import React from 'react';
import { StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';
import { useThemeColor } from '../hooks/useThemeColor';
import { getThrowById } from '../../lib/throwHistory';

export default function ThrowDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const accentColor = useThemeColor({}, 'accent');
  
  // Get throw data
  const throwRecord = id ? getThrowById(id) : null;

  // If throw not found, show error state
  if (!throwRecord) {
    return (
      <ThemedView style={styles.container}>
        <Stack.Screen
          options={{
            title: "Throw Not Found",
            headerTitleStyle: { fontWeight: '600' },
          }}
        />
        
        <ThemedView style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color="#FF6B6B" />
          <ThemedText style={styles.errorTitle}>Throw Not Found</ThemedText>
          <ThemedText style={styles.errorText}>
            The throw you're looking for could not be found.
          </ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  // Show delete confirmation
  const handleDelete = () => {
    Alert.alert(
      "Delete Throw",
      `Are you sure you want to delete the throw from ${throwRecord.date}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            // For now just go back, would implement actual deletion later
            router.back();
          }
        }
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: throwRecord.name,
          headerTitleStyle: { fontWeight: '600' },
          headerRight: () => (
            <ThemedView style={{ flexDirection: 'row', gap: 8 }}>
              <Ionicons 
                name="trash" 
                size={20} 
                color="#FF6B6B" 
                onPress={handleDelete}
                style={{ padding: 4 }}
              />
            </ThemedView>
          ),
        }}
      />
      
      <ScrollView style={styles.scrollContainer}>
        <ThemedView style={styles.content}>
          
          {/* Video Player Placeholder */}
          <ThemedView style={styles.videoSection}>
            <Image
              source={require('../../assets/images/prev_throw_sample.jpg')}
              style={styles.videoPlaceholder}
              resizeMode="cover"
            />
            <ThemedView style={styles.videoControls}>
              <Ionicons name="play-circle" size={48} color="rgba(255, 255, 255, 0.8)" />
            </ThemedView>
          </ThemedView>

          {/* Analysis Results */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Analysis Results</ThemedText>
            
            {throwRecord.analysisResult.hipShoulderSeparationDeg && (
              <ThemedView style={styles.analysisItem}>
                <ThemedText style={styles.analysisLabel}>Hip-Shoulder Separation</ThemedText>
                <ThemedText style={styles.analysisValue}>
                  {throwRecord.analysisResult.hipShoulderSeparationDeg.toFixed(1)}°
                </ThemedText>
              </ThemedView>
            )}
            
            {throwRecord.analysisResult.reachbackPx && (
              <ThemedView style={styles.analysisItem}>
                <ThemedText style={styles.analysisLabel}>Reachback</ThemedText>
                <ThemedText style={styles.analysisValue}>
                  {throwRecord.analysisResult.reachbackPx} px
                </ThemedText>
              </ThemedView>
            )}
            
            {throwRecord.analysisResult.elbowPeakMs && (
              <ThemedView style={styles.analysisItem}>
                <ThemedText style={styles.analysisLabel}>Elbow Peak</ThemedText>
                <ThemedText style={styles.analysisValue}>
                  {throwRecord.analysisResult.elbowPeakMs} ms
                </ThemedText>
              </ThemedView>
            )}
            
            {throwRecord.analysisResult.wristSpeedMps && (
              <ThemedView style={styles.analysisItem}>
                <ThemedText style={styles.analysisLabel}>Wrist Speed</ThemedText>
                <ThemedText style={styles.analysisValue}>
                  {throwRecord.analysisResult.wristSpeedMps.toFixed(1)} m/s
                </ThemedText>
              </ThemedView>
            )}
          </ThemedView>

          {/* Coaching Tip */}
          {throwRecord.analysisResult.tip && (
            <ThemedView style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Coaching Tip</ThemedText>
              <ThemedView style={styles.tipContainer}>
                <Ionicons name="bulb" size={20} color="#FFE66D" style={{ marginRight: 8 }} />
                <ThemedText style={styles.tipText}>
                  {throwRecord.analysisResult.tip}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          )}

        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  videoSection: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  videoPlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#000',
  },
  videoControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  section: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#4CAF50', // Changed from cyan to green
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoLabel: {
    fontSize: 14,
    opacity: 0.8,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  analysisItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  analysisLabel: {
    fontSize: 14,
    opacity: 0.8,
  },
  analysisValue: {
    fontSize: 14,
    fontWeight: '600', // Made bold
    color: '#4CAF50', // Changed from cyan to green
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    backgroundColor: 'rgba(255, 230, 109, 0.1)',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FFE66D',
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.9,
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: '#FF6B6B',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
});
