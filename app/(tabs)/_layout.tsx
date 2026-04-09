import React from 'react';
import { Tabs } from 'expo-router';
import { Text, View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts } from '@/lib/theme';
import { useAuthStore } from '@/stores/authStore';

function TabIcon({ icon, label, focused }: { icon: string; label: string; focused: boolean }) {
  return (
    <View style={{ alignItems: 'center', gap: 2 }}>
      <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.45 }}>{icon}</Text>
    </View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const role = useAuthStore(s => s.activeRole);

  const bottomPad = Platform.OS === 'android'
    ? 10
    : insets.bottom > 0 ? insets.bottom : 16;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.gray100,
          borderTopWidth: 1,
          paddingTop: 10,
          paddingBottom: bottomPad,
          height: 58 + bottomPad,
          elevation: 12,
          shadowColor: colors.night,
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.07,
          shadowRadius: 12,
        },
        tabBarActiveTintColor: colors.teal,
        tabBarInactiveTintColor: colors.gray400,
        tabBarLabelStyle: {
          fontFamily: fonts.bodySemiBold,
          fontSize: 10,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon icon="🏠" label="Home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="ship"
        options={{
          title: role === 'courier' ? 'Trips' : 'Ship',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={role === 'courier' ? '🗺️' : '📦'} label={role === 'courier' ? 'Trips' : 'Ship'} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="track"
        options={{
          title: role === 'courier' ? 'Requests' : 'Track',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={role === 'courier' ? '🔔' : '🔍'} label={role === 'courier' ? 'Requests' : 'Track'} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon icon="👤" label="Profile" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
