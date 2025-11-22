// --- 1. Importações ---
import express from 'express';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit'; 
import fs from 'fs'; 

// --- 2. Configuração Inicial ---
dotenv.config(); 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Configuração do Groq
const groq = new Groq(); 

// Cache em memória
const cache = new Map();

// --- 4. Middlewares (Filtros) ---
app.use(cors()); 
app.use(express.json({ limit: '10mb' })); 

// --- 5. Servir os Ficheiros Estáticos (O Frontend) ---
app.use(express.static(path.join(__dirname, 'public')));

// --- 6. Rotas da API (O "Cérebro") ---
const langMap = {
    en: 'Inglês',
    it: 'Italiano'
};

/**
 * ROTA 1: Gerar o conteúdo de estudo (Nível Especialista)
 */
app.post('/api/study-content', async (req, res) => {
    try {
        const { topic, lang } = req.body;
        const languageName = langMap[lang] || 'Italiano';
        
        const cacheKey = `study_${topic}_${lang}`;
        if (cache.has(cacheKey)) {
            console.log(`Enviando conteúdo do CACHE: ${topic}`);
            return res.json({ content: cache.get(cacheKey) });
        }
        
        console.log(`Gerando Masterclass (API Groq): Tópico=${topic}, Idioma=${languageName}`);

        const studyPrompt = `
            Aja como um Linguista Sênior e Professor Especialista em ensinar **${languageName}** para falantes de Português do Brasil.
            Seu objetivo é criar uma "Masterclass" sobre o tópico: "${topic}".
            
            **DIRETRIZES PEDAGÓGICAS (Especialista):**
            * **Tom de Voz:** Profissional, encorajador, mas tecnicamente preciso. Evite explicações superficiais.
            * **Foco no Brasileiro:** Identifique proativamente os erros que brasileiros cometem devido à interferência do português (falsos cognatos, estrutura frasal, pronúncia).
            * **Controle de Áudio (CRUCIAL):** O sistema gera botões de áudio automaticamente para tudo que estiver dentro da tag <strong>. 
                * **REGRA 1:** NUNCA use <strong> para dar ênfase em palavras no meio da explicação em português. Use <em> ou "aspas" para isso.
                * **REGRA 2:** Use <strong> EXCLUSIVAMENTE para as frases completas no idioma alvo (${languageName}) dentro da seção de Exemplos.

            **ESTRUTURA OBRIGATÓRIA DA AULA (HTML):**

            1.  **<h2>A Essência do Conceito</h2>**
                * Defina o tópico de forma clara. Não traduza apenas; explique a *lógica* por trás dele. Para que serve na vida real?

            2.  **<h2>Como e Quando Usar</h2>**
                * Contexto é tudo. É formal? Informal? Gíria? 
                * Dê um cenário da vida real onde isso seria usado (ex: "Em uma entrevista de emprego" ou "Pedindo café em Roma").

            3.  **<h2>A Armadilha Brasileira (Atenção!)</h2>**
                * Explique onde o falante de português costuma errar neste tópico. Compare a estrutura do Português com a do ${languageName}.

            4.  **<h2>A Fórmula (Gramática)</h2>**
                * Explique as regras de construção de forma visual e limpa. Use tabelas (<table>) se houver conjugações.

            5.  **<h2>Exemplos Práticos (Áudio Habilitado)</h2>**
                * Forneça 5 a 7 frases ricas e variadas.
                * **FORMATO OBRIGATÓRIO:** <ul>
                        <li><strong>[Frase completa em ${languageName}]</strong><br>([Tradução em Português])</li>
                    </ul>

            6.  **<h2>Resumo Mestre</h2>**
                * Uma frase "takeaway" para o aluno não esquecer.

            **REGRAS TÉCNICAS:**
            * Retorne APENAS o HTML interno (sem <html>, <head>, <body>).
            * Use classes CSS padrão se necessário, mas foque na estrutura semântica.
        `;

        const studyResponse = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "Você é a maior autoridade em ensino de idiomas para brasileiros. Você gera HTML limpo e estruturado." },
                { role: "user", content: studyPrompt }
            ],
            max_tokens: 4000, 
        });

        const studyHtml = studyResponse.choices[0].message.content;
        cache.set(cacheKey, studyHtml);

        res.json({ content: studyHtml });

    } catch (error) {
        console.error("Erro na rota /api/study-content:", error);
        res.status(500).json({ error: "Falha ao gerar conteúdo de estudo." });
    }
});


