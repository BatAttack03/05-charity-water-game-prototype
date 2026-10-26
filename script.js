
/* ==========================================================
   WATER WHISKERS — GAME LOGIC

   HOW THE GAME WORKS:
   - Type the displayed word and press Enter.
   - Correct word = +10 water drops.
   - Incorrect word = -5 water drops.
   - Score cannot go below 0.
   - Reach 100 drops to fill the village well.
   - Confetti appears when the player wins.
   - Reset and Play Again restart the game.
   ========================================================== */


/* ==========================================================
   1. GAME SETTINGS
   ========================================================== */

// Words that can appear during gameplay.
const WORDS = [
  'water',
  'hope',
  'health',
  'future',
  'village',
  'clean',
  'river',
  'kindness',
  'garden',
  'community'
];

// Points earned for a correct word.
const POINTS_PER_WORD = 10;

// Points lost for an incorrect word.
const POINTS_LOST = 5;

// Points needed to win the level.
const LEVEL_GOAL = 100;


/* ==========================================================
   2. FIND HTML ELEMENTS
   ========================================================== */

// Typing interface
const wordDisplay = document.querySelector('#targetWord');
const wordInput = document.querySelector('#wordInput');
const feedback = document.querySelector('#feedback');

// Score and progress
const scoreDisplay = document.querySelector('#score');
const progressBar = document.querySelector('#waterProgress');
const progressText = document.querySelector('#progressText');

// Buttons
const resetButton = document.querySelector('#resetButton');
const playAgainButton = document.querySelector('#playAgainButton');

// Win screen
const winOverlay = document.querySelector('#winOverlay');

// Confetti container
const confettiContainer = document.querySelector('#confettiContainer');


/* ==========================================================
   3. GAME STATE
   ========================================================== */

// Player's current score.
let score = 0;

// Word the player must type.
let currentWord = 'water';

// Used to prevent the same word appearing twice in a row.
let previousWord = '';

// Tracks whether the level is complete.
let gameWon = false;

// Tracks the confetti cleanup timer.
let confettiTimeout;


/* ==========================================================
   4. CHOOSE A RANDOM WORD
   ========================================================== */

function chooseWord() {

  // Remove the previously displayed word from the choices.
  const choices = WORDS.filter(word => word !== previousWord);

  // Select a random word.
  currentWord = choices[
    Math.floor(Math.random() * choices.length)
  ];

  // Remember this word for the next selection.
  previousWord = currentWord;

  // Display the new word.
  wordDisplay.textContent = currentWord;
}


/* ==========================================================
   5. UPDATE SCORE AND PROGRESS BAR
   ========================================================== */

function updateScore() {

  // Update the visible score.
  scoreDisplay.textContent = score;

  // Update the progress bar.
  progressBar.value = score;

  // Update accessible progress text.
  progressText.textContent =
    `${score} out of ${LEVEL_GOAL} water drops`;
}


/* ==========================================================
   6. DISPLAY PLAYER FEEDBACK
   ========================================================== */

function setFeedback(message, kind = '') {

  // Display the feedback message.
  feedback.textContent = message;

  // Apply the success or error CSS class.
  feedback.className = `feedback ${kind}`;
}


/* ==========================================================
   7. INCORRECT WORD PENALTY
   ========================================================== */

function losePoints() {

  // Subtract 5 points.
  // Math.max prevents the score from becoming negative.
  score = Math.max(0, score - POINTS_LOST);

  // Update score and progress bar.
  updateScore();

  // Tell the player what happened.
  setFeedback(
    `Incorrect word! -${POINTS_LOST} water drops 💧`,
    'error'
  );

  // Highlight the incorrect answer so it can be replaced.
  wordInput.select();
}


/* ==========================================================
   8. CHECK THE PLAYER'S WORD
   ========================================================== */

