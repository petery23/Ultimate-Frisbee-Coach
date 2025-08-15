import React, { useRef } from "react";
import { Text, Pressable, StyleSheet, Platform, Animated } from "react-native";
import * as Haptics from 'expo-haptics';
import { useThemeColor } from "../app/hooks/useThemeColor";

export default function PrimaryButton({ label, onPress, disabled }: { label: string; onPress?: () => void; disabled?: boolean }) {
  const backgroundColor = useThemeColor({}, 'accent');
  const textColor = useThemeColor({}, 'background');
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    // Haptic feedback on press
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false, // Keep as false since we're animating background color
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false, // Keep as false since we're animating background color
      }),
    ]).start();
  };

  const handlePress = () => {
    // Success haptic when action completes
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress?.();
  };

  const glowColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(76, 175, 80, 0)', 'rgba(76, 175, 80, 0.3)'],
  });
  
  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
      }}
    >
      <Animated.View
        style={[
          styles.glowContainer,
          {
            backgroundColor: glowColor,
          }
        ]}
      >
        <Pressable 
          style={[styles.button, { 
            backgroundColor,
            opacity: disabled ? 0.7 : 1 
          }]} 
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled}
        >
          <Text style={[styles.label, { color: textColor }]}>{label}</Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  glowContainer: {
    borderRadius: 15,
    padding: 3,
  },
  button: { 
    paddingHorizontal: 20, 
    paddingVertical: 14, 
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  label: { 
    fontWeight: "600",
    textAlign: 'center',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});


