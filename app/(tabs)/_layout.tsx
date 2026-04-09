import React from 'react';
import { Tabs } from 'expo-router';
import { Text, View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts } from '@/lib/theme';
import { useAuthStore } from '@/stores/authStore';
import { mockChatConversations, mockNotifications } from '@/lib/mockData';

function TabIcon({ icon, focused }: { icon: string; focused: boolean }) {
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

  const unreadChats = mockChatConversations.filter(c => c.unread > 0).length;

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
          tabBarIcon: ({ focused }) => <TabIcon icon="🏠" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="ship"
        options={{
          title: role === 'courier' ? 'Trips' : 'Ship',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={role === 'courier' ? '🗺️' : '📦'} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="track"
        options={{
          title: role === 'courier' ? 'Requests' : 'Track',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={role === 'courier' ? '🔔' : '🔍'} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ focused }) => (
            <View>
              <TabIcon icon="💬" focused={focused} />
              {unreadChats > 0 && (
                <View style={{
                  position: 'absolute', top: -2, right: -6,
                  width: 14, height: 14, borderRadius: 7,
                  backgroundColor: colors.orange,
                  alignItems: 'center', justifyContent: 'center',
                  borderWidth: 1.5, borderColor: colors.white,
                }}>
                  <Text style={{ fontSize: 8, color: colors.white, fontFamily: fonts.bodyBold }}>{unreadChats}</Text>
                </View>
              )}
            </View>
          ),
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
