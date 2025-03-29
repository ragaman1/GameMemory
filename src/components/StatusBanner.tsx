// components/StatusBanner.tsx
import { View, Text } from 'react-native';
import { styles } from '../styles/gameStyles';

type GameState = 'idle' | 'displaying' | 'recall' | 'success' | 'failure';
import type { StatusBannerProps } from '../types/game';

export default function StatusBanner({ state }: StatusBannerProps) {
    // Define the status messages for each game state
    const statusMessages = {
      idle: 'Ready to start!',
      displaying: 'Memorize the sequence...',
      recall: 'Recall the sequence!',
      success: 'Correct! Well done!',
      failure: 'Incorrect! Game Over!'
    };
  
    return (
      <View style={[styles.statusBanner, styles[`${state}Banner`]]}>
        <Text style={styles.statusText}>{statusMessages[state]}</Text>
      </View>
    );
  }
  
  // Usage in index.tsx:
  const gameState: GameState = 'idle';
  <StatusBanner state={gameState} />