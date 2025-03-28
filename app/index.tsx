// app/index.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    useColorScheme,
    Platform,
    ScrollView, // Import ScrollView for potentially long messages
} from 'react-native';
import { Audio } from 'expo-av';

// --- Constants, Types, and Helpers ---
const MIN_LEVEL = 3; // Starting sequence length
const MAX_STAGES = 5; // Stages per level
const MAX_TRIES = 3; // Tries per stage
const DISPLAY_TIME_MS = 1500;
type GameState = 'idle' | 'displaying' | 'inputting' | 'submitting' | 'gameOver'; // Adjusted states

const generateSequence = (length: number): number[] => {
    return Array.from({ length }, () => Math.floor(Math.random() * 10));
};

const shuffle = <T,>(array: T[]): T[] => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
};

const playSound = async (soundObject: Audio.Sound | null) => {
    if (soundObject) {
        try {
            await soundObject.replayAsync();
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    }
};

// --- Main Component ---
export default function GameScreen(): JSX.Element {
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    // --- State Variables ---
    const [level, setLevel] = useState<number>(MIN_LEVEL); // Represents sequence length
    const [stage, setStage] = useState<number>(1); // Current stage within the level (1-5)
    const [tries, setTries] = useState<number>(MAX_TRIES); // Remaining tries for the current stage
    const [sequence, setSequence] = useState<number[]>([]);
    const [userInput, setUserInput] = useState<number[]>([]);
    const [gameState, setGameState] = useState<GameState>('idle');
    const [message, setMessage] = useState<string>('Press Start');
    const [score, setScore] = useState<number>(0); // Score based on completed stages
    const [shuffledDigits, setShuffledDigits] = useState<number[]>(() => shuffle<number>([...Array(10).keys()]));
    const [hintUsed, setHintUsed] = useState<boolean>(false); // Hint used in current stage?
    const [hintToShow, setHintToShow] = useState<number | null>(null); // The digit revealed by hint
    const [correctSequenceToShow, setCorrectSequenceToShow] = useState<number[] | null>(null); // Sequence to show on game over
    const [isCorrect, setIsCorrect] = useState<boolean>(true); // Track sequence correctness

    // --- Sound State ---
    const [clickSound, setClickSound] = useState<Audio.Sound | null>(null);
    const [correctSound, setCorrectSound] = useState<Audio.Sound | null>(null);
    const [incorrectSound, setIncorrectSound] = useState<Audio.Sound | null>(null);
    const [levelUpSound, setLevelUpSound] = useState<Audio.Sound | null>(null); // Played on level increment
    const [stageUpSound, setStageUpSound] = useState<Audio.Sound | null>(null); // Played on stage increment (can be same as correct)
    const [gameOverSound, setGameOverSound] = useState<Audio.Sound | null>(null); // Played on game over (can be same as incorrect)

    // --- Sound Loading Effect (assuming sounds like stageUp.mp3, gameOver.mp3 exist)---
    useEffect(() => {
        let isMounted = true;
        const loadSounds = async () => {
            console.log('Loading sounds...');
            try {
                const { sound: clickS } = await Audio.Sound.createAsync(require('../assets/sounds/click.mp3'));
                const { sound: correctS } = await Audio.Sound.createAsync(require('../assets/sounds/click.mp3'));
                const { sound: incorrectS } = await Audio.Sound.createAsync(require('../assets/sounds/click.mp3'));
                const { sound: levelUpS } = await Audio.Sound.createAsync(require('../assets/sounds/click.mp3'));
                // Assuming stageUp is similar to correct, gameOver similar to incorrect
                const { sound: stageUpS } = await Audio.Sound.createAsync(require('../assets/sounds/click.mp3')); // Or specific stageUp.mp3
                const { sound: gameOverS } = await Audio.Sound.createAsync(require('../assets/sounds/click.mp3')); // Or specific gameOver.mp3

                if (isMounted) {
                    setClickSound(clickS);
                    setCorrectSound(correctS);
                    setIncorrectSound(incorrectS);
                    setLevelUpSound(levelUpS);
                    setStageUpSound(stageUpS); // Store stage up sound
                    setGameOverSound(gameOverS); // Store game over sound
                    console.log('Sounds loaded successfully.');
                } else {
                    await Promise.all([clickS, correctS, incorrectS, levelUpS, stageUpS, gameOverS].map(s => s?.unloadAsync()));
                }
            } catch (error) { console.error('Failed to load sounds:', error); }
        };
        loadSounds();
        return () => { // Cleanup
            isMounted = false;
            console.log('Unloading sounds...');
            [clickSound, correctSound, incorrectSound, levelUpSound, stageUpSound, gameOverSound].forEach(s => s?.unloadAsync());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run once

    // --- Game Logic Functions ---
    const startGame = useCallback((): void => {
        playSound(clickSound);
        console.log('Starting game...');
        setLevel(MIN_LEVEL);
        setStage(1);
        setScore(0);
        setTries(MAX_TRIES);
        setHintUsed(false);
        setHintToShow(null);
        setUserInput([]);
        setCorrectSequenceToShow(null); // Clear any previous correct sequence
        const newSequence = generateSequence(MIN_LEVEL);
        setSequence(newSequence);
        setMessage('Watch closely...');
        setGameState('displaying');
        setShuffledDigits(shuffle<number>([...Array(10).keys()]));
    }, [clickSound]);

    // Advances Stage or transitions to Next Level
    const advanceStageOrLevel = useCallback((): void => {
        const nextStage = stage + 1;
        const currentSequenceLength = level;
        setScore((prevScore) => prevScore + 1); // Increment score per stage
        setUserInput([]);
        setTries(MAX_TRIES); // Reset tries
        setHintUsed(false); // Reset hint
        setHintToShow(null); // Clear hint display

        if (nextStage <= MAX_STAGES) {
            // Advance Stage within the same Level (sequence length)
             playSound(stageUpSound);
            setStage(nextStage);
            const newSequence = generateSequence(currentSequenceLength);
            setSequence(newSequence);
            setMessage('Watch closely...');
            setGameState('displaying');
        } else {
            // Advance Level (increase sequence length)
             playSound(levelUpSound);
            const nextLevelLength = currentSequenceLength + 1;
            setLevel(nextLevelLength);
            setStage(1); // Reset stage to 1 for the new level
            const newSequence = generateSequence(nextLevelLength);
            setSequence(newSequence);
            setMessage('Watch closely...');
            setGameState('displaying');
        }
    }, [stage, level, stageUpSound, levelUpSound]);

    const handleGameOver = useCallback((reason: string = "Incorrect sequence"): void => {
        playSound(gameOverSound);
        console.log('Game Over:', reason);
        setCorrectSequenceToShow(sequence); // Store the correct sequence for display
        setGameState('gameOver');
        setMessage(`Game Over! ${reason}\nYour final score: ${score}\nPress Start to Play Again`);
    }, [score, gameOverSound, sequence]); // sequence needed to store it

    const handleNumberPress = useCallback((number: number): void => {
        if (gameState !== 'inputting') return;
        // Limit input length to sequence length
        if (userInput.length < sequence.length) {
            playSound(clickSound);
            setHintToShow(null); // Clear hint if user starts typing again
            setUserInput([...userInput, number]);
        }
    }, [gameState, clickSound, userInput, sequence.length]);

   const handleClearInput = useCallback((): void => {
      if (gameState !== 'inputting') return;
      playSound(clickSound);
      setHintToShow(null);
      setUserInput([]);
  }, [gameState, clickSound]);

    // New: Handle Submission
    const handleSubmit = useCallback((): void => {
        if (gameState !== 'inputting' || userInput.length !== sequence.length) {
             // Optionally add feedback if input is incomplete
             if (userInput.length !== sequence.length) {
                 setMessage(`Input incomplete. Need ${sequence.length} digits.`);
             }
            return; // Only submit when inputting and length matches
        }

        const correct = userInput.every((val, index) => val === sequence[index]);
        setIsCorrect(correct);

        setTimeout(() => { // Short delay for feedback
            if (correct) {
                playSound(correctSound);
                setMessage(`Correct!`);
                setTimeout(advanceStageOrLevel, 600); // Delay before next sequence shows
            } else {
                const remainingTries = tries - 1;
                setTries(remainingTries);
                playSound(incorrectSound);

                if (remainingTries > 0) {
                    setMessage(`Incorrect! ${remainingTries} ${remainingTries === 1 ? 'try' : 'tries'} left. Try again.`);
                    setUserInput([]); // Clear input for next try
                    setHintToShow(null); // Clear hint
                    setGameState('inputting'); // Allow input again
                } else {
                    handleGameOver(`Incorrect sequence. No tries left.`);
                }
            }
        }, 300); // Delay for submit feedback

    }, [gameState, userInput, sequence, tries, correctSound, incorrectSound, advanceStageOrLevel, handleGameOver]);

    // New: Handle Hint Request
    const handleHint = useCallback((): void => {
        if (gameState !== 'inputting' || hintUsed || tries <= 0) return;

        playSound(clickSound); // Sound for hint button?
        setHintUsed(true);

        const currentInputLength = userInput.length;
        if (currentInputLength < sequence.length) {
            const hintDigit = sequence[currentInputLength];
            setHintToShow(hintDigit);
            setMessage(`Hint: The next digit is ${hintDigit}`);
        } else {
            // Should not happen if button is disabled correctly, but safety check
            setMessage(`Input is already full!`);
        }
         // Keep gameState as 'inputting'
    }, [gameState, hintUsed, tries, userInput.length, sequence, clickSound]);


    // --- Effects ---
    // Display Phase Effect (Unchanged)
    useEffect(() => {
        if (gameState === 'displaying') {
            console.log('Displaying sequence:', sequence);
            const displayDuration = DISPLAY_TIME_MS + (level * 100); // Slightly longer for longer sequences
            const timer = setTimeout(() => {
                console.log('Display time ended. Switching to inputting.');
                setMessage('Your turn! Enter the sequence.');
                setGameState('inputting');
            }, displayDuration);
            return () => clearTimeout(timer);
        }
    }, [gameState, sequence, level]);

    // --- Themed Styles ---
    const styles = createThemedStyles(isDarkMode);

    // --- Render Logic ---
    const renderNumberPad = (): JSX.Element => (
        <View style={styles.numberPad}>
            {shuffledDigits.map((digit) => (
                <TouchableOpacity
                    key={digit}
                    style={[
                        styles.numberButton,
                        // Disable appearance if not inputting
                        gameState !== 'inputting' && styles.disabledButtonOpacity
                    ]}
                    onPress={() => handleNumberPress(digit)}
                    disabled={gameState !== 'inputting' || userInput.length >= sequence.length} // Also disable if input is full
                >
                    <Text style={styles.numberButtonText}>{digit}</Text>
                </TouchableOpacity>
            ))}
             {/* Clear Button */}
             <TouchableOpacity
                style={[
                    styles.numberButton,
                    styles.utilityButton, // Specific style for clear/submit/hint?
                    styles.clearButton,
                    gameState !== 'inputting' && styles.disabledButtonOpacity
                 ]}
                onPress={handleClearInput}
                disabled={gameState !== 'inputting' || userInput.length === 0}
                >
                <Text style={styles.utilityButtonText}>CLR</Text>
            </TouchableOpacity>
             {/* Hint Button */}
             <TouchableOpacity
                 style={[
                     styles.numberButton, // Reuse styling
                     styles.utilityButton,
                     styles.hintButton,
                     (gameState !== 'inputting' || hintUsed || tries <= 0) && styles.disabledButtonOpacity // Disable styling
                 ]}
                 onPress={handleHint}
                 disabled={gameState !== 'inputting' || hintUsed || tries <= 0}
             >
                 <Text style={styles.utilityButtonText}>Hint</Text>
             </TouchableOpacity>
             {/* Submit Button */}
            <TouchableOpacity
                style={[
                    styles.numberButton,
                    styles.utilityButton,
                    styles.submitButton,
                    // Disable if not inputting or input is incomplete
                    (gameState !== 'inputting' || userInput.length !== sequence.length) && styles.disabledButtonOpacity
                ]}
                onPress={handleSubmit}
                 disabled={gameState !== 'inputting' || userInput.length !== sequence.length}
            >
                <Text style={styles.utilityButtonText}>SUBMIT</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
           <ScrollView contentContainerStyle={styles.scrollViewContent}>
                 <View style={styles.container}>
                    {/* Status Area */}
                    <View style={styles.statusArea}>
                        <Text style={styles.levelText}>Level: {level} (Stage {stage}/{MAX_STAGES})</Text>
                        <Text style={styles.scoreText}>Score: {score}</Text>
                         {gameState === 'inputting' && ( // Show tries only when relevant
                             <Text style={styles.triesText}>Tries Left: {tries}</Text>
                         )}
                    </View>

                    {/* Display Area */}
                    <View style={styles.displayArea}>
                        {gameState === 'displaying' && (
                            <Text style={styles.sequenceText}>{sequence.join(' ')}</Text>
                        )}
                        {/* Show user input during inputting and submitting */}
                        {(gameState === 'inputting' || gameState === 'submitting') && (
                             <>
                                {/* Display Hint if available */}
                                {hintToShow !== null && gameState === 'inputting' && (
                                    <Text style={styles.hintText}>Hint: {hintToShow}</Text>
                                )}
                                <Text style={styles.userInputText}>{userInput.join(' ') || ' '}</Text>
                             </>
                        )}
                        {/* Show final input and correct sequence on game over */}
                       {gameState === 'gameOver' && correctSequenceToShow && (
                            <>
                                <Text style={styles.gameOverLabel}>Your Input:</Text>
                                <Text style={[styles.userInputText, styles.incorrectSequence]}>{userInput.join(' ') || ' '}</Text>
                                <Text style={styles.gameOverLabel}>Correct:</Text>
                                <Text style={[styles.sequenceText, styles.correctSequence]}>{correctSequenceToShow.join(' ')}</Text>
                            </>
                       )}
                        {/* General Message Area */}
                        <Text style={[
                            styles.messageText,
                            // Style message differently based on state if needed
                            gameState === 'gameOver' && styles.gameOverMessage,
                            (gameState === 'inputting' && !isCorrect && tries < MAX_TRIES) && styles.warningMessage // Example: Style warning
                            ]}>
                            {message}
                        </Text>


                    </View>

                    {/* Input Area */}
                    <View style={styles.inputArea}>
                        {(gameState === 'inputting' || gameState === 'submitting') && renderNumberPad()}
                        {(gameState === 'idle' || gameState === 'gameOver') && (
                            <TouchableOpacity style={styles.startButton} onPress={startGame}>
                                <Text style={styles.startButtonText}>
                                    {gameState === 'idle' ? 'Start Game' : 'Play Again'}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
           </ScrollView>
        </SafeAreaView>
    );
}

// --- Dynamic Style Creation Function ---
const createThemedStyles = (isDarkMode: boolean) => {
    const colors = {
        background: isDarkMode ? '#121212' : '#f0f0f0',
        text: isDarkMode ? '#e0e0e0' : '#333',
        textMuted: isDarkMode ? '#a0a0a0' : '#555',
        textSmall: isDarkMode ? '#b0b0b0' : '#555',
        cardBackground: isDarkMode ? '#1e1e1e' : '#ffffff',
        buttonBackground: isDarkMode ? '#333333' : '#dddddd',
        buttonBorder: isDarkMode ? '#444444' : '#cccccc',
        buttonText: isDarkMode ? '#e0e0e0' : '#333',
        startButton: '#28a745',
        startButtonText: '#ffffff',
        clearButton: '#ffc107', // Yellow/Orange
        submitButton: '#007bff', // Blue
        hintButton: '#6f42c1',  // Purple
        utilityButtonText: '#ffffff', // White text for utility buttons
        sequenceText: isDarkMode ? '#66aaff' : '#007bff',
        userInputText: isDarkMode ? '#bbbbbb' : '#666',
        correctSequence: isDarkMode ? '#5cb85c' : '#28a745', // Greenish
        incorrectSequence: isDarkMode ? '#d9534f' : '#dc3545', // Reddish
        hintText: isDarkMode ? '#ffc107' : '#e09a00', // Hint color - noticeable
        warningText: isDarkMode ? '#ffc107' : '#e09a00', // Warning color
        errorText: isDarkMode ? '#d9534f' : '#dc3545', // Error color
    };

    return StyleSheet.create({
        safeArea: { flex: 1, backgroundColor: colors.background },
        scrollViewContent: { flexGrow: 1 }, // Ensure ScrollView content can grow
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between', // Pushes elements apart vertically
            paddingBottom: 30,
            paddingHorizontal: 20,
            minHeight: 600, // Ensure minimum height for content spacing
        },
        statusArea: {
            flexDirection: 'row',
            justifyContent: 'space-between', // Space out items
            alignItems: 'center', // Align items vertically
            width: '100%',
            marginTop: 20,
            marginBottom: 15,
            flexWrap: 'wrap', // Allow wrapping if space is tight
        },
        levelText: { fontSize: 16, color: colors.textMuted },
        scoreText: { fontSize: 16, color: colors.textMuted },
        triesText: { fontSize: 16, color: colors.warningText, fontWeight: 'bold' }, // Highlight tries
        displayArea: {
            // flex: 1, // Don't let it take all space, allow input area to be fixed size
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 150, // Adjust as needed
            width: '100%',
            backgroundColor: colors.cardBackground,
            borderRadius: 10,
            padding: 20,
            marginBottom: 20, // Space before input area
            borderWidth: isDarkMode ? 1 : 0,
            borderColor: isDarkMode ? colors.buttonBorder : undefined,
        },
        sequenceText: {
            fontSize: 36, // Adjust size if needed
            fontWeight: 'bold',
            letterSpacing: 8,
            color: colors.sequenceText,
            textAlign: 'center',
            marginBottom: 10, // Space below sequence/input
        },
        userInputText: {
            fontSize: 32,
            fontWeight: 'bold',
            letterSpacing: 6,
            color: colors.userInputText,
            minHeight: 45, // Ensure space even when empty
            textAlign: 'center',
            marginBottom: 10,
        },
        // Specific styles for correct/incorrect display on game over
        correctSequence: { color: colors.correctSequence },
        incorrectSequence: { color: colors.incorrectSequence, textDecorationLine: 'line-through' },
        gameOverLabel: { fontSize: 14, color: colors.textMuted, marginTop: 8 },
        hintText: {
            fontSize: 18,
            color: colors.hintText,
            fontWeight: 'bold',
            marginBottom: 5,
        },
        messageText: {
            fontSize: 20, // Slightly smaller default message
            textAlign: 'center',
            color: colors.text,
            paddingHorizontal: 10,
            marginTop: 10, // Space above message
        },
        // Optional specific message styles
        gameOverMessage: { color: colors.errorText, fontWeight: 'bold' },
        warningMessage: { color: colors.warningText },

        inputArea: {
            width: '100%',
            alignItems: 'center',
            // Removed minHeight, size determined by content (number pad)
            justifyContent: 'center', // Center the pad/button vertically if needed
            paddingTop: 10, // Add some space above the pad
        },
        startButton: {
            backgroundColor: colors.startButton,
            paddingVertical: 15,
            paddingHorizontal: 40,
            borderRadius: 8,
            minWidth: 180, // Ensure decent button size
            alignItems:'center'
        },
        startButtonText: {
            color: colors.startButtonText,
            fontSize: 20,
            fontWeight: 'bold',
        },
        numberPad: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            maxWidth: 320, // Adjust max width if needed for new buttons
            alignItems: 'center',
        },
        numberButton: {
            backgroundColor: colors.buttonBackground,
            width: 65, // Slightly smaller buttons?
            height: 65,
            justifyContent: 'center',
            alignItems: 'center',
            margin: 6, // Adjust margin
            borderRadius: 32.5, // Keep circular
            borderWidth: 1,
            borderColor: colors.buttonBorder,
        },
        // Base style for utility buttons (CLR, HINT, SUBMIT)
        utilityButton: {
           width: 90, // Make utility buttons wider
           borderRadius: 8, // Rectangular?
           height: 55, // Adjust height
        },
        utilityButtonText: {
            fontSize: 14, // Smaller text for utility
            fontWeight: 'bold',
            color: colors.utilityButtonText,
             textAlign: 'center',
        },
        clearButton: { backgroundColor: colors.clearButton },
        hintButton: { backgroundColor: colors.hintButton },
        submitButton: { backgroundColor: colors.submitButton, /*width: 120*/ }, // Make submit wider?

        disabledButtonOpacity: { // Style for disabled buttons
            opacity: 0.4,
        },
        numberButtonText: {
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.buttonText,
        },
    });
};
