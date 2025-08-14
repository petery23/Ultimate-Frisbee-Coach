import React, { useState, useCallback } from 'react';
import { ScrollView, Image, useColorScheme, View, Platform } from 'react-native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemedView } from './components/ThemedView';
import { ThemedText } from './components/ThemedText';
import { useThemeColor } from './hooks/useThemeColor';
import PrimaryButton from '../components/PrimaryButton';
import { instructionStyles } from './styles/instructionStyles';
import { MeasurementItem, InstructionItem } from './components/InstructionComponents';

export default function InstructionsScreen() {
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({}, 'background');
  const [isNavigating, setIsNavigating] = useState(false);
  
  const handleStartRecording = useCallback(() => {
    if (isNavigating) return;
    
    setIsNavigating(true);
    router.replace('/record');
    
    // Reset after a timeout
    setTimeout(() => {
      setIsNavigating(false);
    }, 1000);
  }, [isNavigating]);

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

          <ThemedText style={instructionStyles.sectionTitle}>What We Measure</ThemedText>
          
          <MeasurementItem 
            title="Hip-Shoulder Separation" 
            description="The rotational difference between your hips and shoulders at release. Indicates proper kinetic chain sequencing." 
          />
          
          <MeasurementItem 
            title="Reachback Distance" 
            description="How far your throwing arm extends behind your body. Helps generate power and proper disc path." 
          />
          
          <MeasurementItem 
            title="Elbow Peak Timing" 
            description="When your elbow reaches maximum angular velocity relative to release. Optimal timing improves throw efficiency." 
          />
          
          <MeasurementItem 
            title="Wrist Speed" 
            description="The speed of your wrist at release. Correlates with throw power and spin." 
          />
          
          <ThemedText style={instructionStyles.sectionTitle}>Recording Instructions</ThemedText>
          
          <View style={instructionStyles.instructionsContainer}>
            <InstructionItem 
              number="1" 
              instruction="Position camera at 90° to throwing direction" 
              detail="The analysis requires a clear side profile of your throw"
            />
            
            <InstructionItem 
              number="2" 
              instruction="Place camera at chest/shoulder height" 
              detail="Too high or low will distort joint angle measurements"
            />
            
            <InstructionItem 
              number="3" 
              instruction="Stand 4-6 meters from camera" 
              detail="Full body should be visible but not too small in frame"
            />
            
            <InstructionItem 
              number="4" 
              instruction="Ensure good lighting" 
              detail="Helps with accurate body landmark detection"
            />
            
            <InstructionItem 
              number="5" 
              instruction="Wear contrasting clothing" 
              detail="Makes it easier to detect your joints and movements"
            />
          </View>

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
            
            <View style={instructionStyles.buttonWrapper}>
              <PrimaryButton 
                label="Go Back"
                onPress={() => router.replace('/')}
                disabled={isNavigating}
                variant="secondary"
                style={{marginTop: 12}}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
