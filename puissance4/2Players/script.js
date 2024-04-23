document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const color = document.querySelector('.color');
    //const message = document.createElement('div');
    //message.id = 'message';
    //document.body.appendChild(message);

    let currentPlayer = 'red';
    let winner = null;
    let winnerDirectioon = [];
    const grid = Array.from({ length: 6 }, () => Array(7).fill(null));

    // clear grid
    const button = document.querySelector('.button');
    button.addEventListener('click', () => {
        location.reload();
    });

    function createCell(row, col) {
        const cell = document.createElement('div');
        cell.classList.add('cell', 'empty');
        cell.dataset.row = row;
        cell.dataset.col = col;
        cell.addEventListener('click', handleCellClick);
        board.appendChild(cell);
    }

    function createBoard() {
        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 7; col++) {
                createCell(row, col);
            }
        }
    }

    function handleCellClick() {
        if (winner != null) return;

        const col = parseInt(this.dataset.col);
        const row = getPlayableRow(col);
        grid[row][col] = currentPlayer;

        if (row !== null) {
            updateBoard(row, col);

            winner = getWinner(row, col);

            if (winner != null ) {
                //winner = currentPlayer;
                //message.textContent = `Player ${currentPlayer.toUpperCase()} wins!`;
                if (winner != "draw") {
                    checkDirection(row, col, winnerDirectioon[0], winnerDirectioon[1]);
                }
                //message.textContent = "It's a draw!";
            } else {
                switchPlayer();
            }
        }
    }

    function getPlayableRow(col) {
        for (let row = 5; row >= 0; row--) {
            if (grid[row][col] === null) {
                
                return row;
            }
        }
        return null; // Column is full
    }

    function updateBoard(row, col) {
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        cell.classList.remove('empty');
        cell.classList.add(currentPlayer);
        //cell.setAttribute("id", currentPlayer);
    }

    function switchPlayer() {
        currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
        color.setAttribute("id", currentPlayer);
        //message.textContent = `Player ${currentPlayer.toUpperCase()}'s turn`;
    }

    function getWinner(row, col) {
        if (checkDirection(row, col, 0, 1)) { // Horizontal
            winnerDirectioon.push(0);
            winnerDirectioon.push(1);
            return currentPlayer;
        } else if (checkDirection(row, col, 1, 0)) { // Vertical
            winnerDirectioon.push(1);
            winnerDirectioon.push(0);
            return currentPlayer;
        } else if (checkDirection(row, col, 1, 1)) { // Diagonal /
            winnerDirectioon.push(1);
            winnerDirectioon.push(1);
            return currentPlayer;
        } else if (checkDirection(row, col, -1, 1)) { // Diagonal \
            winnerDirectioon.push(-1);
            winnerDirectioon.push(1);
            return currentPlayer;
        } else {
            return null;
        }
        /*return (
            checkDirection(row, col, 0, 1) || // Horizontal
            checkDirection(row, col, 1, 0) || // Vertical
            checkDirection(row, col, 1, 1) || // Diagonal /
            checkDirection(row, col, -1, 1)   // Diagonal \
        );*/
    }

    function checkDirection(row, col, rowDir, colDir) {
        const count = countConsecutive(row, col, rowDir, colDir) + countConsecutive(row, col, -rowDir, -colDir) + 1;
        return count >= 4;
    }

    function countConsecutive(row, col, rowDir, colDir) {
        const color = grid[row][col];
        let count = 0;
        let newRow = row + rowDir;
        let newCol = col + colDir;

        while (newRow >= 0 && newRow < 6 && newCol >= 0 && newCol < 7 && grid[newRow][newCol] === color) {
            
            // entourer le gagnant
            if (winner != null) {
                //grid[newRow][newCol].setAttribute("id", "winner");
                const cell1 = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
                cell1.setAttribute("id", "winner");
                const cell = document.querySelector(`.cell[data-row="${newRow}"][data-col="${newCol}"]`);
                cell.setAttribute("id", "winner");
            }
            
            count++;
            newRow += rowDir;
            newCol += colDir;
        }

        return count;
    }

    function checkForDraw() {
        return grid.every(row => row.every(cell => cell !== null));
    }

    createBoard();
    //message.textContent = `Player ${currentPlayer.toUpperCase()}'s turn`;
});