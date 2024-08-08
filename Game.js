class Game {
    constructor() {
        this.end = false;
        this.board = [];
        this.directions = [
            [0, 1],  // Bottom
            [0, -1], // Top
            [1, 0],  // Right
            [-1, 0], // Left
        ];
        this.row = 3;
        this.col = 3;
        this.init();
    }

    init() {
        this.initBoard();
        this.generateSolvedBoard();
        this.initToDocument();
        this.listener();
    }

    initBoard() {
        this.board = Array.from({ length: 9 }, () => Array(9).fill(0));
    }

    generateSolvedBoard() {
        this.board.forEach((row, y) => {
            row.forEach((col, x) => {
                const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                let rand = this.getRandomNumber(nums);
                let boxCoord = {
                    y: Math.floor(y / 3),
                    x: Math.floor(x / 3)
                };
                while (!this.isValidInBox(rand.num, boxCoord, x, y) && nums.length > 0) {
                    nums.splice(rand.index, 1);
                    rand = this.getRandomNumber(nums);
                    if (nums.length < 1) {
                        rand.num = 0;
                    }
                }
                this.board[y][x] = rand.num;
            });
        });

        while (!this.isValidBoard()) {
            this.initBoard();
            this.generateSolvedBoard();
        }
    }

    isValidBoard() {
        return this.board.flat().every(col => col !== 0);
    }

    getRandomNumber(value) {
        const nums = value;
        const index = Math.floor(Math.random() * nums.length);
        return { num: nums[index], index: index };
    }

    isValidInBox(rand, coord, realX, realY) {
        let valid = true;
        let nums = [];
        let x = coord.x * this.col;
        let y = coord.y * this.row;
        let maxX = x + 2;
        let maxY = y + 2;

        for (let tempY = y; tempY <= maxY; tempY++) {
            for (let tempX = x; tempX <= maxX; tempX++) {
                nums.push(this.board[tempY][tempX]);
            }
        }

        nums.forEach(num => {
            if (num == rand) valid = false;
        });

        if (!this.isValidInBoard(rand, realX, realY)) valid = false;
        return valid;
    }

    isValidInBoard(rand, x, y) {
        let valid = true;
        let nums = [];
        this.directions.forEach(direction => {
            let [dirX, dirY] = direction;
            let tempX = x + dirX;
            let tempY = y + dirY;
            while (this.inBoard(tempX, tempY)) {
                nums.push(this.board[tempY][tempX]);
                tempX += dirX;
                tempY += dirY;
            }
        });

        nums.forEach(num => {
            if (num == rand) valid = false;
        });

        return valid;
    }

    inBoard(x, y) {
        return x >= 0 && y >= 0 && x < 9 && y < 9;
    }

    initToDocument() {
        let totalClue = Math.floor(Math.random() * 3) + 2;

        boxes.forEach((box, i) => {
            const y = Math.floor(i / 3);
            const x = i - (y * 3);
            const boxArr = this.getBoxArray(x, y);
            const fields = box.children;

            boxArr.forEach((val, idx) => {
                fields[idx].setAttribute('data-answer', val);
            });

            for (let i = 0; i < totalClue; i++) {
                let idx = Math.floor(Math.random() * 9);
                fields[idx].innerHTML = boxArr[idx];
                fields[idx].classList.add('active');
            }
        });
    }

    getBoxArray(x, y) {
        let nums = [];
        x = x * this.col;
        y = y * this.row;
        let maxX = x + 2;
        let maxY = y + 2;

        for (let tempY = y; tempY <= maxY; tempY++) {
            for (let tempX = x; tempX <= maxX; tempX++) {
                nums.push(this.board[tempY][tempX]);
            }
        }

        return nums;
    }

    listener() {
        const fields = document.querySelectorAll('.field');

        fields.forEach(field => {
            if (!field.classList.contains('active')) {
                field.addEventListener('click', () => {
                    let value = parseInt(field.innerHTML) || 0;
                    if (value + 1 > 9) value = 0;
                    value++;
                    field.innerHTML = value;
                    if (this.checkWin()) {
                        this.end = true;
                        const timeEl = document.querySelector('.time-played');
                        let minute = formatTime(Math.floor(time / 60));
                        let second = formatTime(time - (minute * 60));
                        timeEl.innerHTML = `${minute}:${second}`;
                        endModal.style.display = 'flex';
                    }
                });
            }
        });
    }

    checkWin() {
        let win = true;
        let fields = document.querySelectorAll('.field');
        fields.forEach(field => {
            let expected = field.getAttribute('data-answer');
            let current = field.innerHTML;
            if (expected && current != expected) {
                win = false;
            }
        });
        return win;
    }

    solve() {
        const solver = (board) => {
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    if (board[row][col] === 0) {
                        for (let num = 1; num <= 9; num++) {
                            if (this.isValidPlacement(board, row, col, num)) {
                                board[row][col] = num;
                                if (solver(board)) {
                                    return true;
                                }
                                board[row][col] = 0;
                            }
                        }
                        return false;
                    }
                }
            }
            return true;
        };

        solver(this.board);
        this.initToDocument();
    }

    isValidPlacement(board, row, col, num) {
        // Check the row
        for (let x = 0; x < 9; x++) {
            if (board[row][x] === num) {
                return false;
            }
        }

        // Check the column
        for (let x = 0; x < 9; x++) {
            if (board[x][col] === num) {
                return false;
            }
        }

        // Check the 3x3 box
        const startRow = row - row % 3;
        const startCol = col - col % 3;
        for (let r = startRow; r < startRow + 3; r++) {
            for (let c = startCol; c < startCol + 3; c++) {
                if (board[r][c] === num) {
                    return false;
                }
            }
        }

        return true;
    }
}
