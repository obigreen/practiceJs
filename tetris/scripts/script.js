const canvas = document.getElementById("tetris-board")
const nextPieceCanvas = document.getElementById("next-piece");
const ctx = canvas.getContext("2d")
const nextCtx = nextPieceCanvas.getContext("2d");
//=========
const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-button");

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;
const GAME_SPEED = 500;

let board = [];
let currentPiece;
let nextPiece;
let gameInterval;
let gameRunning = false
let score = 0;
let currentLevel = 1;


//Фигуры
const pieces = [
    {shape: [[1, 1, 1, 1]], color: "#FF0000"},// I-образная фигура
    {shape: [[1, 1], [1, 1]], color: "#00FF00"},// O-образная фигура
    {shape: [[0, 1, 1], [1, 1, 0]], color: "#0000FF"},// Z-образная фигура
    {shape: [[1, 1, 0], [0, 1, 1]], color: "#FFFF00"},// S-образная фигура
    {shape: [[1, 1, 1], [0, 1, 0]], color: "#FF00FF"},// T-образная фигура
    {shape: [[1, 1, 1], [1, 0, 0]], color: "#FFA500"},// L-образная фигура
    {shape: [[1, 1, 1], [0, 0, 1]], color: "#00FFFF"} // J-образная фигура
]

//Инициализируем поле
function initBoard() {
    board = [];
    for (let r = 0; r < ROWS; r++) {
        board[r] = [];
        for (let c = 0; c < COLS; c++) {
            board[r][c] = {value: 0, color: null};
        }
    }
}

//Создаем стандарт отображения элементов фигуры если есть value в пересечении сетки
function drawBoard() {
    ctx.fillStyle = "#fff";
    //начало полня в левом верхнем углу и растянуто по всей дине и ширине
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //Квадратик фигуры в точки пересечения
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (board[r][c].value) {

                ctx.fillStyle = board[r][c].color;
                ctx.fillRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);

                ctx.stokeStyle = "black";
                ctx.strokeRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }


    //Отображаем фигуру в нужном месте если она есть
    if (currentPiece) {
        ctx.fillStyle = currentPiece.color;
        for (let r = 0; r < currentPiece.shape.length; r++) {
            for (let c = 0; c < currentPiece.shape[r].length; c++) {
                if (currentPiece.shape[r][c]) {
                    ctx.fillRect((currentPiece.x + c) * BLOCK_SIZE, (currentPiece.y + r) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                    ctx.stokeStyle = "black";
                    ctx.strokeRect((currentPiece.x + c) * BLOCK_SIZE, (currentPiece.y + r) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                }
            }
        }
    }
}

//Создаем стандарт изображения элементов для холста со следующей фигурой
function drawNextPiece() {
    nextCtx.fillStyle = "#fff";
    nextCtx.fillRect(0, 0, nextPieceCanvas.width, nextPieceCanvas.height);

    if (nextCtx) {
        nextCtx.fillStyle = nextPiece.color;

        const offsetX = (nextPieceCanvas.width - nextPiece.shape[0].length * BLOCK_SIZE) / 2
        const offsetY = (nextPieceCanvas.width - nextPiece.shape.length * BLOCK_SIZE) / 2

        for (let r = 0; r < nextPiece.shape.length; r++) {
            for (let c = 0; c < nextPiece.shape[r].length; c++) {
                if (nextPiece.shape[r][c]) {
                    nextCtx.fillRect(offsetX + c * BLOCK_SIZE, offsetY + r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                    nextCtx.stokeStyle = "black";
                    nextCtx.strokeRect(offsetX + c * BLOCK_SIZE, offsetY + r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                }
            }
        }
    }
}

//Функция для проверки столкновения с границами поля и элементами
function collision(x, y, shape) {
    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c]) {
                const newX = x + c;
                const newY = y + r;
                if (newX < 0 || newX >= COLS || newY >= ROWS || (newY >= 0 && board[newY][newX].value)) {
                    return true;
                }
            }
        }
    }
    return false;
}

//Функция изменения состояния игры
function update() {

    if (!collision(currentPiece.x, currentPiece.y + 1, currentPiece.shape)) {
        currentPiece.y++
    } else {
        merge();
        clearLines();
        currentPiece = nextPiece
        nextPiece = newPiece()
        drawNextPiece()

        if (collision(currentPiece.x, currentPiece.y, currentPiece.shape)) {
            gameOver();
            return;
        }
    }
    drawBoard()
}

//Фиксируем фигуру долетевшию до низа или другой фигруы
function merge() {
    for (let r = 0; r < currentPiece.shape.length; r++) {
        for (let c = 0; c < currentPiece.shape[r].length; c++) {
            if (currentPiece.shape[r][c]) {
                const boardX = currentPiece.x + c;
                const boardY = currentPiece.y + r;

                if (boardY >= 0) {
                    board[boardY][boardX] = {
                        value: 1,
                        color: currentPiece.color,
                    }
                }
            }
        }
    }
}

