const gridRows = 6;
const gridCols = 5;

const container = document.querySelector("#container");
console.log(container);
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
