// pre defined variables for manipulate calculation
const userInputs = [];
let currentIndex = 0;
let currentRow = 1;
let correctWord = "";

// read json form file
async function readWords() {
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
}

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

// getting user input from keybord
document.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    e.preventDefault(); // Prevent the default tabbing action
  }
  val = e.key.toLowerCase();
  const isAlphabet = /^[a-zA-Z]$/.test(val);
  (isAlphabet || val == "backspace" || val == "enter") && actionSwitcher(val);
});

// swishBoard to managing Actions
const actionSwitcher = (val) => {
  val === "enter"
    ? enterAction(val)
    : val === "backspace"
    ? deleteAction()
    : inputAction(val);
};

// wtire write a alphabet in the cell and updated the array of userInputs
const writeLetter = (val) => {
  userInputs.push(val);
  const currentIndex = userInputs.length - 1;
  const nextIndex = currentIndex + 1;
  const inputsElements = document.querySelectorAll(".grid .cell");
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
  if (userInputs.length >= gridCols && userInputs.length % gridCols === 0) {
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
  if (deleteTill < userInputs.length || deleteTill === currentRow * gridCols) {
    deleteLetter();
  }
};

// manage actions when clicking enter button
const enterAction = () => {
  let checkAnyIputINNewRow = currentRow * gridCols - gridCols;
  if (
    userInputs.length % gridCols !== 0 ||
    userInputs.length <= checkAnyIputINNewRow
  ) {
    displayMessage("Too short!");
  } else {
    const word = userInputs.slice(-5).join("");
    isValidWord(word).then((result) => {
      if (!result) {
        displayMessage("Word is not exist");
      } else {
        checkWord(word);
      }
    });
  }
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
const checkWord = (word) => {
  const inputsElements = document.querySelectorAll(".grid .cell");
  for (let i = 0; i < gridCols; i++) {
    let index = gridCols * currentRow + i;
    inputsElements[gridCols * currentRow + i].classList.add("current-row");
  }
  currentRow++;
  checkLetter(word);
};

// logic of comparing between user guase and the computer choosen
const checkLetter = (word) => {
  let wordArray = [...word];
  let correctWordArray = [...correctWord];
  const commonLetters = wordArray.filter((value) =>
    correctWordArray.includes(value)
  );

  wordArray.forEach((letter, letterIndex) => {
    correctWordArray.forEach((correctLetter, correctLetterIndex) => {
      if (letter === correctLetter && letterIndex === correctLetterIndex) {
        highlightCorrectPosition(letterIndex);
      }
      if (letter === correctLetter) {
        highlightCorrectLetter(letterIndex);
      }
    });
  });
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
