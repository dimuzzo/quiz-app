/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 * @param {Array} array - The array to shuffle.
 * @returns {Array} The shuffled array.
 */
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Initializes and manages the entire quiz lifecycle.
 * @param {Array} quizQuestions - An array of question objects.
 * @param {Function} questionRenderer - A function that returns the HTML for a question.
 * @returns {Object} An object with methods to control the quiz.
 */
function initializeQuiz(quizQuestions, questionRenderer) {
    const dom = {
        quizContent: document.getElementById('quizContent'),
        progressFill: document.getElementById('progressFill'),
        progressText: document.getElementById('progressText'),
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

    let currentSourceQuestions = quizQuestions;

    let state = {
        currentQuestionIndex: 0,
        userAnswers: [],
    };
    
    let questions = [];
    let questionOrder = [];

    function loadQuestion() {
        if (!questions || questions.length === 0) return;
        const isAnswered = state.userAnswers[state.currentQuestionIndex].correct !== null;
        
        const question = questions[state.currentQuestionIndex];
        const userAnswerObj = state.userAnswers[state.currentQuestionIndex];

        dom.quizContent.innerHTML = questionRenderer(question, state);

        const optionsContainer = dom.quizContent.querySelector('.options');
        optionsContainer.addEventListener('click', handleOptionClick);
        
        if (isAnswered) {
            const options = dom.quizContent.querySelectorAll('.option');
            const selectedOptionEl = dom.quizContent.querySelector(`.option[data-answer="${userAnswerObj.userAnswer}"]`);
            
            options.forEach(opt => {
                opt.classList.add('disabled');
                const questionCorrectAnswer = question.correct;
                const optionValueRaw = opt.dataset.answer;
                const optionValue = optionValueRaw === 'true' ? true : (optionValueRaw === 'false' ? false : parseInt(optionValueRaw, 10));

                if (optionValue === questionCorrectAnswer) opt.classList.add('correct');
                else if (opt === selectedOptionEl) opt.classList.add('incorrect');
            });

            if (selectedOptionEl) selectedOptionEl.classList.add('selected');
            dom.quizContent.querySelector('.explanation').classList.remove('hidden');
        } else if (userAnswerObj.userAnswer !== null) {
            const selectedOptionEl = dom.quizContent.querySelector(`.option[data-answer="${userAnswerObj.userAnswer}"]`);
            if (selectedOptionEl) selectedOptionEl.classList.add('selected');
        }

        updateNavigation();
    }

    function handleOptionClick(event) {
        const target = event.target.closest('.option');
        const isAnswered = state.userAnswers[state.currentQuestionIndex].correct !== null;
        if (!target || isAnswered) return;

        target.closest('.options').querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
        target.classList.add('selected');
        
        const answerRaw = target.dataset.answer;
        const answer = answerRaw === 'true' ? true : (answerRaw === 'false' ? false : parseInt(answerRaw, 10));
        state.userAnswers[state.currentQuestionIndex].userAnswer = answer;
    }

    function showAnswer() {
        const isAnswered = state.userAnswers[state.currentQuestionIndex].correct !== null;
        if (isAnswered) return;

        if (state.userAnswers[state.currentQuestionIndex].userAnswer === null) {
            alert(i18n.getString('global.select_answer_alert'));
            return;
        }

        const question = questions[state.currentQuestionIndex];
        const isCorrect = state.userAnswers[state.currentQuestionIndex].userAnswer === question.correct;
        state.userAnswers[state.currentQuestionIndex].correct = isCorrect;
        
        fullRender();
    }

    function navigate(direction) {
        const newIndex = state.currentQuestionIndex + direction;
        if (newIndex >= 0 && newIndex < questions.length) {
            state.currentQuestionIndex = newIndex;
            fullRender();
        } else if (newIndex === questions.length) {
            showResults();
        }
    }

    function updateProgress() {
        if (questions.length === 0) return;
        const progress = ((state.currentQuestionIndex + 1) / questions.length) * 100;
        dom.progressFill.style.width = `${progress}%`;
        dom.progressText.textContent = i18n.getString('global.question_progress', {
            current: state.currentQuestionIndex + 1,
            total: questions.length
        });
    }

    function updateNavigation() {
        if (questions.length === 0) return;
        const isAnswered = state.userAnswers[state.currentQuestionIndex].correct !== null;

        dom.prevBtn.disabled = state.currentQuestionIndex === 0;
        const nextButtonKey = state.currentQuestionIndex === questions.length - 1 ? 'global.finish_quiz_button' : 'global.next';
        dom.nextBtn.textContent = i18n.getString(nextButtonKey);
        
        dom.showAnswerBtn.classList.toggle('hidden', isAnswered);
        dom.nextBtn.classList.toggle('hidden', !isAnswered);
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

        const correctTotal = state.userAnswers.filter(a => a.correct === true).length;
        const answeredCount = state.userAnswers.filter(a => a.userAnswer !== null).length;
        const incorrectTotal = state.userAnswers.filter(a => a.correct === false).length;
        const percentageTotal = questions.length > 0 ? Math.round((correctTotal / questions.length) * 100) : 0;

        dom.scorePercentage.textContent = `${percentageTotal}%`;
        dom.correctStat.textContent = correctTotal;
        dom.incorrectStat.textContent = incorrectTotal;
        dom.answeredCorrectStat.textContent = `${correctTotal} / ${answeredCount}`;
        dom.answeredIncorrectStat.textContent = `${incorrectTotal} / ${answeredCount}`;
        
        const gradientDegrees = (percentageTotal / 100) * 360;
        dom.scoreCircle.style.background = `conic-gradient(#4f46e5 ${gradientDegrees}deg, #e2e8f0 ${gradientDegrees}deg)`;
    }
    
    function fullRender() {
        loadQuestion();
        updateProgress();
        updateCurrentStats();
        updateQuestionMapStyles();
        if (dom.questionJumpSelect) dom.questionJumpSelect.value = state.currentQuestionIndex;
    }

    function updateLanguage(allNewQuestions, optionShuffler) {
        const newQuestionsMap = new Map(allNewQuestions.map(q => [q.id || q.pattern, q]));
        
        const translatedQuestions = questionOrder.map(id => {
            const newQuestionData = newQuestionsMap.get(id);
            return optionShuffler ? optionShuffler(newQuestionData) : newQuestionData;
        });

        currentSourceQuestions = translatedQuestions;
        
        questions = currentSourceQuestions;
        
        fullRender();
    }
    
    function initQuiz() {
        questions = shuffleArray([...currentSourceQuestions]);
        
        questionOrder = questions.map(q => q.id || q.pattern);
        
        state.currentQuestionIndex = 0;
        state.userAnswers = new Array(questions.length).fill(null).map(() => ({ userAnswer: null, correct: null }));

        dom.results.classList.add('hidden');
        dom.quizContent.classList.remove('hidden');
        dom.controls.classList.remove('hidden');
        dom.progressSection.classList.remove('hidden');

        if (questions.length === 0) {
            dom.quizContent.innerHTML = `<p style='text-align:center;'>No questions available.</p>`;
            return;
        }

        const questionJumpSelect = dom.questionJumpSelect;
        questionJumpSelect.innerHTML = '';
        questions.forEach((_, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = index + 1;
            questionJumpSelect.appendChild(option);
        });

        const questionMapContainer = dom.questionMapContainer;
        questionMapContainer.innerHTML = '';
        questions.forEach((_, index) => {
            const marker = document.createElement('div');
            marker.classList.add('question-marker');
            marker.dataset.index = index;
            marker.textContent = index + 1;
            marker.addEventListener('click', () => { state.currentQuestionIndex = index; fullRender(); });
            questionMapContainer.appendChild(marker);
        });
        
        dom.showAnswerBtn.onclick = showAnswer; 
        dom.stopBtn.onclick = showResults;
        dom.nextBtn.onclick = () => navigate(1);
        dom.prevBtn.onclick = () => navigate(-1);
        dom.restartBtn.onclick = initQuiz; // Il tasto ricomincia richiama questa funzione, che ora fa lo shuffle
        
        questionJumpSelect.onchange = (e) => {
            state.currentQuestionIndex = parseInt(e.target.value, 10);
            fullRender();
        };

        fullRender();
    }

    function updateQuestionMapStyles() {
        if (!dom.questionMapContainer) return;
        const markers = dom.questionMapContainer.querySelectorAll('.question-marker');
        markers.forEach((marker, index) => {
            marker.className = 'question-marker';
            if (index === state.currentQuestionIndex) marker.classList.add('current');
            const answerInfo = state.userAnswers[index];
            if (answerInfo.correct === true) marker.classList.add('correct');
            else if (answerInfo.correct === false) marker.classList.add('incorrect');
            else if (answerInfo.userAnswer !== null) marker.classList.add('answered');
        });
    }

    initQuiz();
    
    return {
        fullRender,
        updateLanguage
    };
}