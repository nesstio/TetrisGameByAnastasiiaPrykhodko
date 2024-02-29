// 1. додати нові фігури
// 2 нові фігури
// 2. додати функцію котра буде повертати випадкові фігуру при оновленні
// 4. центрувати фігуру незалежно від ширини
const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS = 20;
const TETROMINO_NAMES = ["O", "J", "I", "Z", "S", "T"];

const TETROMINOES = {
  O: [
    [1, 1],
    [1, 1],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  T: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 0, 0],
  ],
};

function convertPositionToIndex(row, column) {
  console.log("row=" + row + ", cloumn =" + column);
  return row * PLAYFIELD_COLUMNS + column;
}

let playfield;
let tetromino;

function generatePlayField() {
  for (let i = 0; i < PLAYFIELD_COLUMNS * PLAYFIELD_ROWS; i++) {
    const div = document.createElement("div");
    document.querySelector(".grid").append(div);
  }

  playfield = new Array(PLAYFIELD_ROWS)
    .fill()
    .map(() => new Array(PLAYFIELD_COLUMNS).fill(0));
  //  console.log(playfield);
}
function generateTetromino() {
  const name = TETROMINO_NAMES[generateRandomShape()];
  const matrix = TETROMINOES[name];
  console.log(matrix);
  let column = Math.round((PLAYFIELD_COLUMNS - TETROMINOES[name].length) / 2);
  console.log(column);

  tetromino = {
    name,
    matrix,
    row: 0,
    column: column,
  };
}

function generateRandomShape() {
  let max = TETROMINO_NAMES.length - 1;

  let randomIndexOfTetorminoName = Math.round(Math.random() * max);
  // console.log(generateRandomShape());
  return randomIndexOfTetorminoName;
}

function placeTetramino() {
  const matrixSize = tetromino.matrix.length;

  for (let row = 0; row < matrixSize; row++) {
    for (let column = 0; column < matrixSize; column++) {
      if (tetromino.matrix[row][column]) {
        playfield[tetromino.row + row][tetromino.column + column] =
          tetromino.name;
      }
    }
  }
  generateTetromino();
}

generatePlayField();
generateTetromino();

const cells = document.querySelectorAll(".grid div");

function drawPlayField() {
  for (let row = 0; row < PLAYFIELD_ROWS; row++) {
    for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
      if (playfield[row][column] == 0) {
        continue;
      }

      const name = playfield[row][column];

      const cellIndex = convertPositionToIndex(row, column);
      // console.log(cellIndex);
      cells[cellIndex].classList.add(name);
    }
  }
}

function drawTetromino() {
  const name = tetromino.name;
  const tetrominoMatrixSize = tetromino.matrix.length;

  for (let row = 0; row < tetrominoMatrixSize; row++) {
    for (let column = 0; column < tetrominoMatrixSize; column++) {
      // Щоб подивитись результат алгоритму з функції rotateMatrix()!!!!!

      // const cellIndex = convertPositionToIndex(
      //     tetromino.row + row,
      //     tetromino.column + column
      // );
      // cells[cellIndex].innerHTML = showRotated[row][column];
      // -----------------------
      if (!tetromino.matrix[row][column]) continue;

      const cellIndex = convertPositionToIndex(
        tetromino.row + row,
        tetromino.column + column
      );

      cells[cellIndex].classList.add(name);
    }
    //column
  }
  //row
}

function draw() {
  cells.forEach((cell) => cell.removeAttribute("class"));
  drawPlayField();
  drawTetromino();
}
let showRotated = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

function rotateTetramino() {
  const oldMatrix = tetromino.matrix;
  const rotatetedMatrix = rotateMatrix(tetromino.matrix);
  showRotated = rotateMatrix(showRotated);
  tetromino.matrix = rotatetedMatrix;
  if(!isValid()){
    tetromino.matrix = oldMatrix;
  }
}
draw();

function rotate() {
  rotateTetramino();
  draw();
}

document.addEventListener("keydown", onKeyDown);
function onKeyDown(e) {
  //   console.log(e);
  switch (e.key) {
    case "ArrowUp":
      rotate();
      break;
    case "ArrowDown":
      moveTetrominoDown();
      break;
    case "ArrowLeft":
      moveTetrominoLeft();
      break;
    case "ArrowRight":
      moveTetrominoRight();
      break;
  }
  draw();
}

function rotateMatrix(matrixTetromino) {
  const N = matrixTetromino.length;
  const rotateMatrix = [];
  for (let i = 0; i < N; i++) {
    rotateMatrix[i] = [];
    for (let j = 0; j < N; j++) {
      rotateMatrix[i][j] = matrixTetromino[N - j - 1][i];
    }
  }
  
  
  return rotateMatrix;
}

function moveTetrominoDown() {
  tetromino.row += 1;
  if (!isValid()) {
    tetromino.row -= 1;
    placeTetramino();
  }
}
function moveTetrominoLeft() {
  tetromino.column -= 1;
  if (!isValid()) {
    tetromino.column += 1;
  }
}
function moveTetrominoRight() {
  tetromino.column += 1;
  if (!isValid()) {
    tetromino.column -= 1;
  }
}

function isValid() {
  const matrixSize = tetromino.matrix.length;
  for (let row = 0; row < matrixSize; row++) {
    for (let column = 0; column < matrixSize; column++) {
      // if(tetromino.matrix[row][column]){continue;}
      if (isOutsideOfGameboard(row, column)) {
        return false;
      }
      if (hasCollisions(row, column)) {
        return false;
      }
    }
  }
  return true;
}

function isOutsideOfGameboard(row, column) {
  return tetromino.matrix[row][column] && (
    tetromino.column + column < 0 ||
    tetromino.column + column >= PLAYFIELD_COLUMNS ||
    tetromino.row + row >= PLAYFIELD_ROWS
  );
}
function hasCollisions(row, column) {
  return tetromino.matrix[row][column] &&
  playfield[tetromino.row + row][tetromino.column + column];
}
