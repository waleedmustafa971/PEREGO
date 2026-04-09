import { Stack } from 'expo-router';

export default function ShipmentLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="create" />
      <Stack.Screen name="browse-travelers" />
      <Stack.Screen name="booking" />
      <Stack.Screen name="payment" />
      <Stack.Screen name="tracking" />
      <Stack.Screen name="history" />
    </Stack>
  );
}