//Удаляем строки и начисляем очки
function clearLines() {
    let linesCleared = 0;

    for (let r = ROWS - 1; r >= 0; r--) {
        if (board[r].every(cell => cell.value)) {
            board[r].forEach(cell => (cell.color = "gray"));
            linesCleared++;
        }
    }

    if (linesCleared > 0) {
        setTimeout(() => {
            for (let r = ROWS - 1; r >= 0; r--) {
                if (board[r].every(cell => cell.color === "gray")) {
                    board.splice(r, 1);
                    board.unshift(new Array(COLS).fill({ value: 0, color: null }));
                    r++;
                }
            }
            const points = linesCleared === 1 ? 100 : linesCleared === 2 ? 300 : linesCleared === 3 ? 500 : 800;
            score += points;
            document.getElementById("score-value").textContent = String(score);

            // Проверка на увеличение уровня
            const newLevel = Math.floor(score / 300) + 1;
            if (newLevel > currentLevel) {
                currentLevel = newLevel;
                increaseGameSpeed();
            }

            drawBoard()
        }, 200)
    }
}

function increaseGameSpeed() {
    clearInterval(gameInterval);

    const newSpeed = Math.max(GAME_SPEED - currentLevel * 50);
    gameInterval = setInterval(update, newSpeed);

    console.log(`Level: ${currentLevel}, Speed: ${newSpeed}ms`);
}



//Заканчиваем игру, обновляем поле, выводим сообщение
function gameOver() {
    clearInterval(gameInterval)
    gameRunning = false

    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "36px VT323";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2)

    restartButton.style.display = "block";
}


function moveLeft() {
    if (!collision(currentPiece.x - 1, currentPiece.y, currentPiece.shape)) {
        currentPiece.x--;
        drawBoard()
    }
}

function moveRight() {
    if (!collision(currentPiece.x + 1, currentPiece.y, currentPiece.shape)) {
        currentPiece.x++;
        drawBoard()
    }
}

function moveDown() {
    if (!collision(currentPiece.x, currentPiece.y + 1, currentPiece.shape)) {
        currentPiece.y++;
        drawBoard()
    }
}

function rotatePiece() {
    const rotated = rotate(currentPiece.shape)
    if (!collision(currentPiece.x, currentPiece.y, rotated)) {
        currentPiece.shape = rotated;
        drawBoard()
    }
}


function rotate(shape) {

    const newShape = [];
    for (let c = 0; c < shape[0].length; c++) {
        const newRow = [];


        //Так не работало
        // for (let r = shape.length - 1; r >= 0; r++) {
        //     newRow.push(shape[r][c]);
        // }

        for (let r = shape.length - 1; r >= 0; r--) {
            if (!shape[r]) {
                return shape; // Останавливаем выполнение
            }
            newRow.push(shape[r][c]);
        }
        newShape.push(newRow);
    }
    return newShape;
}

document.addEventListener("keydown", event => {
    if (!gameRunning) return;

    switch (event.code) {
        case "KeyA":
            moveLeft();
            break;
        case "KeyD":
            moveRight();
            break;
        case "KeyS":
            moveDown();
            break;
        case "KeyW":
            rotatePiece();
            break;
    }
})


//Создаем вызов рандомной фигуры из массива фигур и центрируем по колонкам и по самим элементам фигуры
function newPiece() {
    const pieceIndex = Math.floor(Math.random() * pieces.length);
    const piece = pieces[pieceIndex]
    return {
        shape: piece.shape,
        color: piece.color,
        x: Math.floor(COLS / 2) - Math.floor(piece.shape[0].length / 2),
        y: 0
    }
}

//Стартуем игру активируя функции
startButton.addEventListener("click", () => {
    if (gameRunning) return;
    initBoard();
    currentPiece = newPiece();
    nextPiece = newPiece();
    gameRunning = true;
    drawBoard();
    drawNextPiece();
    gameInterval = setInterval(update, GAME_SPEED);
})

restartButton.addEventListener("click", () => {
    restartButton.style.display = "none";
    startButton.style.display = "block";
    gameRunning = false;
    score = 0;
    document.getElementById("score-value").textContent = score;
    initBoard();
    drawBoard();
    drawNextPiece()
})

const sounds = {
    backgroundMusic: new Howl({
        src: ["https://archive.org/download/TetrisThemeMusic/Tetris.mp3"],
        loop: true,
        volume: 0.5,
    }),
};

document.getElementById("music-toggle").addEventListener("change", (e) => {
    if (e.target.checked) {
        sounds.backgroundMusic.play();
    } else {
        sounds.backgroundMusic.pause();
    }
});


initBoard()
//В переменной currentPiece мы вызываем функцию которая вызывает рандомную фигуру и центирует ее для последующей передачи
//в drawBoard() что бы правильно и в нужном месте отобразить
// currentPiece = newPiece()
// nextPiece = newPiece()
drawBoard()

