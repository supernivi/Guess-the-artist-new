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
$("#end-hard").hide();
$("body").removeClass("body-color");
$("body").removeClass("body-bg-end");

// Hard Mode values
let endQuestion = 0;
let questionNumber = 1;
let currentScore = 0;
const image = $("#question-hard");
const input = $("#answer-input");
const displayQuestionNumber = $("#question-number");
const resultTextHard = document.getElementById("result-hard");
const finalScoreHard = document.getElementById("finalScore-hard");

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
      console.log(loadedQuestions);
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
      console.log("hard mode fetch");
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

//
// Hard Mode ***
//
const hardModeStart = () => {
  $("#answer-button").click((e) => {
    e.preventDefault();
    endQuestion = questions.length - 1;
    if (input.val()) {
      if (endQuestion >= questionNumber) {
        // Logs
        console.log(questionNumber);
        console.log(questions[questionNumber].img);
        console.log(questions[questionNumber].answer);
        console.log(input.val().toLowerCase().trim());

        // Before changing question
        if (
          input
            .val()
            .replace(/[^a-z0-9\s]/gi, "")
            .replace(/[_\s]/g, "")
            .toLowerCase() ===
          questions[questionNumber].answer
            .replace(/[^a-z0-9\s]/gi, "")
            .replace(/[_\s]/g, "")
            .toLowerCase()
        ) {
          score++;
          console.log("score", score);
          input.val(null);
        } else {
          console.log("score", score);
          input.val(null);
        }
        displayQuestionNumber.text(questionNumber+1);
        image.attr("src", questions[questionNumber].img);
        questionNumber++;
      } else {
        calculateHardScore();
        putResult();
        $("#game-hard").hide();
        $("body").addClass("body-bg-end");
        $("#end-hard").show();
      }
    } else {
      window.alert("Input cannot be null");
    }
  });
};

function calculateHardScore() {
  if (
    input
      .val()
      .replace(/[^a-z0-9\s]/gi, "")
      .replace(/[_\s]/g, "")
      .toLowerCase() ===
    questions[4].answer
      .replace(/[^a-z0-9\s]/gi, "")
      .replace(/[_\s]/g, "")
      .toLowerCase()
  ) {
    score++;
    console.log("score", score);
    input.val(null);
  } else {
    console.log("score", score);
    input.val(null);
  }
}

function putResult() {
  if (score == 5) {
    resultTextHard.innerText = "Perfect score!";
    finalScoreHard.innerText = `You Scored : ${score * 10}/50`;
  } else if (score == 4) {
    resultTextHard.innerText = "Awesome job, you got most of them right.";
    finalScoreHard.innerText = `You Scored : ${score * 10}/50`;
  } else if (score == 3) {
    resultTextHard.innerText = "Pretty good, we'll say that's a pass.";
    finalScoreHard.innerText = `You Scored : ${score * 10}/50`;
  } else if (score == 2) {
    resultTextHard.innerText = "Well, at least you got some of them right!";
    finalScoreHard.innerText = `You Scored : ${score * 10}/50`;
  } else if (score == 1) {
    resultTextHard.innerText =
      "Looks like this was a tough one,\n better luck next time.";
    finalScoreHard.innerText = `You Scored : ${score * 10}/50`;
  } else {
    resultTextHard.innerText =
      "Yikes, none correct. Well,\n maybe it was rigged?";
    finalScoreHard.innerText = `You Scored : ${score * 10}/50`;
  }
}

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

  console.log(question.src);
  console.log(currentQuestion.question);

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
