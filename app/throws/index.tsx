import React, { useState, useEffect } from 'react';
import { StyleSheet, SectionList, RefreshControl } from 'react-native';
import { Stack, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';
import { useThemeColor } from '../hooks/useThemeColor';
import { ThrowRecord } from '../../types';
import { getThrowsSorted, getThrowById } from '../../lib/throwHistory';
import ThrowCard from '../../components/throws/ThrowCard';

export default function ThrowsListScreen() {
  const [throws, setThrows] = useState<ThrowRecord[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const accentColor = useThemeColor({}, 'accent');

  // Separate favorites and regular throws
  const favoriteThrows = throws.filter(throw_ => throw_.isFavorite);
  const regularThrows = throws.filter(throw_ => !throw_.isFavorite);

  // Load throws data
  const loadThrows = () => {
    try {
      const sortedThrows = getThrowsSorted();
      setThrows(sortedThrows);
      console.log(`Loaded ${sortedThrows.length} throws`);
    } catch (error) {
      console.error('Error loading throws:', error);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadThrows();
  }, []);

  // Reload data when screen comes into focus (e.g., returning from detail view)
  useFocusEffect(
    React.useCallback(() => {
      console.log('Throws screen focused, reloading data...');
      loadThrows();
    }, [])
  );

  // Pull to refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    loadThrows();
    setTimeout(() => setRefreshing(false), 500);
  };

  // Handle updates from ThrowCard actions
  const handleThrowUpdate = (updatedThrowId?: string, action?: 'favorite' | 'name' | 'delete') => {
    console.log(`handleThrowUpdate called with ID: ${updatedThrowId}, action: ${action}`);
    
    if (updatedThrowId && action === 'favorite') {
      // For favorite toggles, get the updated state from the data store
      const updatedThrow = getThrowById(updatedThrowId);
      if (updatedThrow) {
        setThrows(prevThrows => {
          const updatedThrows = prevThrows.map(throw_ => 
            throw_.id === updatedThrowId 
              ? { ...throw_, isFavorite: updatedThrow.isFavorite }
              : throw_
          );
          console.log(`Updated throws state - throw ${updatedThrowId} is now ${updatedThrow.isFavorite ? 'favorited' : 'unfavorited'}`);
          console.log(`Favorites count: ${updatedThrows.filter(t => t.isFavorite).length}`);
          return updatedThrows;
        });
      }
    } else {
      // For other actions, reload from data source
      console.log('Reloading throws from data source...');
      setTimeout(() => {
        loadThrows();
      }, 0);
    }
  };  // Render individual throw item
  const renderItem = ({ item }: { item: ThrowRecord }) => (
    <ThrowCard 
      throwRecord={item} 
      onUpdate={handleThrowUpdate}
    />
  );

  // Render section header
  const renderSectionHeader = ({ section }: { section: any }) => (
    <ThemedView style={styles.sectionHeader}>
      <ThemedText style={styles.sectionTitle}>{section.title}</ThemedText>
      <ThemedText style={styles.sectionCount}>
        {section.data.length} {section.data.length === 1 ? 'throw' : 'throws'}
      </ThemedText>
    </ThemedView>
  );

  // Empty state
  const renderEmptyState = () => (
    <ThemedView style={styles.emptyContainer}>
      <Ionicons name="disc" size={64} color={accentColor} />
      <ThemedText style={styles.emptyTitle}>No Throws Yet</ThemedText>
      <ThemedText style={styles.emptyText}>
        Record your first throw to analyze your technique and start building your history
      </ThemedText>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Throw History",
          headerTitleStyle: { fontWeight: '600' },
        }}
      />
      
      <SectionList
        sections={[
          ...(favoriteThrows.length > 0 ? [{
            title: "⭐ Favorites",
            data: favoriteThrows,
          }] : []),
          ...(regularThrows.length > 0 ? [{
            title: "All Throws",
            data: regularThrows,
          }] : []),
        ]}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[accentColor]}
            tintColor={accentColor}
          />
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
    flexGrow: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4CAF50', // Changed from cyan to green
  },
  sectionCount: {
    fontSize: 14,
    opacity: 0.7,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    marginTop: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
});
