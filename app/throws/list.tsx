import React from 'react';
import { FlatList } from 'react-native';
import { Stack, router } from 'expo-router';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';

const DATA = [
  { id: '1', name: 'Test Throw 1' },
  { id: '2', name: 'Test Throw 2' },
  { id: '3', name: 'Test Throw 3' }
];

export default function ThrowsListScreen() {
  const handlePress = (id: string) => {
    console.log('Navigation to ID: ' + id);
    router.push({
      pathname: '/throws/[id]' as any,
      params: { id }
    });
  };

  const renderItem = ({ item }: { item: typeof DATA[0] }) => (
    <ThemedView style={{ padding: 20, margin: 10, backgroundColor: '#f0f0f0' }}>
      <ThemedText onPress={() => handlePress(item.id)}>{item.name}</ThemedText>
    </ThemedView>
  );

  return (
    <ThemedView style={{ flex: 1 }}>
      <Stack.Screen options={{ title: 'Throw History' }} />
      <FlatList data={DATA} renderItem={renderItem} keyExtractor={(item) => item.id} />
    </ThemedView>
  );
}
