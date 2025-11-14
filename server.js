// --- 1. Importações ---
import express from 'express';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit'; // Importa a biblioteca de PDF

// --- 2. Configuração Inicial ---
dotenv.config(); 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const groq = new Groq();

// --- 3. Cache na Memória ---
const cache = new Map();

// --- 4. Middlewares (Filtros) ---
app.use(cors()); 
app.use(express.json({ limit: '10mb' })); // Aumenta o limite de JSON para quizzes grandes

// --- 5. Servir os Ficheiros Estáticos (O Frontend) ---
app.use(express.static(path.join(__dirname, 'public')));

// --- 6. Rotas da API (O "Cérebro") ---
const langMap = {
    en: 'Inglês',
    it: 'Italiano'
};

/**
 * ROTA 1: Gerar o conteúdo de estudo detalhado
 * (PROMPT SUPER DETALHADO V2)
 */
app.post('/api/study-content', async (req, res) => {
    try {
        const { topic, lang } = req.body;
        const languageName = langMap[lang] || 'Italiano';
        const isCustom = !topic.startsWith('en_') && !topic.startsWith('it_');
        
        const cacheKey = `study_${topic}_${lang}`;

        if (!isCustom && cache.has(cacheKey)) {
            console.log(`Enviando conteúdo de estudo do CACHE: ${cacheKey}`);
            return res.json({ content: cache.get(cacheKey) });
        }

        console.log(`Gerando conteúdo de estudo (API Groq): Tópico=${topic}, Idioma=${languageName}`);

        // 2. Criar o Prompt para a IA (SUPER DETALHADO)
        const studyPrompt = `
            Aja como um linguista especialista e professor-mestre de ${languageName}, com fluência nativa em Português (Brasil).
            Sua tarefa é criar uma "aula-mestra" (masterclass) completa, profunda e extremamente detalhada sobre o tópico: "${topic}".
            O público-alvo são falantes de Português (Brasil) que estão aprendendo ${languageName} e querem entender o conceito a fundo.

            **REGRAS DE CONTEÚDO OBRIGATÓRIAS (ESTRUTURA DA AULA):**
            A aula deve ser rica e seguir esta estrutura, sempre que aplicável ao tópico:

            1.  **Conceito Central (O "O Quê"):**
                * Comece com uma definição clara e direta do tópico. O que é? Para que serve?

            2.  **Contexto de Uso (O "Quando" e "Onde"):**
                * Explique em quais situações este conceito é usado.
                * Diferencie o uso (ex: formal vs. informal, escrito vs. falado).

            3.  **Comparação com o Português (O "Como se relaciona"):**
                * **MUITO IMPORTANTE:** Crie uma seção "Como isso se compara ao Português?".
                * Mostre as semelhanças e, principalmente, as *diferenças* que causam confusão para brasileiros (ex: "Em português diríamos X, mas em ${languageName} o correto é Y").
                * Identifique falsos cognatos ou "armadilhas" comuns.

            4.  **Regras de Formação e Gramática (O "Como"):**
                * Detalhe as regras gramaticais (ex: conjugação, ordem das palavras, uso de auxiliares).
                * Use tabelas (com <table>, <tr>, <td>) se for útil para mostrar conjugações ou estruturas.

            5.  **Exemplos Múltiplos e Variados (A "Prática"):**
                * Forneça uma grande quantidade de exemplos.
                * **REGRA DE ÁUDIO:** Cada exemplo principal deve ser uma frase completa no idioma de estudo (${languageName}) e deve estar **obrigatoriamente** dentro de tags <strong>.
                * **TRADUÇÃO:** A tradução em português deve vir *imediatamente depois* da tag </strong>, entre parênteses.
                * **Tipos de Exemplo:** Inclua frases afirmativas, negativas e interrogativas. Se possível, crie mini-diálogos (Pessoa A / Pessoa B) para mostrar o conceito em ação.
                * Exemplo Correto: <p><strong>I have already eaten.</strong> (Eu já comi.)</p>
                * Exemplo Correto (Diálogo):
                    <ul>
                        <li><strong>Pessoa A: Have you seen this movie?</strong> (Você já viu este filme?)</li>
                        <li><strong>Pessoa B: No, I have not seen it yet.</strong> (Não, eu ainda não o vi.)</li>
                    </ul>

            6.  **Exceções e "Pegadinhas" (O "Cuidado"):**
                * Crie uma seção "Erros Comuns & Exceções".
                * Liste os erros mais comuns que brasileiros cometem com este tópico e explique por que estão errados.

            7.  **Resumo (A "Lição Principal"):**
                * Termine com um parágrafo de resumo "Principais Lições" que reforce o conceito central.

            **REGRAS DE FORMATAÇÃO:**
            * **Formato:** Use HTML simples. Use <h2> para subtítulos, <p> para parágrafos, <ul>/<li> para listas, <table>/<tr>/<td> para tabelas, e <strong> APENAS para as frases de exemplo em ${languageName} que devem ter áudio.
            * **Idioma:** Todas as explicações, títulos e traduções devem ser em **Português (Brasil)**.
            * **Saída:** Não inclua <html>, <head> ou <body>. Gere apenas o conteúdo HTML interno.
        `;

        // 3. Chamar a API Groq
        const studyResponse = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "Você é um assistente de ensino de idiomas que gera material de estudo em HTML formatado em Português-BR." },
                { role: "user", content: studyPrompt }
            ],
            max_tokens: 3500, 
        });

        const studyHtml = studyResponse.choices[0].message.content;

        if (!isCustom) {
            cache.set(cacheKey, studyHtml);
            console.log(`Conteúdo de estudo salvo no CACHE: ${cacheKey}`);
        }

        res.json({ content: studyHtml });

    } catch (error) {
        console.error("Erro na rota /api/study-content:", error);
        res.status(500).json({ error: "Falha ao gerar conteúdo de estudo." });
    }
});


