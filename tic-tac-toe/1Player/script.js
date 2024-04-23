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
    let maxDepth = 100;

    // clear grid
    const button = document.querySelector('.button');
    button.addEventListener('click', () => {
        location.reload();
    });

    // Let IA begin
    const buttonIA = document.querySelector('.buttonIA');
    if (cells)
    buttonIA.addEventListener('click', () => {
        if (cells.every(cell => cell.textContent === '')) {
            cells[Math.floor(Math.random() * 9)].textContent = 'O';
        }
    });

    // Set difficulty
    const easyButton = document.querySelector('.easyButton');
    const hardButton = document.querySelector('.hardButton');
    easyButton.addEventListener('click', () => {
        easyButton.setAttribute("id", "clicked");
        hardButton.setAttribute("id", "");
        maxDepth = 1;
    });
    hardButton.addEventListener('click', () => {
        easyButton.setAttribute("id", "");
        hardButton.setAttribute("id", "clicked");
        maxDepth = 100;
    });

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

    function handleCellClick() {
        if (winner != null) {
            return; // If the game is already won, do nothing
        }

        const row = this.dataset.row;
        const col = this.dataset.col;

        if (!isValidMove(row, col)) return; // If the cell is already taken, do nothing

        makeMove(row, col);

        winner = checkForWinner(cells)

        if (winner != null) {
            writeWinner();
            return;
        } else {
            otherToPlay();
        }
    }

    function otherToPlay() {
        let bestMove = getBestPosition(cells);
        cells[bestMove].textContent = 'O';

        winner = checkForWinner(cells)

        if (winner != null) {
            writeWinner();
            return;
        }
    }

    function writeWinner() {
        cells[winningCombinations[winnerPosition][0]].setAttribute("id", "cellWinner");
        cells[winningCombinations[winnerPosition][1]].setAttribute("id", "cellWinner");
        cells[winningCombinations[winnerPosition][2]].setAttribute("id", "cellWinner");
    }

    function isValidMove(row, col) {
        return !cells.find(cell => cell.dataset.row == row && cell.dataset.col == col).textContent;
    }

    function makeMove(row, col) {
        cells.find(cell => cell.dataset.row == row && cell.dataset.col == col).textContent = currentPlayer;
    }

    function checkForWinner(testcells) {
        for (let i = 0; i < winningCombinations.length; i++) {
            if (testcells[winningCombinations[i][0]].textContent && testcells[winningCombinations[i][0]].textContent === testcells[winningCombinations[i][1]].textContent && testcells[winningCombinations[i][0]].textContent === testcells[winningCombinations[i][2]].textContent) {
                winnerPosition = i;
                return testcells[winningCombinations[i][0]].textContent;
            }
        }
        return null;
    }

    function isBoardFull(testcells) {
        return testcells.every(cell => cell.textContent);
    }

    function getBestPosition(cells) {
        
        const newCells = cells.slice();

        function minimax(depth, maximizingPlayer) {
            // Si le jeu est terminé, retourner l'évaluation
            const winner = checkForWinner(newCells);
            if (winner === 'O') {
                return 10 - depth; // Le joueur 'O' (ordinateur) a gagné
            } else if (winner === 'X') {
                return depth - 10; // Le joueur 'X' (humain) a gagné
            } else if (isBoardFull(newCells)) {
                return 0; // Match nul
            }

            if (depth > maxDepth) {
                return 0;
            }

            if (maximizingPlayer) {
                let maxEval = -100;
                for (let i = 0; i < newCells.length; i++) {
                    if (newCells[i].textContent === '') {
                        newCells[i].textContent = 'O';
                        maxEval = Math.max(maxEval, minimax(depth + 1, false));
                        newCells[i].textContent = '';
                    }
                }
                return maxEval;
            } else {
                let minEval = 100;
                for (let i = 0; i < newCells.length; i++) {
                    if (newCells[i].textContent === '') {
                        newCells[i].textContent = 'X';
                        minEval = Math.min(minEval, minimax(depth + 1, true));
                        newCells[i].textContent = '';
                    }
                }
                return minEval;
            }
            
        }

        let bestMove = -1;
        let bestEval = -100;
        let bestPositions = [];
        for (let i = 0; i < newCells.length; i++) {
            if (newCells[i].textContent === '') {
                newCells[i].textContent = 'O';
                const moveEval = minimax(0, false);
                newCells[i].textContent = '';

                if (moveEval > bestEval) {
                    bestEval = moveEval;
                    bestPositions = [];
                    bestPositions.push(i);
                } else if (moveEval == bestEval) {
                    bestPositions.push(i);
                }
            }
        }

        return bestPositions[Math.floor(Math.random() * bestPositions.length)]
    }

});