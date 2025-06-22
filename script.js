// Get references to the HTML elements we'll interact with
const wordDisplay = document.getElementById('word-display');
const textInput = document.getElementById('text-input');
const feedbackMessage = document.getElementById('feedback-message');
const scoreDisplay = document.getElementById('score-display'); // Renamed HTML element to score-display (as before)
const timerDisplay = document.getElementById('timer-display');


// Array of words for the game (YOUR EXPANDED LIST)
const words = [
    "the", "it", "at", "when", "how", "what", "said", "day", "stop", "like",
    "father", "fish", "be", "to", "and", "that", "not", "under", "move",
    "develop", "start", "top", "a", "light", "hold", "stand", "send",
    "believe", "create"
    // Add all your additional words here!
];

let currentWord = '';
let rawTypedCharacters = 0; // NEW: Total valid keystrokes made
let correctLetters = 0; // Total perfectly correct characters (for accuracy)
let initialTime = 30; // Game duration in seconds (can be 30 or 60)
let timeLeft = initialTime;
let timerInterval;
let gameStarted = false;

let shuffledWords = [];
let wordIndex = 0;

let previousTypedLength = 0; // NEW: To track if a new character was typed (not backspace)


// Function to shuffle the words array (Fisher-Yates algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}

// MODIFIED: Function to update the WPM and Accuracy display
function updateWPMAndAccuracy() {
    const timeElapsed = initialTime - timeLeft; // Time actually passed during the game
    let wpm = 0;
    let accuracy = 0;

    if (timeElapsed > 0) {
        // WPM: Calculate using rawTypedCharacters (closer to MonkeyType's raw WPM)
        wpm = Math.round((rawTypedCharacters / 5) / (timeElapsed / 60));
        
        // Accuracy: (Perfectly Correct Letters / Total Raw Typed Characters)
        if (rawTypedCharacters > 0) {
            accuracy = Math.round((correctLetters / rawTypedCharacters) * 100);
        }
    }

    scoreDisplay.innerHTML = `WPM: ${wpm} | Acc: ${accuracy}%`;
}

// Function to update the timer display (no changes here)
function updateTimerDisplay() {
    timerDisplay.textContent = `Time: ${timeLeft}s`;
}

// Function to display the current word (broken into characters) and upcoming words (no changes here)
function displayWords() {
    if (wordIndex >= shuffledWords.length) {
        shuffledWords = shuffleArray([...words]);
        wordIndex = 0;
    }

    currentWord = shuffledWords[wordIndex];
    
    let currentWordHtml = '';
    for (let i = 0; i < currentWord.length; i++) {
        currentWordHtml += `<span id="char-${i}">${currentWord[i]}</span>`;
    }

    const nextWordsArray = shuffledWords.slice(wordIndex + 1, wordIndex + 1 + 10);
    const nextWordsString = nextWordsArray.join(' ');

    wordDisplay.innerHTML = `${currentWordHtml}<span class="upcoming-text"> ${nextWordsString}</span>`; 

    feedbackMessage.textContent = '';
    textInput.value = '';
    previousTypedLength = 0; // Reset for new word
    
    const firstCharSpan = document.getElementById('char-0');
    if (firstCharSpan) {
        firstCharSpan.classList.add('active-char');
    }

    wordIndex++;
}

