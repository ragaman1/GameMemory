// app/styles/memoryGameStyles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  infoText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusBanner: {
    width: '100%',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  idleBanner: {
    backgroundColor: '#95a5a6',
  },
  displayingBanner: {
    backgroundColor: '#3498db',
  },
  recallBanner: {
    backgroundColor: '#2ecc71',
  },
  successBanner: {
    backgroundColor: '#2ecc71',
  },
  failureBanner: {
    backgroundColor: '#e74c3c',
  },
  statusText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameArea: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  inputDisplay: {
    alignItems: 'center',
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    maxWidth: '90%',
  },
  inputDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#3498db',
    marginHorizontal: 5,
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputDotFilled: {
    backgroundColor: '#3498db',
  },
  inputNumber: {
    color: 'white',
    fontWeight: 'bold',
  },
  controlArea: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 30,
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
  numberPadContainer: {
    flex: 3,
  },
});

export default styles; 