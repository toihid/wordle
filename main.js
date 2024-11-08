// pre defined variables for manipulate calculation
const userInputs = [];
let currentIndex = 0;
let currentRow = 1;
let correctWord = "";
let isWinner = false;
let isLoser = false;

// read json from file
const readWords = async () => {
  try {
    const response = await fetch("wordle.json");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json(); // Wait for the JSON parsing
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return {};
  }
};

// assign a random word from the wordle.json file
readWords().then((result) => {
  randomWord = result[Math.floor(Math.random() * result.length)];
  onCorrectWordLoaded(randomWord);
});
const onCorrectWordLoaded = (randomWord) => {
  correctWord = randomWord;
  console.log("correct-word:", correctWord);
};

// geting user input from onscreen keyboard
const onScreenKeyboard = document.querySelectorAll("#keyboard button");
onScreenKeyboard.forEach((button) => {
  button.addEventListener("click", (e) => {
    value = e.target.getAttribute("data-value");
    actionSwitcher(value.toLowerCase());
  });
});

// Make sure that only backspace, enter and alphabetical letters are allowed
document.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    e.preventDefault(); // Prevent the default tabbing action
  }
  val = e.key.toLowerCase();
  const isAlphabet = /^[a-zA-Z]$/.test(val);
  if (isAlphabet || val == "backspace" || val == "enter") {
    actionSwitcher(val);
  }
});

// switchboard to map the appropiate key to the appropiate action
const actionSwitcher = (val) => {
  // Done, TODO: switch statement , Done
  colorBlindBtn.blur();
  if (!isWinner) {
    switch (val) {
      case "enter":
        enterAction(val);
        break;
      case "backspace":
        deleteAction();
        break;
      default:
        inputAction(val);
        break;
    }
  }
};

// write a alphabet in the cell and updated the array of userInputs
const writeLetter = (val) => {
  userInputs.push(val);
  const currentIndex = userInputs.length - 1;
  const nextIndex = currentIndex + 1;
  const inputsElements = document.querySelectorAll(".grid .cell");
  // Make sure that it does not overflow the available cells
  if (nextIndex <= inputsElements.length) {
    inputsElements[currentIndex].textContent = val;
    inputsElements[currentIndex].classList.add("outline");
  }
};

// delete a alphabet from the cell and updated the array of userInputs
const deleteLetter = () => {
  userInputs.pop();
  const currentIndex = userInputs.length;
  const nextIndex = currentIndex + 1;
  const inputsElements = document.querySelectorAll(".grid .cell");
  if (nextIndex <= inputsElements.length) {
    inputsElements[currentIndex].textContent = "";
    inputsElements[currentIndex].classList.remove("outline");
  }
};

// take actions for new input
const inputAction = (val) => {
  const rowNum = Math.ceil(userInputs.length / gridCols);
  //Done, TODO: check if we really need the first condition. Check only second one.userInputs.length % gridCols === 0
  // TODO: research if guard-clause can be implemented
  // the first condition is not needed
  //if (userInputs.length >= gridCols && userInputs.length % gridCols === 0) {

  if (userInputs.length % gridCols === 0) {
    if (rowNum < currentRow) {
      writeLetter(val);
    } else {
      displayMessage("Please Enter");
    }
  } else {
    writeLetter(val);
  }
};

const deleteAction = (val) => {
  // finding the number of element of last row, user only delete elements on current row not the previous row
  const deleteTill = Math.floor(userInputs.length / gridCols) * gridCols;
  // First condition makes sure you cant delete on previous row
  if (deleteTill < userInputs.length || deleteTill === currentRow * gridCols) {
    deleteLetter();
  }
};

// manage actions when clicking enter button
const enterAction = () => {
  let checkAnyIputINNewRow = currentRow * gridCols - gridCols;
  // Done, TODO: research if a guard-clause can be implemented
  if (
    userInputs.length % gridCols !== 0 ||
    userInputs.length <= checkAnyIputINNewRow
  ) {
    displayMessage("Too short!");
    return;
  }
  const word = userInputs.slice(-5).join("");
  isValidWord(word).then((result) => {
    if (!result) {
      displayMessage("Word is not exist");
    } else {
      onValidWord(word);
    }
  });
};

