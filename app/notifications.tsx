import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts, fontSize, spacing, radius } from '@/lib/theme';
import { mockNotifications } from '@/lib/mockData';
import Header from '@/components/ui/Header';
import EmptyState from '@/components/ui/EmptyState';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerWrap}>
        <Header title="Notifications" />
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllRead} style={styles.markAllBtn}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {notifications.length === 0 ? (
        <EmptyState icon="🔔" title="All caught up" subtitle="No notifications yet. We'll let you know when something happens." />
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
          {notifications.map((n, i) => (
            <TouchableOpacity
              key={n.id}
              onPress={() => markRead(n.id)}
              activeOpacity={0.75}
              style={[styles.item, !n.read && styles.itemUnread, i < notifications.length - 1 && styles.itemBorder]}
            >
              <View style={[styles.iconWrap, { backgroundColor: n.color + '18' }]}>
                <Text style={styles.icon}>{n.icon}</Text>
              </View>
              <View style={styles.content}>
                <View style={styles.topRow}>
                  <Text style={[styles.title, !n.read && styles.titleUnread]}>{n.title}</Text>
                  <Text style={styles.time}>{n.time}</Text>
                </View>
                <Text style={styles.body} numberOfLines={2}>{n.body}</Text>
              </View>
              {!n.read && <View style={styles.dot} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  headerWrap: { borderBottomWidth: 1, borderBottomColor: colors.gray100 },
  markAllBtn: { paddingHorizontal: spacing.xl, paddingBottom: 10 },
  markAllText: { fontSize: fontSize.sm, color: colors.teal, fontFamily: fonts.bodySemiBold },
  item: {
    flexDirection: 'row',
    gap: 14,
    paddingVertical: 16,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.white,
  },
  itemUnread: { backgroundColor: colors.teal + '06' },
  itemBorder: { borderBottomWidth: 1, borderBottomColor: colors.gray100 },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  icon: { fontSize: 20 },
  content: { flex: 1 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  title: { fontFamily: fonts.bodyMedium, fontSize: fontSize.md - 1, color: colors.night, flex: 1 },
  titleUnread: { fontFamily: fonts.bodyBold },
  time: { fontSize: fontSize.xs + 1, color: colors.gray400, marginLeft: 8, flexShrink: 0 },
  body: { fontSize: fontSize.sm, color: colors.gray500, lineHeight: 20 },
  dot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: colors.teal,
    alignSelf: 'center',
    flexShrink: 0,
  },
});
