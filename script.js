
const _question = document.getElementById('question');
const _options = document.querySelector('.quiz-options');
const _checkBtn = document.getElementById('check-answer');
const _playAgainBtn = document.getElementById('play-again');
const _result = document.getElementById('result');
const _correctScore = document.getElementById('correct-score');
const _totalQuestion = document.getElementById('total-question');

let correctAnswer = "", correctScore = 0, askedCount = 0, totalQuestion = 3, data;

async function fetchData()
{   
    const APIUrl = 'https://opentdb.com/api.php?amount=10';
    const result = await fetch(APIUrl)
    data = await result.json();
    loadQuestion();
}

// load question from API
function loadQuestion(){
    _result.innerHTML = "";                  /*search*/
    showQuestion(data.results[askedCount+1]);

    // console.log(data);
}

// event listeners
function buttonEvents(){
    _checkBtn.addEventListener('click', checkAnswer);
    _playAgainBtn.addEventListener('click', restartQuiz);
}

document.addEventListener('DOMContentLoaded', function(){    /*1*/
    fetchData();
    buttonEvents();
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
});

// display question and options
function showQuestion(data){
    _checkBtn.disabled = false;
    correctAnswer = data.correct_answer;  /*why didnt we use let*/
    let incorrectAnswer = data.incorrect_answers;
    let optionsList = incorrectAnswer;  /*assigned to new variable beacuse we need to do opeartion on "incorrectAnswer"*/
    optionsList.splice(Math.floor(Math.random() * (incorrectAnswer.length + 1)), 0, correctAnswer); /*what is incorrectAnswer.length (4 ?)*/
    // console.log(correctAnswer);


    /*searcg this*/
    _question.innerHTML = `${data.question} <br> <span class = "category"> ${data.category} </span>`;
    _options.innerHTML = `
        ${optionsList.map((option, index) => `
            <li> ${index + 1}. <span>${option}</span> </li>
        `).join('')}
    `;
    selectOption();
}


// options selection
function selectOption(){
    _options.querySelectorAll('li').forEach(function(option){
        option.addEventListener('click', function(){
            if(_options.querySelector('.selected')){
                const activeOption = _options.querySelector('.selected');
                activeOption.classList.remove('selected');
            }
            option.classList.add('selected');
        });
    });
}

// answer checking
function checkAnswer(){
    _checkBtn.disabled = true;
    if(_options.querySelector('.selected')){
        let selectedAnswer = _options.querySelector('.selected span').textContent;
        if(selectedAnswer == HTMLDecode(correctAnswer)){
            correctScore++;
            _result.innerHTML = `<p><i class = "fas fa-check"></i>Correct Answer!</p>`;
        } else {
            _result.innerHTML = `<p><i class = "fas fa-times"></i>Incorrect Answer!</p> <small><b>Correct Answer: </b>${correctAnswer}</small>`;
        }
        checkCount();
    } else {
        _result.innerHTML = `<p><i class = "fas fa-question"></i>Please select an option!</p>`;
        _checkBtn.disabled = false;
    }
}

// to convert html entities into normal text of correct answer if there is any
function HTMLDecode(textString) {
    let doc = new DOMParser().parseFromString(textString, "text/html");
    return doc.documentElement.textContent;
}


function checkCount(){
    askedCount++;
    setCount();
    if(askedCount == totalQuestion){
        _result.innerHTML += `<p>Your score is ${correctScore}.</p>`;
        _playAgainBtn.style.display = "block";
        _checkBtn.style.display = "none";
    } else {
        setTimeout(function(){
            loadQuestion();
        }, 1000);                                
    }
}

function setCount(){
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
}


function restartQuiz(){
    correctScore = 0, askedCount = 0;
    _playAgainBtn.style.display = "none";
    _checkBtn.style.display = "block";
    _checkBtn.disabled = false;
    setCount();
    fetchData();
}