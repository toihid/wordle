const gridRows = 7;
const gridCols = 5;

const container = document.querySelector("#container");

const controlBar = document.createElement("div");
controlBar.classList.add("control-bar");

// blind mode toggle

const blindMode = document.createElement("div");
blindMode.classList.add("blind-mode");

const colorBlindSwitch = document.createElement("span");
colorBlindSwitch.textContent = "Color blind mode ";
blindMode.appendChild(colorBlindSwitch);

const colorBlindBtn = document.createElement("button");
colorBlindBtn.id = "btn-toggle-color-blind";
colorBlindBtn.classList.add("off");
colorBlindBtn.textContent = "OFF";
blindMode.appendChild(colorBlindBtn);

controlBar.appendChild(blindMode);
container.appendChild(controlBar);

// dark mode
const darkMode = document.createElement("div");
darkMode.classList.add("dark-mode");

const darkModeSwitchText = document.createElement("span");
darkModeSwitchText.textContent = "Dark mode ";

darkMode.appendChild(darkModeSwitchText);

const darkModeBtn = document.createElement("button");
darkModeBtn.id = "btn-toggle-dark-mode";
darkModeBtn.classList.add("off");
darkModeBtn.textContent = "OFF";

darkMode.appendChild(darkModeBtn);
controlBar.appendChild(darkMode);

container.appendChild(controlBar);

const grid = document.createElement("div");

grid.classList.add("grid");
grid.style.gridTemplateColumns = `repeat(${gridCols},1fr)`;
grid.style.gridTemplateRows = `repeat(${gridRows},1fr)`;

for (let i = 0; i < gridCols * gridRows; i++) {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  cell.setAttribute("index", i);

  /* cell.addEventListener("input", (e) => {
    inputActions(e.target.value);
  }); */
  grid.appendChild(cell);
}

container.appendChild(grid);

const resultDiv = document.createElement("div");
resultDiv.classList.add("result");
container.appendChild(resultDiv);
