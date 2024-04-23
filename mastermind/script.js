document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const verif = document.getElementById('verif');
    const grid = Array.from({ length: 12 }, () => Array(4).fill(8));
    //const verifGrid = Array.from({ length: 12 }, () => Array(4).fill(6));

    let end = false;

    const colors = ["red", "green", "blue", "yellow", "purple", "orange", "white", "pink", "empty"];
    const hidden = [];
    let lvl = 11;

    const button = document.querySelector('.button');
    button.addEventListener('click', () => {
        test();
    });

    function createCell(row, col) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.row = row;
        cell.dataset.col = col;
        cell.addEventListener('click', handleCellClick);
        board.appendChild(cell);
    }

    function createVerifCell(row, col) {
        const verifCell = document.createElement('div');
        verifCell.classList.add('verifCell');
        verifCell.dataset.row = row;
        verifCell.dataset.col = col;
        verif.appendChild(verifCell);
    }

    function createBoard() {
        for (let row = 0; row < 12; row++) {
            for (let col = 0; col < 4; col++) {
                createCell(row, col);
            }
        }
        for (let row = 0; row < 12; row++) {
            for (let col = 0; col < 4; col++) {
                createVerifCell(row, col);
            }
        }
    }

    function makeHidden() {
        for (let i = 0; i < 4; i++) {
            hidden.push(Math.floor(Math.random() * 8));
            //grid[0][i] = hidden[i];
            //updateBoard(0, i);
        }
    }

    function handleCellClick() {
        if (lvl < 0 || end) return;

        const col = parseInt(this.dataset.col);
        const row = lvl;

        grid[row][col] = (grid[row][col] + 1) % 9;
        updateBoard(row,col);

    }

    function updateBoard(row, col) {
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        cell.setAttribute("id", colors[grid[row][col]]);
    }

    function test() {
        const testTab = [];
        const marker = [true, true, true, true];
        const gridToTest = [];



        // test good piece good position
        for (let i = 0; i < 4; i++) {

            // return si c'est pas rempli
            if (grid[lvl][i] == 8) return;

            // remplire gridToTest
            gridToTest.push(grid[lvl][i]);

            if (hidden[i] == grid[lvl][i]) {
                testTab.push("red");
                marker[i] = false;
                gridToTest[i] = 8;
            }
        } 

        // test good peice wrong position
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (hidden[i] == gridToTest[j] /*&& marker[j]*/ && marker[i]) {
                    testTab.push("white");
                    marker[i] = false;
                    gridToTest[j] = 8;
                }
            }

            //if ((hidden[0] == grid[lvl][i] /*&& marker[0]*/ && marker[i]) || (hidden[1] == grid[lvl][i] /*&& marker[1]*/ && marker[i]) || (hidden[2] == grid[lvl][i] /*&& marker[2]*/ && marker[i]) || (hidden[3] == grid[lvl][i] /*&& marker[3]*/ && marker[i])) {
            //    testTab.push("white");
            //    marker[i] = false;
            //}
            
        }

        let i = 0;
        let testEnd = 0;

        if (testTab.length < 1) {
            for (let i = 0; i < 4; i++) {
                const verifCell = document.querySelector(`.verifCell[data-row="${lvl}"][data-col="${i}"]`);
                verifCell.classList.add("grey");
            }
        }

        testTab.forEach(function(color) {
            const verifCell = document.querySelector(`.verifCell[data-row="${lvl}"][data-col="${i}"]`);
            verifCell.classList.add(color);
            //verifGrid[lvl][i].setAttribute("id", color);
            i++;
            if (color == "red") {
                testEnd++;
            }
        });

        lvl--;

        if (testEnd >= 4) end = true;

    }

    createBoard();
    makeHidden();
});