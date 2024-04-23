document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const color = document.querySelector('.color');
    //const message = document.createElement('div');
    //message.id = 'message';
    //document.body.appendChild(message);

    let currentPlayer = 'red';
    let winner = [];
    let maxDepth = 7; // Pas trop élevé -> performances
    //let winnerDirectioon = [];
    const grid = Array.from({ length: 6 }, () => Array(7).fill(null));
    const playableRowTab = [5, 5, 5, 5, 5, 5, 5];

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
        if (winner[0] != null) return;

        const col = parseInt(this.dataset.col);
        const row = playableRowTab[col];
        
        if (row >= 0) {
            grid[row][col] = currentPlayer;
            playableRowTab[col]--;
            updateBoard(row, col);

            winner = getWinner(grid, row, col);

            if (winner[0] != null) {
                //winner = currentPlayer;
                //message.textContent = `Player ${currentPlayer.toUpperCase()} wins!`;
                if (winner[0] != "draw") {
                    checkDirection(grid, row, col, winner[1], winner[2]);
                }
                //message.textContent = "It's a draw!";
            } else {
                setTimeout(() => {
                    otherToPlay();
                }, 0);
            }
        }
    }

    function otherToPlay() {
        switchPlayer();

        let bestCol = getBestCol(grid, playableRowTab);
        let bestRow = playableRowTab[bestCol];
        
        grid[bestRow][bestCol] = currentPlayer;
        playableRowTab[bestCol]--;
        updateBoard(bestRow, bestCol);
        
        winner = getWinner(grid, bestRow, bestCol);

        if (winner[0] != null) {
            if (winner[0] != "draw") {
                checkDirection(grid, bestRow, bestCol, winner[1], winner[2]);
            }
        }
        
        switchPlayer();
    }
