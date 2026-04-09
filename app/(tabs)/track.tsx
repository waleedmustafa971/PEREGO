import { useCallback } from 'react';
import { useFocusEffect, router } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';

export default function TrackTab() {
  const role = useAuthStore(s => s.activeRole);

  useFocusEffect(useCallback(() => {
    router.replace(role === 'courier' ? '/courier/requests' : '/shipment/history');
  }, [role]));

  return null;
}