/**
 * ROTA 2: Gerar o Quiz (perguntas e explicações)
 * (PROMPT V2 FOCADO EM APLICAÇÃO)
 */
app.post('/api/quiz', async (req, res) => {
    try {
        const { content, numQuestions, lang } = req.body;
        const languageName = langMap[lang] || 'Italiano';

        console.log(`Gerando QUIZ (API Groq): ${numQuestions} perguntas para ${languageName}.`);

        // 2. Criar o Prompt para a IA (FOCO NO USO DO IDIOMA)
        const quizPrompt = `
            Aja como um especialista em avaliação pedagógica para ensino de ${languageName}.
            Baseado **exclusivamente** no material de estudo em HTML fornecido abaixo, crie um quiz de múltipla escolha.

            Material de Estudo:
            <material>
            ${content}
            </material>

            **REGRAS OBRIGATÓRIAS DO QUIZ:**

            1.  **FOCO NA APLICAÇÃO (REGRA MAIS IMPORTANTE):**
                * As perguntas devem testar o *USO* do idioma ${languageName}, não a memorização de regras gramaticais.
                * **EVITE PERGUNTAS DE METALINGUAGEM.**
                * **Exemplo de Pergunta RUIM (Evitar):** "O que é o 'Present Perfect'?"
                * **Exemplo de Pergunta RUIM (Evitar):** "Qual é a regra para usar 'in' ou 'on'?"
                * **Exemplo de Pergunta BOA (Usar):** "Qual frase completa corretamente a lacuna: 'She ______ (live) here since 2010.'?" (Opções: has lived, lived, lives, is living)
                * **Exemplo de Pergunta BOA (Usar):** "Qual é a tradução correta para 'Eu estou trabalhando agora.'?"
                * **Exemplo de Pergunta BOA (Usar):** "Escolha a preposição correta: 'The book is ___ the table.'"

            2.  **TIPOS DE PERGUNTA:**
                * Crie uma variedade de perguntas focadas na aplicação, como:
                    * Completar a lacuna (com o verbo, preposição, artigo, etc.).
                    * Tradução (Português -> ${languageName}).
                    * Tradução (${languageName} -> Português).
                    * Identificar a frase gramaticalmente correta entre as opções.
                    * Escolher a palavra correta para o contexto.

            3.  **IDIOMA:**
                * Crie ${numQuestions} perguntas.
                * As *perguntas* (enunciados) e as *explicações* devem ser escritas em **Português (Brasil)**.
                * As *opções de resposta* devem estar, na maioria das vezes, no idioma de estudo (${languageName}), a menos que seja uma pergunta de tradução para o português.

            4.  **FORMATO JSON (OBRIGATÓRIO):**
                * A resposta deve ser **APENAS** um objeto JSON. Não inclua \`\`\`json ou qualquer texto antes ou depois do JSON.
                * O JSON deve ter uma chave "questions", que é um array de objetos.
                * Cada objeto-pergunta deve conter:
                    * "pergunta": A pergunta (string em Português-BR).
                    * "opcoes_incorretas": Um array de 3 strings (as alternativas erradas).
                    * "opcao_correta": A string exata da resposta correta.
                    * "explicacao": Uma explicação detalhada (em Português-BR) do porquê a resposta correta está certa, focada no conceito gramatical.

            Exemplo da estrutura JSON esperada:
            {
              "questions": [
                {
                  "pergunta": "Qual frase significa 'Eu comi maçãs ontem'?",
                  "opcoes_incorretas": ["I eat apples", "I have eaten apples", "I am eating apples"],
                  "opcao_correta": "I ate apples yesterday",
                  "explicacao": "Para ações concluídas no passado com um tempo definido (ontem/yesterday), usamos o Simple Past (ate), e não o Present Perfect (have eaten)."
                }
              ]
            }
        `;

        const quizResponse = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "Você é um assistente que gera quizzes em formato JSON a partir de um texto, com todas as saídas em Português-BR." },
                { role: "user", content: quizPrompt }
            ],
            response_format: { type: "json_object" }, 
            max_tokens: 4096,
        });

        const quizJsonString = quizResponse.choices[0].message.content;
        const quizJson = JSON.parse(quizJsonString); 

        res.json(quizJson);

    } catch (error) {
        console.error("Erro na rota /api/quiz:", error);
        res.status(500).json({ error: "Falha ao gerar o quiz." });
    }
});


