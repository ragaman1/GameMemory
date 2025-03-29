// app/styles/memoryGameStyles.ts
import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7', // Slightly different background from example
    // SafeAreaView typically handles top padding, but explicit padding top for Android can be added if needed
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Use space-around or space-between
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white', // Keep white or match theme
    borderBottomWidth: 1,
    borderBottomColor: '#d0d0d0', // Slightly different color
  },
  infoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333', // Darker color
  },
  statusBanner: {
    width: '100%',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    // Ensure elevation or zIndex if it needs to overlap sometimes (usually not needed)
  },
  // Banner background colors seem fine, keep them as they are
  idleBanner: { backgroundColor: '#95a5a6' },
  displayingBanner: { backgroundColor: '#3498db' },
  recallBanner: { backgroundColor: '#f1c40f' }, // Example: Yellow for recall
  successBanner: { backgroundColor: '#2ecc71' },
  failureBanner: { backgroundColor: '#e74c3c' },
  statusText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameArea: {
    flex: 3, // Adjusted flex ratio example (game: 3, controls: 2)
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 20,
  },
  // --- Styles for Input Feedback Area ---
  inputDisplay: {
    alignItems: 'center',
    justifyContent: 'center', // Center content vertically
    minHeight: 60, // Give it some minimum space
    width: '100%', // Take full width for centering row
    // marginBottom: 20, // Removed marginBottom, let spacing be handled by parent flex
  },
   failSequenceText: { // Style for showing sequence on failure
    color: '#e74c3c', // Use failure color
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap', // Important for longer sequences
    maxWidth: '90%', // Prevent excessive width on large screens
  },
  inputDot: {
    width: 35, // Slightly larger dots
    height: 35,
    borderRadius: 17.5,
    borderWidth: 2, // Thicker border
    borderColor: '#a0a0a0', // Neutral border color
    backgroundColor: '#e0e0e0', // Light background for empty
    margin: 4, // Spacing between dots
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputDotFilled: {
    backgroundColor: '#3498db', // Blue for filled
    borderColor: '#2980b9', // Darker blue border
  },
  inputNumber: { // Text inside the dot
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16, // Adjust size as needed
  },
  // --- Style for Idle Placeholder ---
  placeholderArea: { // Used inside gameArea when idle
      minHeight: 60,
      justifyContent: 'center',
      alignItems: 'center',
  },
  placeholderText: { // Text for idle placeholder
      fontSize: 20,
      color: '#888',
      fontStyle: 'italic',
  },
  // --- Styles for Control Area (Button or NumberPad) ---
  controlArea: {
    flex: 2, // Adjusted flex ratio example
    width: '100%',
    justifyContent: 'center', // Center content (button/numpad/placeholder) vertically
    alignItems: 'center', // Center content horizontally
    paddingBottom: 20, // Padding at the very bottom
    // minHeight: 280, // Optional: Set minimum height if needed for layout stability
  },
  startButton: {
    backgroundColor: '#2ecc71', // Green for start/again
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
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  // Removed numberPadContainer as controlArea handles the layout
  // --- Style for NumberPad Placeholder ---
  numberPadPlaceholder: { // Takes up space when NumberPad is hidden
    // Define height based on estimated NumberPad size to prevent layout shifts
    // Adjust this value based on your NumberPad's actual rendered height
    height: 280,
    width: '100%', // Ensure it takes width if needed
  },
});
