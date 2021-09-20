const startButton = document.querySelector("#play");

const ctgButtons = Array.from(document.querySelectorAll(".category-btn"));

const difButtons = Array.from(document.querySelectorAll(".difficulty-btn"));

const startPage = document.querySelector("#start-page");

const gamePage = document.querySelector("#game-page");

const endPage = document.querySelector("#end-page");

const finalScore = document.querySelector("#finalScore");

let category;

let difficulty;

const btnFunc = (btn) => {
  btn.addEventListener("click", (e) => {
    if (btn.classList.contains("difficulty-btn")) {
      difficulty = btn.value;
    } else {
      category = btn.value;
    }
    if (
      category != undefined &&
      difficulty != undefined &&
      startButton.classList.contains("hidden")
    ) {
      startButton.classList.toggle("hidden");
    }
  });
};

difButtons.forEach((btn) => btnFunc(btn));

ctgButtons.forEach((btn) => btnFunc(btn));

function start() {
  startPage.classList.toggle("hidden");
  fetcher();
}

const question = document.querySelector("#question");

const choices = Array.from(document.querySelectorAll(".choice-txt"));

const questionCounterText = document.querySelector("#questionCounter");

const scoreText = document.querySelector("#score");

const loader = document.querySelector("#loader");

const game = document.querySelector("#game");

let currentQuestion = {};

let acceptingAnswers = false;

let score = 0;

let questionCounter = 0;

let availableQuestions = [];

let questions = [];

const fetcher = () => {
  fetch(
    `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`
  )
    .then((res) => {
      return res.json();
    })
    .then((loadedQuestions) => {
      questions = loadedQuestions.results.map((loadedQuestion) => {
        const formattedQuestion = {
          question: loadedQuestion.question,
        };

        const answerChoices = [...loadedQuestion.incorrect_answers];

        formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;

        answerChoices.splice(
          formattedQuestion.answer - 1,
          0,
          loadedQuestion.correct_answer
        );

        answerChoices.forEach((choice, index) => {
          formattedQuestion["choice" + (index + 1)] = choice;
        });

        return formattedQuestion;
      });

      startGame();
    })
    .catch((err) => {
      console.error(err);
    });
};

const MAX_QUESTIONS = 10;

startGame = () => {
  questionCounter = 0;

  score = 0;

  availableQuestions = [...questions];

  getNewQuestion();

  gamePage.classList.toggle("hidden");

  setTimeout(() => {
    loader.classList.toggle("hidden");
  }, 1000);

  setTimeout(() => {
    game.classList.toggle("hidden");
  }, 1000);
};

getNewQuestion = () => {
  if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    finalScore.innerText = `Score: ${score}`;
    gamePage.classList.toggle("hidden");
    endPage.classList.toggle("hidden");
  }
  questionCounter++;

  questionCounterText.innerText = `${questionCounter}/${MAX_QUESTIONS}`;

  const questionIndex = Math.floor(Math.random() * availableQuestions.length);

  currentQuestion = availableQuestions[questionIndex];

  question.innerText = currentQuestion.question;

  choices.forEach((choice) => {
    const number = choice.dataset["number"];
    choice.innerText = currentQuestion["choice" + number];
  });

  availableQuestions.splice(questionIndex, 1);

  acceptingAnswers = true;
};

choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    if (!acceptingAnswers) return;

    acceptingAnswers = false;
    const selectedChoice = e.target;

    let classToApply = "incorrect";
    const selectedAnswer = selectedChoice.dataset["number"];

    if (selectedAnswer == currentQuestion.answer) {
      classToApply = "correct";
      score++;
      scoreText.innerText = score;
    }

    selectedChoice.parentElement.classList.add(classToApply);

    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 1000);
  });
});

const restart = () => {
  endPage.classList.toggle("hidden");

  currentQuestion = {};

  acceptingAnswers = false;

  score = 0;

  questionCounter = 0;

  availableQuestions = [];

  questions = [];

  loader.classList.toggle("hidden");

  game.classList.toggle("hidden");

  fetcher();
};

const reset = () => {
  category = undefined;

  difficulty = undefined;

  currentQuestion = {};

  acceptingAnswers = false;

  score = 0;

  questionCounter = 0;

  availableQuestions = [];

  questions = [];

  game.classList.toggle("hidden");

  endPage.classList.toggle("hidden");

  startPage.classList.toggle("hidden");

  startButton.classList.toggle("hidden");

  loader.classList.toggle("hidden");
};
