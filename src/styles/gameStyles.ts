import { StyleSheet, Platform } from 'react-native';
import { LightTheme, DarkTheme } from '../contexts/ThemeContext';

export const createStyles = (colors: typeof LightTheme | typeof DarkTheme) => StyleSheet.create({
  // ProgressBar styles
  progressBarContainer: {
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: 8,
  },
  progressBar: {
    height: '100%',
  },
  // Base styles
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  textPrimary: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  textSecondary: {
    color: colors.textSecondary,
    fontSize: 20,
    fontStyle: 'italic',
  },
  textButton: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  textStatus: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoText: {
    color: colors.text,
    fontSize: 16,
    marginHorizontal: 5,
  },
  placeholderText: {
    color: colors.textSecondary,
    fontSize: 18,
    fontStyle: 'italic',
  },

  // Header styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  // Game area styles
  gameArea: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 20,
  },
  inputDisplay: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
    width: '100%',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    maxWidth: '90%',
  },
  inputDot: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    borderWidth: 2,
    borderColor: colors.inputDotBorder,
    backgroundColor: colors.inputDot,
    margin: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputDotFilled: {
    backgroundColor: colors.inputDotFilled,
    borderColor: colors.inputDotFilledBorder,
  },
  inputNumber: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  failSequenceText: {
    color: colors.failureBanner,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // Placeholder styles
  placeholderArea: {
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberPadPlaceholder: {
    height: 280,
    width: '100%',
  },

  // Control area styles
  controlArea: {
    flex: 2,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  startButton: {
    backgroundColor: colors.startButton,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    minWidth: 200,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  modeLabel: {
    marginRight: 8,
    fontSize: 14,
    color: colors.text,
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  
  // NumberPad styles
  numberPadContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  numberPadRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  numberPadButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  numberPadButtonBase: {
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  numberPadNumberButton: {
    backgroundColor: '#3498db',
  },
  numberPadDeleteButton: {
    backgroundColor: '#e74c3c',
  },
  numberPadDisabledButton: {
    backgroundColor: '#bdc3c7',
    elevation: 0,
    shadowOpacity: 0,
  }
});

// For backward compatibility
export const styles = createStyles(LightTheme);