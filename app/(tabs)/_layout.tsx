import React from 'react';
import { Tabs } from 'expo-router';
import { Text, View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts } from '@/lib/theme';
import { useAuthStore } from '@/stores/authStore';
import { mockChatConversations } from '@/lib/mockData';

function TabIcon({ icon, focused }: { icon: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.4 }}>{icon}</Text>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const role = useAuthStore(s => s.activeRole);
  const unreadChats = mockChatConversations.filter(c => c.unread > 0).length;

  // Only add bottom inset on iPhone with home indicator (insets.bottom > 20)
  // Android gesture nav returns 0 or small values — cap at 8 to avoid pushing bar off screen
  const safeBottom = Platform.OS === 'ios' && insets.bottom > 20 ? insets.bottom : 8;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.gray100,
          borderTopWidth: 1,
          height: 62 + safeBottom,
          paddingTop: 8,
          paddingBottom: safeBottom,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarActiveTintColor: colors.teal,
        tabBarInactiveTintColor: colors.gray300,
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
                  position: 'absolute', top: -3, right: -8,
                  width: 15, height: 15, borderRadius: 8,
                  backgroundColor: colors.orange,
                  alignItems: 'center', justifyContent: 'center',
                  borderWidth: 2, borderColor: colors.white,
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
