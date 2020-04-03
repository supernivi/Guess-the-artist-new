const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
const hint = document.getElementById("hint");

const finalScore = document.getElementById("finalScore");
const resultText =document.getElementById("result");

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];
let questions = [];

$("#game").hide();
$("#end").hide();

$("#easy").click(()=>{
  $("#home").hide();
  $("#game").show();
  fetch("./js/easy.json")
  .then(res => {
    return res.json();
  })
  .then(loadedQuestions => {
    questions = loadedQuestions;

    startGame();
  })
  .catch(err => {
    console.error(err);
  });
})

$("#intermediate").click(()=>{
  $("#home").hide();
  $("#game").show();
  fetch("./js/intermediate.json")
  .then(res => {
    return res.json();
  })
  .then(loadedQuestions => {
    questions = loadedQuestions;

    startGame();
  })
  .catch(err => {
    console.error(err);
  });
})

//CONSTANTS
const CORRECT_BONUS = 10;
let MAX_QUESTIONS = 5;

startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuesions = [...questions];
  getNewQuestion();
};

getNewQuestion = () => {
  if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    localStorage.setItem("mostRecentScore", score);
    $("#game").hide();
    $("#end").show();
  }
  questionCounter++;
  progressText.innerText = `Question : ${questionCounter}/${MAX_QUESTIONS}`;
  progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

  const questionIndex = Math.floor(Math.random() * availableQuesions.length);
  currentQuestion = availableQuesions[questionIndex];
  question.src = currentQuestion.question;
  hint.innerText = currentQuestion.hint;
  choices.forEach(choice => {
    const number = choice.dataset["number"];
    choice.innerText = currentQuestion["choice" + number];
  });

  availableQuesions.splice(questionIndex, 1);
  acceptingAnswers = true;
};

choices.forEach(choice => {
  choice.addEventListener("click", e => {
    if (!acceptingAnswers) return;

    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];
    const correctAnswer = choices[currentQuestion.answer-1];

    const classToApply =
      selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

    if (classToApply === "correct") {
      incrementScore(CORRECT_BONUS);
      selectedChoice.parentElement.classList.add(classToApply);
    }
    else {
      selectedChoice.parentElement.classList.add(classToApply);
      correctAnswer.parentElement.classList.add("correct");
    }

    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      correctAnswer.parentElement.classList.remove("correct");
      getNewQuestion();
    }, 680);
  });
});

incrementScore = num => {
  score += num;
  scoreText.innerText = score;

  if(score==50){
    resultText.innerText = "Perfect score!";
    finalScore.innerText =`You Scored : ${score}/50`;
  }
  else if(score==40){
    resultText.innerText = "Awesome job, you got most of them right.";
    finalScore.innerText =`You Scored : ${score}/50`;
  }
  else if(score==30){
    resultText.innerText = "Pretty good, we'll say that's a pass.";
    finalScore.innerText =`You Scored : ${score}/50`;
  }
  else if(score==20){
    resultText.innerText = "Well, at least you got some of them right!";
    finalScore.innerText =`You Scored : ${score}/50`;
  }
  else if(score==10){
    resultText.innerText = "Looks like this was a tough one, better luck next time.";
    finalScore.innerText =`You Scored : ${score}/50`;
  }
  else{
    resultText.innerText = "Yikes, none correct. Well, maybe it was rigged?";
    finalScore.innerText =`You Scored : 0/50`;
  }
};