function submitWord() {

  // Stop accepting answers after winning.
  if (gameWon) {
    return;
  }

  // Read the player's answer.
  // Trim removes extra spaces.
  // Lowercase makes answers case-insensitive.
  const answer = wordInput.value.trim().toLowerCase();

  // Do not subtract points for an empty answer.
  if (!answer) {

    setFeedback('Type the word first!', 'error');

    return;
  }

  // INCORRECT ANSWER
  if (answer !== currentWord) {

    losePoints();

    return;
  }

  // CORRECT ANSWER
  score = Math.min(score + POINTS_PER_WORD, LEVEL_GOAL);

  // Update score and progress bar.
  updateScore();

  // Clear the typing box.
  wordInput.value = '';

  // Show positive feedback.
  setFeedback(
    `Nice! +${POINTS_PER_WORD} water drops 💧`,
    'success'
  );

  // Check whether the player has won.
  if (score >= LEVEL_GOAL) {

    winGame();

  } else {

    // Display another word.
    chooseWord();

  }
}


/* ==========================================================
   9. WIN THE LEVEL
   ========================================================== */

function winGame() {

  // Mark the game as completed.
  gameWon = true;

  // Remove focus from the typing box.
  wordInput.blur();

  // Display the victory screen.
  winOverlay.hidden = false;

  // Launch the confetti celebration!
  launchConfetti();

  // Move keyboard focus to the Play Again button.
  playAgainButton.focus();
}


/* ==========================================================
   10. CONFETTI CELEBRATION
   ========================================================== */

function launchConfetti() {

  // Remove previous confetti and cleanup timers.
  clearTimeout(confettiTimeout);
  confettiContainer.innerHTML = '';

  // Respect reduced-motion accessibility preferences.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  // charity: water brand colors.
  const confettiColors = [
    '#FFC907', // Yellow
    '#2E9DF7', // Blue
    '#8BD1CB', // Light blue
    '#4FCB53', // Green
    '#FF902A', // Orange
    '#F5402C', // Red
    '#159A48', // Dark green
    '#F16061'  // Pink
  ];

  // Create 100 pieces of confetti.
  for (let i = 0; i < 100; i++) {

    // Create one confetti piece.
    const confetti = document.createElement('div');

    confetti.classList.add('confetti-piece');

    // Random horizontal position.
    confetti.style.left = Math.random() * 100 + '%';

    // Random brand color.
    confetti.style.backgroundColor =
      confettiColors[
        Math.floor(Math.random() * confettiColors.length)
      ];

    // Random width and height.
    confetti.style.width =
      6 + Math.random() * 8 + 'px';

    confetti.style.height =
      8 + Math.random() * 12 + 'px';

    // Random falling speed.
    confetti.style.animationDuration =
      2 + Math.random() * 2 + 's';

    // Random animation delay.
    confetti.style.animationDelay =
      Math.random() * 1.5 + 's';

    // Add the confetti to the game screen.
    confettiContainer.appendChild(confetti);
  }

  // Remove the confetti after the animation finishes.
  confettiTimeout = setTimeout(() => {

    confettiContainer.innerHTML = '';

  }, 5500);
}


/* ==========================================================
   11. RESET THE GAME
   ========================================================== */

function resetGame() {

  // Reset score and game state.
  score = 0;
  gameWon = false;
  previousWord = '';

  // Hide the victory screen.
  winOverlay.hidden = true;

  // Stop any remaining confetti.
  clearTimeout(confettiTimeout);
  confettiContainer.innerHTML = '';

  // Reset score and progress bar.
  updateScore();

  // Choose a new word.
  chooseWord();

  // Clear the typing box.
  wordInput.value = '';

  // Clear feedback.
  setFeedback('');

  // Focus the typing box.
  wordInput.focus();
}


/* ==========================================================
   12. BUTTONS AND KEYBOARD CONTROLS
   ========================================================== */

// Press Enter to submit a word.
wordInput.addEventListener('keydown', event => {

  if (event.key === 'Enter' && !event.isComposing) {

    event.preventDefault();

    submitWord();
  }

});

// Reset button restarts the game.
resetButton.addEventListener('click', resetGame);

// Play Again button restarts the game.
playAgainButton.addEventListener('click', resetGame);


/* ==========================================================
   13. START THE GAME
   ========================================================== */

// Display the initial score.
updateScore();

// Allow the player to begin typing immediately.
wordInput.focus();
