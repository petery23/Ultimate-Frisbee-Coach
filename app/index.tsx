// app/index.tsx
import React, { useRef, useEffect, useState } from "react";
import { StyleSheet, View, Image, useColorScheme, Animated } from "react-native";
import { ThemedView } from "./components/ThemedView";
import { ThemedText } from "./components/ThemedText";
import { useThemeColor } from "./hooks/useThemeColor";
import { useNavigationDebounce } from "./hooks/useNavigationDebounce";
import PrimaryButton from "../components/PrimaryButton";
import StreakBadge from "../components/StreakBadge";
import AchievementToast from "../components/AchievementToast";
import { getThrowsSorted } from "../lib/throwHistory";

export default function Index() {
  const colorScheme = useColorScheme();
  const buttonBgColor = useThemeColor({}, 'accent');
  const buttonTextColor = useThemeColor({}, 'background');
  const navigation = useNavigationDebounce(500); // 500ms debounce
  
  // Stats for gamification
  const [throwStats, setThrowStats] = useState({ streak: 0, total: 0 });
  
  // Achievement toast state
  const [achievementToast, setAchievementToast] = useState({
    visible: false,
    title: '',
    description: '',
    icon: ''
  });
  
  // Animation values
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(30)).current;
  const captionOpacity = useRef(new Animated.Value(0)).current;
  const captionTranslateY = useRef(new Animated.Value(20)).current;
  const streakOpacity = useRef(new Animated.Value(0)).current;
  const streakTranslateY = useRef(new Animated.Value(20)).current;
  const button1Opacity = useRef(new Animated.Value(0)).current;
  const button1TranslateY = useRef(new Animated.Value(20)).current;
  const button2Opacity = useRef(new Animated.Value(0)).current;
  const button2TranslateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Load throw stats for gamification
    const throws = getThrowsSorted();
    const today = new Date();
    const newStreak = calculateStreak(throws, today);
    const prevStreak = throwStats.streak;
    
    setThrowStats({ streak: newStreak, total: throws.length });
    
    // Check for new achievements
    if (newStreak > prevStreak) {
      checkForAchievements(newStreak, prevStreak);
    }
  }, []);

  const calculateStreak = (throws: any[], today: Date) => {
    // Simple streak calculation - consecutive days with throws
    if (throws.length === 0) return 0;
    
    let streak = 0;
    let currentDate = new Date(today);
    
    for (let i = 0; i < 30; i++) { // Check last 30 days
      const dayStart = new Date(currentDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(currentDate);
      dayEnd.setHours(23, 59, 59, 999);
      
      const hasThrowOnDay = throws.some(throw_ => {
        const throwDate = new Date(throw_.date);
        return throwDate >= dayStart && throwDate <= dayEnd;
      });
      
      if (hasThrowOnDay) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (i === 0) {
        // No throw today, streak is 0
        break;
      } else {
        // End of streak
        break;
      }
    }
    
    return streak;
  };

  const checkForAchievements = (newStreak: number, prevStreak: number) => {
    // Check for streak milestones
    if (newStreak >= 10 && prevStreak < 10) {
      showAchievement("🏆 Streak Legend!", "10 days in a row! You're unstoppable!", "🏆");
    } else if (newStreak >= 5 && prevStreak < 5) {
      showAchievement("🥇 Streak Master!", "5 days in a row! Keep it up!", "🥇");
    } else if (newStreak >= 3 && prevStreak < 3) {
      showAchievement("🔥 On Fire!", "3 day streak started!", "🔥");
    }
  };

  const showAchievement = (title: string, description: string, icon: string) => {
    setAchievementToast({
      visible: true,
      title,
      description,
      icon
    });
  };

  const hideAchievement = () => {
    setAchievementToast(prev => ({ ...prev, visible: false }));
  };

  useEffect(() => {
    // Staggered animation sequence
    Animated.sequence([
      // Logo animation
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      // Title animation
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(titleTranslateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Caption animation
      Animated.parallel([
        Animated.timing(captionOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(captionTranslateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      // Streak animation
      Animated.parallel([
        Animated.timing(streakOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(streakTranslateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      // Button animations
      Animated.parallel([
        Animated.parallel([
          Animated.timing(button1Opacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(button1TranslateY, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(button2Opacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(button2TranslateY, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();
  }, []);
  
  return (
    <>
      <ThemedView variant="container" style={styles.container}>
        <Animated.View 
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            }
          ]}
        >
          <ThemedView
            style={styles.logoBackground}
            variant="card"
          >
            <Image 
              source={require('../assets/images/ultimate_logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </ThemedView>
        </Animated.View>

        <Animated.View
          style={{
            opacity: titleOpacity,
            transform: [{ translateY: titleTranslateY }],
          }}
        >
          <ThemedText type="title" style={styles.title}>Ultimate Frisbee Coach</ThemedText>
        </Animated.View>

        <Animated.View
          style={{
            opacity: captionOpacity,
            transform: [{ translateY: captionTranslateY }],
          }}
        >
          <ThemedText type="caption" style={styles.caption}>Record a 4s side‑view throw to analyze.</ThemedText>
        </Animated.View>

        {/* Streak Badge with animation */}
        {throwStats.total > 0 && (
          <Animated.View
            style={{
              opacity: streakOpacity,
              transform: [{ translateY: streakTranslateY }],
              width: '100%',
              maxWidth: 300,
            }}
          >
            <StreakBadge streakCount={throwStats.streak} totalThrows={throwStats.total} />
          </Animated.View>
        )}
        
        <Animated.View 
          style={[
            styles.buttonContainer,
            {
              opacity: button1Opacity,
              transform: [{ translateY: button1TranslateY }],
            }
          ]}
        >
          <PrimaryButton 
            label="Record New Throw" 
            onPress={() => navigation.push("/instructions" as any)}
          />
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.buttonContainer,
            {
              opacity: button2Opacity,
              transform: [{ translateY: button2TranslateY }],
            }
          ]}
        >
          <PrimaryButton 
            label="View previous throws" 
            onPress={() => navigation.push("/throws" as any)}
          />
        </Animated.View>
      </ThemedView>

      {/* Achievement Toast */}
      <AchievementToast
        visible={achievementToast.visible}
        title={achievementToast.title}
        description={achievementToast.description}
        icon={achievementToast.icon}
        onDismiss={hideAchievement}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    padding: 24, 
    gap: 12 
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoBackground: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 60,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  logo: { 
    width: 90, 
    height: 90,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 28,
    fontWeight: '700',
  },
  caption: {
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.8,
    fontSize: 16,
    lineHeight: 22,
  },
  buttonContainer: {
    marginTop: 8,
    width: 'auto',
    maxWidth: 240,
    alignSelf: 'center',
  },
});
