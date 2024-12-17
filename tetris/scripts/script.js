const canvas = document.getElementById("tetris-board")
const ctx = canvas.getContext("2d")
const ROWS = 20;
const COLS = 10;
let board = [];


function initBoard() {
    board = [];
    for (let r = 0; r < ROWS; r++) {
        board[r] = [];
        for (let c = 0; c < COLS; c++) {
            board[r][c] = {value: 0, color: null};
        }
    }
}

function drawBoard() {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.with, canvas.height);

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (board[r][c].value) {
                ctx.fillStyle = board[r][c].color;

                ctx.fillRect(
                    c * BLOCK_SIZE,
                    r * BLOCK_SIZE,
                    BLOCK_SIZE,
                    BLOCK_SIZE
                );

                ctx.stokeStyle = "black";
                ctx.strokeRect(
                    c * BLOCK_SIZE,
                    r * BLOCK_SIZE,
                    BLOCK_SIZE,
                    BLOCK_SIZE
                )
            }
        }
    }
}

initBoard()
drawBoard()

