import { Redirect } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';

export default function ShipTab() {
  const role = useAuthStore(s => s.activeRole);
  return <Redirect href={role === 'courier' ? '/courier/create-trip' : '/shipment/create'} />;
}
