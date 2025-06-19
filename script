// Get references to the HTML elements we'll interact with
const wordDisplay = document.getElementById('word-display');
const textInput = document.getElementById('text-input');
const feedbackMessage = document.getElementById('feedback-message');
const scoreDisplay = document.getElementById('score-display');
const timerDisplay = document.getElementById('timer-display');


// Array of words for the game
const words = [
    "the", "it", "at", "when", "how", "what", "said", "day", "stop", "like",
    "father", "fish", "be", "to", "and", "that", "not", "under", "move",
    "develop", "start", "top", "a", "light", "hold", "stand", "send",
    "believe", "create"
];

let currentWord = '';
let score = 0;
let timeLeft = 30;
let timerInterval;
let gameStarted = false;

let shuffledWords = [];
let wordIndex = 0;

let typedCharacters = ''; // To keep track of characters typed for the current word


// Function to shuffle the words array (Fisher-Yates algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}

// Function to update the score display
function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
}

// Function to update the timer display
function updateTimerDisplay() {
    timerDisplay.textContent = `Time: ${timeLeft}s`;
}

// MODIFIED: Function to display the current word (broken into characters) and upcoming words
function displayWords() {
    // If we've gone through all shuffled words, reshuffle
    if (wordIndex >= shuffledWords.length) {
        shuffledWords = shuffleArray([...words]); // Shuffle a fresh copy
        wordIndex = 0;
    }

    currentWord = shuffledWords[wordIndex];
    
    // Prepare the current word for character-by-character display
    // Each character will be wrapped in a span with a unique ID
    let currentWordHtml = '';
    for (let i = 0; i < currentWord.length; i++) {
        currentWordHtml += `<span id="char-${i}">${currentWord[i]}</span>`;
    }

    // Get next 10 words (or fewer if nearing end of list)
    // Adjust slice to ensure we don't go out of bounds of shuffledWords
    const nextWordsArray = shuffledWords.slice(wordIndex + 1, wordIndex + 1 + 10); // +10 for the next 10 words
    const nextWordsString = nextWordsArray.join(' ');

    // Combine current word (with spans) and next words
    wordDisplay.innerHTML = `${currentWordHtml} <span class="upcoming-text">${nextWordsString}</span>`;

    feedbackMessage.textContent = '';
    textInput.value = ''; // Clear input field
    typedCharacters = ''; // Reset typed characters for the new word
    
    // Highlight the first character if it exists
    const firstCharSpan = document.getElementById('char-0');
    if (firstCharSpan) {
        firstCharSpan.classList.add('active-char'); // New class for the currently expected char
    }

    wordIndex++; // Move to the next word for the next turn
}

// Function to start the game
function startGame() {
    if (gameStarted) return; // Prevent starting multiple games
    gameStarted = true;
    score = 0; // Reset score
    timeLeft = 30; // Reset timer
    updateScore(); // Update score display
    shuffledWords = shuffleArray([...words]); // Shuffle words at game start
    wordIndex = 0; // Reset index
    displayWords(); // Display the first word (using new function)
    textInput.focus(); // Ensure input field is focused
    textInput.disabled = false; // Ensure input is enabled

    // First, clear any existing timer to prevent multiple timers running
    clearInterval(timerInterval); 

    // Update the display immediately
    updateTimerDisplay(); 

    // Set up a new interval to decrement time every second
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft <= 0) {
            endGame(); // Call endGame when time runs out
        }
    }, 1000); // 1000 milliseconds = 1 second
}

// Function to end the game
function endGame() {
    clearInterval(timerInterval); // Stop the timer
    gameStarted = false;
    textInput.disabled = true; // Disable input field
    wordDisplay.textContent = "Game Over!"; // Clear all words
    feedbackMessage.textContent = `You scored ${score} words! Press any key to play again.`;
    feedbackMessage.style.color = 'blue'; 
    
    // Set a timeout to clear the feedback message after a short delay
    setTimeout(() => {
        feedbackMessage.textContent = '';
    }, 3000); // Clear after 3 seconds
}


// Event Listener for user typing
textInput.addEventListener('input', () => {
    // Start game on first input if not already started
    if (!gameStarted) {
        startGame();
    }

    const typedText = textInput.value;
    typedCharacters = typedText; // Update typed characters for the current word

    // Remove active-char from ALL characters first, then re-add to correct one
    // This handles backspacing correctly too
    for (let i = 0; i < currentWord.length; i++) {
        const charSpan = document.getElementById(`char-${i}`);
        if (charSpan) {
            charSpan.classList.remove('active-char');
        }
    }

    let isCorrectSoFar = true;
    for (let i = 0; i < currentWord.length; i++) {
        const charSpan = document.getElementById(`char-${i}`);
        if (!charSpan) continue; // Should not happen if rendering correctly

        if (i < typedText.length) { // If this character has been typed
            if (typedText[i] === currentWord[i]) {
                charSpan.classList.add('correct-char');
                charSpan.classList.remove('incorrect-char');
            } else {
                charSpan.classList.add('incorrect-char');
                charSpan.classList.remove('correct-char');
                isCorrectSoFar = false; // Mark as incorrect
            }
        } else { // If this character has not been typed yet (cleared or not reached)
            charSpan.classList.remove('correct-char', 'incorrect-char');
        }
    }
    
    // Highlight the next expected character (if not at end of word)
    const nextCharIndex = typedText.length;
    const nextCharSpan = document.getElementById(`char-${nextCharIndex}`);
    if (nextCharSpan) {
        nextCharSpan.classList.add('active-char');
    }


    // Check if the whole word is typed (length matches)
    if (typedText.length === currentWord.length) {
        if (typedText === currentWord) {
            feedbackMessage.textContent = 'Correct!';
            feedbackMessage.style.color = 'green';
            score++; // Increment score for correct word
            updateScore(); // Update score display
            displayWords(); // Get a new word and update display
        } else {
            // Word is typed but incorrect, user must correct
            feedbackMessage.textContent = 'Incorrect word!';
            feedbackMessage.style.color = 'red';
        }
    } else {
        // Word is not fully typed yet
        if (isCorrectSoFar) { // All typed chars are correct so far
            feedbackMessage.textContent = 'Keep typing...';
            feedbackMessage.style.color = '#555';
        } else { // There's an incorrect char already typed
            feedbackMessage.textContent = 'Correction needed...';
            feedbackMessage.style.color = 'red';
        }
    }
});

// Event Listener to restart game after it ends (using keydown for broader detection)
textInput.addEventListener('keydown', (event) => {
    // Only restart if game is NOT started, time is over, and a non-modifier/non-repeat key is pressed
    if (!gameStarted && timeLeft <= 0 && !event.repeat && event.key !== ' ' && event.key !== 'Shift' && event.key !== 'Control' && event.key !== 'Alt' && event.key !== 'Meta' && event.key !== 'Backspace') {
        startGame();
    }
});


// Initial setup when the script loads
updateScore(); // Show initial score (0)
updateTimerDisplay(); // Show initial time (30s)
// IMPORTANT: KEEP THIS LINE COMMENTED OUT OR DELETED: textInput.disabled = true;
wordDisplay.textContent = "Type to start game!"; // Initial message for the user