/**
 * ROTA 2: Gerar o Quiz (Nível Especialista)
 */
app.post('/api/quiz', async (req, res) => {
    try {
        const { content, numQuestions, lang } = req.body;
        const languageName = langMap[lang] || 'Italiano';

        console.log(`Gerando QUIZ Especialista (API Groq): ${numQuestions} perguntas.`);

        const quizPrompt = `
            Aja como um Especialista em Avaliação de Proficiência (padrão CEFR) para **${languageName}**.
            Crie um quiz desafiador e educativo de ${numQuestions} perguntas baseado no conteúdo abaixo.

            Conteúdo: "${content.substring(0, 4000)}..."

            **REGRAS DE OURO:**
            1.  **Unicidade de Resposta:** Certifique-se de que existe EXATAMENTE UMA resposta correta. As outras devem ser "distratores" (erros comuns, mas claramente errados).
            2.  **Idioma:** * Se a pergunta for "Complete a frase", a frase e as opções devem estar em **${languageName}**.
                * Se a pergunta for "Traduza", a frase base está em Português e as opções em **${languageName}**.
                * NUNCA faça uma pergunta onde tudo (pergunta e respostas) esteja em Português.
            3.  **Explicação:** A explicação deve ser em Português, didática, explicando POR QUE a certa é certa e POR QUE a errada (o erro comum) é errada.

            **FORMATO JSON ESTRITO:**
            {
                "questions": [
                    {
                        "pergunta": "Enunciado em Português (ex: Qual a forma correta do verbo...)",
                        "opcoes_incorretas": ["Opção Errada 1", "Opção Errada 2", "Opção Errada 3"],
                        "opcao_correta": "Opção Certa",
                        "explicacao": "Explicação detalhada."
                    }
                ]
            }
        `;

        const quizResponse = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "Você é um gerador de testes JSON rigoroso. Não inclua markdown, apenas o JSON." },
                { role: "user", content: quizPrompt }
            ],
            response_format: { type: "json_object" }, 
            max_tokens: 4096,
        });

        const quizJson = JSON.parse(quizResponse.choices[0].message.content); 

        if (!quizJson.questions || quizJson.questions.length === 0) {
            throw new Error("A IA não gerou perguntas válidas.");
        }

        res.json(quizJson);

    } catch (error) {
        console.error("Erro na rota /api/quiz:", error);
        res.status(500).json({ error: "Falha ao gerar o quiz." });
    }
});


/**
 * ROTA 3: Gerar PDF de Revisão (Melhorada)
 */
