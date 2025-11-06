// Espera o DOM carregar completamente
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. DEFINIÇÕES DE DADOS (Tópicos) ---
    // A UI agora é fixa em Português.

    // Tópicos (Mockado - Agora com 20 por idioma)
    const allTopics = {
        'en': [
            { id: 'en_1', title: 'O Verbo "To Be" (Ser/Estar)', description: 'Fundação: Aprenda Am, Is, Are.' },
            { id: 'en_2', title: 'Simple Present', description: 'Fale sobre rotinas e fatos.' },
            { id: 'en_3', title: 'Present Continuous', description: 'Fale sobre ações acontecendo agora.' },
            { id: 'en_4', title: 'Simple Past (Verbos Regulares)', description: 'Fale sobre ações terminadas (ex: walked).' },
            { id: 'en_5', title: 'Simple Past (Verbos Irregulares)', description: 'Ações terminadas (ex: went, saw).' },
            { id: 'en_6', title: 'Futuro com "Will" e "Going To"', description: 'Diferenças entre planos e previsões.' },
            { id: 'en_7', title: 'Preposições de Lugar (In, On, At)', description: 'Onde as coisas estão.' },
            { id: 'en_8', title: 'Preposições de Tempo (In, On, At)', description: 'Quando as coisas acontecem.' },
            { id: 'en_9', title: 'Artigos (A, An, The)', description: 'Quando usar artigos definidos e indefinidos.' },
            { id: 'en_10', title: 'Plurais Regulares e Irregulares', description: 'Ex: book/books, man/men.' },
            { id: 'en_11', title: 'Verbos Modais (Can, Could, Should)', description: 'Habilidade, permissão, conselho.' },
            { id: 'en_12', title: 'Past Continuous', description: 'Ações que estavam acontecendo no passado.' },
            { id: 'en_13', title: 'Present Perfect (Com "For" e "Since")', description: 'Ações que começaram no passado e continuam.' },
            { id: 'en_14', title: 'Present Perfect vs Simple Past', description: 'A maior dúvida dos brasileiros.' },
            { id: 'en_15', title: 'Past Perfect', description: 'O passado do passado (ex: had done).' },
            { id: 'en_16', title: 'Conditionals (Zero, First, Second)', description: 'Frases com "Se" (If clauses).' },
            { id: 'en_17', title: 'Reported Speech (Discurso Indireto)', description: 'Contar o que outra pessoa disse.' },
            { id: 'en_18', title: 'Passive Voice (Voz Passiva)', description: 'Ex: The window was broken.' },
            { id: 'en_19', title: 'Perguntas com (Who, What, Where, Why)', description: 'Formulando perguntas (WH-Questions).' },
            { id: 'en_20', title: 'Phrasal Verbs Comuns (Get, Go, Put)', description: 'Verbos compostos essenciais.' }
        ],
        'it': [
            { id: 'it_1', title: 'O Verbo "Essere" (Ser/Estar)', description: 'Fundação: Aprenda Sono, Sei, È.' },
            { id: 'it_2', title: 'O Verbo "Avere" (Ter)', description: 'Usos principais e como auxiliar.' },
            { id: 'it_3', title: 'Presente Indicativo (Verbos em -ARE)', description: 'Falar no presente (ex: parlare).' },
            { id: 'it_4', title: 'Presente Indicativo (Verbos em -ERE, -IRE)', description: 'Verbos regulares (ex: vedere, dormire).' },
            { id: 'it_5', title: 'Artigos (Il, Lo, La, Gli, Le, I)', description: 'Artigos definidos e indefinidos.' },
            { id: 'it_6', title: 'Passato Prossimo (Com "Avere")', description: 'Falar do passado (ex: ho parlato).' },
            { id: 'it_7', title: 'Passato Prossimo (Com "Essere")', description: 'Verbos de movimento e estado.' },
            { id: 'it_8', title: 'Futuro Semplice (Futuro Simples)', description: 'Falar sobre o futuro (ex: parlerò).' },
            { id: 'it_9', title: 'Preposições Simples (A, In, Da, Di)', description: 'As preposições mais comuns.' },
            { id: 'it_10', title: 'Preposições Articuladas', description: 'Contração de preposição + artigo (ex: al, nello).' },
            { id: 'it_11', title: 'Plurais e Gênero', description: 'Como formar plurais (ex: amico/amici).' },
            { id: 'it_12', title: 'Verbos Modais (Potere, Dovere, Volere)', description: 'Poder, Dever, Querer.' },
            { id: 'it_13', title: 'Imperfetto (Imperfeito)', description: 'O passado para descrições e hábitos.' },
            { id: 'it_14', title: 'Imperfetto vs Passato Prossimo', description: 'Quando usar cada tempo passado.' },
            { id: 'it_15', title: 'Trapassato Prossimo', description: 'O passado do passado (ex: avevo fatto).' },
            { id: 'it_16', title: 'Condizionale Presente (Condicional)', description: 'Ex: "Eu gostaria" (vorrei).' },
            { id: 'it_17', title: 'Pronomes Diretos (Mi, Ti, Lo, La)', description: 'Substituindo o objeto (ex: "Eu o vejo").' },
            { id: 'it_18', title: 'Pronomes Indiretos (Mi, Ti, Gli, Le)', description: 'Ex: "Eu dou a ele" (Gli do).' },
            { id: 'it_19', title: 'Verbos Reflexivos (Lavarsi)', description: 'Ações feitas a si mesmo.' },
            { id: 'it_20', title: 'Perguntas (Chi, Cosa, Dove, Perché)', description: 'Formulando perguntas.' }
        ]
    };

    // --- 2. ESTADO GLOBAL DO APLICATIVO ---

    let state = {
        currentLang: 'en', // 'en' ou 'it'
        currentTopic: null, // ex: { id: 'en_1', title: 'O Verbo "To Be"' }
        currentScreen: 'home-screen',
        quizQuestions: [], // Armazena as perguntas do quiz
        userAnswers: [], // Armazena as respostas do usuário
        currentQuestionIndex: 0,
        studyContentCache: null, // Cache do conteúdo de estudo atual
        history: [], // Histórico de quizzes (para localStorage)
    };

    // --- 3. SELETORES DE ELEMENTOS (DOM) ---
    const loadingOverlay = document.getElementById('loading-overlay');
    const loadingText = document.getElementById('loading-text');

    // Elementos da Tela de Tópicos
    const topicListContainer = document.getElementById('topic-list-container');
    const topicSearchInput = document.getElementById('topic-search');
    const customTopicInput = document.getElementById('custom-topic-input'); // NOVO
    const customTopicBtn = document.getElementById('custom-topic-btn'); // NOVO

    // Elementos da Tela de Estudo
    const studyContentWrapper = document.getElementById('study-content-wrapper');
    const studyTopicTitle = document.getElementById('study-topic-title');

    // Elementos da Tela de Configuração do Quiz
    const questionSlider = document.getElementById('question-slider');
    const questionCountSpan = document.getElementById('question-count');

    // Elementos da Tela de Quiz
    const quizProgressSpan = document.getElementById('quiz-progress');
    const questionTextEl = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const nextQuestionBtn = document.getElementById('next-question-btn');

    // Elementos da Tela de Resultados
    const scoreTextEl = document.getElementById('score-text');
    const answersReviewContainer = document.getElementById('answers-review-container');

    // --- 4. FUNÇÕES PRINCIPAIS ---

    /**
     * Navega para uma tela específica, escondendo as outras.
     * @param {string} screenId - O ID da <section> para mostrar.
     */
    function navigate(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
        state.currentScreen = screenId;
    }

    /**
     * Mostra ou esconde o overlay de loading.
     * @param {boolean} show - Mostrar (true) ou esconder (false)
     * @param {string} text - Texto a ser exibido (em Português)
     */
    function toggleLoading(show, text = 'Carregando...') {
        if (show) {
            loadingText.textContent = text;
            loadingOverlay.classList.remove('hidden');
        } else {
            loadingOverlay.classList.add('hidden');
        }
    }

    /**
     * Salva o progresso do usuário no localStorage.
     */
    function saveState() {
        const data = {
            history: state.history,
            // ... outros dados que queremos salvar
        };
        localStorage.setItem('idiomasAppProgress', JSON.stringify(data));
    }

    /**
     * Carrega o progresso do usuário do localStorage.
     */
    function loadState() {
        const data = localStorage.getItem('idiomasAppProgress');
        if (data) {
            const parsedData = JSON.parse(data);
            state.history = parsedData.history || [];
        }
    }

    /**
     * Carrega e exibe a lista de tópicos para o idioma selecionado.
     */
    function loadTopics() {
        topicListContainer.innerHTML = ''; // Limpa a lista
        const topics = allTopics[state.currentLang] || [];
        
        // Filtra com base na busca
        const searchTerm = topicSearchInput.value.toLowerCase();
        const filteredTopics = topics.filter(topic => 
            topic.title.toLowerCase().includes(searchTerm) || 
            topic.description.toLowerCase().includes(searchTerm)
        );

        if (filteredTopics.length === 0) {
            topicListContainer.innerHTML = '<p class="empty-list-text">Nenhum tópico sugerido encontrado.</p>';
            return;
        }

        filteredTopics.forEach(topic => {
            const item = document.createElement('div');
            item.className = 'topic-item';
            item.innerHTML = `<h3>${topic.title}</h3><p>${topic.description}</p>`;
            item.addEventListener('click', () => {
                // Ao clicar num tópico da lista, limpa o campo customizado
                customTopicInput.value = '';
                // Define o tópico e busca o conteúdo
                state.currentTopic = topic;
                fetchAndDisplayStudyContent(topic.title);
            });
            topicListContainer.appendChild(item);
        });
    }

    /**
     * Função central para buscar e exibir conteúdo de estudo.
     * @param {string} topicTitle - O título do tópico (da lista ou customizado).
     */
    async function fetchAndDisplayStudyContent(topicTitle) {
        // Define o tópico atual (se for customizado, o ID é nulo)
        if (!state.currentTopic || state.currentTopic.title !== topicTitle) {
            state.currentTopic = { id: null, title: topicTitle };
        }
        
        studyTopicTitle.textContent = topicTitle;
        navigate('study-screen');
        toggleLoading(true, 'Gerando material de estudo...');

        try {
            // Busca o conteúdo de estudo da nossa API backend
            const response = await fetch('http://localhost:3000/api/study-content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic: topicTitle, lang: state.currentLang }),
            });
            if (!response.ok) throw new Error('Falha ao buscar conteúdo.');

            const data = await response.json();
            state.studyContentCache = data.content; // Salva o conteúdo para o quiz
            studyContentWrapper.innerHTML = data.content;

        } catch (error) {
            console.error(error);
            studyContentWrapper.innerHTML = '<p class="error-text">Erro ao carregar o conteúdo. Tente novamente.</p>';
        } finally {
            toggleLoading(false);
        }
    }

    /**
     * Inicia a geração do Quiz.
     */
    async function startQuiz() {
        const numQuestions = parseInt(questionSlider.value, 10);
        
        if (!state.studyContentCache) {
            alert('Erro: Conteúdo de estudo não encontrado.');
            return;
        }

        navigate('quiz-screen');
        toggleLoading(true, `Gerando quiz de ${numQuestions} questões...`);

        try {
            const response = await fetch('http://localhost:3000/api/quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studyContent: state.studyContentCache,
                    lang: state.currentLang,
                    numQuestions: numQuestions
                }),
            });
            if (!response.ok) throw new Error('Falha ao gerar o quiz.');

            const data = await response.json();
            
            // Embaralha perguntas e opções (como pedido)
            state.quizQuestions = shuffleArray(data.quiz).map(q => {
                q.options = shuffleArray(q.options);
                return q;
            });

            state.userAnswers = [];
            state.currentQuestionIndex = 0;
            loadQuestion();

        } catch (error) {
            console.error(error);
            navigate('quiz-config-screen'); // Volta para a tela de config
            alert('Erro ao gerar o quiz. Tente novamente.');
        } finally {
            toggleLoading(false);
        }
    }

    /**
     * Carrega a pergunta atual do quiz na tela.
     */
    function loadQuestion() {
        if (state.currentQuestionIndex >= state.quizQuestions.length) {
            showResults(); // Acabou o quiz
            return;
        }

        const q = state.quizQuestions[state.currentQuestionIndex];
        quizProgressSpan.textContent = `Pergunta ${state.currentQuestionIndex + 1} / ${state.quizQuestions.length}`;
        questionTextEl.textContent = q.question;

        optionsContainer.innerHTML = '';
        q.options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = option;
            button.addEventListener('click', () => selectAnswer(button, option));
            optionsContainer.appendChild(button);
        });

        nextQuestionBtn.style.display = 'none'; // Esconde o botão "Próxima"
    }

    /**
     * Chamado quando o usuário clica em uma opção de resposta.
     * @param {HTMLElement} selectedButton - O botão que foi clicado.
     * @param {string} selectedOption - O texto da opção selecionada.
     */
    function selectAnswer(selectedButton, selectedOption) {
        // Impede cliques múltiplos
        if (nextQuestionBtn.style.display === 'block') return;

        const q = state.quizQuestions[state.currentQuestionIndex];
        const isCorrect = (selectedOption === q.correctAnswer);

        // Salva a resposta
        state.userAnswers[state.currentQuestionIndex] = {
            question: q.question,
            selected: selectedOption,
            correct: q.correctAnswer,
            isCorrect: isCorrect,
            explanation: q.detailedExplanation,
        };

        // Feedback visual imediato
        Array.from(optionsContainer.children).forEach((btn) => {
            const optionText = btn.textContent;
            if (optionText === q.correctAnswer) {
                btn.classList.add('correct');
            } else if (optionText === selectedOption) {
                btn.classList.add('incorrect');
            }
            btn.disabled = true; // Desativa todos os botões
        });

        nextQuestionBtn.style.display = 'block'; // Mostra o botão "Próxima"
    }

    /**
     * Mostra a tela de resultados final.
     */
    function showResults() {
        let correctCount = 0;
        state.userAnswers.forEach(ans => {
            if (ans.isCorrect) correctCount++;
        });

        const total = state.quizQuestions.length;
        const percentage = Math.round((correctCount / total) * 100);
        scoreTextEl.textContent = `Acertos: ${correctCount} / ${total} (${percentage}%)`;

        // Salva no histórico
        state.history.push({
            topic: state.currentTopic.title,
            score: `${correctCount}/${total}`,
            date: new Date().toISOString()
        });
        saveState(); // Salva no localStorage

        // Constrói o gabarito
        answersReviewContainer.innerHTML = '';
        state.userAnswers.forEach((ans, index) => {
            const reviewItem = document.createElement('div');
            reviewItem.className = 'review-item';

            const userAnswerClass = ans.isCorrect ? 'correct' : 'incorrect';
            const userAnswerHTML = `<span class="user-answer ${userAnswerClass}">${ans.selected}</span>`;
            
            const correctAnswerHTML = ans.isCorrect ? '' : `<br><strong>Correta: <span class="correct-answer">${ans.correct}</span></strong>`;

            reviewItem.innerHTML = `
                <div class="review-question">${index + 1}. ${ans.question}</div>
                <div class="review-answer">
                    <p>Sua resposta: ${userAnswerHTML}${correctAnswerHTML}</p>
                </div>
                <div class="review-explanation">
                    <strong>Explicação:</strong> ${ans.explanation}
                </div>
            `;
            answersReviewContainer.appendChild(reviewItem);
        });

        navigate('results-screen');
    }

    /**
     * Embaralha um array (Algoritmo Fisher-Yates).
     */
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }


    // --- 5. INICIALIZAÇÃO E EVENT LISTENERS ---

    // ----- Navegação Home -----
    document.querySelectorAll('.lang-card').forEach(card => {
        card.addEventListener('click', () => {
            state.currentLang = card.getAttribute('data-lang'); // Apenas define o idioma
            loadTopics(); // Carrega os tópicos sugeridos
            navigate('topics-screen');
        });
    });

    // ----- Navegação (Botões "Voltar") -----
    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetScreen = btn.getAttribute('data-target');
            navigate(targetScreen);
        });
    });

    // ----- Tela de Tópicos -----
    topicSearchInput.addEventListener('input', loadTopics);

    // NOVO: Event listener para o botão de prompt customizado
    customTopicBtn.addEventListener('click', () => {
        const customTopic = customTopicInput.value.trim();
        if (customTopic) {
            // Limpa a busca e a lista
            topicSearchInput.value = '';
            topicListContainer.innerHTML = '';
            // Busca o conteúdo do tópico customizado
            fetchAndDisplayStudyContent(customTopic);
        } else {
            alert('Por favor, digite um tópico para estudar.');
        }
    });

    // ----- Tela de Estudo -----
    document.getElementById('go-to-quiz-btn').addEventListener('click', () => {
        navigate('quiz-config-screen');
    });

    // ----- Tela de Configuração do Quiz -----
    questionSlider.addEventListener('input', (e) => {
        questionCountSpan.textContent = e.target.value;
    });
    document.getElementById('start-quiz-btn').addEventListener('click', startQuiz);

    // ----- Tela de Quiz -----
    nextQuestionBtn.addEventListener('click', () => {
        state.currentQuestionIndex++;
        loadQuestion();
    });
    document.getElementById('quit-quiz-btn').addEventListener('click', () => {
        if (confirm('Tem certeza que deseja sair? Seu progresso será perdido.')) {
            navigate('topics-screen');
        }
    });

    // ----- Tela de Resultados -----
    document.getElementById('redo-quiz-btn').addEventListener('click', () => {
        // Reinicia o quiz com as mesmas perguntas (mas embaralhadas)
        state.quizQuestions = shuffleArray(state.quizQuestions);
        state.userAnswers = [];
        state.currentQuestionIndex = 0;
        navigate('quiz-screen');
        loadQuestion();
    });
    document.getElementById('back-to-topics-btn').addEventListener('click', () => {
        navigate('topics-screen');
    });

    // ----- Inicialização do App -----
    loadState(); // Carrega o histórico do localStorage
    navigate('home-screen'); // Começa na tela inicial
    toggleLoading(false); // Garante que o loading esteja escondido

});