/*
    function getPlayableRow(testgrid, col) {
        for (let row = 5; row >= 0; row--) {
            if (testgrid[row][col] === null) {
                
                return row;
            }
        }
        return null; // Column is full
    }*/

    function updateBoard(row, col) {
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        cell.classList.remove('empty');
        cell.classList.add(currentPlayer);
        //cell.setAttribute("id", currentPlayer);
    }

    function switchPlayer() {
        currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
        //color.setAttribute("id", currentPlayer);
        //message.textContent = `Player ${currentPlayer.toUpperCase()}'s turn`;
    }

    function getWinner(testgrid, row, col) {
        if (checkDirection(testgrid, row, col, 0, 1)) { // Horizontal
            return [currentPlayer, 0, 1];
        } else if (checkDirection(testgrid, row, col, 1, 0)) { // Vertical
            return [currentPlayer, 1, 0];
        } else if (checkDirection(testgrid, row, col, 1, 1)) { // Diagonal /
            return [currentPlayer, 1, 1];
        } else if (checkDirection(testgrid, row, col, -1, 1)) { // Diagonal \
            return [currentPlayer, -1, 1];
        } else if (checkForDraw(testgrid)) {
            return ["draw", 0, 0];
        } else {
            return [null, 0, 0];
        }
        /*return (
            checkDirection(row, col, 0, 1) || // Horizontal
            checkDirection(row, col, 1, 0) || // Vertical
            checkDirection(row, col, 1, 1) || // Diagonal /
            checkDirection(row, col, -1, 1)   // Diagonal \
        );*/
    }

    function checkDirection(testgrid, row, col, rowDir, colDir) {
        const count = countConsecutive(testgrid, row, col, rowDir, colDir) + countConsecutive(testgrid, row, col, -rowDir, -colDir) + 1;
        return count >= 4;
    }

    function countConsecutive(testgrid, row, col, rowDir, colDir) {
        const color = testgrid[row][col];
        let count = 0;
        let newRow = row + rowDir;
        let newCol = col + colDir;

        while (newRow >= 0 && newRow < 6 && newCol >= 0 && newCol < 7 && testgrid[newRow][newCol] === color) {
            
            // entourer le gagnant
            if (winner[0] != null) {
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

    function checkForDraw(testgrid) {
        return testgrid.every(row => row.every(cell => cell !== null));
    }

    /*
    function getBestCol(grid) {
        const newGrid = grid.slice();

        function minimax(depth, maximizingPlayer, row, col) {
            
            const winner = getWinner(newGrid, row, col);
            if (winner[0] == 'yellow') {
                return 10 - depth; // Le joueur yellow (ordinateur) a gagné
            } else if (winner[0] == 'red') {
                return depth - 10; // Le joueur red (humain) a gagné
            } else if (winner[0] == "draw") {
                return 0; // Match nul
            }
            
            if (depth > maxDepth) {
                return 0;
            }

            if (maximizingPlayer) {
                let maxEval = -100;
                for (let testCol = 0; testCol < 7; testCol++) {
                    let testRow = getPlayableRow(newGrid, testCol);
                    if (testRow !== null) {
                        newGrid[testRow][testCol] = currentPlayer;
                        maxEval = Math.max(maxEval, minimax(depth + 1, false, testRow, testCol));
                        newGrid[testRow][testCol] = null;
                    }
                }
                return maxEval;
            } else {
                switchPlayer();
                let minEval = 100;
                for (let testCol = 0; testCol < 7; testCol++) {
                    let testRow = getPlayableRow(newGrid, testCol);
                    if (testRow !== null) {
                        newGrid[testRow][testCol] = currentPlayer;
                        minEval = Math.min(minEval, minimax(depth + 1, true, testRow, testCol));
                        newGrid[testRow][testCol] = null;
                    }
                }
                switchPlayer();
                return minEval;
            }
        }


        //const bestCols = [];
        let bestEval = -100;
        let bestPositions = [];

        for (let testCol = 0; testCol < 7; testCol++) {
            let testRow = getPlayableRow(newGrid, testCol);
            if (testRow !== null) {
                newGrid[testRow][testCol] = currentPlayer;
                const moveEval = minimax(0, false, testRow, testCol);
                newGrid[testRow][testCol] = null; // Pas sur que ce soit null

                if (moveEval > bestEval) {
                    bestEval = moveEval;
                    bestPositions = [];
                    bestPositions.push(testCol);
                } else if (moveEval == bestEval) {
                    bestPositions.push(testCol);
                }
            }
        }

        return bestPositions[Math.floor(Math.random() * bestPositions.length)];
        
    }*/
    

    
    function getBestCol(grid, playableRowTab) {
        const newGrid = grid.slice();
        const newPlayableRowTab = playableRowTab.slice();

        function minimax(depth, alpha, beta, maximizingPlayer, row, col) {
            const winner = getWinner(newGrid, row, col);
            if (winner[0] === 'yellow') {
                return 20 - depth; // Le joueur yellow (ordinateur) a gagné
            } else if (winner[0] === 'red') {
                return depth - 20; // Le joueur red (humain) a gagné
            } else if (winner[0] === "draw") {
                return 0; // Match nul
            }

            if (depth < 0) {
                depth = 0;
            }

            if (depth === maxDepth) {
                return 0;
            }

            if (maximizingPlayer) {
                let maxEval = -Infinity;
                let bestEvals = [];
                for (let testCol = 0; testCol < 7; testCol++) {
                    const testRow = newPlayableRowTab[testCol];
                    if (testRow >= 0) {
                        newGrid[testRow][testCol] = currentPlayer;
                        newPlayableRowTab[testCol]--;
                        //maxEval = Math.max(maxEval, minimax(depth + 1, alpha, beta, false, testRow, testCol));
                        moveEval = minimax(depth + 1, alpha, beta, false, testRow, testCol);

                        if (moveEval > maxEval) {
                            maxEval = moveEval;
                            bestEvals = [moveEval];
                        } else if (moveEval === maxEval) {
                            bestEvals.push(moveEval);
                        }

                        newGrid[testRow][testCol] = null;
                        newPlayableRowTab[testCol]++;
                        alpha = Math.max(alpha, maxEval);
                        if (beta <= alpha) {
                            break;
                        }
                    }
                }
                if (bestEvals.length > 6) {
                    maxEval = maxEval + 7;
                }
                return maxEval;
            } else {
                switchPlayer();
                let minEval = Infinity;
                let bestEvals = [];
                for (let testCol = 0; testCol < 7; testCol++) {
                    const testRow = newPlayableRowTab[testCol];
                    if (testRow >= 0) {
                        newGrid[testRow][testCol] = currentPlayer;
                        newPlayableRowTab[testCol]--;
                        //minEval = Math.min(minEval, minimax(depth + 1, alpha, beta, true, testRow, testCol));
                        moveEval = minimax(depth + 1, alpha, beta, true, testRow, testCol);

                        if (moveEval < minEval) {
                            minEval = moveEval;
                            bestEvals = [moveEval];
                        } else if (moveEval === minEval) {
                            bestEvals.push(moveEval);
                        }

                        newGrid[testRow][testCol] = null;
                        newPlayableRowTab[testCol]++;
                        beta = Math.min(beta, minEval);
                        if (beta <= alpha) {
                            break;
                        }
                    }
                }
                switchPlayer();
                if (bestEvals.length > 6) {
                    minEval = minEval - 7;
                }
                return minEval;
            }
        }

        let bestEval = -Infinity;
        let bestPositions = [];

        for (let testCol = 0; testCol < 7; testCol++) {
            const testRow = newPlayableRowTab[testCol];
            if (testRow >= 0) {
                newGrid[testRow][testCol] = currentPlayer;
                newPlayableRowTab[testCol]--;
                let moveEval = minimax(-10, -Infinity, Infinity, false, testRow, testCol); // depth = -10 pour que imedia soit plus lourd
                newGrid[testRow][testCol] = null;
                newPlayableRowTab[testCol]++;

                if (testCol > 1 && testCol < 5) {
                    moveEval++;
                }

                if (testRow == 0) {
                    moveEval = moveEval - 1;
                }

                if (moveEval > bestEval) {
                    bestEval = moveEval;
                    bestPositions = [testCol];
                } else if (moveEval === bestEval) {
                    bestPositions.push(testCol);
                }
            }
        }

        return bestPositions[Math.floor(Math.random() * bestPositions.length)];
    }
    

    createBoard();
    //message.textContent = `Player ${currentPlayer.toUpperCase()}'s turn`;
});