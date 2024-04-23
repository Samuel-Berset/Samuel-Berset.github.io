document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const cells = [];
    const winningCombinations = [
        // Rows
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        // Columns
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        // Diagonals
        [0, 4, 8],
        [2, 4, 6]
    ];
    let currentPlayer = 'X';
    let winner = null;
    let winnerPosition = null;

    // Create the board
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', handleCellClick);
            cells.push(cell);
            board.appendChild(cell);
        }
    }

    // clear grid
    const button = document.querySelector('.button');
    button.addEventListener('click', () => {
        location.reload();
    });

    function handleCellClick() {
        if (winner != null) {
            return; // If the game is already won, do nothing
        }

        const row = this.dataset.row;
        const col = this.dataset.col;

        if (!isValidMove(row, col)) return; // If the cell is already taken, do nothing

        makeMove(row, col);

        winner = checkForWinner()

        if (winnerPosition != null) {
            cells[winningCombinations[winnerPosition][0]].setAttribute("id", "cellWinner");
            cells[winningCombinations[winnerPosition][1]].setAttribute("id", "cellWinner");
            cells[winningCombinations[winnerPosition][2]].setAttribute("id", "cellWinner");
            return;
        } else {
            switchPlayer();
        }
    }

    function isValidMove(row, col) {
        return !cells.find(cell => cell.dataset.row == row && cell.dataset.col == col).textContent;
    }

    function makeMove(row, col) {
        cells.find(cell => cell.dataset.row == row && cell.dataset.col == col).textContent = currentPlayer;
    }

    function switchPlayer() {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }

    function checkForWinner() {
        for (let i = 0; i < winningCombinations.length; i++) {
            if (cells[winningCombinations[i][0]].textContent && cells[winningCombinations[i][0]].textContent === cells[winningCombinations[i][1]].textContent && cells[winningCombinations[i][0]].textContent === cells[winningCombinations[i][2]].textContent) {
                winnerPosition = i;
                return cells[winningCombinations[i][0]].textContent;
            }
        }
        return null;
    }

});