/**
 * (VERSÃO 3 - ATUALIZADA) ROTA 3: Gerar PDF de Revisão
 * Esta rota agora usa um prompt JSON estruturado e um processador PDFKit
 * para criar um documento limpo, organizado e detalhado.
 */
app.post('/api/generate-review-pdf', async (req, res) => {
    try {
        const { quizzesSelecionados, lang } = req.body; 
        const languageName = langMap[lang] || 'Italiano';

        console.log(`Gerando PDF de Revisão (API Groq JSON) para ${languageName}.`);

        // 1. Montar o "dossiê" completo para a IA
        let fullQuizContext = "";       
        let originalStudyContent = "";  
        let topicos = new Set();

        quizzesSelecionados.forEach(quiz => {
            topicos.add(quiz.topic_title);

            if (quiz.studyContent) {
                originalStudyContent += `
                \n\n--- CONTEÚDO DA AULA: ${quiz.topic_title} (Nível: ${quiz.level || 'N/A'}) ---\n
                ${quiz.studyContent}
                \n--- FIM DO CONTEÚDO ---\n
                `;
            }

            fullQuizContext += `
            ---
            QUIZ SOBRE: "${quiz.topic_title}" (NÍVEL: ${quiz.level || 'N/A'})
            PONTUAÇÃO: ${quiz.score} (${quiz.percentage}%)
            PERGUNTAS DESTE QUIZ:
            ${quiz.questions.map(q => `
                - Pergunta: ${q.pergunta}
                - Opções: [${q.opcao_correta}, ${q.opcoes_incorretas.join(', ')}]
                - Resposta Correta: ${q.opcao_correta}
                - Resposta do Aluno: ${q.user_answer}
                - Acertou: ${q.is_correct}
            `).join('\n')}
            ---
            `;
        });

        const listaTopicos = [...topicos].join(', ');

        // 2. (NOVO PROMPT V3) Criar o "Mega-Prompt" que pede JSON
        const pdfPrompt = `
            Aja como um tutor de ${languageName} e designer instrucional, fluente em Português-BR.
            Um aluno quer um guia de estudo completo em PDF baseado nas aulas que ele estudou e nos quizzes que ele realizou sobre os tópicos: ${listaTopicos}.

            Sua tarefa é gerar um objeto JSON que estruture este guia de estudo.
            
            **DADOS FORNECIDOS:**
            1.  **Aulas Originais:** <aulas_originais>${originalStudyContent || 'Nenhuma aula original fornecida.'}</aulas_originais>
            2.  **Quizzes Realizados:** <quizzes_realizados>${fullQuizContext}</quizzes_realizados>

            **REGRAS DO JSON DE SAÍDA:**
            * Responda APENAS com o objeto JSON. Não inclua \`\`\`json.
            * Todo o texto deve ser em Português (Brasil), exceto os exemplos de frases.
            * Seja completo, detalhado e didático, como um professor paciente.

            **Estrutura do JSON Esperada:**
            {
              "titulo": "Seu Guia de Revisão Personalizado: ${listaTopicos}",
              "introducao": "Um parágrafo motivacional analisando o desempenho geral e encorajando o aluno a focar nos pontos de melhoria.",
              "partes": [
                {
                  "titulo_parte": "Parte 1: Revisão e Aprofundamento do Conteúdo",
                  "secoes": [
                    {
                      "subtitulo": "Tópico 1: (ex: Simple Past vs. Present Perfect)",
                      "analise_erros": "Análise específica dos erros do aluno neste tópico, baseado nos <quizzes_realizados>. (ex: 'Notei que você confundiu X com Y...')",
                      "conteudo_completo": "Aqui está um conteúdo completo e detalhado sobre este tópico, explicando as regras, o uso e as exceções. Use múltiplos parágrafos para ser bem detalhado.",
                      "novos_exemplos": [
                        { "frase": "I went to the park yesterday.", "traducao": "Eu fui ao parque ontem." },
                        { "frase": "I have gone to the park three times this week.", "traducao": "Eu fui ao parque três vezes esta semana." }
                      ]
                    }
                  ]
                }
              ],
              "quiz_pratica": {
                "titulo_parte": "Parte 2: Quiz de Prática Focado",
                "perguntas": [
                  {
                    "pergunta": "1. Pergunta focada em um erro comum do aluno...",
                    "opcoes": [
                      "a) Opção A",
                      "b) Opção B (a pegadinha)",
                      "c) Opção C (correta)",
                      "d) Opção D"
                    ],
                    "resposta_correta_index": 2
                  }
                ]
              },
              "gabarito": {
                "titulo_parte": "Parte 3: Gabarito e Explicações",
                "respostas": [
                  {
                    "pergunta_num": "1",
                    "resposta": "c) Opção C",
                    "explicacao": "Esta é a resposta correta porque ela aborda diretamente o conceito X, que revisamos na Parte 1..."
                  }
                ]
              }
            }
        `;

        // 3. Chamar a API Groq (AGORA PEDINDO JSON)
        const reviewResponse = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "Você é um tutor de idiomas que gera guias de estudo detalhados em formato JSON, em Português-BR." },
                { role: "user", content: pdfPrompt }
            ],
            response_format: { type: "json_object" }, // Força a saída em JSON!
            max_tokens: 4096, 
        });

        const pdfData = JSON.parse(reviewResponse.choices[0].message.content);

        // 4. (NOVO PROCESSADOR) Gerar o PDF com PDFKit de forma limpa
        const doc = new PDFDocument({ 
            margin: 50, // Margens de 50px
            layout: 'portrait', 
            size: 'A4'
        });
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="guia_de_revisao_talkpro.pdf"');

        doc.pipe(res);

        // --- Funções Auxiliares de Formatação ---
        const setFont = (style = 'normal') => {
            const fonts = {
                normal: 'Helvetica',
                bold: 'Helvetica-Bold',
                italic: 'Helvetica-Oblique'
            };
            // Usando fontes padrão do PDFKit (Helvetica)
            doc.font(fonts[style]);
        };
        
        // --- Início do Documento ---
        
        // Título
        setFont('bold');
        doc.fontSize(20).text(pdfData.titulo, { align: 'center' });
        doc.moveDown(2);

        // Introdução
        setFont('normal');
        doc.fontSize(12).text(pdfData.introducao, { align: 'justify' });
        doc.moveDown(2);

        // --- PARTE 1: CONTEÚDO ---
        if (pdfData.partes) {
            pdfData.partes.forEach(parte => {
                setFont('bold');
                doc.fontSize(18).text(parte.titulo_parte);
                doc.moveDown(1);

                parte.secoes.forEach(secao => {
                    setFont('bold');
                    doc.fontSize(16).text(secao.subtitulo, { underline: true });
                    doc.moveDown(0.5);

                    // Análise de Erros
                    setFont('bold');
                    doc.fontSize(12).text('Análise dos Seus Erros:');
                    setFont('italic');
                    doc.text(secao.analise_erros, { align: 'justify' });
                    doc.moveDown(1);

                    // Conteúdo Completo
                    setFont('bold');
                    doc.fontSize(12).text('Revisão Completa do Tópico:');
                    setFont('normal');
                    doc.text(secao.conteudo_completo, { align: 'justify' });
                    doc.moveDown(1);

                    // Novos Exemplos
                    setFont('bold');
                    doc.fontSize(12).text('Novos Exemplos para Praticar:');
                    setFont('normal');
                    secao.novos_exemplos.forEach(ex => {
                        doc.list([`${ex.frase} (${ex.traducao})`], {
                            bulletRadius: 2,
                            textIndent: 10,
                            bulletIndent: 10
                        });
                    });
                    doc.moveDown(2);
                });
            });
        }

        // --- PARTE 2: QUIZ DE PRÁTICA ---
        if (pdfData.quiz_pratica && pdfData.quiz_pratica.perguntas.length > 0) {
            doc.addPage(); // Nova página para o quiz
            setFont('bold');
            doc.fontSize(18).text(pdfData.quiz_pratica.titulo_parte);
            doc.moveDown(1);

            setFont('normal');
            pdfData.quiz_pratica.perguntas.forEach(p => {
                setFont('bold');
                doc.fontSize(12).text(p.pergunta);
                doc.moveDown(0.5);
                
                setFont('normal');
                p.opcoes.forEach((opcao, index) => {
                    doc.text(opcao, { indent: 20 });
                });
                doc.moveDown(1.5);
            });
        }

        // --- PARTE 3: GABARITO ---
        if (pdfData.gabarito && pdfData.gabarito.respostas.length > 0) {
            doc.addPage(); // Nova página para o gabarito
            setFont('bold');
            doc.fontSize(18).text(pdfData.gabarito.titulo_parte);
            doc.moveDown(1);

        
            pdfData.gabarito.respostas.forEach(r => {
                setFont('bold');
                doc.fontSize(12).text(`Pergunta ${r.pergunta_num}: ${r.resposta}`);
                doc.moveDown(0.5);
                
                setFont('normal');
                doc.text(r.explicacao, { align: 'justify', indent: 20 });
                doc.moveDown(1.5);
            });
        }

        // Finaliza o PDF
        doc.end(); 

    } catch (error) {
        console.error("Erro na rota /api/generate-review-pdf:", error);
        res.status(500).json({ error: "Falha ao gerar o PDF de revisão." });
    }
});


// --- 7. Rota "Apanha-Tudo" (Catch-All) ---
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// --- 8. Iniciar o Servidor ---
app.listen(port, () => {
    console.log(`Servidor TalkPro (Groq) rodando na porta ${port}`);
});