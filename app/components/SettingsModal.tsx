// app/components/SettingsModal.tsx
import React from 'react';
import { Modal, View, Text, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useGame } from '../../src/contexts/GameContext';

type SettingsModalProps = {
  visible: boolean;
  onClose: () => void;
};

const SettingsModal: React.FC<SettingsModalProps> = ({ visible, onClose }) => {
  const { theme, toggleTheme, colors } = useTheme();
  const { displayMode, toggleDisplayMode, gameState } = useGame();
  
  // Only allow changing display mode when game is idle or failed
  const canChangeDisplayMode = gameState === 'idle' || gameState === 'failure';
  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={[styles.modalView, { backgroundColor: colors.card }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>Settings</Text>
          
          {/* Theme toggle */}
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              Dark Mode
            </Text>
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: colors.inputDotFilled }}
            />
          </View>
          
          {/* Display mode toggle */}
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              Display Mode
            </Text>
            <View style={styles.displayModeContainer}>
              <Text style={[styles.modeLabel, { color: colors.textSecondary }]}>
                {displayMode === 'sequential' ? 'One by One' : 'All at Once'}
              </Text>
              <Switch
                value={displayMode === 'simultaneous'}
                onValueChange={toggleDisplayMode}
                disabled={!canChangeDisplayMode}
                trackColor={{ false: '#767577', true: colors.inputDotFilled }}
              />
            </View>
          </View>
          
          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: colors.startButton }]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  settingLabel: {
    fontSize: 16,
  },
  displayModeContainer: {
    alignItems: 'flex-end',
  },
  modeLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  closeButton: {
    borderRadius: 8,
    padding: 10,
    marginTop: 20,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SettingsModal;