// display a message
const displayMessage = (message) => {
  const messageBox = document.createElement("div");
  messageBox.classList.add("message-box");
  messageBox.textContent = message;
  setTimeout(function () {
    messageBox.style.display = "none"; // Hide the message
  }, 1000);
  container.appendChild(messageBox);
};

// check validation of the word
async function isValidWord(word) {
  try {
    const response = await fetch(
      "https://api.dictionaryapi.dev/api/v2/entries/en/" + word
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return false;
  }
}

// manage the word
const onValidWord = (word) => {
  currentRow++;
  checkLetter(word);
};

// logic of comparing between user guase and the computer choosen
const checkLetter = (word) => {
  let wordArray = [...word];
  let correctWordArray = [...correctWord];

  let countCorrectLetters = 0;
  wordArray.forEach((letter, letterIndex) => {
    correctWordArray.forEach((correctLetter, correctLetterIndex) => {
      if (letter === correctLetter && letterIndex === correctLetterIndex) {
        highlightCorrectPosition(letterIndex);
        countCorrectLetters++;
      } else if (letter === correctLetter) {
        highlightCorrectLetter(letterIndex);
      }
    });
  });

  // Determine if the board is in a winning or losing state.
  if (countCorrectLetters === gridCols) {
    winner();
    isWinner = true;
  } else if (currentRow == gridRows + 1) {
    isLoser = true;
    loser();
  }
};

// highlight the correct alphabet in the row
const highlightCorrectLetter = (letterIndex) => {
  const letterPosition = (currentRow - 1) * gridCols - gridCols + letterIndex;
  const inputsElements = document.querySelectorAll(".grid .cell");
  inputsElements[letterPosition].classList.add("correct-letter");
};

// highlight the correct alphabet in correct position in the row
const highlightCorrectPosition = (letterIndex) => {
  const letterPosition = (currentRow - 1) * gridCols - gridCols + letterIndex;
  const inputsElements = document.querySelectorAll(".grid .cell");
  inputsElements[letterPosition].classList.add("correct-position");
};

// setting for clor blind
colorBlindBtn.addEventListener("click", () => {
  if (colorBlindBtn.classList.contains("on")) {
    colorBlindBtn.classList.remove("on");
    colorBlindBtn.classList.add("off");
    colorBlindBtn.textContent = "OFF";
    container.classList.remove("blind-mode");
  } else {
    colorBlindBtn.classList.remove("off");
    colorBlindBtn.classList.add("on");
    colorBlindBtn.textContent = "ON";
    container.classList.add("blind-mode");
  }
});

// setting for clor blind
darkModeBtn.addEventListener("click", () => {
  if (darkModeBtn.classList.contains("on")) {
    darkModeBtn.classList.remove("on");
    darkModeBtn.classList.add("off");
    darkModeBtn.textContent = "OFF";
    container.classList.remove("dark-mode");
  } else {
    darkModeBtn.classList.remove("off");
    darkModeBtn.classList.add("on");
    darkModeBtn.textContent = "ON";
    container.classList.add("dark-mode");
  }
});

const winner = () => {
  const winnerH = document.createElement("h3");
  winnerH.classList.add("winnre");
  winnerH.textContent = "🎉 Congratulations! 🎉 You're a winner!";
  resultDiv.appendChild(winnerH);

  resetBtn();
};

const loser = () => {
  const winnerH = document.createElement("h3");
  winnerH.classList.add("loser");
  winnerH.textContent = "🎉 You didn’t win this time, but keep pushing! 💪";
  resultDiv.appendChild(winnerH);
  resetBtn();
};

const resetBtn = () => {
  const resetBtn = document.createElement("button");
  resetBtn.classList.add("btn-reseet");
  resetBtn.textContent = "Reset Game";
  resetBtn.addEventListener("click", () => {
    location.reload();
  });
  resultDiv.appendChild(resetBtn);
};
