const overlay = document.querySelector('.overlay');
const boxes = document.querySelectorAll('.box');
const timeEl = document.querySelector('.time h3');
const endModal = document.querySelector('.end-modal');
const startModal = document.querySelector('.start-modal');
const buttonPlay = document.querySelector('.button-area .button.play');
const buttonPause = document.querySelector('.button-area .button.pause');
const buttonSolve = document.querySelector('.button-area .button.solve');
const buttonRestart = document.querySelector('.button-area .button.restart');

let game;
let timeInterval;
let time = 0;

function init() {
    startModal.style.display = 'none';
    game = new Game();
    runTimer();
}

function runTimer() {
    timeInterval = setInterval(() => {
        if (!game.end) {
            time++;
            let min = Math.floor(time / 60);
            let sec = time - (min * 60);
            timeEl.innerHTML = `${formatTime(min)}:${formatTime(sec)}`;
        } else {
            clearInterval(timeInterval);
        }
    }, 1000);
}

function formatTime(time) {
    return (time < 10) ? `0${time}` : time;
}

function pause() {
    overlay.style.display = 'block';
    buttonPlay.style.display = 'block';
    buttonPause.style.display = 'none';
    clearInterval(timeInterval);
}

function play() {
    overlay.style.display = 'none';
    buttonPlay.style.display = 'none';
    buttonPause.style.display = 'block';
    runTimer();
}

function solveSudoku() {
    if (game) {
        game.solve(); // Call the solve method in the Game class
        updateUIWithSolution();
    }
}

function updateUIWithSolution() {
    const fields = document.querySelectorAll('.field');
    fields.forEach(field => {
        const answer = field.getAttribute('data-answer');
        if (answer) {
            field.innerHTML = answer;
            field.classList.add('active');
        }
    });
}

function restartGame() {
    clearInterval(timeInterval);  // Stop the timer
    time = 0;
    timeEl.innerHTML = '00:00';
    endModal.style.display = 'none';
    startModal.style.display = 'flex';
    // Clear the existing game UI elements
    document.querySelectorAll('.field').forEach(field => {
        field.innerHTML = '';
        field.classList.remove('active');
    });
    // Initialize a new game
    game = new Game();
    runTimer();  // Restart the timer
}

buttonSolve.addEventListener('click', solveSudoku);
buttonRestart.addEventListener('click', restartGame);

// Start the game initially
init();
