import React, { useEffect, useRef } from 'react';
import { Animated, Text, View, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';

interface AchievementToastProps {
  visible: boolean;
  title: string;
  description: string;
  icon: string;
  onDismiss: () => void;
}

export default function AchievementToast({ 
  visible, 
  title, 
  description, 
  icon, 
  onDismiss 
}: AchievementToastProps) {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Success haptic for achievement
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Slide in and scale up
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 50,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 120,
          friction: 6,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(glowAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: false,
            }),
            Animated.timing(glowAnim, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: false,
            }),
          ])
        )
      ]).start();

      // Auto dismiss after 3 seconds
      const timer = setTimeout(() => {
        hideToast();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  };

  if (!visible) return null;

  const glowColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255, 215, 0, 0)', 'rgba(255, 215, 0, 0.3)']
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ],
        }
      ]}
    >
      <Animated.View 
        style={[
          styles.content,
          {
            backgroundColor: glowColor,
          }
        ]}
      >
        <Text style={styles.icon}>{icon}</Text>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    zIndex: 1000,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  icon: {
    fontSize: 32,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
});