app.post('/api/generate-review-pdf', async (req, res) => {
    try {
        const { quizzesSelecionados, lang } = req.body; 
        const languageName = langMap[lang] || 'Italiano';

        console.log(`Gerando PDF de Revisão para ${languageName}.`);

        // Prepara os dados para a IA
        let contextData = quizzesSelecionados.map(q => `
            - Tópico: ${q.topic_title} | Nível Acerto: ${q.percentage}%
            - Detalhes das questões (Erros/Acertos): ${JSON.stringify(q.questions || [])}
        `).join('\n');

        const pdfPrompt = `
            Você é um Mentor de Estudos Personalizado.
            Crie um Plano de Revisão em JSON para um aluno de ${languageName} com base nestes resultados recentes:
            ${contextData.substring(0, 5000)}

            O JSON deve ser rico e encorajador:
            {
                "titulo": "Seu Plano de Domínio do ${languageName}",
                "introducao": "Uma análise curta e motivadora do desempenho geral do aluno.",
                "partes": [
                    {
                        "titulo_parte": "Análise Profunda",
                        "secoes": [
                            { 
                                "subtitulo": "O que você dominou vs O que precisa polir", 
                                "conteudo_completo": "Explique os conceitos gramaticais onde o aluno falhou.",
                                "analise_erros": "Destaque os erros específicos cometidos nos quizzes.",
                                "novos_exemplos": [
                                    { "frase": "Frase correta em ${languageName}", "traducao": "Tradução" }
                                ]
                            }
                        ]
                    }
                ]
            }
        `;

        const reviewResponse = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "Gere JSON válido para relatórios educacionais." },
                { role: "user", content: pdfPrompt }
            ],
            response_format: { type: "json_object" }, 
            max_tokens: 4096, 
        });

        const pdfData = JSON.parse(reviewResponse.choices[0].message.content);

        // --- GERAÇÃO DO PDF (PDFKit) ---
        const doc = new PDFDocument({ margin: 50, size: 'A4' });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="plano_estudos_talkpro.pdf"');
        doc.pipe(res);

        // Cabeçalho
        doc.fontSize(22).font('Helvetica-Bold').text(pdfData.titulo || "Plano de Estudos", { align: 'center' });
        doc.moveDown(1.5);
        
        // Intro
        doc.fontSize(12).font('Helvetica').text(pdfData.introducao || "Segue sua revisão.", { align: 'justify', lineGap: 4 });
        doc.moveDown(2);

        // Partes Dinâmicas
        if(pdfData.partes) {
            pdfData.partes.forEach(parte => {
                doc.fontSize(18).font('Helvetica-Bold').fillColor('#007bff').text(parte.titulo_parte);
                doc.fillColor('black'); // Reset cor
                doc.moveDown(0.8);
                
                if(parte.secoes) {
                    parte.secoes.forEach(sec => {
                        // Subtítulo
                        doc.fontSize(14).font('Helvetica-Bold').text(sec.subtitulo);
                        doc.moveDown(0.3);
                        
                        // Conteúdo
                        doc.fontSize(12).font('Helvetica').text(sec.conteudo_completo, { align: 'justify', lineGap: 2 });
                        doc.moveDown(0.5);
                        
                        // Análise de Erros (Itálico)
                        if(sec.analise_erros) {
                            doc.fontSize(11).font('Helvetica-Oblique').fillColor('#555').text(`💡 Diagnóstico: ${sec.analise_erros}`, { indent: 10 });
                            doc.fillColor('black');
                            doc.moveDown(0.5);
                        }

                        // Novos Exemplos
                        if (sec.novos_exemplos && sec.novos_exemplos.length > 0) {
                            doc.fontSize(12).font('Helvetica-Bold').text("Pratique com estas frases:", { indent: 10 });
                            doc.font('Helvetica');
                            sec.novos_exemplos.forEach(ex => {
                                doc.text(`• ${ex.frase} (${ex.traducao})`, { indent: 20 });
                            });
                        }
                        doc.moveDown(1.5);
                    });
                }
                doc.moveDown(1);
            });
        }
        
        // Rodapé
        doc.moveDown(2);
        doc.fontSize(10).text("Gerado por TalkPro AI - Continue praticando!", { align: 'center', color: 'grey' });

        doc.end();

    } catch (error) {
        console.error("Erro na rota /api/generate-review-pdf:", error);
        res.status(500).json({ error: "Falha ao gerar o PDF." });
    }
});


/**
 * ROTA 4: Gerar Flashcards com IA
 */
app.post('/api/generate-flashcards', async (req, res) => {
    try {
        const { topic, lang } = req.body;
        const languageName = langMap[lang] || 'Italiano';

        console.log(`Gerando Flashcards (API Groq): Tópico=${topic}`);

        const flashcardPrompt = `
            Aja como um professor de ${languageName}.
            Crie de 10 a 30 flashcards essenciais por padrão ou a quantidade que a pessoa digitar sobre: "${topic}".

            REGRAS:
            1.  **Formato JSON:** { "cards": [{ "front": "...", "back": "..." }] }
            2.  **Frente:** Palavra/Expressão em **${languageName}**.
            
        `;

        const aiResponse = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "Você gera apenas JSON." },
                { role: "user", content: flashcardPrompt }
            ],
            response_format: { type: "json_object" }, 
            max_tokens: 2048,
        });

        const jsonResponse = JSON.parse(aiResponse.choices[0].message.content);
        res.json(jsonResponse); 

    } catch (error) {
        console.error("Erro na rota /api/generate-flashcards:", error);
        res.status(500).json({ error: "Falha ao gerar flashcards." });
    }
});


// --- 7. Rota "Apanha-Tudo" (Catch-All) ---
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// --- 8. Iniciar o Servidor ---
app.listen(port, () => {
    console.log(`Servidor TalkPro rodando na porta ${port}`);
});