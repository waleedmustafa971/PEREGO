import React from 'react';
import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { colors, fonts } from '@/lib/theme';
import { useAuthStore } from '@/stores/authStore';

function TabIcon({ icon, focused }: { icon: string; focused: boolean }) {
  return <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.4 }}>{icon}</Text>;
}

export default function TabLayout() {
  const role = useAuthStore(s => s.activeRole);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.white, borderTopColor: colors.gray200, paddingBottom: 20, paddingTop: 8, height: 70 },
        tabBarActiveTintColor: colors.teal,
        tabBarInactiveTintColor: colors.gray400,
        tabBarLabelStyle: { fontFamily: fonts.bodySemiBold, fontSize: 10 },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon icon="🏠" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="ship"
        options={{
          title: role === 'courier' ? 'Trips' : 'Ship',
          tabBarIcon: ({ focused }) => <TabIcon icon={role === 'courier' ? '🗺️' : '📦'} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="track"
        options={{
          title: role === 'courier' ? 'Requests' : 'Track',
          tabBarIcon: ({ focused }) => <TabIcon icon={role === 'courier' ? '🔔' : '🔍'} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon icon="👤" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
