import { Redirect } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';

export default function TrackTab() {
  const role = useAuthStore(s => s.activeRole);
  return <Redirect href={role === 'courier' ? '/courier/requests' : '/shipment/history'} />;
}
