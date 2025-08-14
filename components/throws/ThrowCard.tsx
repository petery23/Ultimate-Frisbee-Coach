import React from 'react';
import { StyleSheet, View, TouchableOpacity, Alert, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../../app/components/ThemedText';
import { ThemedView } from '../../app/components/ThemedView';
import { useThemeColor } from '../../app/hooks/useThemeColor';
import { ThrowRecord } from '../../types';
import { toggleFavorite, deleteThrow, updateThrowName } from '../../lib/throwHistory';

interface ThrowCardProps {
  throwRecord: ThrowRecord;
  onUpdate: () => void;
  onPress?: () => void; // Optional prop for navigation
}

export default function ThrowCard({ throwRecord, onUpdate, onPress }: ThrowCardProps) {
  const iconColor = useThemeColor({}, 'accent');
  const textColor = useThemeColor({}, 'text');
  const secondaryColor = useThemeColor({}, 'secondary');

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePress = () => {
    if (onPress) {
      // Use the provided onPress handler if available
      onPress();
    } else {
      // Default navigation behavior
      router.push({
        pathname: "/throws/[id]",
        params: { id: throwRecord.id }
      });
    }
  };

  const handleFavoritePress = () => {
    try {
      // Toggle the favorite directly on the object for immediate UI update
      throwRecord.isFavorite = !throwRecord.isFavorite;
      // Also update in the data store
      toggleFavorite(throwRecord.id);
      // Notify parent component of the change
      onUpdate();
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleEditName = () => {
    Alert.prompt(
      'Edit Name',
      'Enter a new name for this throw',
      (newName) => {
        if (newName && newName.trim()) {
          try {
            // Update the name directly on the object for immediate UI update
            const oldName = throwRecord.name;
            throwRecord.name = newName.trim();
            
            // Also update in the data store
            updateThrowName(throwRecord.id, newName.trim());
            
            // Notify parent component of the change
            onUpdate();
            
            // Show confirmation
            Alert.alert(
              'Name Updated',
              `Changed from "${oldName}" to "${newName.trim()}"`,
              [{ text: 'OK' }]
            );
          } catch (error) {
            console.error("Error updating name:", error);
            Alert.alert("Error", "Could not update throw name");
          }
        }
      },
      'plain-text',
      throwRecord.name
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Throw',
      `Are you sure you want to delete "${throwRecord.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteThrow(throwRecord.id);
            onUpdate();
          }
        }
      ]
    );
  };

  return (
    <ThemedView variant="card" style={styles.card}>
      <TouchableOpacity style={styles.cardContent} onPress={handlePress} activeOpacity={0.7}>
        <View style={styles.thumbnailContainer}>
          <Image
            source={require('../../assets/images/prev_throw_sample.jpg')}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        </View>
        
        <View style={styles.infoContainer}>
          <View style={styles.nameRow}>
            <ThemedText style={styles.nameText} numberOfLines={1} ellipsizeMode="tail">
              {throwRecord.name}
            </ThemedText>
            <TouchableOpacity onPress={handleFavoritePress} style={styles.starButton}>
              <Ionicons 
                name={throwRecord.isFavorite ? 'star' : 'star-outline'} 
                size={24} 
                color={throwRecord.isFavorite ? '#FFD700' : secondaryColor}
              />
            </TouchableOpacity>
          </View>

          <ThemedText style={styles.dateText}>
            {formatDate(throwRecord.date)}
          </ThemedText>

          {/* Preview of stats */}
          <View style={styles.statsPreview}>
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>
                {throwRecord.analysisResult.hipShoulderSeparationDeg?.toFixed(1)}°
              </ThemedText>
              <ThemedText style={styles.statLabel}>Hip-Shoulder</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>
                {throwRecord.analysisResult.wristSpeedMps?.toFixed(1)} m/s
              </ThemedText>
              <ThemedText style={styles.statLabel}>Speed</ThemedText>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.actionButton} onPress={handleEditName}>
          <Ionicons name="pencil" size={16} color={iconColor} />
          <ThemedText style={[styles.buttonText, { color: iconColor }]}>Edit Name</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
          <Ionicons name="trash-bin" size={16} color={iconColor} />
          <ThemedText style={[styles.buttonText, { color: iconColor }]}>Delete</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    paddingVertical: 12,
    paddingHorizontal: 0,
    width: '100%',
  },
  cardContent: {
    flexDirection: 'row',
    padding: 8,
  },
  thumbnailContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameText: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  starButton: {
    padding: 4,
  },
  dateText: {
    fontSize: 13,
    opacity: 0.7,
    marginBottom: 6,
  },
  statsPreview: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 4,
  },
  statItem: {
    marginRight: 16,
  },
  statLabel: {
    fontSize: 11,
    opacity: 0.7,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ccc',
    paddingHorizontal: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    marginLeft: 16,
  },
  buttonText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '600',
  },
});
