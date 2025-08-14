import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';
import { useThemeColor } from '../hooks/useThemeColor';
import { ThrowRecord } from '../../types';
import { getThrowsSorted } from '../../lib/throwHistory';
import ThrowCard from '../../components/throws/ThrowCard';

export default function ThrowsListScreen() {
  const [throws, setThrows] = useState<ThrowRecord[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const accentColor = useThemeColor({}, 'accent');

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

  // Pull to refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    loadThrows();
    setTimeout(() => setRefreshing(false), 500);
  };

  // Handle updates from ThrowCard actions
  const handleThrowUpdate = () => {
    loadThrows();
  };

  // Render individual throw item
  const renderItem = ({ item }: { item: ThrowRecord }) => (
    <ThrowCard 
      throwRecord={item} 
      onUpdate={handleThrowUpdate}
    />
  );

  // Empty state
  const renderEmptyState = () => (
    <ThemedView style={styles.emptyContainer}>
      <Ionicons name="disc" size={64} color={accentColor} />
      <ThemedText style={styles.emptyTitle}>No Previous Throws</ThemedText>
      <ThemedText style={styles.emptyText}>
        Record a throw to analyze your technique and save it here
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
      
      <FlatList
        data={throws}
        renderItem={renderItem}
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
