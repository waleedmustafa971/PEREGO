import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, fonts, fontSize, spacing } from '@/lib/theme';
import { mockChatConversations } from '@/lib/mockData';
import { Avatar } from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';

export default function MessagesTab() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
      </View>
      {mockChatConversations.length === 0 ? (
        <EmptyState
          icon="💬"
          title="No messages yet"
          subtitle="Once you book a trip or accept a request, you can chat here."
        />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {mockChatConversations.map((c, i) => (
            <TouchableOpacity
              key={c.id}
              onPress={() => router.push('/chat/conversation')}
              activeOpacity={0.75}
              style={[styles.item, i < mockChatConversations.length - 1 && styles.itemBorder]}
            >
              <View style={styles.avatarWrap}>
                <Avatar color={c.avatar} name={c.name} size={50} />
                {c.unread > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{c.unread}</Text>
                  </View>
                )}
              </View>
              <View style={styles.content}>
                <View style={styles.topRow}>
                  <Text style={[styles.name, c.unread > 0 && styles.nameUnread]}>{c.name}</Text>
                  <Text style={styles.time}>{c.time}</Text>
                </View>
                <Text style={styles.shipment} numberOfLines={1}>{c.shipment}</Text>
                <Text style={[styles.lastMsg, c.unread > 0 && styles.lastMsgUnread]} numberOfLines={1}>
                  {c.lastMessage}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  header: {
    paddingHorizontal: spacing.xl, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: colors.gray100,
  },
  title: { fontFamily: fonts.heading, fontSize: fontSize.xl, color: colors.night },
  item: { flexDirection: 'row', gap: 14, paddingVertical: 14, paddingHorizontal: spacing.xl },
  itemBorder: { borderBottomWidth: 1, borderBottomColor: colors.gray100 },
  avatarWrap: { position: 'relative', flexShrink: 0 },
  unreadBadge: {
    position: 'absolute', top: -2, right: -2,
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: colors.teal,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: colors.white,
  },
  unreadText: { fontSize: 9, color: colors.white, fontFamily: fonts.bodyBold },
  content: { flex: 1 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  name: { fontFamily: fonts.bodyMedium, fontSize: fontSize.md - 1, color: colors.night },
  nameUnread: { fontFamily: fonts.bodyBold },
  time: { fontSize: fontSize.xs + 1, color: colors.gray400 },
  shipment: { fontSize: fontSize.xs + 1, color: colors.teal, fontFamily: fonts.bodyMedium, marginBottom: 3 },
  lastMsg: { fontSize: fontSize.sm, color: colors.gray400 },
  lastMsgUnread: { color: colors.night, fontFamily: fonts.bodyMedium },
});
