import React, { useState, useCallback, useRef } from 'react';
import { ScrollView, Image, useColorScheme, View, Platform, Animated } from 'react-native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemedView } from './components/ThemedView';
import { ThemedText } from './components/ThemedText';
import { useThemeColor } from './hooks/useThemeColor';
import PrimaryButton from '../components/PrimaryButton';
import { instructionStyles } from './styles/instructionStyles';

export default function InstructionsScreen() {
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({}, 'background');
  const accentColor = useThemeColor({}, 'accent');
  const [isNavigating, setIsNavigating] = useState(false);
  
  const handleStartRecording = useCallback(() => {
    if (isNavigating) return;
    
    setIsNavigating(true);
    router.push('/record');
    
    // Reset after a timeout
    setTimeout(() => {
      setIsNavigating(false);
    }, 1000);
  }, [isNavigating]);

  const AnimatedStep = ({ number, title, description, delay = 0 }: { 
    number: number; 
    title: string; 
    description: string; 
    delay?: number;
  }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateAnim = useRef(new Animated.Value(30)).current;

    React.useEffect(() => {
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(translateAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ]).start();
      }, delay);

      return () => clearTimeout(timer);
    }, []);

    return (
      <Animated.View 
        style={[
          instructionStyles.stepContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: translateAnim }],
          }
        ]}
      >
        <View style={[instructionStyles.stepNumber, { backgroundColor: accentColor }]}>
          <ThemedText style={instructionStyles.stepNumberText}>{number}</ThemedText>
        </View>
        <View style={instructionStyles.stepContent}>
          <ThemedText style={instructionStyles.stepTitle}>{title}</ThemedText>
          <ThemedText style={instructionStyles.stepDescription}>{description}</ThemedText>
        </View>
      </Animated.View>
    );
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      <Stack.Screen
        options={{
          title: "Recording Instructions",
          headerTitleStyle: { fontWeight: '600' },
        }}
      />
      
      <ScrollView 
        style={{ flex: 1, width: '100%' }} 
        contentContainerStyle={instructionStyles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={instructionStyles.container}>
          <ThemedText style={instructionStyles.title}>How to Record Your Throw</ThemedText>

          <AnimatedStep 
            number={1}
            title="Position Camera at 90°" 
            description="Place your camera perpendicular to your throwing direction for a clear side profile"
            delay={200}
          />
          
          <AnimatedStep 
            number={2}
            title="Set Camera Height" 
            description="Position at chest/shoulder height to avoid distorting joint angle measurements"
            delay={400}
          />
          
          <AnimatedStep 
            number={3}
            title="Find the Right Distance" 
            description="Stand 4-6 meters away so your full body is visible but not too small"
            delay={600}
          />
          
          <AnimatedStep 
            number={4}
            title="Check Your Lighting" 
            description="Ensure good lighting conditions for accurate body landmark detection"
            delay={800}
          />
          
          <AnimatedStep 
            number={5}
            title="Wear Contrasting Clothes" 
            description="Choose clothing that contrasts with your background for better joint detection"
            delay={1000}
          />

          {/* Top-down view diagram */}
          <View style={instructionStyles.imageContainer}>
            <ThemedText style={instructionStyles.imageCaption}>Top View - Camera Position</ThemedText>
            <Image 
              source={require('../assets/images/recording_setup_top.png')} 
              style={instructionStyles.instructionImage}
              resizeMode="contain"
            />
            <ThemedText style={instructionStyles.imageTip}>Position camera at exactly 90° to your throwing direction</ThemedText>
          </View>

          {/* Side view diagram */}
          <View style={instructionStyles.imageContainer}>
            <ThemedText style={instructionStyles.imageCaption}>Side View - Camera Height & Distance</ThemedText>
            <Image 
              source={require('../assets/images/recording_setup_side.png')} 
              style={instructionStyles.instructionImage}
              resizeMode="contain"
            />
            <ThemedText style={instructionStyles.imageTip}>Camera should be at chest height, 4-6m away</ThemedText>
          </View>
          
          <View style={instructionStyles.noteContainer}>
            <ThemedText style={instructionStyles.noteTitle}>Important!</ThemedText>
            <ThemedText style={instructionStyles.noteText}>
              • You should be throwing <ThemedText style={instructionStyles.boldText}>perpendicular</ThemedText> to the camera's view
            </ThemedText>
            <ThemedText style={instructionStyles.noteText}>
              • The camera should see your <ThemedText style={instructionStyles.boldText}>complete side profile</ThemedText> during the throw
            </ThemedText>
            <ThemedText style={instructionStyles.noteText}>
              • Aim your throw <ThemedText style={instructionStyles.boldText}>parallel to the camera</ThemedText>, not at it
            </ThemedText>
          </View>

          <View style={instructionStyles.buttonContainer}>
            <View style={instructionStyles.buttonWrapper}>
              <PrimaryButton 
                label="Start Recording!" 
                onPress={handleStartRecording}
                disabled={isNavigating}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
