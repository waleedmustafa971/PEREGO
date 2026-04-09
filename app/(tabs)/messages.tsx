import { useCallback } from 'react';
import { useFocusEffect, router } from 'expo-router';

export default function MessagesTab() {
  useFocusEffect(useCallback(() => {
    router.replace('/chat/');
  }, []));

  return null;
}
