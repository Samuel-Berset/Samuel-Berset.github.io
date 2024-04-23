document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('sudoku-grid');
    for (let i = 0; i < 81; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 1;
        input.pattern = '[1-9]';
        input.addEventListener('input', function() {
            this.value = this.value.replace(/[^1-9]/g, ''); // Empêche l'entrée de tout caractère autre que 1-9
        });
        grid.appendChild(input);
    }

    document.getElementById('solve-btn').addEventListener('click', () => {
        const grid = getGrid();
        if (solveSudoku(grid, 0, 0)) {
            updateGrid(grid);
        } else {
            alert('Pas de solution trouvée');
        }
    });
});

function getGrid() {
    const inputs = document.querySelectorAll('#sudoku-grid input');
    const grid = [];
    let row = [];
    inputs.forEach((input, index) => {
        row.push(input.value ? parseInt(input.value) : 0);
        if ((index + 1) % 9 === 0) {
            grid.push(row);
            row = [];
        }
    });
    return grid;
}

function updateGrid(grid) {
    const inputs = document.querySelectorAll('#sudoku-grid input');
    inputs.forEach((input, index) => {
        const row = Math.floor(index / 9);
        const col = index % 9;
        input.value = grid[row][col] === 0 ? '' : grid[row][col];
    });
}

function isSafe(grid, row, col, num) {
    for (let x = 0; x < 9; x++) {
        if (grid[row][x] === num || grid[x][col] === num) {
            return false;
        }
    }
    const startRow = row - row % 3;
    const startCol = col - col % 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[i + startRow][j + startCol] === num) {
                return false;
            }
        }
    }
    return true;
}

function solveSudoku(grid, row, col) {
    if (row === 8 && col === 9) {
        return true;
    }
    if (col === 9) {
        row++;
        col = 0;
    }
    if (grid[row][col] !== 0) {
        return solveSudoku(grid, row, col + 1);
    }
    for (let num = 1; num <= 9; num++) {
        if (isSafe(grid, row, col, num)) {
            grid[row][col] = num;
            if (solveSudoku(grid, row, col + 1)) {
                return true;
            }
            grid[row][col] = 0;
        }
    }
    return false;
}