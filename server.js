// Importa as bibliotecas
const express = require('express');
const Groq = require('groq-sdk');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); // <-- NOVO: Para lidar com caminhos de ficheiros

// Configuração inicial
dotenv.config();
const app = express();
// O Render define a porta automaticamente, ou usa 3000 localmente
const port = process.env.PORT || 3000; // <-- MUDANÇA

// Permite que o frontend (index.html) acesse este backend
app.use(cors());
app.use(express.json());

// --- SERVIR OS FICHEIROS ESTÁTICOS (FRONTEND) ---
// <-- NOVO: Diz ao Express para servir os ficheiros da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Inicializa o Groq (lê a chave do .env)
const groq = new Groq();

// Cache na memória para salvar o conteúdo de estudo
const apiCache = new Map();

// --- Rota 1: Gerar Conteúdo de Estudo ---
app.post('/api/study-content', async (req, res) => {
    try {
        const { topic, lang } = req.body;
        const cacheKey = `study_${topic}_${lang}`;

        // 1. Tenta pegar do cache
        if (apiCache.has(cacheKey)) {
            console.log(`[Cache] Entregando conteúdo de estudo para: ${topic}`);
            return res.json({ content: apiCache.get(cacheKey) });
        }

        console.log(`[API] Gerando conteúdo de estudo para: ${topic}`);

        // 2. Prepara o prompt para o Groq
        const langName = lang === 'en' ? 'Inglês' : 'Italiano';
        
        const studyPrompt = `
            Aja como um professor especialista em ${langName} (nível C2).
            Gere um material de estudo profundo e detalhado sobre o tópico "${topic}".
            
            **IMPORTANTE: O público-alvo fala Português (Brasil).**
            
            O conteúdo deve ser uma **explicação 100% em Português** de como o tópico funciona em ${langName}.
            Inclua muitos **exemplos práticos em ${langName}** (o idioma de estudo), mas forneça **imediatamente a tradução ou explicação em Português** de cada exemplo.

            Formate a saída obrigatoriamente em HTML simples. Use:
            - <h2> para o título (em Português)
            - <h3> para subseções (ex: Introdução, Pontos-Chave, Exemplos de Uso, Pontos Difíceis, Resumo)
            - <p> para parágrafos de explicação (em Português).
            - <ul> e <li> para listas de exemplos (ex: "<strong>Frase em ${langName}:</strong> ... <br> <strong>Tradução/Contexto:</strong> ...")
            - <strong> para destacar termos-chave.
            
            Seja detalhado, claro e pedagógico.
        `;

        const response = await groq.chat.completions.create({
            model: "llama-3.1-70b-versatile",
            messages: [
                { role: "system", content: "Você é um professor que gera conteúdo de estudo em HTML, com explicações em PT-BR." },
                { role: "user", content: studyPrompt }
            ],
            max_tokens: 3000,
        });

        const studyHtml = response.choices[0].message.content;

        // 3. Salva no cache e retorna
        apiCache.set(cacheKey, studyHtml);
        res.json({ content: studyHtml });

    } catch (error) {
        console.error("Erro em /api/study-content:", error);
        res.status(500).json({ error: "Falha ao gerar conteúdo de estudo." });
    }
});

// --- Rota 2: Gerar o Quiz ---
app.post('/api/quiz', async (req, res) => {
    try {
        const { studyContent, lang, numQuestions } = req.body;
        
        console.log(`[API] Gerando quiz de ${numQuestions} questões...`);

        const quizPrompt = `
            Baseado **exclusivamente** no seguinte material de estudo:
            <material>
            ${studyContent}
            </material>

            Gere um quiz de ${numQuestions} perguntas.
            As perguntas devem ser **TODAS de múltipla escolha com 4 opções**.
            
            **REGRAS IMPORTANTES:**
            1.  As **perguntas, as alternativas (opções), e a explicação detalhada ('detailedExplanation')** devem ser **obrigatoriamente em Português (Brasil)**.
            2.  As perguntas devem testar o conhecimento do material de estudo.
            
            Retorne **APENAS** um objeto JSON. Não inclua \`\`\`json ou qualquer texto fora do JSON.
            O formato JSON deve ser:
            {
              "quiz": [
                {
                  "question": "O enunciado da pergunta 1 (em Português)...",
                  "options": [ ... ],
                  "correctAnswer": "...",
                  "detailedExplanation": "Uma explicação detalhada EM PORTUGUÊS..."
                }
              ]
            }
        `;

        const response = await groq.chat.completions.create({
            model: "llama-3.1-70b-versatile",
            messages: [
                { role: "system", content: "Você é um gerador de quiz que retorna JSON. Todo o conteúdo do quiz deve ser em Português (Brasil)." },
                { role: "user", content: quizPrompt }
            ],
            response_format: { type: "json_object" },
            max_tokens: 4000,
        });

        const quizJson = JSON.parse(response.choices[0].message.content);
        res.json(quizJson);

    } catch (error) {
        console.error("Erro em /api/quiz:", error);
        res.status(500).json({ error: "Falha ao gerar quiz." });
    }
});

// <-- NOVO: Rota "apanha-tudo" (Catch-all) ---
// Se nenhuma rota de API corresponder, envia o index.html.
// Isto permite que o nosso "Single Page App" funcione.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor de Idiomas (Groq) rodando na porta ${port}`);
});