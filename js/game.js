/*eslint-env es6*/
const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
const hint = document.getElementById("hint");

const finalScore = document.getElementById("finalScore");
const resultText = document.getElementById("result");

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];
let questions = [];

$("#game").hide();
$("#end").hide();
$("#game-hard").hide();
$("body").removeClass("body-color");

// Hard Mode values
let endQuestion = 0;
let questionNumber = 1;
let currentScore = 0;
const image = $("#question");
const input = $("answer-input");
const displayQuestionNumber = $("#question-number");


// Easy level - method
$("#easy").click(() => {
  $("#home").hide();
  $("#game").show();
  fetch("./js/easy.json")
    .then((res) => {
      return res.json();
    })
    .then((loadedQuestions) => {
      questions = loadedQuestions;

      startGame();
    })
    .catch((err) => {
      console.error(err);
    });
});

// Intermediate level - method
$("#intermediate").click(() => {
  $("#home").hide();
  $("#game").show();
  fetch("./js/intermediate.json")
    .then((res) => {
      return res.json();
    })
    .then((loadedQuestions) => {
      questions = loadedQuestions;

      startGame();
    })
    .catch((err) => {
      console.error(err);
    });
});

// Hard level - method
$("#hard").click(() => {
  $("#main").hide();
  $("#home").hide();
  $("#game-hard").show();
  $("body").addClass("body-color");
  fetch("./js/hard.json")
    .then((res) => {
      return res.json();
    })
    .then((loadedQuestions) => {
      console.log(loadedQuestions);
      questions = loadedQuestions;
      displayQuestionNumber.text(questionNumber);
      hardModeStart();
    })
    .catch((err) => {
      console.error(err);
    });
});

// Hard Mode

const hardModeStart = () => {
  $("#answer-button").click((e) => {
    e.preventDefault();
    endQuestion = questions.length-1;
    if (endQuestion >= questionNumber) {
      // Before changing question
      console.log(questionNumber);
      displayQuestionNumber.text(questionNumber);
      console.log(questions[questionNumber].img);
      image.attr('src',questions[questionNumber].img);
      questionNumber++;
      // After changing question
      console.log(questionNumber);
    }else{
      $("#game-hard").hide();
      $("#end").show();
    }
  });
};

//CONSTANTS
const CORRECT_BONUS = 10;
let MAX_QUESTIONS = 5;

const startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuesions = [...questions];
  getNewQuestion();
};

// New Question?
getNewQuestion = () => {
  if (availableQuesions.length === 0 || questionCounter === MAX_QUESTIONS) {
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
  setTimeout(() => {
    choices.forEach((choice) => {
      const number = choice.dataset["number"];
      choice.innerText = currentQuestion["choice" + number];
    }),
      500;
  });

  availableQuesions.splice(questionIndex, 1);
  acceptingAnswers = true;
};

choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    if (!acceptingAnswers) return;

    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];
    const correctAnswer = choices[currentQuestion.answer - 1];

    const classToApply =
      selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

    if (classToApply === "correct") {
      incrementScore(CORRECT_BONUS);
      selectedChoice.parentElement.classList.add(classToApply);
    } else {
      incrementScore(0);
      selectedChoice.parentElement.classList.add(classToApply);
      correctAnswer.parentElement.classList.add("correct");
    }

    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      correctAnswer.parentElement.classList.remove("correct");
      getNewQuestion();
    }, 800);
  });
});

incrementScore = (num) => {
  score += num;
  scoreText.innerText = score;

  if (score == 50) {
    resultText.innerText = "Perfect score!";
    finalScore.innerText = `You Scored : ${score}/50`;
  } else if (score == 40) {
    resultText.innerText = "Awesome job, you got most of them right.";
    finalScore.innerText = `You Scored : ${score}/50`;
  } else if (score == 30) {
    resultText.innerText = "Pretty good, we'll say that's a pass.";
    finalScore.innerText = `You Scored : ${score}/50`;
  } else if (score == 20) {
    resultText.innerText = "Well, at least you got some of them right!";
    finalScore.innerText = `You Scored : ${score}/50`;
  } else if (score == 10) {
    resultText.innerText =
      "Looks like this was a tough one, better luck next time.";
    finalScore.innerText = `You Scored : ${score}/50`;
  } else {
    resultText.innerText = "Yikes, none correct. Well, maybe it was rigged?";
    finalScore.innerText = `You Scored : ${score}/50`;
  }
};
