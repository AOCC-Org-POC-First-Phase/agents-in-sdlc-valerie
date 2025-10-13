/**
 * Modern Sudoku Game Implementation
 * Features: Puzzle generation, solving, validation, timer, and beautiful UI
 */

class SudokuGame {
    constructor() {
        this.grid = [];
        this.solution = [];
        this.selectedCell = null;
        this.selectedNumber = null;
        this.startTime = null;
        this.timerInterval = null;
        this.errorCount = 0;
        this.gameCompleted = false;
        
        this.initializeGrid();
        this.bindEvents();
        this.generateNewGame();
    }

    /**
     * Initialize empty 9x9 grid
     */
    initializeGrid() {
        this.grid = Array(9).fill().map(() => Array(9).fill(0));
        this.solution = Array(9).fill().map(() => Array(9).fill(0));
    }

    /**
     * Bind all event listeners
     */
    bindEvents() {
        document.getElementById('newGame').addEventListener('click', () => this.generateNewGame());
        document.getElementById('solveGame').addEventListener('click', () => this.solveCurrentGame());
        document.getElementById('checkGame').addEventListener('click', () => this.checkCurrentState());
        document.getElementById('clearGame').addEventListener('click', () => this.clearUserInput());
        document.getElementById('newGameFromWin').addEventListener('click', () => {
            this.hideWinModal();
            this.generateNewGame();
        });

        // Number pad events
        document.querySelectorAll('.number-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const number = parseInt(e.target.dataset.number);
                this.selectNumber(number);
            });
        });

        // Modal click outside to close
        document.getElementById('winModal').addEventListener('click', (e) => {
            if (e.target.id === 'winModal') {
                this.hideWinModal();
            }
        });
    }

    /**
     * Create the visual grid
     */
    createVisualGrid() {
        const gridContainer = document.getElementById('sudokuGrid');
        gridContainer.innerHTML = '';

        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                if (this.grid[row][col] !== 0) {
                    cell.textContent = this.grid[row][col];
                    cell.classList.add('prefilled');
                }
                
                cell.addEventListener('click', () => this.selectCell(row, col));
                gridContainer.appendChild(cell);
            }
        }
    }

    /**
     * Select a cell on the grid
     */
    selectCell(row, col) {
        if (this.gameCompleted) return;
        
        // Don't select prefilled cells
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (cell.classList.contains('prefilled')) return;

        // Remove previous selection
        document.querySelectorAll('.cell.selected').forEach(c => c.classList.remove('selected'));
        
        // Select new cell
        cell.classList.add('selected');
        this.selectedCell = { row, col };

        // If a number is selected, fill it in
        if (this.selectedNumber !== null) {
            this.fillNumber(row, col, this.selectedNumber);
        }
    }

    /**
     * Select a number from the number pad
     */
    selectNumber(number) {
        if (this.gameCompleted) return;

        // Remove previous number selection
        document.querySelectorAll('.number-btn.selected').forEach(btn => btn.classList.remove('selected'));
        
        // Select new number
        if (number !== 0) {
            document.querySelector(`[data-number="${number}"]`).classList.add('selected');
        }
        
        this.selectedNumber = number;

        // If a cell is selected, fill it in
        if (this.selectedCell) {
            this.fillNumber(this.selectedCell.row, this.selectedCell.col, number);
        }
    }

    /**
     * Fill a number in the selected cell
     */
    fillNumber(row, col, number) {
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (cell.classList.contains('prefilled')) return;

        // Clear previous styling
        cell.classList.remove('error', 'correct');
        
        if (number === 0) {
            // Clear the cell
            cell.textContent = '';
            this.grid[row][col] = 0;
        } else {
            // Fill the number
            cell.textContent = number;
            this.grid[row][col] = number;

            // Validate the move
            if (this.isValidMove(row, col, number)) {
                cell.classList.add('correct');
                setTimeout(() => cell.classList.remove('correct'), 600);
            } else {
                cell.classList.add('error');
                this.errorCount++;
                this.updateErrorCount();
                setTimeout(() => cell.classList.remove('error'), 500);
            }
        }

        // Check if game is complete
        if (this.isGameComplete()) {
            this.completeGame();
        }
    }

    /**
     * Check if a move is valid
     */
    isValidMove(row, col, num) {
        // Check row
        for (let c = 0; c < 9; c++) {
            if (c !== col && this.grid[row][c] === num) return false;
        }

        // Check column
        for (let r = 0; r < 9; r++) {
            if (r !== row && this.grid[r][col] === num) return false;
        }

        // Check 3x3 box
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        
        for (let r = boxRow; r < boxRow + 3; r++) {
            for (let c = boxCol; c < boxCol + 3; c++) {
                if ((r !== row || c !== col) && this.grid[r][c] === num) return false;
            }
        }

        return true;
    }

    /**
     * Check if the game is complete
     */
    isGameComplete() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.grid[row][col] === 0) return false;
            }
        }
        return this.isValidSudoku();
    }

    /**
     * Check if current state is a valid Sudoku
     */
    isValidSudoku() {
        // Check all rows, columns, and boxes
        for (let i = 0; i < 9; i++) {
            if (!this.isValidUnit(this.getRow(i)) || 
                !this.isValidUnit(this.getColumn(i)) || 
                !this.isValidUnit(this.getBox(i))) {
                return false;
            }
        }
        return true;
    }

    /**
     * Check if a unit (row, column, or box) is valid
     */
    isValidUnit(unit) {
        const seen = new Set();
        for (const num of unit) {
            if (num !== 0) {
                if (seen.has(num)) return false;
                seen.add(num);
            }
        }
        return true;
    }

    /**
     * Get a specific row
     */
    getRow(row) {
        return this.grid[row].slice();
    }

    /**
     * Get a specific column
     */
    getColumn(col) {
        return this.grid.map(row => row[col]);
    }

    /**
     * Get a specific 3x3 box
     */
    getBox(boxIndex) {
        const result = [];
        const boxRow = Math.floor(boxIndex / 3) * 3;
        const boxCol = (boxIndex % 3) * 3;
        
        for (let r = boxRow; r < boxRow + 3; r++) {
            for (let c = boxCol; c < boxCol + 3; c++) {
                result.push(this.grid[r][c]);
            }
        }
        return result;
    }

    /**
     * Generate a new game
     */
    generateNewGame() {
        this.gameCompleted = false;
        this.errorCount = 0;
        this.updateErrorCount();
        this.stopTimer();
        
        // Generate a complete valid Sudoku
        this.initializeGrid();
        this.generateComplete();
        
        // Save the solution
        this.solution = this.grid.map(row => row.slice());
        
        // Remove numbers based on difficulty
        const difficulty = document.getElementById('difficulty').value;
        this.removeNumbers(difficulty);
        
        // Create visual grid and start timer
        this.createVisualGrid();
        this.startTimer();
        
        // Clear selections
        this.selectedCell = null;
        this.selectedNumber = null;
        document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
    }

    /**
     * Generate a complete valid Sudoku puzzle
     */
    generateComplete() {
        // Fill diagonal 3x3 boxes first (they don't affect each other)
        this.fillDiagonalBoxes();
        
        // Fill remaining cells
        this.solveSudoku(this.grid);
    }

    /**
     * Fill the three diagonal 3x3 boxes
     */
    fillDiagonalBoxes() {
        for (let box = 0; box < 9; box += 4) { // 0, 4, 8 (diagonal boxes)
            this.fillBox(Math.floor(box / 3) * 3, (box % 3) * 3);
        }
    }

    /**
     * Fill a 3x3 box with random valid numbers
     */
    fillBox(row, col) {
        const numbers = this.shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        let index = 0;
        
        for (let r = row; r < row + 3; r++) {
            for (let c = col; c < col + 3; c++) {
                this.grid[r][c] = numbers[index++];
            }
        }
    }

    /**
     * Shuffle an array using Fisher-Yates algorithm
     */
    shuffleArray(array) {
        const shuffled = array.slice();
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Solve Sudoku using backtracking
     */
    solveSudoku(grid) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (grid[row][col] === 0) {
                    const numbers = this.shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
                    
                    for (const num of numbers) {
                        if (this.isValidPlacement(grid, row, col, num)) {
                            grid[row][col] = num;
                            
                            if (this.solveSudoku(grid)) {
                                return true;
                            }
                            
                            grid[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Check if a number can be placed at a specific position
     */
    isValidPlacement(grid, row, col, num) {
        // Check row
        for (let c = 0; c < 9; c++) {
            if (grid[row][c] === num) return false;
        }

        // Check column
        for (let r = 0; r < 9; r++) {
            if (grid[r][col] === num) return false;
        }

        // Check 3x3 box
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        
        for (let r = boxRow; r < boxRow + 3; r++) {
            for (let c = boxCol; c < boxCol + 3; c++) {
                if (grid[r][c] === num) return false;
            }
        }

        return true;
    }

    /**
     * Remove numbers from complete grid based on difficulty
     */
    removeNumbers(difficulty) {
        const cellsToRemove = {
            easy: 40,
            medium: 50,
            hard: 60
        };

        const toRemove = cellsToRemove[difficulty] || cellsToRemove.medium;
        const positions = [];
        
        // Create array of all positions
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                positions.push({ row, col });
            }
        }

        // Shuffle positions and remove numbers
        const shuffledPositions = this.shuffleArray(positions);
        for (let i = 0; i < toRemove && i < shuffledPositions.length; i++) {
            const { row, col } = shuffledPositions[i];
            this.grid[row][col] = 0;
        }
    }

    /**
     * Solve the current game
     */
    solveCurrentGame() {
        if (this.gameCompleted) return;

        // Copy solution to grid
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                this.grid[row][col] = this.solution[row][col];
            }
        }

        // Update visual grid
        document.querySelectorAll('.cell').forEach(cell => {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            
            if (!cell.classList.contains('prefilled')) {
                cell.textContent = this.grid[row][col];
                cell.classList.add('correct');
            }
        });

        this.completeGame();
    }

    /**
     * Check current state and highlight errors
     */
    checkCurrentState() {
        if (this.gameCompleted) return;

        let hasErrors = false;

        document.querySelectorAll('.cell').forEach(cell => {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            const value = this.grid[row][col];

            cell.classList.remove('error', 'correct');

            if (value !== 0 && !cell.classList.contains('prefilled')) {
                if (this.isValidMove(row, col, value)) {
                    cell.classList.add('correct');
                    setTimeout(() => cell.classList.remove('correct'), 1000);
                } else {
                    cell.classList.add('error');
                    hasErrors = true;
                    setTimeout(() => cell.classList.remove('error'), 1000);
                }
            }
        });

        if (!hasErrors && this.isGameComplete()) {
            this.completeGame();
        }
    }

    /**
     * Clear all user input
     */
    clearUserInput() {
        if (this.gameCompleted) return;

        document.querySelectorAll('.cell').forEach(cell => {
            if (!cell.classList.contains('prefilled')) {
                const row = parseInt(cell.dataset.row);
                const col = parseInt(cell.dataset.col);
                
                cell.textContent = '';
                cell.classList.remove('error', 'correct', 'selected');
                this.grid[row][col] = 0;
            }
        });

        this.selectedCell = null;
        this.selectedNumber = null;
        document.querySelectorAll('.number-btn.selected').forEach(btn => btn.classList.remove('selected'));
    }

    /**
     * Complete the game
     */
    completeGame() {
        this.gameCompleted = true;
        this.stopTimer();
        
        const finalTime = document.getElementById('timeDisplay').textContent;
        const finalErrors = this.errorCount;
        
        document.getElementById('finalTime').textContent = finalTime;
        document.getElementById('finalErrors').textContent = finalErrors;
        
        // Add celebration effect
        document.querySelectorAll('.cell').forEach((cell, index) => {
            setTimeout(() => {
                cell.style.animation = 'glow 0.6s ease-in-out';
            }, index * 20);
        });

        // Show win modal after animation
        setTimeout(() => {
            this.showWinModal();
        }, 2000);
    }

    /**
     * Start the game timer
     */
    startTimer() {
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
            const seconds = (elapsed % 60).toString().padStart(2, '0');
            document.getElementById('timeDisplay').textContent = `${minutes}:${seconds}`;
        }, 1000);
    }

    /**
     * Stop the game timer
     */
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    /**
     * Update error count display
     */
    updateErrorCount() {
        document.getElementById('errorCount').textContent = this.errorCount;
    }

    /**
     * Show win modal
     */
    showWinModal() {
        document.getElementById('winModal').style.display = 'block';
    }

    /**
     * Hide win modal
     */
    hideWinModal() {
        document.getElementById('winModal').style.display = 'none';
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SudokuGame();
});

// Add keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key >= '1' && e.key <= '9') {
        const number = parseInt(e.key);
        document.querySelector(`[data-number="${number}"]`).click();
    } else if (e.key === '0' || e.key === 'Delete' || e.key === 'Backspace') {
        document.querySelector(`[data-number="0"]`).click();
    }
});