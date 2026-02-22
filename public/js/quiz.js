let currentQuiz = null;
let currentQuestionIndex = 0;
let answers = [];

async function init() {
    const token = localStorage.getItem('token');
    const topic = JSON.parse(localStorage.getItem('currentTopic'));

    if (!token || !topic) {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('topicName').textContent = topic.name + ' Quiz';
    document.getElementById('quizContent').style.display = 'none';
    document.getElementById('quizLoading').style.display = 'flex';

    try {
        const response = await fetchWithAuth('/quiz/start', {
            method: 'POST',
            body: JSON.stringify({ topicId: topic.id })
        });

        const data = await response.json();

        if (response.ok) {
            currentQuiz = data;
            answers = new Array(data.questions.length).fill(null);
            document.getElementById('quizLoading').style.display = 'none';
            document.getElementById('quizContent').style.display = 'block';
            displayQuestion();
        } else {
            alert(data.error || 'Failed to start quiz');
            window.location.href = 'dashboard.html';
        }
    } catch (error) {
        console.error('Error starting quiz:', error);
        alert('Failed to start quiz');
        window.location.href = 'dashboard.html';
    }
}

function displayQuestion() {
    const question = currentQuiz.questions[currentQuestionIndex];
    
    // Update question number and progress
    document.getElementById('questionNumber').textContent = 
        `Question ${currentQuestionIndex + 1}/${currentQuiz.questions.length}`;
    
    const progress = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';

    // Display question
    document.getElementById('questionText').textContent = question.question;

    // Display options
    const optionsGrid = document.getElementById('optionsGrid');
    optionsGrid.innerHTML = '';

    ['a', 'b', 'c', 'd'].forEach(option => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option-card';
        if (answers[currentQuestionIndex] === option) {
            optionDiv.classList.add('selected');
        }
        optionDiv.innerHTML = `
            <div class="option-letter">${option.toUpperCase()}</div>
            <div class="option-text">${question.options[option]}</div>
        `;
        optionDiv.onclick = () => selectOption(option);
        optionsGrid.appendChild(optionDiv);
    });

    // Update navigation buttons
    document.getElementById('prevBtn').disabled = currentQuestionIndex === 0;
    document.getElementById('nextBtn').textContent = 
        currentQuestionIndex === currentQuiz.questions.length - 1 ? 'Submit' : 'Next';
}

function selectOption(option) {
    answers[currentQuestionIndex] = option;
    displayQuestion();
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
}

function nextQuestion() {
    if (currentQuestionIndex === currentQuiz.questions.length - 1) {
        submitQuiz();
    } else {
        if (answers[currentQuestionIndex] === null) {
            if (!confirm('You haven\'t answered this question. Continue anyway?')) {
                return;
            }
        }
        currentQuestionIndex++;
        displayQuestion();
    }
}

async function submitQuiz() {
    // Check for unanswered questions
    const unanswered = answers.filter(a => a === null).length;
    if (unanswered > 0) {
        if (!confirm(`You have ${unanswered} unanswered question(s). Submit anyway?`)) {
            return;
        }
    }

    // Prepare answers
    const submissionAnswers = currentQuiz.questions.map((q, index) => ({
        questionId: q.id,
        userAnswer: answers[index] || 'a' // Default to 'a' if not answered
    }));

    try {
        document.getElementById('quizContent').style.display = 'none';
        document.getElementById('quizLoading').style.display = 'flex';
        document.querySelector('#quizLoading p').textContent = 'Submitting quiz...';

        const response = await fetchWithAuth('/quiz/submit', {
            method: 'POST',
            body: JSON.stringify({
                attemptId: currentQuiz.attemptId,
                answers: submissionAnswers
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Store results and redirect
            localStorage.setItem('quizResults', JSON.stringify(data));
            window.location.href = 'results.html';
        } else {
            alert('Failed to submit quiz');
            window.location.href = 'dashboard.html';
        }
    } catch (error) {
        console.error('Error submitting quiz:', error);
        alert('Failed to submit quiz');
        window.location.href = 'dashboard.html';
    }
}

function confirmExit() {
    if (confirm('Are you sure you want to exit? Your progress will be lost.')) {
        window.location.href = 'dashboard.html';
    }
}

init();
