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
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
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
  
// Improved NumberPad styles
numberPadContainer: {
  width: '100%',
  padding: 10,
  paddingBottom: 20,
  marginVertical: 10,
  backgroundColor: colors.card,
  borderRadius: 16,
  borderWidth: 0, // Remove border for cleaner look
  elevation: 8, // Increase container elevation
  shadowColor: '#000', // Consistent shadow color
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 8,
  alignItems: 'center',
},
numberPadRow: {
  flexDirection: 'row',
  justifyContent: 'space-between', // Better spacing
  width: '90%', // Control width of rows
  marginVertical: 5,
},
numberPadButtonBase: {
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 25, // Half of width/height for perfect circle
  elevation: 5,
  shadowColor: '#000', // Consistent shadow color
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  marginHorizontal: 30, // Adjusted for better spacing
},
numberPadButtonText: {
  fontSize: 20, 
  fontWeight: '600', // Slightly lighter than bold
  color: '#fff', // White for contrast
},
numberPadNumberButton: {
  backgroundColor: '#333333', // blackish grey
},
numberPadDeleteButton: {
  backgroundColor: '#e74c3c', // Refined red
},
numberPadDisabledButton: {
  backgroundColor: '#d1d8e0', // Light grey for disabled state
  opacity: 0.8,
  elevation: 0,
  shadowOpacity: 0,
},
numberPadDisabledContent: {
  color: '#7f8c8d', // Grey for disabled state
  opacity: 0.7,
},
numberPadDeleteIcon: {
  color: '#fff', // White for contrast
  fontSize: 20, // Consistent sizing
},
  // SequenceDisplay styles
  sequenceDisplayContainer: {
    height: 350,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  sequenceProgressBarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  sequenceNumberDisplay: {
    height: 120,
    width: 120,
    borderRadius: 60,
    backgroundColor: 'rgb(203, 42, 42)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sequenceNumberText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: 'white',
  },
  sequenceSimultaneousDisplay: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'rgb(6, 5, 5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sequenceSimultaneousNumbers: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  sequencePlaceholder: {
    height: 120,
    width: 120,
    borderRadius: 60,
    backgroundColor: colors.text,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
  
  // For backward compatibility
  export const styles = createStyles(LightTheme);