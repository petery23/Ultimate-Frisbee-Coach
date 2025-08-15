import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../app/components/ThemedText';
import { ThemedView } from '../app/components/ThemedView';
import { useThemeColor } from '../app/hooks/useThemeColor';

interface StreakBadgeProps {
  streakCount: number;
  totalThrows: number;
}

export default function StreakBadge({ streakCount, totalThrows }: StreakBadgeProps) {
  const accentColor = useThemeColor({}, 'accent');
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation for streak badge
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    const glow = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    );

    if (streakCount >= 3) {
      pulse.start();
      glow.start();
    }

    return () => {
      pulse.stop();
      glow.stop();
    };
  }, [streakCount]);

  const getStreakIcon = () => {
    if (streakCount >= 10) return "trophy";
    if (streakCount >= 5) return "medal";
    if (streakCount >= 3) return "flame";
    return "trending-up";
  };

  const getStreakColor = () => {
    if (streakCount >= 10) return "#FFD700"; // Gold
    if (streakCount >= 5) return "#FF6B35"; // Orange
    if (streakCount >= 3) return "#FF4757"; // Red
    return accentColor;
  };

  const glowColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255, 71, 87, 0)', 'rgba(255, 71, 87, 0.4)'],
  });

  return (
    <View style={styles.container}>
      <ThemedView variant="card" style={styles.badgeContainer}>
        <View style={styles.badgeRow}>
          <Animated.View
            style={[
              styles.iconContainer,
              {
                transform: [{ scale: pulseAnim }],
              }
            ]}
          >
            <Animated.View
              style={{
                backgroundColor: glowColor,
                borderRadius: 20,
                padding: 2,
              }}
            >
              <Ionicons 
                name={getStreakIcon()} 
                size={24} 
                color={getStreakColor()}
              />
            </Animated.View>
          </Animated.View>
          
          <View style={styles.textContainer}>
            <ThemedText style={styles.streakText}>
              {streakCount} day streak!
            </ThemedText>
            <ThemedText style={styles.totalText}>
              {totalThrows} total throws
            </ThemedText>
          </View>
        </View>
        
        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: '#E0E0E0' }]}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  backgroundColor: getStreakColor(),
                  width: `${Math.min((streakCount % 5) * 20, 100)}%`,
                }
              ]}
            />
          </View>
          <ThemedText style={styles.progressText}>
            {5 - (streakCount % 5)} throws to next level
          </ThemedText>
        </View>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  badgeContainer: {
    padding: 16,
    borderRadius: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    marginRight: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  textContainer: {
    flex: 1,
  },
  streakText: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  totalText: {
    fontSize: 14,
    opacity: 0.7,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    opacity: 0.6,
    textAlign: 'center',
  },
});
