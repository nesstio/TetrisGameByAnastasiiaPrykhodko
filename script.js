// 1. додати нові фігури
// 2 нові фігури
// 2. додати функцію котра буде повертати випадкові фігуру при оновленні
// 4. центрувати фігуру незалежно від ширини
const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS = 20;
const TETROMINO_NAMES = [
    'O',
    'J',
    'I',
    'Z',
    'S', 
    'T'
];

const TETROMINOES = {
    'O': [
        [1, 1],
        [1, 1]
    ], 
    'J':[
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    'I':[
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    'Z':[
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    'S':[
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    'T':[
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0]
    ],
}

function convertPositionToIndex(row, column) {
    console.log('row='+ row + ', cloumn =' + column);
    return row * PLAYFIELD_COLUMNS + column;
}

let playfield;
let tetromino;
let indexOfTetorminoName = generateRandomShape();

function generateRandomShape() {
    let randomIndexOfTetorminoName;
    let min = 0;
    let max = TETROMINO_NAMES.length - 1;

    randomIndexOfTetorminoName = Math.round(Math.random() * max);
    // console.log(generateRandomShape());
    return randomIndexOfTetorminoName;
}
function centerShape() {
    let result = Math.round((PLAYFIELD_COLUMNS - TETROMINOES[TETROMINO_NAMES[indexOfTetorminoName]].length)/2);
    // console.log(result);
    return result;
}
function generateTetromino() {
const name = TETROMINO_NAMES[indexOfTetorminoName];
const matrix = TETROMINOES[name];
// console.log(matrix);

    tetromino = {
        name,
        matrix,
        row:0, 
        column: centerShape(),
    }
}

function placeTetromino(){
    const matrixSize = tetromino.matrix.length;
    for(let row = 0; row < matrixSize; row++){
        for(let column = 0; column < matrixSize; column++){
            playfield[tetromino.row + row][tetromino.column + column] = tetromino.name;
        }
    }
    generateTetromino();
}
function generatePlayField() {
     for (let i = 0; i < PLAYFIELD_COLUMNS * PLAYFIELD_ROWS; i++) {
        const div = document.createElement('div');
        document.querySelector('.grid').append(div);
     }

     playfield = new Array(PLAYFIELD_ROWS).fill()
        .map(()=> new Array(PLAYFIELD_COLUMNS).fill(0));
    //  console.log(playfield);
}
generatePlayField();
generateTetromino();

const cells = document.querySelectorAll('.grid div');

function drawPlayField(){
    // cells[15].classList.add('O');
    
    for(let row = 0; row < PLAYFIELD_ROWS; row++){
        for(let column = 0; column < PLAYFIELD_COLUMNS; column++){
            if(playfield[row][column] == 0){continue};

            const name = playfield[row][column];
            const cellIndex = convertPositionToIndex(row, column);      
            // console.log(cellIndex); 
            cells[cellIndex].classList.add(name);
        }
    }
}

function drawTetromino(){
    const name = tetromino.name;
    const tetrominoMatrixSize = tetromino.matrix.length;

    for(let row = 0; row < tetrominoMatrixSize; row++){
        for(let column = 0; column < tetrominoMatrixSize; column++ ){
           

            const cellIndex = convertPositionToIndex(
                tetromino.row + row,
                tetromino.column + column
            );       
            cells[cellIndex].innerHTML = showRotated[row][column];
            if(!tetromino.matrix[row][column]){continue};
            cells[cellIndex].classList.add(name);

        }
        //column
    }
    //row
}

function draw(){
    cells.forEach(cell => cell.removeAttribute('class'));
    drawPlayField();
    drawTetromino();
}
draw();

function rotate(){
    rotateTetromino();
    draw();
}

document.addEventListener('keydown', onKeyDown);
function onKeyDown(e){
    console.log(e);
    switch (e.key) {
        case 'ArrowUp':
            rotate(); 
            
            break;
        case 'ArrowDown':
            moveTetrominoDown(); 
            
            break;
        case 'ArrowLeft':
                moveTetrominoLeft();
                break;    
        case 'ArrowRight':
                    moveTetrominoRight();
                    break;        
    }
    draw();
}

let showRotated = [
    [1,2,3],
    [4,5,6],
    [7,8,9]
]
function rotateTetromino(){
    const oldmatrix = tetromino.matrix;
    const rotatedMatrix = rotateMatrix(tetromino.matrix);
    showRotated = rotateMatrix(showRotated);
    tetromino.matrix = rotatedMatrix;
}

function rotateMatrix(matrixTetromino){
    const N = matrixTetromino.length;
    const rotateMatrix = [];
    for(let i = 0; i < N; i++){
        for(let j = 0; j < N; j++){
            rotateMatrix[i][j] = matrixTetromino[N - j - 1][1];
        }

    }
    return rotateMatrix;
}

function moveTetrominoDown() {
    tetromino.row += 1;
    drawTetromino();
    if(!isValid()){
        tetromino.row -= 1;
        placeTetromino();
    }
}
function moveTetrominoLeft() {
    tetromino.column -= 1;
    if(!isValid()){
        tetromino.column += 1;
    }
}
function moveTetrominoRight() {
    tetromino.column += 1;
    if(!isValid()){
        tetromino.column -= 1;
    }
}

function isValid() {
    const matrixSize = tetromino.matrix.length;
    for(let row = 0; row < matrixSize; row++){
        for(let column = 0; column < matrixSize; column++){
            // if(tetromino.matrix[row][column]){continue};
            if(isOutsideOfGameBoard(row, column)){
                return false;
            }
            if(hasCollisions(row, column)){return false;}
        
        }
    }
    return true;
}
function isOutsideOfGameBoard(row, column) {

    return tetromino.column + column < 0 || 
           tetromino.column + column >= PLAYFIELD_COLUMNS ||
           tetromino.row + row >= playfield.length;
}
function hasCollisions(row, column){
    return playfield[tetromino.row + row][tetromino.column + column]
}