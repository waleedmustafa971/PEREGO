import { Stack } from 'expo-router';

export default function CourierLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="create-trip" />
      <Stack.Screen name="my-trips" />
      <Stack.Screen name="requests" />
      <Stack.Screen name="pickup" />
      <Stack.Screen name="status" />
      <Stack.Screen name="delivery" />
    </Stack>
  );
}
