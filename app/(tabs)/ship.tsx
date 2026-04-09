import { useCallback } from 'react';
import { useFocusEffect, router } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';

export default function ShipTab() {
  const role = useAuthStore(s => s.activeRole);

  useFocusEffect(useCallback(() => {
    router.replace(role === 'courier' ? '/courier/create-trip' : '/shipment/create');
  }, [role]));

  return null;
}
