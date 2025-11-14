// Espera o DOM carregar completamente ANTES de fazer qualquer coisa
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. INICIALIZAÇÃO E CHAVES (MOVIDO PARA DENTRO) ---
    const SUPABASE_URL = 'https://nastbaguvekevhpyefhc.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hc3RiYWd1dmVrZXZocHllZmhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2NjEzNDEsImV4cCI6MjA3ODIzNzM0MX0.fGjKkmH9D040CGQGD2bhDy1kYy_9gpaZgUQUzhiSDO8';
    const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


    // --- 2. DEFINIÇÕES DE DADOS (Tópicos) ---
    const allTopics = {
        'en': {
            'iniciante': [
                { id: 'en_1', title: 'O Verbo "To Be" (Ser/Estar)', description: 'Fundação: Aprenda Am, Is, Are.' },
                { id: 'en_2', title: 'Simple Present', description: 'Fale sobre rotinas e fatos.' },
                { id: 'en_3', title: 'Present Continuous', description: 'Fale sobre ações acontecendo agora.' },
                { id: 'en_9', title: 'Artigos (A, An, The)', description: 'Quando usar artigos definidos e indefinidos.' },
                { id: 'en_10', title: 'Plurais Regulares e Irregulares', description: 'Ex: book/books, man/men.' },
                { id: 'en_19', title: 'Perguntas com (Who, What, Where, Why)', description: 'Formulando perguntas (WH-Questions).' }
            ],
            'intermediario': [
                { id: 'en_4', title: 'Simple Past (Verbos Regulares)', description: 'Fale sobre ações terminadas (ex: walked).' },
                { id: 'en_5', title: 'Simple Past (Verbos Irregulares)', description: 'Ações terminadas (ex: went, saw).' },
                { id: 'en_6', title: 'Futuro com "Will" e "Going To"', description: 'Diferenças entre planos e previsões.' },
                { id: 'en_7', title: 'Preposições de Lugar (In, On, At)', description: 'Onde as coisas estão.' },
                { id: 'en_8', title: 'Preposições de Tempo (In, On, At)', description: 'Quando as coisas acontecem.' },
                { id: 'en_11', title: 'Verbos Modais (Can, Could, Should)', description: 'Habilidade, permissão, conselho.' },
                { id: 'en_12', title: 'Past Continuous', description: 'Ações que estavam acontecendo no passado.' },
                { id: 'en_20', title: 'Phrasal Verbs Comuns (Get, Go, Put)', description: 'Verbos compostos essenciais.' }
            ],
            'avancado': [
                { id: 'en_13', title: 'Present Perfect (Com "For" e "Since")', description: 'Ações que começaram no passado e continuam.' },
                { id: 'en_14', title: 'Present Perfect vs Simple Past', description: 'A maior dúvida dos brasileiros.' },
                { id: 'en_15', title: 'Past Perfect', description: 'O passado do passado (ex: had done).' },
                { id: 'en_16', title: 'Conditionals (Zero, First, Second)', description: 'Frases com "Se" (If clauses).' },
                { id: 'en_17', title: 'Reported Speech (Discurso Indireto)', description: 'Contar o que outra pessoa disse.' },
                { id: 'en_18', title: 'Passive Voice (Voz Passiva)', description: 'Ex: The window was broken.' }
            ]
        },
        'it': {
            'iniciante': [
                { id: 'it_1', title: 'O Verbo "Essere" (Ser/Estar)', description: 'Fundação: Aprenda Sono, Sei, È.' },
                { id: 'it_2', title: 'O Verbo "Avere" (Ter)', description: 'Usos principais e como auxiliar.' },
                { id: 'it_3', title: 'Presente Indicativo (Verbos em -ARE)', description: 'Falar no presente (ex: parlare).' },
                { id: 'it_4', title: 'Presente Indicativo (Verbos em -ERE, -IRE)', description: 'Verbos regulares (ex: vedere, dormire).' },
                { id: 'it_5', title: 'Artigos (Il, Lo, La, Gli, Le, I)', description: 'Artigos definidos e indefinidos.' },
                { id: 'it_11', title: 'Plurais e Gênero', description: 'Como formar plurais (ex: amico/amici).' }
            ],
            'intermediario': [
                { id: 'it_6', title: 'Passato Prossimo (Com "Avere")', description: 'Falar do passado (ex: ho parlato).' },
                { id: 'it_7', title: 'Passato Prossimo (Com "Essere")', description: 'Verbos de movimento e estado.' },
                { id: 'it_8', title: 'Futuro Semplice (Futuro Simples)', description: 'Falar sobre o futuro (ex: parlerò).' },
                { id: 'it_9', title: 'Preposições Simples (A, In, Da, Di)', description: 'As preposições mais comuns.' },
                { id: 'it_10', title: 'Preposições Articuladas', description: 'Contração de preposição + artigo (ex: al, nello).' },
                { id: 'it_12', title: 'Verbos Modais (Potere, Dovere, Volere)', description: 'Poder, Dever, Querer.' },
                { id: 'it_19', title: 'Verbos Reflexivos (Lavarsi)', description: 'Ações feitas a si mesmo.' }
            ],
            'avancado': [
                { id: 'it_13', title: 'Imperfetto (Imperfeito)', description: 'O passado para descrições e hábitos.' },
                { id: 'it_14', title: 'Imperfetto vs Passato Prossimo', description: 'Quando usar cada tempo passado.' },
                { id: 'it_15', title: 'Trapassato Prossimo', description: 'O passado do passado (ex: avevo feito).' },
                { id: 'it_16', title: 'Condizionale Presente (Condicional)', description: 'Ex: "Eu gostaria" (vorrei).' },
                { id: 'it_17', title: 'Pronomes Diretos (Mi, Ti, Lo, La)', description: 'Substituindo o objeto (ex: "Eu o vejo").' },
                { id: 'it_18', title: 'Pronomes Indiretos (Mi, Ti, Gli, Le)', description: 'Ex: "Eu dou a ele" (Gli do).' },
                { id: 'it_20', title: 'Perguntas (Chi, Cosa, Dove, Perché)', description: 'Formulando perguntas.' }
            ]
        }
    };

    // --- 3. ESTADO GLOBAL DO APLICATIVO ---

    let state = {
        currentLang: 'en', // 'en' ou 'it'
        currentLevel: 'iniciante', // Nível ativo
        currentTopic: null, // ex: { id: 'en_1', title: 'O Verbo "To Be"' }
        currentScreen: 'login-screen', // Tela inicial
        quizQuestions: [], // Armazena as perguntas do quiz
        userAnswers: [], // Armazena as respostas do usuário
        currentQuestionIndex: 0,
        studyContentCache: null, // Cache do conteúdo de estudo atual
        currentUser: null, // Armazena o objeto do usuário do Supabase
        isGuest: false, // Flag para modo convidado
        historyCache: new Map(), // Cache para os dados completos do histórico
    };

    // --- 4. SELETORES DE ELEMENTOS (DOM) ---
    const loadingOverlay = document.getElementById('loading-overlay');
    const loadingText = document.getElementById('loading-text');
    const appHeader = document.getElementById('app-header');
    
    const userMenu = document.getElementById('user-menu');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
    const mobileNavLinks = document.getElementById('mobile-nav-links');
    const mobileUserMenu = document.getElementById('mobile-user-menu');

    // Elementos de Autenticação
    const primaryGoogleBtn = document.getElementById('primary-google-btn');
    const guestLoginBtn = document.getElementById('guest-login-btn');
    const emailLoginForm = document.getElementById('email-login-form');
    const loginMessage = document.getElementById('login-message');
    const goToRegisterLink = document.getElementById('go-to-register-link');
    const goToForgotPasswordLink = document.getElementById('go-to-forgot-password-link');
    const backToLoginLinks = document.querySelectorAll('.back-to-login-link');
    
    // Registo
    const registerForm = document.getElementById('register-form');
    const registerMessage = document.getElementById('register-message');
    
    // Recuperar Senha
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    const forgotPasswordMessage = document.getElementById('forgot-password-message');

    // Atualizar Senha
    const updatePasswordForm = document.getElementById('update-password-form');
    const updatePasswordMessage = document.getElementById('update-password-message');

    // Elementos da Tela Home
    const selectEnBtn = document.getElementById('select-en');
    const selectItBtn = document.getElementById('select-it');

    // Elementos da Tela de Tópicos
    const topicListContainer = document.getElementById('topic-list-container');
    const topicSearchInput = document.getElementById('topic-search');
    const customTopicInput = document.getElementById('custom-topic-input');
    const customTopicBtn = document.getElementById('custom-topic-btn');
    const levelTabs = document.querySelectorAll('.level-tab-btn');

    // Elementos da Tela de Estudo
    const studyContentWrapper = document.getElementById('study-content-wrapper');
    const studyTopicTitle = document.getElementById('study-topic-title');
    const backToTopicsBtn = document.getElementById('back-to-topics-btn');
    const startQuizConfigBtn = document.getElementById('start-quiz-config-btn');

    // Elementos da Tela de Configuração do Quiz
    const backToStudyBtn = document.getElementById('back-to-study-btn');
    const questionSlider = document.getElementById('question-slider');
    const questionCountSpan = document.getElementById('question-count');
    const startQuizBtn = document.getElementById('start-quiz-btn');

    // Elementos da Tela de Quiz
    const quizProgressSpan = document.getElementById('quiz-progress');
    const questionTextEl = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const nextQuestionBtn = document.getElementById('next-question-btn');
    const quitQuizBtn = document.getElementById('quit-quiz-btn');

    // Elementos da Tela de Resultados
    const resultsSummaryEl = document.querySelector('.results-summary'); 
    const scoreTextEl = document.getElementById('score-text');
    const answersReviewContainer = document.getElementById('answers-review-container');
    const backToHomeBtn = document.getElementById('back-to-home-btn');
    const reviewAnswersBtn = document.getElementById('review-answers-btn');
    const backToHistoryBtn = document.getElementById('back-to-history-btn'); 

    // Elementos do Cabeçalho e Navegação
    const navHomeBtn = document.getElementById('nav-home-btn');
    const navHistoryBtn = document.getElementById('nav-history-btn');
    
    // Elementos da Tela de Histórico
    const historyListContainer = document.getElementById('history-list-container');
    const generateReviewPdfBtn = document.getElementById('generate-review-pdf-btn'); 
    const pdfHelperText = document.getElementById('pdf-helper-text'); 


    // --- 5. FUNÇÕES PRINCIPAIS ---

    function navigate(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            state.currentScreen = screenId;
        }

        const authScreens = ['login-screen', 'register-screen', 'forgot-password-screen', 'update-password-screen'];
        if (authScreens.includes(screenId)) {
            appHeader.classList.add('hidden');
            document.body.classList.add('no-auth');
        } else {
            appHeader.classList.remove('hidden');
            document.body.classList.remove('no-auth');
        }
        
        closeMobileMenu();
    }

    function toggleLoading(show, text = 'Carregando...') {
        if (show) {
            loadingText.textContent = text;
            loadingOverlay.classList.remove('hidden');
        } else {
            loadingOverlay.classList.add('hidden');
        }
    }

    function showAuthMessage(element, message, isError = true) {
        if (!element) return;
        element.textContent = message;
        element.classList.toggle('error', isError);
        element.classList.toggle('success', !isError);
        element.classList.add('visible');
    }

    function clearAuthMessages() {
        document.querySelectorAll('.auth-message').forEach(msg => {
            msg.textContent = '';
            msg.classList.remove('visible', 'error', 'success');
        });
    }

    // --- 6. LÓGICA DE AUTENTICAÇÃO (SUPABASE) ---

    supabaseClient.auth.onAuthStateChange((event, session) => {
        clearAuthMessages();
        
        if (event === 'PASSWORD_RECOVERY') {
            navigate('update-password-screen');
            return;
        }

        if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
            if (session) {
                state.currentUser = session.user;
                state.isGuest = false;
                updateUIforLoggedInUser();
                if(state.currentScreen === 'login-screen' || state.currentScreen === 'register-screen' || state.currentScreen === 'update-password-screen') {
                   navigate('home-screen'); 
                }
            } else if (event === 'INITIAL_SESSION') {
                navigate('login-screen');
            }
        }

        if (event === 'SIGNED_OUT') {
            state.currentUser = null;
            state.isGuest = false;
            updateUIforGuest(false); 
            navigate('login-screen');
        }
    });

    function updateUIforLoggedInUser() {
        if (!state.currentUser) return;
        const user = state.currentUser;
        const emailInitial = user.email ? user.email.charAt(0).toUpperCase() : '?';
        const avatarUrl = user.user_metadata?.avatar_url;

        const avatarHTML = avatarUrl 
            ? `<img src="${avatarUrl}" alt="Avatar" class="user-avatar">` 
            : `<div class="user-avatar-initial">${emailInitial}</div>`;

        userMenu.innerHTML = `
            ${avatarHTML}
            <button id="logout-btn-desktop" class="btn btn-danger-outline btn-small">Sair</button>
        `;
        
        mobileUserMenu.innerHTML = `
            <div class="mobile-user-info">
                ${avatarHTML}
                <span class="user-email">${user.email}</span>
            </div>
            <button id="logout-btn-mobile" class="btn btn-danger-outline btn-full">Sair</button>
        `;

        document.getElementById('logout-btn-desktop').addEventListener('click', handleLogout);
        document.getElementById('logout-btn-mobile').addEventListener('click', handleLogout);
    }

    function updateUIforGuest(isGuestMode = false) {
        if (isGuestMode) {
            const guestHTML = `
                <div class="user-avatar-initial">?</div>
                <button id="guest-to-login-btn-desktop" class="btn btn-primary-outline btn-small">Fazer Login</button>
            `;
            const mobileGuestHTML = `
                <div class="mobile-user-info">
                    <div class="user-avatar-initial">?</div>
                    <span class="user-email">Modo Convidado</span>
                </div>
                <button id="guest-to-login-btn-mobile" class="btn btn-primary-outline btn-full">Fazer Login</button>
            `;
            
            userMenu.innerHTML = guestHTML;
            mobileUserMenu.innerHTML = mobileGuestHTML;

            document.getElementById('guest-to-login-btn-desktop').addEventListener('click', handleGuestToLogin);
            document.getElementById('guest-to-login-btn-mobile').addEventListener('click', handleGuestToLogin);

        } else {
            userMenu.innerHTML = ''; 
            mobileUserMenu.innerHTML = '';
        }
    }

    function handleGuestToLogin() {
        state.isGuest = false;
        state.currentUser = null;
        navigate('login-screen');
    }

    // --- Handlers de Eventos de Autenticação ---
    primaryGoogleBtn.addEventListener('click', async () => {
        toggleLoading(true, 'A redirecionar para o Google...');
        const { error } = await supabaseClient.auth.signInWithOAuth({ provider: 'google' });
        if (error) {
            toggleLoading(false);
            showAuthMessage(loginMessage, `Erro: ${error.message}`);
        }
    });

    guestLoginBtn.addEventListener('click', () => {
        state.isGuest = true;
        state.currentUser = null; 
        updateUIforGuest(true);
        navigate('home-screen');
    });

    emailLoginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        toggleLoading(true, 'A fazer login...');
        const email = e.target['login-email'].value;
        const password = e.target['login-password'].value;
        const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
        toggleLoading(false);
        if (error) {
            showAuthMessage(loginMessage, `Erro: Email ou senha inválidos.`); 
        }
    });

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = e.target['register-email'].value;
        const password = e.target['register-password'].value;
        const confirmPassword = e.target['register-password-confirm'].value;

        if (password !== confirmPassword) {
            showAuthMessage(registerMessage, 'As senhas não coincidem.');
            return;
        }

        toggleLoading(true, 'A criar conta...');
        const { data, error } = await supabaseClient.auth.signUp({ email, password });
        toggleLoading(false);
        if (error) {
            showAuthMessage(registerMessage, `Erro: ${error.message}`);
        } else {
            showAuthMessage(registerMessage, 'Conta criada! Por favor, verifique o seu email para confirmar.', false);
        }
    });

    forgotPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        toggleLoading(true, 'A enviar email...');
        const email = e.target['forgot-email'].value;
        const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin, 
        });
        toggleLoading(false);
        if (error) {
            showAuthMessage(forgotPasswordMessage, `Erro: ${error.message}`);
        } else {
            showAuthMessage(forgotPasswordMessage, 'Email de recuperação enviado! Verifique a sua caixa de entrada.', false); 
        }
    });

    updatePasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const password = e.target['update-password'].value;
        const confirmPassword = e.target['update-password-confirm'].value;

        if (password !== confirmPassword) {
            showAuthMessage(updatePasswordMessage, 'As senhas não coincidem.');
            return;
        }

        toggleLoading(true, 'A atualizar senha...');
        const { data, error } = await supabaseClient.auth.updateUser({ password });
        toggleLoading(false);
        if (error) {
            showAuthMessage(updatePasswordMessage, `Erro: ${error.message}`);
        } else {
            showAuthMessage(updatePasswordMessage, 'Senha atualizada com sucesso! A redirecionar...', false);
            setTimeout(() => {
                supabaseClient.auth.signOut();
                navigate('login-screen');
            }, 3000);
        }
    });

    async function handleLogout() {
        toggleLoading(true, 'A sair...');
        const { error } = await supabaseClient.auth.signOut();
        toggleLoading(false);
        if (error) {
            alert(`Erro ao sair: ${error.message}`);
        }
    }

    // --- Links de Navegação entre ecrãs de Auth ---
    goToRegisterLink.addEventListener('click', () => navigate('register-screen'));
    goToForgotPasswordLink.addEventListener('click', () => navigate('forgot-password-screen'));
    backToLoginLinks.forEach(link => {
        link.addEventListener('click', () => navigate('login-screen'));
    });


    // --- 7. FUNÇÃO 'loadTopics' ---
    function loadTopics() {
        if (!topicListContainer) return; 
        
        const langTopics = allTopics[state.currentLang] || {}; 
        const levelTopics = langTopics[state.currentLevel] || []; 
        
        const searchTerm = topicSearchInput.value.toLowerCase();
        const filteredTopics = levelTopics.filter(topic => 
            topic.title.toLowerCase().includes(searchTerm) || 
            topic.description.toLowerCase().includes(searchTerm)
        );

        topicListContainer.innerHTML = ''; 
        if (filteredTopics.length === 0) {
            topicListContainer.innerHTML = '<p class="empty-list-text">Nenhum tópico sugerido encontrado.</p>';
            return;
        }

        filteredTopics.forEach(topic => {
            const item = document.createElement('div');
            item.className = 'topic-item';
            item.innerHTML = `<h3>${topic.title}</h3><p>${topic.description}</p>`;
            item.addEventListener('click', () => {
                customTopicInput.value = '';
                state.currentTopic = topic;
                fetchAndDisplayStudyContent(topic.title);
            });
            topicListContainer.appendChild(item);
        });
    }


    // --- 8. LÓGICA DE NAVEGAÇÃO DO APLICATIVO ---

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('open');
        mobileNavOverlay.classList.toggle('open');
        document.body.classList.toggle('mobile-menu-open');
    });

    function closeMobileMenu() {
        mobileMenuBtn.classList.remove('open');
        mobileNavOverlay.classList.remove('open');
        document.body.classList.remove('mobile-menu-open');
    }

    selectEnBtn.addEventListener('click', () => {
        state.currentLang = 'en';
        loadTopics(); 
        navigate('topics-screen');
    });
    selectItBtn.addEventListener('click', () => {
        state.currentLang = 'it';
        loadTopics(); 
        navigate('topics-screen');
    });

    levelTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            levelTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            state.currentLevel = tab.dataset.level;
            loadTopics();
        });
    });

    customTopicBtn.addEventListener('click', () => {
        const topicTitle = customTopicInput.value;
        if (topicTitle.trim()) {
            state.currentTopic = { id: 'custom', title: topicTitle };
            fetchAndDisplayStudyContent(topicTitle);
        }
    });

    topicSearchInput.addEventListener('input', loadTopics); 

    backToTopicsBtn.addEventListener('click', () => navigate('topics-screen'));

    startQuizConfigBtn.addEventListener('click', () => navigate('quiz-config-screen'));

    backToStudyBtn.addEventListener('click', () => navigate('study-screen'));

    questionSlider.addEventListener('input', (e) => {
        questionCountSpan.textContent = `${e.target.value} perguntas`;
    });

    startQuizBtn.addEventListener('click', () => {
        const numQuestions = parseInt(questionSlider.value, 10);
        fetchAndDisplayQuiz(numQuestions);
    });

    quitQuizBtn.addEventListener('click', () => {
        if (confirm('Tem a certeza que quer desistir do quiz? O seu progresso não será salvo.')) {
            navigate('topics-screen');
        }
    });

    backToHomeBtn.addEventListener('click', () => navigate('home-screen'));
    
    backToHistoryBtn.addEventListener('click', () => navigate('history-screen'));

    reviewAnswersBtn.addEventListener('click', () => {
        answersReviewContainer.classList.toggle('visible');
        reviewAnswersBtn.textContent = answersReviewContainer.classList.contains('visible') 
            ? 'Esconder Revisão' 
            : 'Revisar Respostas';
    });

    navHomeBtn.addEventListener('click', () => navigate('home-screen'));
    navHistoryBtn.addEventListener('click', () => {
        fetchAndDisplayHistory();
        navigate('history-screen');
    });
    
    mobileNavLinks.appendChild(navHomeBtn.cloneNode(true)).addEventListener('click', () => navigate('home-screen'));
    mobileNavLinks.appendChild(navHistoryBtn.cloneNode(true)).addEventListener('click', () => {
        fetchAndDisplayHistory();
        navigate('history-screen');
    });

    generateReviewPdfBtn.addEventListener('click', handleGenerateReviewPDF);


    // --- 9. LÓGICA DE CONTEÚDO (API) ---

    async function fetchAndDisplayStudyContent(topicTitle) {
        navigate('study-screen');
        toggleLoading(true, 'A gerar a sua aula... Isto pode demorar alguns segundos.');
        studyTopicTitle.textContent = topicTitle;
        studyContentWrapper.innerHTML = ''; 

        try {
            const response = await fetch('/api/study-content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    topic: topicTitle,
                    lang: state.currentLang
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Falha ao buscar conteúdo.');
            }

            const data = await response.json();
            state.studyContentCache = data.content; 
            studyContentWrapper.innerHTML = data.content;
            addSpeakButtons(); 

        } catch (error) {
            console.error('Erro em fetchAndDisplayStudyContent:', error);
            studyContentWrapper.innerHTML = `<p class="error-message">Não foi possível carregar a aula. Tente novamente. (Erro: ${error.message})</p>`;
        } finally {
            toggleLoading(false);
        }
    }

    function addSpeakButtons() {
        const langCode = state.currentLang === 'it' ? 'it-IT' : 'en-US';
        const elements = studyContentWrapper.querySelectorAll('li, p');

        elements.forEach(el => {
            const strongTag = el.querySelector('strong');
            if (!strongTag) {
                return; 
            }
            
            el.querySelectorAll('.speak-btn').forEach(btn => btn.remove());
            
            let cleanText = strongTag.textContent;
            cleanText = cleanText.replace('🔈', '').replace(/[\(\)\[\]\{\}]/g, '').trim();

            if (cleanText.length > 1) { 
                const speakBtn = document.createElement('span');
                speakBtn.className = 'speak-btn';
                speakBtn.textContent = '🔈';
                speakBtn.title = 'Ouvir pronúncia';
                
                speakBtn.onclick = (e) => {
                    e.stopPropagation(); 
                    speakText(cleanText, langCode);
                };
                
                el.classList.add('has-speak-btn');
                el.prepend(speakBtn);
            }
        });
    }

    function speakText(text, langCode) {
        if (!('speechSynthesis' in window)) {
            alert('O seu navegador não suporta a síntese de voz.');
            return;
        }

        window.speechSynthesis.cancel(); 
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = langCode;
        
        const voices = window.speechSynthesis.getVoices();
        let targetVoice = voices.find(voice => voice.lang === langCode && voice.localService);
        if (!targetVoice) {
            targetVoice = voices.find(voice => voice.lang === langCode);
        }
        
        if (targetVoice) {
            utterance.voice = targetVoice;
        }

        if (voices.length === 0) {
            window.speechSynthesis.onvoiceschanged = () => {
                const newVoices = window.speechSynthesis.getVoices();
                targetVoice = newVoices.find(voice => voice.lang === langCode && voice.localService) || newVoices.find(voice => voice.lang === langCode);
                if (targetVoice) {
                    utterance.voice = targetVoice;
                }
                window.speechSynthesis.speak(utterance);
            };
        } else {
            window.speechSynthesis.speak(utterance);
        }
    }


    async function fetchAndDisplayQuiz(numQuestions) {
        if (!state.studyContentCache) {
            alert('Erro: Conteúdo de estudo não encontrado. Por favor, volte e gere a aula primeiro.');
            navigate('study-screen');
            return;
        }

        navigate('quiz-screen');
        toggleLoading(true, `A gerar o seu quiz de ${numQuestions} perguntas...`);

        try {
            const response = await fetch('/api/quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: state.studyContentCache,
                    numQuestions: numQuestions,
                    lang: state.currentLang
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Falha ao buscar quiz.');
            }

            const data = await response.json();
            
            state.quizQuestions = data.questions || [];
            state.userAnswers = [];
            state.currentQuestionIndex = 0;

            if (state.quizQuestions.length === 0) {
                throw new Error('A IA não retornou nenhuma pergunta para este tópico.');
            }

            displayCurrentQuestion();

        } catch (error) {
            console.error('Erro em fetchAndDisplayQuiz:', error);
            toggleLoading(false);
            alert(`Não foi possível gerar o quiz. Tente novamente. (Erro: ${error.message})`);
            navigate('quiz-config-screen');
        } finally {
            toggleLoading(false);
        }
    }

    function displayCurrentQuestion() {
        const q = state.quizQuestions[state.currentQuestionIndex];
        
        quizProgressSpan.textContent = `Pergunta ${state.currentQuestionIndex + 1}/${state.quizQuestions.length}`;
        questionTextEl.textContent = q.pergunta;
        
        optionsContainer.innerHTML = ''; 
        
        const options = [...q.opcoes_incorretas, q.opcao_correta];
        options.sort(() => Math.random() - 0.5);

        options.forEach(option => {
            const optionBtn = document.createElement('button');
            optionBtn.className = 'btn btn-outline quiz-option';
            optionBtn.textContent = option;
            optionBtn.dataset.answer = option; 

            optionBtn.addEventListener('click', (e) => handleOptionSelect(e, q.opcao_correta));
            
            optionsContainer.appendChild(optionBtn);
        });

        nextQuestionBtn.textContent = (state.currentQuestionIndex === state.quizQuestions.length - 1)
            ? 'Finalizar Quiz'
            : 'Avançar';
        
        nextQuestionBtn.disabled = true;
    }

    function handleOptionSelect(e, correctAnswer) {
        const selectedBtn = e.target;
        const userAnswer = selectedBtn.dataset.answer;

        optionsContainer.querySelectorAll('.quiz-option').forEach(btn => {
            btn.disabled = true;
            
            if (btn.dataset.answer === correctAnswer) {
                btn.classList.add('correct');
            } else if (btn === selectedBtn) {
                btn.classList.add('incorrect');
            }
        });

        state.userAnswers[state.currentQuestionIndex] = userAnswer;
        nextQuestionBtn.disabled = false;
    }

    nextQuestionBtn.addEventListener('click', () => {
        if (state.currentQuestionIndex < state.quizQuestions.length - 1) {
            state.currentQuestionIndex++;
            displayCurrentQuestion();
        } else {
            showQuizResults();
        }
    });

    /**
     * (MODIFICADO)
     * Salva o quiz_data completo, incluindo o level e o studyContentCache.
     */
    async function showQuizResults() {
        let score = 0;
        const quizDataForReview = [];

        state.quizQuestions.forEach((q, index) => {
            const userAnswer = state.userAnswers[index] || "Não respondida";
            const isCorrect = q.opcao_correta === userAnswer;
            
            if (isCorrect) {
                score++;
            }
            
            quizDataForReview.push({
                pergunta: q.pergunta,
                opcoes_incorretas: q.opcoes_incorretas,
                opcao_correta: q.opcao_correta,
                explicacao: q.explicacao,
                user_answer: userAnswer,
                is_correct: isCorrect
            });
        });

        const total = state.quizQuestions.length;
        const percentage = (total > 0) ? Math.round((score / total) * 100) : 0;
        const scoreString = `${score} de ${total}`;
        
        scoreTextEl.textContent = `Você acertou ${scoreString} (${percentage}%)!`;

        resultsSummaryEl.classList.remove('hidden');
        backToHistoryBtn.classList.add('hidden');
        reviewAnswersBtn.classList.remove('hidden');
        backToHomeBtn.classList.remove('hidden');

        populateAnswersReview(quizDataForReview);
        answersReviewContainer.classList.remove('visible'); 
        reviewAnswersBtn.textContent = 'Revisar Respostas';
        
        navigate('results-screen');

        // (MODIFICADO) Salva no Supabase
        if (state.currentUser && !state.isGuest) {
            
            // Prepara o objeto JSONB para salvar
            const quizDataToSave = {
                topic_title: state.currentTopic.title,
                score: scoreString,
                percentage: percentage,
                level: state.currentLevel,         // Salva o Nível
                questions: quizDataForReview,
                studyContent: state.studyContentCache // Salva o Conteúdo da Aula
            };

            const { error } = await supabaseClient
                .from('quiz_history')
                .insert({ 
                    user_id: state.currentUser.id,
                    topic_title: state.currentTopic.title,
                    score: scoreString, 
                    quiz_data: quizDataToSave // Salva o JSON completo
                });
            
            if (error) {
                console.error('Erro ao salvar o histórico no Supabase:', error.message);
            }
        }
    }

    function populateAnswersReview(questionsData) {
        answersReviewContainer.innerHTML = ''; 
        
        questionsData.forEach((q, index) => {
            const reviewCard = document.createElement('div');
            reviewCard.className = `review-card ${q.is_correct ? 'correct' : 'incorrect'}`;

            reviewCard.innerHTML = `
                <p class="review-question"><strong>${index + 1}. ${q.pergunta}</strong></p>
                <p>A sua resposta: <span class="review-answer ${q.is_correct ? 'correct' : 'incorrect'}">${q.user_answer}</span></p>
                ${!q.is_correct ? `<p>Resposta correta: <span class="review-answer correct">${q.opcao_correta}</span></p>` : ''}
                <div class="review-explanation">
                    <strong>Porquê?</strong>
                    <p>${q.explicacao}</p>
                </div>
            `;
            answersReviewContainer.appendChild(reviewCard);
        });
    }

    function displayQuizForReview(quizData) {
        if (!quizData || !quizData.questions) {
            alert('Erro: Não foi possível carregar os dados deste quiz.');
            return;
        }

        scoreTextEl.textContent = `Revisando: ${quizData.topic_title} (${quizData.score})`;
        resultsSummaryEl.classList.add('hidden'); 
        backToHistoryBtn.classList.remove('hidden'); 
        
        populateAnswersReview(quizData.questions);
        answersReviewContainer.classList.add('visible'); 
        
        navigate('results-screen');
    }

    async function fetchAndDisplayHistory() {
        historyListContainer.innerHTML = '';
        state.historyCache.clear(); 
        updatePdfButtonState(); 

        if (state.isGuest || !state.currentUser) {
            historyListContainer.innerHTML = `
                <div class="history-item guest-message">
                    <p>O seu histórico de quizzes não está a ser salvo.</p>
                    <button id="history-guest-login-btn" class="btn btn-primary-outline btn-small">Fazer Login para salvar</button>
                </div>
            `;
            document.getElementById('history-guest-login-btn').addEventListener('click', handleGuestToLogin);
            generateReviewPdfBtn.classList.add('hidden'); 
            pdfHelperText.classList.add('hidden');
            return;
        }

        generateReviewPdfBtn.classList.remove('hidden'); 
        pdfHelperText.classList.remove('hidden');

        toggleLoading(true, 'A buscar o seu histórico...');
        
        try {
            const { data, error } = await supabaseClient
                .from('quiz_history')
                .select('id, created_at, topic_title, score, quiz_data') 
                .eq('user_id', state.currentUser.id)
                .order('created_at', { ascending: false }); 
            
            if (error) throw error;

            if (data.length === 0) {
                historyListContainer.innerHTML = '<p class="empty-list-text">Você ainda não completou nenhum quiz.</p>';
            } else {
                data.forEach(item => {
                    state.historyCache.set(item.id, item.quiz_data);

                    const historyCard = document.createElement('div');
                    historyCard.className = 'history-item';
                    
                    const date = new Date(item.created_at);
                    const formattedDate = date.toLocaleString('pt-BR', { 
                        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                    });

                    let displayScore = item.score; 
                    if (item.quiz_data && item.quiz_data.percentage !== undefined) {
                        displayScore = `${item.quiz_data.percentage}%`;
                    }
                    
                    historyCard.innerHTML = `
                        <div class="history-item-main">
                            <input type="checkbox" class="history-checkbox" data-quiz-id="${item.id}" aria-label="Selecionar este quiz">
                            <div class="history-item-info">
                                <div class="history-item-header">
                                    <span class="history-score">${displayScore}</span>
                                    <span class="history-date">${formattedDate}</span>
                                </div>
                                <h4 class="history-title">${item.topic_title}</h4>
                            </div>
                        </div>
                        
                        <div class="history-item-actions">
                            <button class="btn btn-outline btn-small review-quiz-btn" data-quiz-id="${item.id}">
                                Revisar Quiz
                            </button>
                        </div>
                    `;
                    
                    historyCard.querySelector('.review-quiz-btn').addEventListener('click', (e) => {
                        e.stopPropagation();
                        const quizData = state.historyCache.get(item.id);
                        displayQuizForReview(quizData);
                    });

                    historyCard.querySelector('.history-checkbox').addEventListener('change', updatePdfButtonState);

                    historyListContainer.appendChild(historyCard);
                });
            }

        } catch (error) {
            console.error('Erro ao buscar histórico:', error.message);
            historyListContainer.innerHTML = `<p class="error-message">Não foi possível carregar o seu histórico. (Erro: ${error.message})</p>`;
        } finally {
            toggleLoading(false);
        }
    }

    // --- Funções para Geração de PDF ---

    function updatePdfButtonState() {
        const selectedQuizzes = document.querySelectorAll('.history-checkbox:checked');
        if (selectedQuizzes.length > 0) {
            generateReviewPdfBtn.disabled = false;
            generateReviewPdfBtn.textContent = `Gerar Guia de Revisão (${selectedQuizzes.length})`;
        } else {
            generateReviewPdfBtn.disabled = true;
            generateReviewPdfBtn.textContent = 'Gerar Guia de Revisão (PDF)';
        }
    }

    async function handleGenerateReviewPDF() {
        toggleLoading(true, 'Analisando seus erros... Isto pode demorar um pouco.');

        const selectedCheckboxes = document.querySelectorAll('.history-checkbox:checked');
        const quizzesSelecionados = []; // Envia os quizzes inteiros

        selectedCheckboxes.forEach(chk => {
            const quizId = chk.dataset.quizId;
            const quizData = state.historyCache.get(parseInt(quizId, 10)); 
            
            if (quizData) {
                quizzesSelecionados.push(quizData);
            }
        });

        if (quizzesSelecionados.length === 0) {
            toggleLoading(false);
            alert('Por favor, selecione ao menos um quiz para gerar o guia.');
            return;
        }

        try {
            const response = await fetch('/api/generate-review-pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    quizzesSelecionados: quizzesSelecionados, // Esta é a chave correta
                    lang: state.currentLang 
                }),
            });

            toggleLoading(true, 'Gerando seu PDF personalizado...');

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Falha ao gerar o PDF no servidor.');
            }

            const blob = await response.blob();
            
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `guia_de_revisao_talkpro_${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(a);
            a.click();
            
            window.URL.revokeObjectURL(url);
            a.remove();

        } catch (error) {
            console.error('Erro em handleGenerateReviewPDF:', error);
            alert(`Não foi possível gerar o PDF. (Erro: ${error.message})`);
        } finally {
            toggleLoading(false);
        }
    }


    // --- 10. INICIALIZAÇÃO ---
    loadTopics(); 

}); // FIM DO DOMCONTENTLOADED