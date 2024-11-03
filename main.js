// pre defined variables for manipulate calculation
const userInputs = [];
let currentIndex = 0;
let currentRow = 1;
let correctWord = "large";

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

readWords().then((result) => {
  randomWord = result[Math.floor(Math.random() * result.length)];
  onCorrectWordLoaded(randomWord);
});

const onCorrectWordLoaded = (randomWord) => (correctWord = randomWord);

const onScreenKeyboard = document.querySelectorAll("#keyboard button");
onScreenKeyboard.forEach((button) => {
  button.addEventListener("click", (e) => {
    value = e.target.getAttribute("data-value");
    actionSwitcher(value.toLowerCase());
  });
});

document.addEventListener("keydown", (e) => {
  val = e.key.toLowerCase();
  const isAlphabet = /^[a-zA-Z]$/.test(val);
  (isAlphabet || val == "backspace" || val == "enter") && actionSwitcher(val);
});

const actionSwitcher = (val) => {
  console.log(val);
  val === "enter"
    ? enterAction(val)
    : val === "backspace"
    ? deleteAction()
    : inputAction(val);
};

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

const inputAction = (val) => {
  const rowNum = Math.ceil(userInputs.length / gridCols);
  if (userInputs.length >= gridCols && userInputs.length % gridCols === 0) {
    // if enter to new row then write the letter
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

const displayMessage = (message) => {
  const messageBox = document.createElement("div");
  messageBox.classList.add("message-box");
  messageBox.textContent = message;
  setTimeout(function () {
    messageBox.style.display = "none"; // Hide the message
  }, 1000);
  container.appendChild(messageBox);
};

async function isValidWord(word) {
  console.log(word);
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

const checkWord = (word) => {
  console.log("checkWord", word);
  const inputsElements = document.querySelectorAll(".grid .cell");
  for (let i = 0; i < gridCols; i++) {
    let index = gridCols * currentRow + i;
    console.log(index);
    inputsElements[gridCols * currentRow + i].classList.add("current-row");
  }

  currentRow++;

  console.log("correctWord", correctWord);
  checkLetter(word);
};

const checkLetter = (word) => {
  let wordArray = [...word];
  let correctWordArray = [...correctWord];
  const commonLetters = wordArray.filter((value) =>
    correctWordArray.includes(value)
  );
  console.log(commonLetters);

  wordArray.forEach((letter, letterIndex) => {
    correctWordArray.forEach((correctLetter, correctLetterIndex) => {
      if (letter === correctLetter && letterIndex === correctLetterIndex) {
        console.log("correct letter and position", letter);
        highlightCorrectPosition(letterIndex);
      }
      if (letter === correctLetter) {
        console.log("correct letter", letter);
        highlightCorrectLetter(letterIndex);
      }
    });
  });
};

const highlightCorrectLetter = (letterIndex) => {
  const letterPosition = (currentRow - 1) * gridCols - gridCols + letterIndex;
  const inputsElements = document.querySelectorAll(".grid .cell");
  inputsElements[letterPosition].classList.add("correct-letter");
};

const highlightCorrectPosition = (letterIndex) => {
  const letterPosition = (currentRow - 1) * gridCols - gridCols + letterIndex;
  const inputsElements = document.querySelectorAll(".grid .cell");
  inputsElements[letterPosition].classList.add("correct-position");
};
