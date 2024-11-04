const gridRows = 6;
const gridCols = 5;

const container = document.querySelector("#container");

const controlBar = document.createElement("div");
controlBar.classList.add("control-bar");

const colorBlindSwitch = document.createElement("span");
colorBlindSwitch.textContent = "Color blind mode ";

controlBar.appendChild(colorBlindSwitch);

const colorBlindBtn = document.createElement("button");
colorBlindBtn.id = "btn-toggle-color-blind";
colorBlindBtn.classList.add("off");
colorBlindBtn.textContent = "OFF";

controlBar.appendChild(colorBlindBtn);
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
