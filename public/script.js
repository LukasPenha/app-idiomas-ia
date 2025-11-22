// Espera o DOM carregar completamente ANTES de fazer qualquer coisa
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. INICIALIZAÇÃO E CHAVES ---
    const SUPABASE_URL = 'https://nastbaguvekevhpyefhc.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hc3RiYWd1dmVrZXZocHllZmhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2NjEzNDEsImV4cCI6MjA3ODIzNzM0MX0.fGjKkmH9D040CGQGD2bhDy1kYy_9gpaZgUQUzhiSDO8';
    const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    // --- "AQUECER" A API DE VOZ ---
    let voices = [];
    if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => {
            voices = window.speechSynthesis.getVoices();
        };
        window.speechSynthesis.getVoices(); 
    }

    // --- 2. DEFINIÇÕES DE DADOS (Tópicos - 30 por nível) ---
    const allTopics = {
        'en': {
            'iniciante': [
                { id: 'en_1', title: 'Verb "To Be" (Am/Is/Are)', description: 'Ser ou Estar: A base de tudo.' },
                { id: 'en_2', title: 'Simple Present (Habits)', description: 'Falar sobre rotinas e fatos.' },
                { id: 'en_3', title: 'Present Continuous (Now)', description: 'O que está acontecendo agora.' },
                { id: 'en_4', title: 'Articles (A, An, The)', description: 'Artigos definidos e indefinidos.' },
                { id: 'en_5', title: 'Plurais (Regular & Irregular)', description: 'Book/Books, Man/Men.' },
                { id: 'en_6', title: 'Subject Pronouns (I, You, He)', description: 'Quem faz a ação.' },
                { id: 'en_7', title: 'Object Pronouns (Me, You, Him)', description: 'Quem recebe a ação.' },
                { id: 'en_8', title: 'Possessive Adjectives (My, Your)', description: 'Indicar posse.' },
                { id: 'en_9', title: 'Demonstratives (This, That)', description: 'Este, Aquele (perto/longe).' },
                { id: 'en_10', title: 'Imperatives (Commands)', description: 'Ordens e instruções.' },
                { id: 'en_11', title: 'Simple Past (Regular -ed)', description: 'Passado simples regular.' },
                { id: 'en_12', title: 'Simple Past (Common Irregular)', description: 'Went, Had, Did, Was.' },
                { id: 'en_13', title: 'Prepositions of Place (In, On, At)', description: 'Onde as coisas estão.' },
                { id: 'en_14', title: 'Prepositions of Time (In, On, At)', description: 'Quando as coisas acontecem.' },
                { id: 'en_15', title: 'Can / Can\'t (Ability)', description: 'Habilidade e permissão.' },
                { id: 'en_16', title: 'Countable vs Uncountable', description: 'Coisas que contamos ou não.' },
                { id: 'en_17', title: 'Much vs Many', description: 'Quantidade.' },
                { id: 'en_18', title: 'Some vs Any', description: 'Algum, nenhum.' },
                { id: 'en_19', title: 'Question Words (WH-Questions)', description: 'Who, What, Where, Why.' },
                { id: 'en_20', title: 'Comparatives (Bigger than)', description: 'Comparar duas coisas.' },
                { id: 'en_21', title: 'Superlatives (The biggest)', description: 'O maior de todos.' },
                { id: 'en_22', title: 'Adverbs of Frequency', description: 'Always, Sometimes, Never.' },
                { id: 'en_23', title: 'There is / There are', description: 'Haver / Existir.' },
                { id: 'en_24', title: 'Going to (Future Plans)', description: 'Planos futuros.' },
                { id: 'en_25', title: 'Will (Future Predictions)', description: 'Previsões.' },
                { id: 'en_26', title: 'Numbers & Dates', description: 'Números e datas.' },
                { id: 'en_27', title: 'Family Vocabulary', description: 'Membros da família.' },
                { id: 'en_28', title: 'Colors & Clothes', description: 'Cores e roupas.' },
                { id: 'en_29', title: 'Telling Time', description: 'Como dizer as horas.' },
                { id: 'en_30', title: 'Conjunctions (And, But, So)', description: 'Conectar frases.' }
            ],
            'intermediario': [
                { id: 'en_31', title: 'Past Continuous (Was doing)', description: 'Ações em progresso no passado.' },
                { id: 'en_32', title: 'Present Perfect (Basic)', description: 'Experiências de vida (Have done).' },
                { id: 'en_33', title: 'Present Perfect (For/Since)', description: 'Duração de ações.' },
                { id: 'en_34', title: 'Present Perfect vs Past Simple', description: 'Quando usar qual?' },
                { id: 'en_35', title: 'Past Perfect (Had done)', description: 'O passado do passado.' },
                { id: 'en_36', title: 'Future Continuous', description: 'Ações em progresso no futuro.' },
                { id: 'en_37', title: 'First Conditional (If... will)', description: 'Situações reais.' },
                { id: 'en_38', title: 'Second Conditional (If... would)', description: 'Situações imaginárias.' },
                { id: 'en_39', title: 'Modals Deduction (Must/Might)', description: 'Certeza e possibilidade.' },
                { id: 'en_40', title: 'Modals Obligation (Have to/Should)', description: 'Deveres e conselhos.' },
                { id: 'en_41', title: 'Passive Voice (Present/Past)', description: 'O objeto recebe a ação.' },
                { id: 'en_42', title: 'Used to / Would', description: 'Hábito no passado.' },
                { id: 'en_43', title: 'Reported Speech (Basic)', description: 'Ele disse que...' },
                { id: 'en_44', title: 'Relative Clauses (Who/Which)', description: 'Quem, o qual.' },
                { id: 'en_45', title: 'Phrasal Verbs (Set 1)', description: 'Verbos compostos comuns.' },
                { id: 'en_46', title: 'Phrasal Verbs (Set 2)', description: 'Mais verbos compostos.' },
                { id: 'en_47', title: 'Gerunds vs Infinitives', description: 'Doing vs To do.' },
                { id: 'en_48', title: 'Question Tags', description: 'Não é?, né?' },
                { id: 'en_49', title: 'So do I / Neither do I', description: 'Concordar.' },
                { id: 'en_50', title: 'Reflexive Pronouns', description: 'Myself, Yourself.' },
                { id: 'en_51', title: 'Prepositions of Movement', description: 'Into, Through, Towards.' },
                { id: 'en_52', title: 'Adjectives (-ed vs -ing)', description: 'Bored vs Boring.' },
                { id: 'en_53', title: 'Too / Enough', description: 'Demais / Suficiente.' },
                { id: 'en_54', title: 'Word Order', description: 'Ordem das palavras.' },
                { id: 'en_55', title: 'Prefixes & Suffixes', description: 'Formação de palavras.' },
                { id: 'en_56', title: 'Make vs Do', description: 'Diferenças de uso.' },
                { id: 'en_57', title: 'Say vs Tell', description: 'Dizer vs Contar.' },
                { id: 'en_58', title: 'Separable Phrasal Verbs', description: 'Turn it on.' },
                { id: 'en_59', title: 'Indefinite Pronouns', description: 'Someone, Anybody.' },
                { id: 'en_60', title: 'Get (Multiple meanings)', description: 'Os muitos usos de Get.' }
            ],
            'avancado': [
                { id: 'en_61', title: 'Third Conditional (If... would have)', description: 'Arrependimentos do passado.' },
                { id: 'en_62', title: 'Mixed Conditionals', description: 'Misturando tempos.' },
                { id: 'en_63', title: 'Future Perfect (Will have done)', description: 'Ação completa no futuro.' },
                { id: 'en_64', title: 'Future Perfect Continuous', description: 'Duração no futuro.' },
                { id: 'en_65', title: 'Past Perfect Continuous', description: 'Duração no passado.' },
                { id: 'en_66', title: 'Passive Voice (Advanced)', description: 'Passiva com Modais.' },
                { id: 'en_67', title: 'Causative (Have something done)', description: 'Mandar fazer algo.' },
                { id: 'en_68', title: 'Reported Speech (Advanced)', description: 'Mudanças de tempo complexas.' },
                { id: 'en_69', title: 'Inversion', description: 'Never have I ever...' },
                { id: 'en_70', title: 'Subjunctive Mood', description: 'I suggest that he go.' },
                { id: 'en_71', title: 'Cleft Sentences', description: 'Ênfase (It was John who...).' },
                { id: 'en_72', title: 'Participle Clauses', description: 'Walking down the street...' },
                { id: 'en_73', title: 'Phrasal Verbs (Advanced)', description: 'Verbos complexos.' },
                { id: 'en_74', title: 'Idioms (Business)', description: 'Expressões de trabalho.' },
                { id: 'en_75', title: 'Idioms (Daily Life)', description: 'Expressões do dia a dia.' },
                { id: 'en_76', title: 'Discourse Markers', description: 'Organizar a fala.' },
                { id: 'en_77', title: 'Advanced Prepositions', description: 'Despite, Regarding.' },
                { id: 'en_78', title: 'Verbs with Two Objects', description: 'Give him the book.' },
                { id: 'en_79', title: 'Ellipsis & Substitution', description: 'Omitir palavras.' },
                { id: 'en_80', title: 'Emphasis (Do/Does)', description: 'I do like it.' },
                { id: 'en_81', title: 'Wishes & Regrets', description: 'I wish I had known.' },
                { id: 'en_82', title: 'As if / As though', description: 'Como se.' },
                { id: 'en_83', title: 'Unless / In case', description: 'Condicionais.' },
                { id: 'en_84', title: 'Despite / In spite of', description: 'Apesar de.' },
                { id: 'en_85', title: 'Nuances of Future', description: 'To be about to, due to.' },
                { id: 'en_86', title: 'Narrative Tenses Review', description: 'Contar histórias.' },
                { id: 'en_87', title: 'Formal vs Informal Writing', description: 'Estilos de escrita.' },
                { id: 'en_88', title: 'Advanced Vocabulary Patterns', description: 'Collocations.' },
                { id: 'en_89', title: 'Slang & Colloquialisms', description: 'Gírias atuais.' },
                { id: 'en_90', title: 'Fixed Expressions', description: 'Frases feitas.' }
            ]
        },
        'it': {
            'iniciante': [
                { id: 'it_1', title: 'Verbo "Essere" (Ser/Estar)', description: 'Io sono, tu sei (Fundação).' },
                { id: 'it_2', title: 'Verbo "Avere" (Ter)', description: 'Io ho, tu hai (Fundação).' },
                { id: 'it_3', title: 'Artigos Definidos (Il, Lo, La...)', description: 'O grande desafio inicial.' },
                { id: 'it_4', title: 'Artigos Indefinidos (Un, Uno, Una)', description: 'Um, uma.' },
                { id: 'it_5', title: 'Gênero dos Substantivos', description: 'Masculino (-o) vs Feminino (-a).' },
                { id: 'it_6', title: 'Plural dos Substantivos', description: 'O/I, A/E, E/I.' },
                { id: 'it_7', title: 'Presente Regular (-ARE)', description: 'Parlare, Mangiare.' },
                { id: 'it_8', title: 'Presente Regular (-ERE)', description: 'Vedere, Leggere.' },
                { id: 'it_9', title: 'Presente Regular (-IRE)', description: 'Dormire, Partire.' },
                { id: 'it_10', title: 'Adjetivos (Concordância)', description: 'Como descrever coisas.' },
                { id: 'it_11', title: 'C\'è / Ci sono', description: 'Há / Existem.' },
                { id: 'it_12', title: 'Preposições Simples (Di, A, Da)', description: 'As mais usadas.' },
                { id: 'it_13', title: 'Preposições (In, Con, Su, Per)', description: 'Lugar e companhia.' },
                { id: 'it_14', title: 'Números e Horas', description: 'Contar e dizer o tempo.' },
                { id: 'it_15', title: 'Dias e Meses', description: 'Calendário básico.' },
                { id: 'it_16', title: 'Verbos Modais (Potere)', description: 'Poder.' },
                { id: 'it_17', title: 'Verbos Modais (Volere)', description: 'Querer.' },
                { id: 'it_18', title: 'Verbos Modais (Dovere)', description: 'Dever.' },
                { id: 'it_19', title: 'Interrogativos (Chi, Che, Dove)', description: 'Fazer perguntas.' },
                { id: 'it_20', title: 'Possessivos (Mio, Tuo)', description: 'Meu, teu.' },
                { id: 'it_21', title: 'Verbos Reflexivos (Presente)', description: 'Mi chiamo, Ti lavi.' },
                { id: 'it_22', title: 'Vocabulário: Família', description: 'Pai, mãe, irmãos.' },
                { id: 'it_23', title: 'Vocabulário: Cibo (Comida)', description: 'Essencial na Itália.' },
                { id: 'it_24', title: 'Preposições Articuladas (Intro)', description: 'Del, Della, Al, Alla.' },
                { id: 'it_25', title: 'Passato Prossimo (com Avere)', description: 'Passado recente básico.' },
                { id: 'it_26', title: 'Passato Prossimo (com Essere)', description: 'Verbos de movimento.' },
                { id: 'it_27', title: 'Mi piace / Mi piacciono', description: 'Expressar gostos.' },
                { id: 'it_28', title: 'Vorrei (Polidez)', description: 'Eu gostaria...' },
                { id: 'it_29', title: 'Demonstrativos (Questo/Quello)', description: 'Este, Aquele.' },
                { id: 'it_30', title: 'Advérbios de Frequência', description: 'Sempre, Spesso, Mai.' }
            ],
            'intermediario': [
                { id: 'it_31', title: 'Imperfetto', description: 'Passado para descrições e hábitos.' },
                { id: 'it_32', title: 'Passato Prossimo vs Imperfetto', description: 'A grande dúvida.' },
                { id: 'it_33', title: 'Pronomes Diretos (Lo, La, Li, Le)', description: 'Substituindo objetos.' },
                { id: 'it_34', title: 'Pronomes Indiretos (Gli, Le)', description: 'A ele, a ela.' },
                { id: 'it_35', title: 'Futuro Semplice', description: 'Farei, Andrò.' },
                { id: 'it_36', title: 'Partícula "Ne"', description: 'Quantidade e parte de algo.' },
                { id: 'it_37', title: 'Partícula "Ci" (Locativo)', description: 'Lá, nisso.' },
                { id: 'it_38', title: 'Imperativo Direto (Tu/Noi/Voi)', description: 'Dê ordens informais.' },
                { id: 'it_39', title: 'Imperativo Formal (Lei)', description: 'Ordens educadas.' },
                { id: 'it_40', title: 'Condizionale Presente', description: 'Eu faria, eu iria.' },
                { id: 'it_41', title: 'Stare + Gerundio', description: 'Estou fazendo (Sto mangiando).' },
                { id: 'it_42', title: 'Comparativos', description: 'Più... di, Meno... di.' },
                { id: 'it_43', title: 'Superlativos', description: 'Issimo, Il più.' },
                { id: 'it_44', title: 'Trapassato Prossimo', description: 'Tinha feito (Avevo fatto).' },
                { id: 'it_45', title: 'Pronomes Relativos (Che/Cui)', description: 'Que, quem.' },
                { id: 'it_46', title: 'Aggettivi Indefiniti', description: 'Qualche, Alcuni, Nessuno.' },
                { id: 'it_47', title: 'Verbos Pronominais (Farcela)', description: 'Expressões idiomáticas.' },
                { id: 'it_48', title: 'Verbos Pronominais (Andarsene)', description: 'Ir embora.' },
                { id: 'it_49', title: 'Concordância Passado (Pronomes)', description: 'Li ho visti.' },
                { id: 'it_50', title: 'Futuro Anteriore', description: 'Terei feito.' },
                { id: 'it_51', title: 'Discurso Indireto (Básico)', description: 'Ele disse que...' },
                { id: 'it_52', title: 'Uso de "Proprio" e "Magari"', description: 'Palavras essenciais.' },
                { id: 'it_53', title: 'Diminutivos e Aumentativos', description: '-ino, -one, -accio.' },
                { id: 'it_54', title: 'Pronomes Combinados (Me lo...)', description: 'Dá-melo (Dammelo).' },
                { id: 'it_55', title: 'Forma Impessoal (Si dice)', description: 'Diz-se, faz-se.' },
                { id: 'it_56', title: 'Verbos como "Mancare/Servire"', description: 'Funcionam como Piacere.' },
                { id: 'it_57', title: 'Conjunções (Perché, Poiché)', description: 'Causa e efeito.' },
                { id: 'it_58', title: 'Preposições com Verbos', description: 'Iniziare a, Finire di.' },
                { id: 'it_59', title: 'Vocabulário: Saúde e Corpo', description: 'Médico e dores.' },
                { id: 'it_60', title: 'Vocabulário: Casa e Móveis', description: 'Descrever o lar.' }
            ],
            'avancado': [
                { id: 'it_61', title: 'Congiuntivo Presente (Che io sia)', description: 'Dúvida e opinião.' },
                { id: 'it_62', title: 'Congiuntivo Passato', description: 'Opinião sobre o passado.' },
                { id: 'it_63', title: 'Congiuntivo Imperfetto', description: 'Se eu fosse...' },
                { id: 'it_64', title: 'Congiuntivo Trapassato', description: 'Se eu tivesse sido...' },
                { id: 'it_65', title: 'Periodo Ipotetico (Realtà)', description: 'Se chove, não vou.' },
                { id: 'it_66', title: 'Periodo Ipotetico (Possibilità)', description: 'Se chovesse, não iria.' },
                { id: 'it_67', title: 'Periodo Ipotetico (Irrealtà)', description: 'Se tivesse chovido...' },
                { id: 'it_68', title: 'Passato Remoto', description: 'Literatura e história.' },
                { id: 'it_69', title: 'Forma Passiva (Essere/Venire)', description: 'Foi feito.' },
                { id: 'it_70', title: 'Si Passivante', description: 'Vende-se casas.' },
                { id: 'it_71', title: 'Condizionale Passato', description: 'Teria feito.' },
                { id: 'it_72', title: 'Gerundio Composto', description: 'Tendo feito (Avendo fatto).' },
                { id: 'it_73', title: 'Infinito Passato', description: 'Dopo aver mangiato.' },
                { id: 'it_74', title: 'Concordância dos Tempos (Subj)', description: 'Regras complexas.' },
                { id: 'it_75', title: 'Discurso Indireto (Avançado)', description: 'Mudanças de tempo.' },
                { id: 'it_76', title: 'Verbi Procomplementari Avançados', description: 'Prendersela, Cavarsela.' },
                { id: 'it_77', title: 'Uso de "Mica"', description: 'Negação enfática.' },
                { id: 'it_78', title: 'Uso de "Anzi", "Insomma"', description: 'Conectivos de fala.' },
                { id: 'it_79', title: 'Trapassato Remoto', description: 'Passado literário arcaico.' },
                { id: 'it_80', title: 'Forma Causativa (Far fare)', description: 'Mandar fazer.' },
                { id: 'it_81', title: 'Substantivação', description: 'Transformar verbos em nomes.' },
                { id: 'it_82', title: 'Preposições: Casos Especiais', description: 'Exceções e regências.' },
                { id: 'it_83', title: 'Modismos e Expressões', description: 'In bocca al lupo.' },
                { id: 'it_84', title: 'Italiano Formal (Burocrático)', description: 'Linguagem escrita.' },
                { id: 'it_85', title: 'Dialetos (Noções Gerais)', description: 'Contexto cultural.' },
                { id: 'it_86', title: 'Falsos Cognatos (Burro, Caldo)', description: 'Armadilhas avançadas.' },
                { id: 'it_87', title: 'Sufixos Alterados (-accio, -ucolo)', description: 'Nuances de significado.' },
                { id: 'it_88', title: 'Omissão do Artigo', description: 'Quando não usar.' },
                { id: 'it_89', title: 'Posição dos Adjetivos', description: 'Antes ou depois?' },
                { id: 'it_90', title: 'Recapitulativo Geral', description: 'Revisão mestre.' }
            ]
        }
    };

    // --- 3. ESTADO GLOBAL DO APLICATIVO ---

    let state = {
        currentLang: 'en', 
        currentLevel: 'iniciante', 
        currentTopic: null, 
        currentScreen: 'login-screen', 
        quizQuestions: [], 
        userAnswers: [], 
        currentQuestionIndex: 0,
        studyContentCache: null, 
        currentUser: null, 
        isGuest: false, 
        historyCache: new Map(), 
        currentQuizErrors: [], 
        reviewCards: [], 
        currentReviewCardIndex: 0, 
        aiGeneratedCards: [],
        currentDeckId: null 
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

    const primaryGoogleBtn = document.getElementById('primary-google-btn');
    const guestLoginBtn = document.getElementById('guest-login-btn');
    const emailLoginForm = document.getElementById('email-login-form');
    const loginMessage = document.getElementById('login-message');
    const goToRegisterLink = document.getElementById('go-to-register-link');
    const goToForgotPasswordLink = document.getElementById('go-to-forgot-password-link');
    const backToLoginLinks = document.querySelectorAll('.back-to-login-link');
    
    const registerForm = document.getElementById('register-form');
    const registerMessage = document.getElementById('register-message');
    
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    const forgotPasswordMessage = document.getElementById('forgot-password-message');

    const updatePasswordForm = document.getElementById('update-password-form');
    const updatePasswordMessage = document.getElementById('update-password-message');

    const selectEnBtn = document.getElementById('select-en');
    const selectItBtn = document.getElementById('select-it');

    const topicListContainer = document.getElementById('topic-list-container');
    const topicSearchInput = document.getElementById('topic-search');
    const customTopicInput = document.getElementById('custom-topic-input');
    const customTopicBtn = document.getElementById('custom-topic-btn');
    const levelTabs = document.querySelectorAll('.level-tab-btn');

    const studyContentWrapper = document.getElementById('study-content-wrapper');
    const studyTopicTitle = document.getElementById('study-topic-title');
    const backToTopicsBtn = document.getElementById('back-to-topics-btn');
    const startQuizConfigBtn = document.getElementById('start-quiz-config-btn');

    const backToStudyBtn = document.getElementById('back-to-study-btn');
    const questionSlider = document.getElementById('question-slider');
    const questionCountSpan = document.getElementById('question-count');
    const startQuizBtn = document.getElementById('start-quiz-btn');

    const quizProgressSpan = document.getElementById('quiz-progress');
    const questionTextEl = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const nextQuestionBtn = document.getElementById('next-question-btn');
    const quitQuizBtn = document.getElementById('quit-quiz-btn');

    const resultsSummaryEl = document.querySelector('.results-summary'); 
    const scoreTextEl = document.getElementById('score-text');
    const answersReviewContainer = document.getElementById('answers-review-container');
    const backToHomeBtn = document.getElementById('back-to-home-btn');
    const reviewAnswersBtn = document.getElementById('review-answers-btn');
    const backToHistoryBtn = document.getElementById('back-to-history-btn'); 
    const saveErrorsBtn = document.getElementById('save-errors-btn'); 

    const navHomeBtn = document.getElementById('nav-home-btn');
    const navHistoryBtn = document.getElementById('nav-history-btn');
    const navFlashcardsBtn = document.getElementById('nav-flashcards-btn'); 
    
    const historyListContainer = document.getElementById('history-list-container');
    const generateReviewPdfBtn = document.getElementById('generate-review-pdf-btn'); 
    const pdfHelperText = document.getElementById('pdf-helper-text'); 

    // (NOVOS) Seletores do Hub de Flashcards
    // CORREÇÃO AQUI: Usando o ID correto #flashcards-main-tabs para evitar conflito
    // E DECLARADO UMA ÚNICA VEZ
    const flashcardTabs = document.querySelectorAll('#flashcards-main-tabs .level-tab-btn');
    const flashcardViews = document.querySelectorAll('#flashcards-screen .flashcard-view');
    const deckListContainer = document.getElementById('deck-list-container');
    const createDeckForm = document.getElementById('create-deck-form');
    const createDeckMessage = document.getElementById('create-deck-message');
    const manualCardsContainer = document.getElementById('manual-cards-container');
    const addManualCardFieldBtn = document.getElementById('add-manual-card-field');
    const aiDeckTopicInput = document.getElementById('ai-deck-topic');
    const generateAiCardsBtn = document.getElementById('generate-ai-cards-btn');
    const aiCardsSelectionList = document.getElementById('ai-cards-selection-list');

    // (NOVOS) Seletores da Tela de Sessão de Revisão
    const reviewBackBtn = document.getElementById('review-back-btn');
    const reviewCardContainer = document.getElementById('review-card-container');
    const reviewCardFront = document.getElementById('review-card-front');
    const reviewCardBack = document.getElementById('review-card-back');
    const reviewEmptyState = document.getElementById('review-empty-state');
    const reviewShowAnswerBtn = document.getElementById('review-show-answer-btn');
    const reviewRatingContainer = document.getElementById('review-rating-container');
    const reviewRatingButtons = reviewRatingContainer.querySelectorAll('.btn');
    const reviewAgainBtn = document.getElementById('review-again-btn'); 


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
                
                if(state.currentScreen === 'login-screen' || state.currentScreen === 'register-screen') {
                   navigate('home-screen'); 
                    loadTopics(); // Carrega tópicos após login para ver progresso
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
    if(primaryGoogleBtn) {
        primaryGoogleBtn.addEventListener('click', async () => {
            toggleLoading(true, 'A redirecionar para o Google...');
            const { error } = await supabaseClient.auth.signInWithOAuth({ provider: 'google' });
            if (error) {
                toggleLoading(false);
                showAuthMessage(loginMessage, `Erro: ${error.message}`);
            }
        });
    }

    if(guestLoginBtn) {
        guestLoginBtn.addEventListener('click', () => {
            state.isGuest = true;
            state.currentUser = null; 
            updateUIforGuest(true);
            navigate('home-screen');
            loadTopics();
        });
    }

    if(emailLoginForm) {
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
    }

    if(registerForm) {
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
    }

    if(forgotPasswordForm) {
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
    }

    if(updatePasswordForm) {
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
    }

    async function handleLogout() {
        toggleLoading(true, 'A sair...');
        const { error } = await supabaseClient.auth.signOut();
        toggleLoading(false);
        if (error) {
            alert(`Erro ao sair: ${error.message}`);
        }
    }

    if(goToRegisterLink) goToRegisterLink.addEventListener('click', () => navigate('register-screen'));
    if(goToForgotPasswordLink) goToForgotPasswordLink.addEventListener('click', () => navigate('forgot-password-screen'));
    backToLoginLinks.forEach(link => {
        link.addEventListener('click', () => navigate('login-screen'));
    });


    // --- 7. FUNÇÃO 'loadTopics' (Com Lógica de Progresso via Banco de Dados) ---
    
    async function fetchCompletedTopicsFromDB() {
        if (!state.currentUser) return new Set();

        // Busca histórico de quiz onde a porcentagem é >= 70
        const { data, error } = await supabaseClient
            .from('quiz_history')
            .select('topic_title, quiz_data')
            .eq('user_id', state.currentUser.id);

        if (error) {
            console.error("Erro ao buscar progresso:", error);
            return new Set();
        }

        const completedSet = new Set();
        data.forEach(row => {
            // Verifica se quiz_data existe e tem percentage
            if (row.quiz_data && row.quiz_data.percentage >= 70) {
                completedSet.add(row.topic_title);
            }
        });
        
        return completedSet;
    }

    async function loadTopics() {
        if (!topicListContainer) return; 
        
        const langTopics = allTopics[state.currentLang] || {}; 
        const levelTopics = langTopics[state.currentLevel] || []; 
        
        const searchTerm = topicSearchInput.value.toLowerCase();
        const filteredTopics = levelTopics.filter(topic => 
            topic.title.toLowerCase().includes(searchTerm) || 
            topic.description.toLowerCase().includes(searchTerm)
        );

        topicListContainer.innerHTML = '<p style="text-align:center; width:100%;">Carregando progresso...</p>';
        
        // Busca progresso real do banco
        const completedTopics = await fetchCompletedTopicsFromDB();

        topicListContainer.innerHTML = ''; 
        if (filteredTopics.length === 0) {
            topicListContainer.innerHTML = '<p class="empty-list-text">Nenhum tópico sugerido encontrado.</p>';
            return;
        }

        filteredTopics.forEach(topic => {
            const item = document.createElement('div');
            item.className = 'topic-item';
            
            // Verifica se o título está no Set de completados
            if (completedTopics.has(topic.title)) {
                item.classList.add('completed');
            }

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

    if(mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('open');
            mobileNavOverlay.classList.toggle('open');
            document.body.classList.toggle('mobile-menu-open');
        });
    }

    function closeMobileMenu() {
        if(mobileMenuBtn) mobileMenuBtn.classList.remove('open');
        if(mobileNavOverlay) mobileNavOverlay.classList.remove('open');
        document.body.classList.remove('mobile-menu-open');
    }

    if(selectEnBtn) selectEnBtn.addEventListener('click', () => {
        state.currentLang = 'en';
        loadTopics(); 
        navigate('topics-screen');
    });
    if(selectItBtn) selectItBtn.addEventListener('click', () => {
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

    if(customTopicBtn) {
        customTopicBtn.addEventListener('click', () => {
            const topicTitle = customTopicInput.value;
            if (topicTitle.trim()) {
                state.currentTopic = { id: 'custom', title: topicTitle };
                fetchAndDisplayStudyContent(topicTitle);
            }
        });
    }

    if(topicSearchInput) topicSearchInput.addEventListener('input', loadTopics); 

    if(backToTopicsBtn) backToTopicsBtn.addEventListener('click', () => {
        loadTopics(); 
        navigate('topics-screen');
    });

    if(startQuizConfigBtn) startQuizConfigBtn.addEventListener('click', () => navigate('quiz-config-screen'));

    if(backToStudyBtn) backToStudyBtn.addEventListener('click', () => navigate('study-screen'));

    if(questionSlider) {
        questionSlider.addEventListener('input', (e) => {
            questionCountSpan.textContent = `${e.target.value} perguntas`;
        });
    }

    if(startQuizBtn) {
        startQuizBtn.addEventListener('click', () => {
            const numQuestions = parseInt(questionSlider.value, 10);
            fetchAndDisplayQuiz(numQuestions);
        });
    }

    if(quitQuizBtn) {
        quitQuizBtn.addEventListener('click', () => {
            if (confirm('Tem a certeza que quer desistir do quiz? O seu progresso não será salvo.')) {
                navigate('topics-screen');
            }
        });
    }

    if(backToHomeBtn) backToHomeBtn.addEventListener('click', () => {
        loadTopics();
        navigate('topics-screen');
    });
    
    if(backToHistoryBtn) backToHistoryBtn.addEventListener('click', () => navigate('history-screen'));

    if(reviewAnswersBtn) {
        reviewAnswersBtn.addEventListener('click', () => {
            answersReviewContainer.classList.toggle('visible');
            reviewAnswersBtn.textContent = answersReviewContainer.classList.contains('visible') 
                ? 'Esconder Revisão' 
                : 'Revisar Respostas';
        });
    }

    if(navHomeBtn) navHomeBtn.addEventListener('click', () => navigate('home-screen'));
    if(navHistoryBtn) {
        navHistoryBtn.addEventListener('click', () => {
            fetchAndDisplayHistory();
            navigate('history-screen');
        });
    }
    if(navFlashcardsBtn) {
        navFlashcardsBtn.addEventListener('click', () => {
            fetchAndDisplayDecks(); 
            navigate('flashcards-screen');
        });
    }
    
    // Mobile Nav (com verificação)
    if(mobileNavLinks) {
        mobileNavLinks.innerHTML = ''; 
        if(navHomeBtn) mobileNavLinks.appendChild(navHomeBtn.cloneNode(true)).addEventListener('click', () => navigate('home-screen'));
        if(navFlashcardsBtn) mobileNavLinks.appendChild(navFlashcardsBtn.cloneNode(true)).addEventListener('click', () => {
            fetchAndDisplayDecks();
            navigate('flashcards-screen');
        });
        if(navHistoryBtn) mobileNavLinks.appendChild(navHistoryBtn.cloneNode(true)).addEventListener('click', () => {
            fetchAndDisplayHistory();
            navigate('history-screen');
        });
    }

    // if(saveErrorsBtn) saveErrorsBtn REMOVIDO

    if(generateReviewPdfBtn) {
        generateReviewPdfBtn.addEventListener('click', handleGenerateReviewPDF);
    }
    
    // Listeners da tela de Revisão
    if(reviewBackBtn) reviewBackBtn.addEventListener('click', () => navigate('flashcards-screen')); 
    if(reviewShowAnswerBtn) {
        reviewShowAnswerBtn.addEventListener('click', () => {
            reviewCardBack.classList.remove('hidden');
            reviewShowAnswerBtn.classList.add('hidden');
            reviewRatingContainer.classList.remove('hidden');
        });
    }

    // Adiciona listeners aos botões de avaliação
    reviewRatingButtons.forEach(button => {
        button.addEventListener('click', () => {
            const rating = button.dataset.rating;
            handleReviewRating(rating);
        });
    });


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
        
        let targetVoice = voices.find(voice => voice.lang === langCode && voice.localService);
        if (!targetVoice) {
            targetVoice = voices.find(voice => voice.lang === langCode);
        }
        
        if (targetVoice) {
            utterance.voice = targetVoice;
        } else {
            console.warn(`Nenhuma voz encontrada para ${langCode}. Usando padrão.`);
        }

        if (voices.length === 0) {
            window.speechSynthesis.onvoiceschanged = () => {
                voices = window.speechSynthesis.getVoices();
                targetVoice = voices.find(voice => voice.lang === langCode && voice.localService) || voices.find(voice => voice.lang === langCode);
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
        
        // CORREÇÃO: REMOVER DUPLICATAS
        const optionsRaw = [...q.opcoes_incorretas, q.opcao_correta];
        const uniqueOptions = [...new Set(optionsRaw)];
        uniqueOptions.sort(() => Math.random() - 0.5);

        uniqueOptions.forEach(option => {
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

    if(nextQuestionBtn) {
        nextQuestionBtn.addEventListener('click', () => {
            if (state.currentQuestionIndex < state.quizQuestions.length - 1) {
                state.currentQuestionIndex++;
                displayCurrentQuestion();
            } else {
                showQuizResults();
            }
        });
    }

    async function showQuizResults() {
        let score = 0;
        const quizDataForReview = [];
        state.currentQuizErrors = []; 

        state.quizQuestions.forEach((q, index) => {
            const userAnswer = state.userAnswers[index] || "Não respondida";
            const isCorrect = q.opcao_correta === userAnswer;
            
            if (isCorrect) {
                score++;
            } else {
                state.currentQuizErrors.push({
                    front: q.pergunta,
                    back: `${q.opcao_correta}\n\nExplicação: ${q.explicacao}`
                });
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

        if (resultsSummaryEl) resultsSummaryEl.classList.remove('hidden');
        if (backToHistoryBtn) backToHistoryBtn.classList.add('hidden');
        if (reviewAnswersBtn) reviewAnswersBtn.classList.remove('hidden');
        if (backToHomeBtn) backToHomeBtn.classList.remove('hidden');

        // Botão Salvar Erros REMOVIDO propositalmente

        populateAnswersReview(quizDataForReview);
        if (answersReviewContainer) answersReviewContainer.classList.remove('visible'); 
        if (reviewAnswersBtn) reviewAnswersBtn.textContent = 'Revisar Respostas';
        
        navigate('results-screen');

        if (state.currentUser && !state.isGuest) {
            
            const quizDataToSave = {
                topic_title: state.currentTopic.title,
                score: scoreString,
                percentage: percentage,
                level: state.currentLevel,         
                questions: quizDataForReview,
                studyContent: state.studyContentCache 
            };

            const { error } = await supabaseClient
                .from('quiz_history')
                .insert({ 
                    user_id: state.currentUser.id,
                    topic_title: state.currentTopic.title,
                    score: scoreString, 
                    quiz_data: quizDataToSave 
                });
            
            if (error) {
                console.error('Erro ao salvar o histórico no Supabase:', error);
            } else {
                // Se passou no teste (>=70%), recarrega os tópicos para atualizar a cor verde
                if (percentage >= 70) {
                     // Não chamamos loadTopics direto para não trocar de tela, 
                     // mas a próxima vez que o usuário for para "Tópicos", estará verde.
                }
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
            alert('Erro: Conteúdo de quiz não encontrado.');
            return;
        }

        scoreTextEl.textContent = `Revisando: ${quizData.topic_title} (${quizData.score})`;
        if (resultsSummaryEl) resultsSummaryEl.classList.add('hidden'); 
        if (backToHistoryBtn) backToHistoryBtn.classList.remove('hidden'); 
        
        // if (saveErrorsBtn) saveErrorsBtn.classList.add('hidden');
        
        populateAnswersReview(quizData.questions);
        if (answersReviewContainer) answersReviewContainer.classList.add('visible'); 
        
        navigate('results-screen');
    }

    async function fetchAndDisplayHistory() {
        if(!historyListContainer) return;
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
            const guestLoginBtn = document.getElementById('history-guest-login-btn');
            if (guestLoginBtn) {
                guestLoginBtn.addEventListener('click', handleGuestToLogin);
            }
            if (generateReviewPdfBtn) generateReviewPdfBtn.classList.add('hidden'); 
            if (pdfHelperText) pdfHelperText.classList.add('hidden');
            return;
        }

        if (generateReviewPdfBtn) generateReviewPdfBtn.classList.remove('hidden'); 
        if (pdfHelperText) pdfHelperText.classList.remove('hidden');

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

    // --- 10. LÓGICA DE FLASHCARDS (CRUD COMPLETO) ---

    // 1. Navegação Principal das Abas de Flashcards
    if (flashcardTabs) {
        flashcardTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault(); 
                
                // Remove active apenas das abas principais
                flashcardTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const viewId = tab.dataset.view;
                
                // Alterna as views principais
                flashcardViews.forEach(view => {
                    // Se viewId for undefined (clique errado), não esconde tudo
                    if (viewId) {
                        view.classList.toggle('active', view.id === viewId);
                    }
                });

                if (viewId === 'deck-list-view') {
                    fetchAndDisplayDecks();
                } else if (viewId === 'deck-stats-view') {
                    loadReviewStats();
                }
            });
        });
    }

    // 2. Correção das Abas Internas (Manual vs IA) - O Bug de "Sumir"
    const innerTabs = document.querySelectorAll('#create-deck-form .level-tabs.small-tabs .level-tab-btn');
    let currentCreateMode = 'create-manual-content'; 
    
    if (innerTabs) {
        innerTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault(); // IMPEDE que o formulário seja enviado
                e.stopPropagation(); 

                // 1. Troca a classe visual
                innerTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // 2. Identifica qual conteúdo mostrar
                const targetId = tab.dataset.target;
                
                // 3. Atualiza a variável de controle
                currentCreateMode = targetId;

                // 4. Mostra o conteúdo certo
                const contents = document.querySelectorAll('#create-deck-form .create-content');
                contents.forEach(content => {
                    if (content.id === targetId) {
                        content.classList.add('active');
                    } else {
                        content.classList.remove('active');
                    }
                });
            });
        });
    }

    function addManualCardField() {
        if(!manualCardsContainer) return;
        const cardField = document.createElement('div');
        cardField.className = 'input-group manual-card-entry'; 
        cardField.innerHTML = `
            <input type="text" class="manual-front" placeholder="Frente (ex: Hello)">
            <input type="text" class="manual-back" placeholder="Verso (ex: Olá)">
        `;
        manualCardsContainer.appendChild(cardField);
    }
    // Inicializa com um campo
    if(manualCardsContainer && manualCardsContainer.children.length === 0) addManualCardField();

    if(addManualCardFieldBtn) addManualCardFieldBtn.addEventListener('click', addManualCardField);

    if(generateAiCardsBtn) {
        generateAiCardsBtn.addEventListener('click', async () => {
            const topic = aiDeckTopicInput.value;
            if (!topic.trim()) {
                alert("Por favor, insira um tópico para a IA gerar.");
                return;
            }

            toggleLoading(true, "A IA está gerando seus cartões...");
            aiCardsSelectionList.innerHTML = '';
            state.aiGeneratedCards = []; 

            try {
                const response = await fetch('/api/generate-flashcards', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        topic: topic,
                        lang: state.currentLang
                    })
                });

                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.error || 'Falha ao buscar resposta da IA.');
                }

                const data = await response.json(); 
                state.aiGeneratedCards = data.cards || [];

                if (state.aiGeneratedCards.length === 0) {
                    aiCardsSelectionList.innerHTML = '<p class="empty-list-text" style="padding: 1rem;">A IA não retornou cartões para este tópico.</p>';
                }

                state.aiGeneratedCards.forEach((card, index) => {
                    const cardEl = document.createElement('div');
                    cardEl.className = 'ai-card-item';
                    cardEl.innerHTML = `
                        <input type="checkbox" id="ai-card-${index}" data-index="${index}" checked>
                        <label for="ai-card-${index}">
                            <strong>${card.front}</strong><br>
                            ${card.back}
                        </label>
                    `;
                    aiCardsSelectionList.appendChild(cardEl);
                });

            } catch (error) {
                console.error("Erro ao gerar cartões com IA:", error);
                aiCardsSelectionList.innerHTML = `<p class="error-message">Erro ao gerar cartões: ${error.message}</p>`;
            } finally {
                toggleLoading(false);
            }
        });
    }

    if(createDeckForm) {
        createDeckForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearAuthMessages();
            if (!state.currentUser) {
                showAuthMessage(createDeckMessage, "Você precisa estar logado para criar um baralho.");
                return;
            }

            const deckNameInput = document.getElementById('deck-name');
            const deckName = deckNameInput.value;
            if (!deckName.trim()) {
                showAuthMessage(createDeckMessage, "Por favor, insira um nome para o baralho.");
                return;
            }

            toggleLoading(true, "Salvando baralho e cartões...");

            try {
                // 1. Cria o Baralho
                const { data: newDeck, error: deckError } = await supabaseClient
                    .from('decks')
                    .insert({
                        user_id: state.currentUser.id,
                        name: deckName
                    })
                    .select('id') 
                    .single();

                if (deckError) throw deckError;
                
                const newDeckId = newDeck.id;
                let cardsToSave = [];
                
                // 2. Coleta Cartões baseados na aba ativa
                if (currentCreateMode === 'create-manual-content') {
                    const manualFronts = document.querySelectorAll('.manual-front');
                    const manualBacks = document.querySelectorAll('.manual-back');
                    
                    manualFronts.forEach((frontEl, index) => {
                        const front = frontEl.value.trim();
                        const back = manualBacks[index].value.trim();
                        if (front && back) {
                            cardsToSave.push({ front, back, next_review_at: new Date().toISOString() });
                        }
                    });

                } else { 
                    const selectedCheckboxes = document.querySelectorAll('#ai-cards-selection-list input[type="checkbox"]:checked');
                    selectedCheckboxes.forEach(checkbox => {
                        const index = parseInt(checkbox.dataset.index, 10);
                        cardsToSave.push({ ...state.aiGeneratedCards[index], next_review_at: new Date().toISOString() });
                    });
                }

                // 3. Salva Cartões no Supabase
                if (cardsToSave.length > 0) {
                    const formattedCards = cardsToSave.map(card => ({
                        ...card,
                        user_id: state.currentUser.id,
                        deck_id: newDeckId
                    }));

                    const { error: cardError } = await supabaseClient
                        .from('flashcards')
                        .insert(formattedCards);
                    
                    if (cardError) throw cardError;
                }
                
                toggleLoading(false);
                showAuthMessage(createDeckMessage, `Baralho "${deckName}" e ${cardsToSave.length} cartões salvos!`, false);
                
                // Limpa form
                deckNameInput.value = '';
                aiDeckTopicInput.value = '';
                manualCardsContainer.innerHTML = '';
                addManualCardField();
                aiCardsSelectionList.innerHTML = '';
                state.aiGeneratedCards = [];

                // Volta para a lista
                fetchAndDisplayDecks();
                document.getElementById('tab-decks-list').click();

            } catch (error) {
                console.error("Erro ao criar baralho:", error);
                toggleLoading(false);
                showAuthMessage(createDeckMessage, `Erro: ${error.message}`);
            }
        });
    }

    // 3. Listar Baralhos (READ) com Botões de Ação
    async function fetchAndDisplayDecks() {
        if (state.isGuest || !state.currentUser) {
            if(deckListContainer) deckListContainer.innerHTML = '<p class="empty-list-text">Faça login para ver seus baralhos.</p>';
            return; 
        }
        
        toggleLoading(true, "Buscando seus baralhos...");
        
        try {
            const { data: decks, error } = await supabaseClient
                .from('decks')
                .select('id, name, flashcards(count)') // Pega contagem de cartas
                .eq('user_id', state.currentUser.id)
                .order('created_at', { ascending: false });
            
            if (error) throw error;

            if(!deckListContainer) return;
            deckListContainer.innerHTML = ''; 
            if (decks.length === 0) {
                deckListContainer.innerHTML = '<p class="empty-list-text">Você ainda não tem nenhum baralho.</p>';
            } else {
                decks.forEach(deck => {
                    const count = deck.flashcards ? deck.flashcards[0].count : 0;
                    const deckEl = document.createElement('div');
                    deckEl.className = 'deck-item';
                    deckEl.innerHTML = `
                        <div class="deck-info">
                            <h3>${deck.name}</h3>
                            <p>${count} cartões</p>
                        </div>
                        <div class="deck-actions">
                            <button class="btn btn-primary btn-small btn-study" data-id="${deck.id}">Estudar</button>
                            <button class="btn btn-outline btn-small btn-manage" data-id="${deck.id}">Gerenciar</button>
                            <button class="btn btn-danger-outline btn-small btn-delete-deck" data-id="${deck.id}">🗑️</button>
                        </div>
                    `;
                    
                    // Event Listeners
                    deckEl.querySelector('.btn-study').addEventListener('click', () => fetchAndDisplayReviewCards(deck.id));
                    deckEl.querySelector('.btn-manage').addEventListener('click', () => openManageDeckScreen(deck));
                    deckEl.querySelector('.btn-delete-deck').addEventListener('click', () => handleDeleteDeck(deck.id, deck.name));

                    deckListContainer.appendChild(deckEl);
                });
            }

        } catch (error) {
            console.error("Erro ao buscar baralhos:", error);
            deckListContainer.innerHTML = '<p class="error-message">Erro ao carregar baralhos.</p>';
        } finally {
            toggleLoading(false);
        }
    }

    // 4. Excluir Baralho (DELETE)
    async function handleDeleteDeck(deckId, deckName) {
        if (!confirm(`Tem certeza que deseja excluir o baralho "${deckName}" e todos os seus cartões?`)) return;

        toggleLoading(true, "Excluindo baralho...");
        try {
            // Supabase com Cascade Delete configurado deleta os cartões automaticamente.
            // Se não estiver configurado, deletamos os cartões primeiro manualmente:
            await supabaseClient.from('flashcards').delete().eq('deck_id', deckId);

            const { error } = await supabaseClient.from('decks').delete().eq('id', deckId);
            if (error) throw error;

            fetchAndDisplayDecks(); // Recarrega a lista
        } catch (error) {
            alert("Erro ao excluir: " + error.message);
        } finally {
            toggleLoading(false);
        }
    }

    // 5. Abrir Tela de Gerenciamento (Manage Screen)
    let currentManageDeckId = null; // Variável para saber qual deck estamos editando

    async function openManageDeckScreen(deck) {
        currentManageDeckId = deck.id;
        const titleEl = document.getElementById('manage-deck-title');
        if(titleEl) titleEl.textContent = `Gerenciando: ${deck.name}`;
        navigate('deck-manage-screen');
        fetchAndRenderManageCards();
    }

    const manageBackBtn = document.getElementById('manage-back-btn');
    if(manageBackBtn) {
        manageBackBtn.addEventListener('click', () => {
            navigate('flashcards-screen');
            fetchAndDisplayDecks(); // Atualiza contagem se tiver mudado
        });
    }

    // 6. Listar Cartões para Edição
    async function fetchAndRenderManageCards() {
        const listContainer = document.getElementById('manage-cards-list');
        if(!listContainer) return;
        listContainer.innerHTML = '<p style="text-align:center; color:#666;">Carregando cartões...</p>';

        try {
            const { data: cards, error } = await supabaseClient
                .from('flashcards')
                .select('*')
                .eq('deck_id', currentManageDeckId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            listContainer.innerHTML = '';

            if (cards.length === 0) {
                listContainer.innerHTML = '<p style="text-align:center; color:#666;">Nenhum cartão neste baralho.</p>';
                return;
            }

            cards.forEach(card => {
                const item = document.createElement('div');
                item.className = 'manage-card-item';
                // Input fields para edição inline
                item.innerHTML = `
                    <div class="manage-card-inputs">
                        <input type="text" value="${card.front}" id="front-${card.id}">
                        <input type="text" value="${card.back}" id="back-${card.id}">
                    </div>
                    <div class="manage-actions">
                        <button class="btn-icon save" title="Salvar Alterações" onclick="handleUpdateCard('${card.id}')">💾</button>
                        <button class="btn-icon delete" title="Excluir Cartão" onclick="handleDeleteCard('${card.id}')">🗑️</button>
                    </div>
                `;
                listContainer.appendChild(item);
            });

        } catch (error) {
            console.error(error);
            listContainer.innerHTML = '<p class="error-message">Erro ao carregar cartões.</p>';
        }
    }

    // Funções globais para os botões onclick inline (precisam estar no escopo window ou anexadas via addEventListener)
    window.handleUpdateCard = async (cardId) => {
        const frontVal = document.getElementById(`front-${cardId}`).value;
        const backVal = document.getElementById(`back-${cardId}`).value;

        try {
            const { error } = await supabaseClient
                .from('flashcards')
                .update({ front: frontVal, back: backVal })
                .eq('id', cardId);

            if (error) throw error;
            
            // Feedback visual simples
            const btn = document.querySelector(`button[onclick="handleUpdateCard('${cardId}')"]`);
            const originalText = btn.textContent;
            btn.textContent = "✅";
            setTimeout(() => btn.textContent = originalText, 1500);

        } catch (error) {
            alert("Erro ao atualizar: " + error.message);
        }
    };

    window.handleDeleteCard = async (cardId) => {
        if(!confirm("Excluir este cartão?")) return;
        try {
            const { error } = await supabaseClient
                .from('flashcards')
                .delete()
                .eq('id', cardId);

            if (error) throw error;
            fetchAndRenderManageCards(); // Recarrega lista
        } catch (error) {
            alert("Erro ao excluir: " + error.message);
        }
    };

    // 7. Adicionar Novo Cartão no Baralho Existente
    const btnAddSingleCard = document.getElementById('btn-add-single-card');
    if(btnAddSingleCard) {
        btnAddSingleCard.addEventListener('click', async () => {
            const frontInput = document.getElementById('new-card-front');
            const backInput = document.getElementById('new-card-back');
            const front = frontInput.value.trim();
            const back = backInput.value.trim();

            if (!front || !back) {
                alert("Preencha frente e verso.");
                return;
            }

            try {
                toggleLoading(true, "Adicionando...");
                const { error } = await supabaseClient.from('flashcards').insert({
                    user_id: state.currentUser.id,
                    deck_id: currentManageDeckId,
                    front: front,
                    back: back,
                    next_review_at: new Date().toISOString() // FIX: Ensure immediate availability
                });

                if (error) throw error;

                frontInput.value = '';
                backInput.value = '';
                fetchAndRenderManageCards(); // Atualiza a lista na hora

            } catch (error) {
                alert("Erro ao adicionar: " + error.message);
            } finally {
                toggleLoading(false);
            }
        });
    }


    // --- GRÁFICO DE ESTATÍSTICAS ---
    let reviewChartInstance = null;

    async function loadReviewStats() {
        const ctx = document.getElementById('review-chart');
        if (!ctx || !state.currentUser) return;

        try {
            // 1. Busca logs dos últimos 7 dias
            const today = new Date();
            const sevenDaysAgo = new Date(today);
            sevenDaysAgo.setDate(today.getDate() - 6);
            sevenDaysAgo.setHours(0,0,0,0);

            const { data: logs, error } = await supabaseClient
                .from('review_logs')
                .select('created_at')
                .eq('user_id', state.currentUser.id)
                .gte('created_at', sevenDaysAgo.toISOString());
            
            if (error) throw error;

            // 2. Agrupa por dia da semana (0-6)
            const counts = [0, 0, 0, 0, 0, 0, 0]; 
            const labels = [];
            
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(today.getDate() - i);
                const dayName = i === 0 ? 'Hoje' : d.toLocaleDateString('pt-BR', { weekday: 'short' });
                labels.push(dayName);
            }

            logs.forEach(log => {
                const logDate = new Date(log.created_at);
                const todayMidnight = new Date(today);
                todayMidnight.setHours(0,0,0,0);
                const logMidnight = new Date(logDate);
                logMidnight.setHours(0,0,0,0);

                const diffTime = todayMidnight - logMidnight;
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 

                if (diffDays >= 0 && diffDays < 7) {
                    counts[6 - diffDays]++;
                }
            });

            // 3. Renderiza o Gráfico
            if (reviewChartInstance) {
                reviewChartInstance.destroy();
            }

            reviewChartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: '',
                        data: counts,
                        backgroundColor: '#a855f7',
                        borderRadius: 4,
                        barThickness: 30, 
                        hoverBackgroundColor: '#9333ea'
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: function(context) { return context.raw + ' revisões'; }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { stepSize: 1, color: '#6b7280' },
                            grid: { color: '#e5e7eb' },
                            border: { display: false }
                        },
                        x: {
                            ticks: { color: '#6b7280' },
                            grid: { display: false },
                            border: { display: false }
                        }
                    },
                    layout: { padding: 10 }
                }
            });

        } catch (error) {
            console.error("Erro ao carregar estatísticas:", error);
        }
    }

    // --- FUNÇÃO DE SALVAR ERROS DE QUIZ (Revisão) ---
    async function getOrCreateDefaultDeck() {
        if (!state.currentUser) return null;
        const deckName = `Erros de Quiz (${state.currentLang.toUpperCase()})`;

        let { data: deck, error: selectError } = await supabaseClient
            .from('decks')
            .select('id')
            .eq('user_id', state.currentUser.id)
            .eq('name', deckName)
            .maybeSingle(); 

        if (selectError && selectError.code !== 'PGRST116') throw new Error("Falha ao buscar baralho.");
        if (deck) return deck.id;

        const { data: newDeck, error: insertError } = await supabaseClient
            .from('decks')
            .insert({ user_id: state.currentUser.id, name: deckName })
            .select('id')
            .single();
        
        if (insertError) throw new Error("Falha ao criar baralho.");
        return newDeck.id;
    }

    async function handleSaveErrorsToFlashcards() {
        if (state.isGuest || !state.currentUser || state.currentQuizErrors.length === 0) {
            alert("Não é possível salvar. Nenhum erro encontrado ou você está como convidado.");
            return;
        }
        toggleLoading(true, "Salvando erros como flashcards...");
        saveErrorsBtn.disabled = true;
        try {
            const deckId = await getOrCreateDefaultDeck();
            if (!deckId) throw new Error("ID do baralho não encontrado.");

            const flashcardsToSave = state.currentQuizErrors.map(error => ({
                user_id: state.currentUser.id,
                deck_id: deckId,
                front: error.front, 
                back: error.back,   
            }));

            const { error } = await supabaseClient.from('flashcards').insert(flashcardsToSave);
            if (error) throw error;

            toggleLoading(false);
            alert(`${flashcardsToSave.length} erros salvos com sucesso!`);
            saveErrorsBtn.classList.add('hidden'); 
        } catch (error) {
            console.error("Erro ao salvar flashcards:", error);
            toggleLoading(false);
            alert(`Falha ao salvar flashcards: ${error.message}`);
            saveErrorsBtn.disabled = false;
        }
    }

    async function fetchAndDisplayReviewCards(deckId) {
        state.currentDeckId = deckId; // Store deck ID for "Review Again" feature

        if (state.isGuest || !state.currentUser) {
            alert("Faça login para revisar seus flashcards.");
            navigate('login-screen');
            return;
        }
        
        toggleLoading(true, "Buscando seus cartões de revisão...");
        navigate('review-session-screen'); 
        
        try {
            const now = new Date().toISOString();
            const { data, error } = await supabaseClient
                .from('flashcards')
                .select('*')
                .eq('user_id', state.currentUser.id)
                .eq('deck_id', deckId) 
                .lte('next_review_at', now) 
                .order('next_review_at', { ascending: true }); 

            if (error) throw error;

            state.reviewCards = data;
            state.currentReviewCardIndex = 0;
            displayCurrentReviewCard();

        } catch (error) {
            console.error("Erro ao buscar cartões:", error);
            alert(`Falha ao buscar cartões: ${error.message}`);
            navigate('flashcards-screen'); 
        } finally {
            toggleLoading(false);
        }
    }

    function displayCurrentReviewCard() {
        if (!reviewCardContainer) return;

        if (state.currentReviewCardIndex >= state.reviewCards.length) {
            reviewCardContainer.classList.add('hidden');
            reviewShowAnswerBtn.classList.add('hidden');
            reviewRatingContainer.classList.add('hidden');
            reviewEmptyState.classList.remove('hidden');
            return;
        }
        
        reviewCardContainer.classList.remove('hidden');
        reviewShowAnswerBtn.classList.remove('hidden');
        reviewEmptyState.classList.add('hidden');
        reviewRatingContainer.classList.add('hidden');
        reviewCardBack.classList.add('hidden');

        const card = state.reviewCards[state.currentReviewCardIndex];
        
        // FIX: Add Audio Button
        reviewCardFront.innerHTML = `
            <h3>${card.front} 
                <button onclick="event.stopPropagation(); window.speakTextGlobal('${card.front.replace(/'/g, "\\'")}')" style="background:none; border:none; cursor:pointer; font-size:1.2rem;">🔊</button>
            </h3>`;
        
        reviewCardBack.innerHTML = `<p>${card.back}</p>`;
    }

    // Expose speakText globally for the inline onclick
    window.speakTextGlobal = function(text) {
        // Simple detection: If text contains Italian words (generic check), use 'it-IT', else 'en-US'
        // Or rely on state.currentLang if available. 
        // Since user is learning English, default to en-US unless state says otherwise.
        const lang = state.currentLang === 'it' ? 'it-IT' : 'en-US';
        speakText(text, lang);
    };

    async function handleResetReviews(deckId) {
        if (!deckId) return;
        
        if(!confirm("Tem certeza? Isso fará com que todos os cartões deste baralho fiquem disponíveis para revisão agora.")) return;

        toggleLoading(true, "Reiniciando agendamentos...");
        try {
            // Update all cards in this deck to have next_review_at = NOW()
            const { error } = await supabaseClient
                .from('flashcards')
                .update({ next_review_at: new Date().toISOString() })
                .eq('deck_id', deckId);

            if (error) throw error;

            // Reload the review session
            fetchAndDisplayReviewCards(deckId);

        } catch (error) {
            console.error("Erro ao resetar reviews:", error);
            alert("Erro ao resetar: " + error.message);
        } finally {
            toggleLoading(false);
        }
    }

    async function handleReviewRating(rating) {
        const card = state.reviewCards[state.currentReviewCardIndex];
        if (!card) return;

        // Log de revisão
        await supabaseClient.from('review_logs').insert({
            user_id: state.currentUser.id,
            flashcard_id: card.id,
            rating: rating
        });

        let { interval_days, ease_factor } = card;

        if (rating === 'again') {
            interval_days = 0; 
            ease_factor = Math.max(1.3, ease_factor - 0.2);
        } else if (rating === 'ok') {
            interval_days = Math.max(1, interval_days * ease_factor);
        } else if (rating === 'easy') {
            interval_days = Math.max(1, interval_days * ease_factor * 1.3);
            ease_factor = ease_factor + 0.15;
        }
        
        interval_days = Math.round(interval_days);
        const now = new Date();
        const nextReviewDate = new Date(now.getTime() + (rating === 'again' ? 10 * 60 * 1000 : interval_days * 24 * 60 * 60 * 1000));

        try {
            toggleLoading(true, "Atualizando cartão...");
            const { error } = await supabaseClient
                .from('flashcards')
                .update({
                    next_review_at: nextReviewDate.toISOString(),
                    interval_days: interval_days,
                    ease_factor: ease_factor
                })
                .eq('id', card.id);

            if (error) throw error;
            
        } catch (error) {
            console.error("Erro ao atualizar cartão:", error);
            alert("Não foi possível salvar seu progresso. Verifique sua conexão.");
            return;
        } finally {
            toggleLoading(false);
        }

        state.currentReviewCardIndex++;
        displayCurrentReviewCard();
    }

    // --- GERAÇÃO DE PDF ---
    function updatePdfButtonState() {
        if (!generateReviewPdfBtn) return;
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
        const quizzesSelecionados = []; 

        selectedCheckboxes.forEach(chk => {
            const quizId = chk.dataset.quizId;
            const quizData = state.historyCache.get(parseInt(quizId, 10)); 
            if (quizData) quizzesSelecionados.push(quizData);
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
                    quizzesSelecionados: quizzesSelecionados, 
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
    
    // --- INICIALIZAÇÃO ---
    loadTopics(); 

}); // FIM DO DOMCONTENTLOADED