const cells = document.querySelectorAll('.cell');
const status = document.getElementById('status');
const resetButton = document.getElementById('reset');
const canvas = document.getElementById('win-line');
const ctx = canvas.getContext('2d');
let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let winningCombo = null;

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
];

// Set canvas size
function resizeCanvas() {
    const boardContainer = document.getElementById('board-container');
    canvas.width = boardContainer.offsetWidth;
    canvas.height = boardContainer.offsetHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);

function handleCellClick(e) {
    const index = e.target.getAttribute('data-index');
    if (board[index] !== '' || !gameActive) return;

    board[index] = currentPlayer;
    e.target.textContent = currentPlayer;
    e.target.classList.add(currentPlayer.toLowerCase());

    if (checkWin()) {
        status.textContent = `Player ${currentPlayer} Wins!`;
        gameActive = false;
        highlightWinningCells();
        drawWinningLine();
        triggerConfetti();
        return;
    }

    if (board.every(cell => cell !== '')) {
        status.textContent = "It's a Draw!";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    status.textContent = `Player ${currentPlayer}'s Turn`;
}

function checkWin() {
    return winningCombinations.some(combination => {
        if (combination.every(index => board[index] === currentPlayer)) {
            winningCombo = combination;
            return true;
        }
        return false;
    });
}

function highlightWinningCells() {
    winningCombo.forEach(index => {
        cells[index].classList.add('winner');
    });
}

function drawWinningLine() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = '#FF4040'; // Red line for visibility
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';

    const cellSize = canvas.width / 3;
    const offset = cellSize / 2;

    const startCell = winningCombo[0];
    const endCell = winningCombo[2];

    const startX = (startCell % 3) * cellSize + offset;
    const startY = Math.floor(startCell / 3) * cellSize + offset;
    const endX = (endCell % 3) * cellSize + offset;
    const endY = Math.floor(endCell / 3) * cellSize + offset;

    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
}

function triggerConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#1E90FF', '#FFD700', '#FF4040']
    });
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    winningCombo = null;
    status.textContent = `Player ${currentPlayer}'s Turn`;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'winner');
    });
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}