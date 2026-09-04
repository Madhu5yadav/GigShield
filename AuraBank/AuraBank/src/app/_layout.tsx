import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuraProvider } from '../context/AuraContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuraProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }} />
      </AuraProvider>
    </SafeAreaProvider>
  );
}
