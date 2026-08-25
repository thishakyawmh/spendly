import { Stack } from 'expo-router';
import SafeScreen from '../components/SafeScreen';

export default function RootLayout() {
  return (
    <SafeScreen>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="about" options={{ title: 'About' }} />
      </Stack>
    </SafeScreen>
  );
}