// MODIFIED: Function to start the game
function startGame() {
    if (gameStarted) return;
    gameStarted = true;
    rawTypedCharacters = 0; // Reset raw typed characters
    correctLetters = 0; // Reset perfectly correct characters
    timeLeft = initialTime; // Reset timer
    previousTypedLength = 0; // Reset for initial input

    updateWPMAndAccuracy(); // Update display at start
    shuffledWords = shuffleArray([...words]);
    wordIndex = 0;
    displayWords();
    textInput.focus();
    textInput.disabled = false;

    clearInterval(timerInterval); 
    updateTimerDisplay(); 

    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        updateWPMAndAccuracy(); // Update WPM & Accuracy every second

        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

// MODIFIED: Function to end the game
function endGame() {
    clearInterval(timerInterval);
    gameStarted = false;
    textInput.disabled = true;
    wordDisplay.textContent = "Game Over!";
    
    // Final calculations for the end message
    const finalTimeElapsed = initialTime - Math.max(0, timeLeft);
    let finalWPM = 0;
    let finalAccuracy = 0;

    if (finalTimeElapsed > 0) {
        finalWPM = Math.round((rawTypedCharacters / 5) / (finalTimeElapsed / 60));
        if (rawTypedCharacters > 0) {
            finalAccuracy = Math.round((correctLetters / rawTypedCharacters) * 100);
        }
    }

    feedbackMessage.textContent = `Game Over! WPM: ${finalWPM} | Accuracy: ${finalAccuracy}% | Raw Typed: ${rawTypedCharacters} | Correct Letters: ${correctLetters}. Press any key to play again.`;
    feedbackMessage.style.color = 'blue'; 
    
    setTimeout(() => {
        feedbackMessage.textContent = '';
    }, 3000);
}


// MODIFIED: Event Listener for user typing
textInput.addEventListener('input', () => {
    if (!gameStarted) {
        startGame();
    }

    const typedText = textInput.value;

    // Increment rawTypedCharacters if a new character was added (not backspace)
    if (typedText.length > previousTypedLength) {
        rawTypedCharacters++;
    }
    previousTypedLength = typedText.length; // Update for next comparison

    // Character highlighting logic
    let isCurrentWordPartiallyCorrect = true; // Flag for correct prefix
    let currentWordPerfectlyTyped = false; // Flag if current word is typed perfectly so far

    for (let i = 0; i < currentWord.length; i++) {
        const charSpan = document.getElementById(`char-${i}`);
        if (!charSpan) continue;

        if (i < typedText.length) {
            // Char is typed
            if (typedText[i] === currentWord[i]) {
                charSpan.classList.add('correct-char');
                charSpan.classList.remove('incorrect-char');
            } else {
                charSpan.classList.add('incorrect-char');
                charSpan.classList.remove('correct-char');
                isCurrentWordPartiallyCorrect = false; // An incorrect character was found
            }
        } else {
            // Char not yet typed or was backspaced over
            charSpan.classList.remove('correct-char', 'incorrect-char', 'active-char');
        }
    }
    
    // Update active char highlight
    // Remove active-char from ALL characters first, then re-add to correct one
    for (let i = 0; i < currentWord.length; i++) {
        const charSpan = document.getElementById(`char-${i}`);
        if (charSpan) {
            charSpan.classList.remove('active-char');
        }
    }
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
            correctLetters += currentWord.length; // Add *all* letters of the correct word to total correct letters
            updateWPMAndAccuracy(); // Update WPM and Accuracy
            displayWords(); // Get a new word and update display
        } else {
            feedbackMessage.textContent = 'Incorrect word!';
            feedbackMessage.style.color = 'red';
            // No update to correctLetters if word is wrong; user must correct
        }
    } else {
        // Word is not fully typed yet
        if (isCurrentWordPartiallyCorrect) { // All typed chars are correct so far for current word
            feedbackMessage.textContent = 'Keep typing...';
            feedbackMessage.style.color = '#555';
        } else { // There's an incorrect char already typed
            feedbackMessage.textContent = 'Correction needed...';
            feedbackMessage.style.color = 'red';
        }
    }
    updateWPMAndAccuracy(); // Update WPM and accuracy after every keystroke
});

// Event Listener to restart game after it ends (using keydown for broader detection)
textInput.addEventListener('keydown', (event) => {
    if (!gameStarted && timeLeft <= 0 && !event.repeat && event.key !== ' ' && event.key !== 'Shift' && event.key !== 'Control' && event.key !== 'Alt' && event.key !== 'Meta' && event.key !== 'Backspace') {
        startGame();
    }
});


// Initial setup when the script loads
updateWPMAndAccuracy(); // Show initial WPM (0) and Accuracy (0%)
updateTimerDisplay(); // Show initial time (30s)
wordDisplay.textContent = "Type to start game!"; // Initial message for the user
