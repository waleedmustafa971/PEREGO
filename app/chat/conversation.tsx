import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts, fontSize, spacing, radius } from '@/lib/theme';
import { mockChatMessages, mockUser } from '@/lib/mockData';
import { useShipmentStore } from '@/stores/shipmentStore';
import Header from '@/components/ui/Header';
import { Badge } from '@/components/ui/Card';

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(mockChatMessages);
  const traveler = useShipmentStore(s => s.selectedTraveler);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages(prev => [...prev, {
      id: String(prev.length + 1),
      senderId: mockUser.uid,
      text: message.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);
    setMessage('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={traveler?.courierName || 'Sarah Khaled'}
        right={<Badge text="Matched" color={colors.teal} />}
      />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.messages} contentContainerStyle={{ padding: spacing.xl, gap: 8 }}>
          {messages.map(m => {
            const isMe = m.senderId === mockUser.uid;
            return (
              <View key={m.id} style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
                <View style={[styles.bubbleInner, isMe ? styles.bubbleInnerMe : styles.bubbleInnerThem]}>
                  <Text style={[styles.bubbleText, isMe && { color: colors.white }]}>{m.text}</Text>
                </View>
                <Text style={[styles.time, isMe && { textAlign: 'right' }]}>{m.timestamp}</Text>
              </View>
            );
          })}
        </ScrollView>
        <View style={styles.inputBar}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
            placeholderTextColor={colors.gray400}
            style={styles.input}
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendBtn}>
            <Text style={styles.sendText}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  messages: { flex: 1 },
  bubble: { maxWidth: '80%' },
  bubbleMe: { alignSelf: 'flex-end' },
  bubbleThem: { alignSelf: 'flex-start' },
  bubbleInner: { padding: 10, paddingHorizontal: 14, borderRadius: 16 },
  bubbleInnerMe: { backgroundColor: colors.teal, borderBottomRightRadius: 4 },
  bubbleInnerThem: { backgroundColor: colors.gray100, borderBottomLeftRadius: 4 },
  bubbleText: { fontSize: fontSize.md - 1, lineHeight: 20, color: colors.night },
  time: { fontSize: fontSize.xs, color: colors.gray400, marginTop: 2 },
  inputBar: { flexDirection: 'row', gap: 8, padding: 12, paddingBottom: 28, borderTopWidth: 1, borderTopColor: colors.gray200 },
  input: { flex: 1, backgroundColor: colors.gray100, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: fontSize.md - 1, fontFamily: fonts.body, color: colors.night },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.teal, alignItems: 'center', justifyContent: 'center' },
  sendText: { color: colors.white, fontFamily: fonts.bodyBold, fontSize: 18 },
});
