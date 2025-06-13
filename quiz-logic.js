function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function initializeQuiz(quizQuestions, questionRenderer) {
    const dom = {
        quizContent: document.getElementById('quizContent'),
        progressFill: document.getElementById('progressFill'),
        currentQuestion: document.getElementById('currentQuestion'),
        totalQuestions: document.getElementById('totalQuestions'),
        questionJumpSelect: document.getElementById('questionJump'),
        questionMapContainer: document.getElementById('questionMap'),
        prevBtn: document.getElementById('prevBtn'),
        nextBtn: document.getElementById('nextBtn'),
        showAnswerBtn: document.getElementById('showAnswerBtn'),
        stopBtn: document.getElementById('stopBtn'),
        restartBtn: document.getElementById('restartBtn'),
        results: document.getElementById('results'),
        scorePercentage: document.getElementById('scorePercentage'),
        correctStat: document.querySelector('#correctStat .stat-value'),
        incorrectStat: document.querySelector('#incorrectStat .stat-value'),
        answeredCorrectStat: document.querySelector('#answeredCorrectStat .stat-value'),
        answeredIncorrectStat: document.querySelector('#answeredIncorrectStat .stat-value'),
        scoreCircle: document.getElementById('scoreCircle'),
        progressSection: document.querySelector('.progress-section'),
        controls: document.querySelector('.controls'),
        currentCorrectCount: document.getElementById('currentCorrectCount'),
        currentIncorrectCount: document.getElementById('currentIncorrectCount'),
    };

    let state = {
        currentQuestionIndex: 0,
        userAnswers: [],
        isShowingAnswer: false,
    };
    
    let questions = [];

    function initQuiz() {
        questions = quizQuestions; // Usa le domande passate
        state.currentQuestionIndex = 0;
        state.userAnswers = new Array(questions.length).fill(null).map(() => ({ userAnswer: null, correct: null }));
        state.isShowingAnswer = false;

        dom.results.classList.add('hidden');
        dom.quizContent.classList.remove('hidden');
        dom.controls.classList.remove('hidden');
        dom.progressSection.classList.remove('hidden');

        if (questions.length === 0) {
            dom.quizContent.innerHTML = "<p style='text-align:center; font-size:1.2rem; color:#6b7280;'>Nessuna domanda disponibile.</p>";
            dom.controls.classList.add('hidden');
            dom.progressSection.classList.add('hidden');
            return;
        }

        populateQuestionJump();
        populateQuestionMap();
        loadQuestion();
        updateProgress();
        updateNavigation();
        updateCurrentStats();
    }

    function loadQuestion() {
        if (questions.length === 0) return;
        state.isShowingAnswer = false;
        const question = questions[state.currentQuestionIndex];
        const userAnswerObj = state.userAnswers[state.currentQuestionIndex];

        // Usa il renderer passato come argomento per generare l'HTML
        dom.quizContent.innerHTML = questionRenderer(question, state);

        const optionsContainer = dom.quizContent.querySelector('.options');
        optionsContainer.addEventListener('click', handleOptionClick);
        
        // Controlla se la domanda è già stata valutata
        if (userAnswerObj.correct !== null) {
            state.isShowingAnswer = true;
            const options = dom.quizContent.querySelectorAll('.option');
            const selectedOptionEl = dom.quizContent.querySelector(`.option[data-answer="${userAnswerObj.userAnswer}"]`);
            
            options.forEach(opt => {
                opt.classList.add('disabled');
                const optionValue = opt.dataset.answer === 'true' ? true : (opt.dataset.answer === 'false' ? false : parseInt(opt.dataset.answer, 10));
                if (optionValue === question.correct) {
                    opt.classList.add('correct');
                } else if (opt === selectedOptionEl) {
                    opt.classList.add('incorrect');
                }
            });

            if (selectedOptionEl) selectedOptionEl.classList.add('selected');
            dom.quizContent.querySelector('.explanation').classList.remove('hidden');
        } else if (userAnswerObj.userAnswer !== null) {
            // Ripristina solo lo stato 'selected' se la domanda è stata risposta ma non valutata
            const selectedOptionEl = dom.quizContent.querySelector(`.option[data-answer="${userAnswerObj.userAnswer}"]`);
            if (selectedOptionEl) selectedOptionEl.classList.add('selected');
        }

        dom.showAnswerBtn.classList.toggle('hidden', state.isShowingAnswer);
        dom.nextBtn.classList.toggle('hidden', !state.isShowingAnswer);

        updateQuestionJumpHighlight();
        updateQuestionMapStyles();
        updateNavigation();
    }

    function handleOptionClick(event) {
        const target = event.target.closest('.option');
        if (!target || state.isShowingAnswer || state.userAnswers[state.currentQuestionIndex].correct !== null) {
            return;
        }

        target.closest('.options').querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
        target.classList.add('selected');
        
        const answerRaw = target.dataset.answer;
        const answer = answerRaw === 'true' ? true : (answerRaw === 'false' ? false : parseInt(answerRaw, 10));
        state.userAnswers[state.currentQuestionIndex].userAnswer = answer;
    }

    function showAnswer() {
        if (state.isShowingAnswer) return;
        if (state.userAnswers[state.currentQuestionIndex].userAnswer === null) {
            alert("Per favore, seleziona una risposta prima.");
            return;
        }

        state.isShowingAnswer = true;
        const question = questions[state.currentQuestionIndex];
        const isCorrect = state.userAnswers[state.currentQuestionIndex].userAnswer === question.correct;
        state.userAnswers[state.currentQuestionIndex].correct = isCorrect;

        // Ricarica la domanda per mostrare gli stili corretto/sbagliato
        loadQuestion();
        updateCurrentStats();
        updateQuestionMapStyles();
    }

    function navigate(direction) {
        const newIndex = state.currentQuestionIndex + direction;
        if (newIndex >= 0 && newIndex < questions.length) {
            state.currentQuestionIndex = newIndex;
            loadQuestion();
            updateProgress();
        } else if (newIndex === questions.length) {
            showResults();
        }
    }

    function updateProgress() {
        if (questions.length === 0) return;
        const progress = ((state.currentQuestionIndex + 1) / questions.length) * 100;
        dom.progressFill.style.width = `${progress}%`;
        dom.currentQuestion.textContent = state.currentQuestionIndex + 1;
        dom.totalQuestions.textContent = questions.length;
    }

    function updateNavigation() {
        if (questions.length === 0) {
            dom.prevBtn.disabled = true;
            dom.nextBtn.disabled = true;
            return;
        }
        dom.prevBtn.disabled = state.currentQuestionIndex === 0;
        dom.nextBtn.textContent = state.currentQuestionIndex === questions.length - 1 ? '🏁 Termina Quiz' : 'Successiva →';
    }
    
    function updateCurrentStats() {
        const correctCount = state.userAnswers.filter(a => a.correct === true).length;
        const incorrectCount = state.userAnswers.filter(a => a.correct === false).length;
        dom.currentCorrectCount.textContent = correctCount;
        dom.currentIncorrectCount.textContent = incorrectCount;
    }

    function showResults() {
        dom.quizContent.classList.add('hidden');
        dom.controls.classList.add('hidden');
        dom.progressSection.classList.add('hidden');
        dom.results.classList.remove('hidden');

        const totalValidQuestions = questions.length;
        const answeredCount = state.userAnswers.filter(a => a.userAnswer !== null).length;
        const correctTotal = state.userAnswers.filter(a => a.correct === true).length;
        const incorrectTotal = state.userAnswers.filter(a => a.correct === false).length;
        const percentageTotal = totalValidQuestions > 0 ? Math.round((correctTotal / totalValidQuestions) * 100) : 0;

        dom.scorePercentage.textContent = `${percentageTotal}%`;
        dom.correctStat.textContent = correctTotal;
        dom.incorrectStat.textContent = incorrectTotal;
        dom.answeredCorrectStat.textContent = `${correctTotal} / ${answeredCount}`;
        dom.answeredIncorrectStat.textContent = `${incorrectTotal} / ${answeredCount}`;

        const gradientDegrees = (percentageTotal / 100) * 360;
        dom.scoreCircle.style.background = `conic-gradient(#4f46e5 ${gradientDegrees}deg, #e2e8f0 ${gradientDegrees}deg)`;
    }

    function populateQuestionJump() {
        if (!dom.questionJumpSelect || questions.length === 0) return;
        dom.questionJumpSelect.innerHTML = '';
        questions.forEach((_, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = index + 1;
            dom.questionJumpSelect.appendChild(option);
        });
        dom.questionJumpSelect.value = state.currentQuestionIndex;
    }

    function updateQuestionJumpHighlight() {
        if (dom.questionJumpSelect) dom.questionJumpSelect.value = state.currentQuestionIndex;
    }

    function handleQuestionJump(event) {
        const newIndex = parseInt(event.target.value, 10);
        if (newIndex >= 0 && newIndex < questions.length && newIndex !== state.currentQuestionIndex) {
            state.currentQuestionIndex = newIndex;
            loadQuestion();
            updateProgress();
        }
    }
    
    function populateQuestionMap() {
        if (!dom.questionMapContainer || questions.length === 0) return;
        dom.questionMapContainer.innerHTML = '';
        questions.forEach((_, index) => {
            const marker = document.createElement('div');
            marker.classList.add('question-marker');
            marker.dataset.index = index;
            marker.textContent = index + 1;
            marker.addEventListener('click', () => handleQuestionMarkerClick(index));
            dom.questionMapContainer.appendChild(marker);
        });
        updateQuestionMapStyles();
    }

    function handleQuestionMarkerClick(index) {
        if (index >= 0 && index < questions.length && index !== state.currentQuestionIndex) {
            state.currentQuestionIndex = index;
            loadQuestion();
            updateProgress();
        }
    }
    
    function updateQuestionMapStyles() {
        if (!dom.questionMapContainer || questions.length === 0) return;
        const markers = dom.questionMapContainer.querySelectorAll('.question-marker');
        markers.forEach(marker => {
            const index = parseInt(marker.dataset.index, 10);
            marker.classList.remove('current', 'answered', 'correct', 'incorrect');
            if (index === state.currentQuestionIndex) marker.classList.add('current');
            
            const answerInfo = state.userAnswers[index];
            if (answerInfo.correct === true) marker.classList.add('correct');
            else if (answerInfo.correct === false) marker.classList.add('incorrect');
            else if (answerInfo.userAnswer !== null) marker.classList.add('answered');
        });
    }

    // Event Listeners
    dom.showAnswerBtn.addEventListener('click', showAnswer);
    dom.stopBtn.addEventListener('click', showResults);
    dom.nextBtn.addEventListener('click', () => navigate(1));
    dom.prevBtn.addEventListener('click', () => navigate(-1));
    dom.restartBtn.addEventListener('click', initQuiz);
    if (dom.questionJumpSelect) {
        dom.questionJumpSelect.addEventListener('change', handleQuestionJump);
    }

    initQuiz();
}