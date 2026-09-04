import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAura } from '../context/AuraContext';

const PRESET_SUPPORT_TOPICS = [
  'Talk to Support Agent 🎧',
  'Can I spend ₹1,000 today?',
  'How does Safe Advance work?',
  'Why is my resilience score 82?',
  'When will my weekend payout arrive?',
];

export const AiCoachView: React.FC = () => {
  const { chatMessages, askAiCoach } = useAura();
  const [inputText, setInputText] = useState('');
  const [isLiveSupportConnected, setIsLiveSupportConnected] = useState(false);

  const handleSend = () => {
    if (inputText.trim()) {
      askAiCoach(inputText.trim());
      setInputText('');
    }
  };

  const handleTopicTap = (topic: string) => {
    if (topic.includes('Talk to Support Agent')) {
      setIsLiveSupportConnected(true);
      askAiCoach('I would like to speak with a customer support representative.');
    } else {
      askAiCoach(topic);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Banner */}
      <View style={styles.headerCard}>
        <View style={styles.topHeaderRow}>
          <View style={styles.titleCol}>
            <Text style={styles.headerBadge}>CUSTOMER SUPPORT & ASSISTANT</Text>
            <Text style={styles.headerTitle}>Help & Live Chat</Text>
          </View>
          <View style={[styles.statusPill, isLiveSupportConnected && styles.statusPillActive]}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>
              {isLiveSupportConnected ? 'Agent Connected' : '24/7 Support Online'}
            </Text>
          </View>
        </View>

        <Text style={styles.headerSub}>
          Connect with AURA AI or request a live banking customer support specialist.
        </Text>
      </View>

      {/* Suggested Quick Support Chips */}
      <Text style={styles.chipsTitle}>Quick Support Options:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
        <View style={styles.chipsRow}>
          {PRESET_SUPPORT_TOPICS.map((topic, idx) => (
            <Pressable
              key={idx}
              style={({ pressed }) => [
                styles.chipBtn,
                topic.includes('Support Agent') && styles.chipBtnHighlight,
                pressed && styles.chipBtnPressed,
              ]}
              onPress={() => handleTopicTap(topic)}>
              <Text
                style={[
                  styles.chipText,
                  topic.includes('Support Agent') && styles.chipTextHighlight,
                ]}>
                {topic}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Main Support Chat Stream */}
      <ScrollView style={styles.chatScroll} contentContainerStyle={styles.chatContainer}>
        {chatMessages.map(msg => (
          <View
            key={msg.id}
            style={[
              styles.msgWrapper,
              msg.sender === 'user' ? styles.userMsgWrapper : styles.auraMsgWrapper,
            ]}>
            {msg.sender === 'aura' && (
              <View style={styles.auraAvatar}>
                <Ionicons name="headset-outline" size={16} color="#059669" />
              </View>
            )}

            <View
              style={[
                styles.msgBubble,
                msg.sender === 'user' ? styles.userBubble : styles.auraBubble,
              ]}>
              <Text
                style={[
                  styles.msgText,
                  msg.sender === 'user' ? styles.userMsgText : styles.auraMsgText,
                ]}>
                {msg.text}
              </Text>

              {/* Embedded Data Card / Support Ticket Details */}
              {msg.dataCard && (
                <View style={styles.embeddedCard}>
                  <Text style={styles.embeddedCardTitle}>{msg.dataCard.title}</Text>
                  {msg.dataCard.details.map((detail, dIdx) => (
                    <Text key={dIdx} style={styles.embeddedCardDetail}>
                      • {detail}
                    </Text>
                  ))}
                  {msg.dataCard.value && (
                    <View style={styles.embeddedCardTag}>
                      <Text style={styles.embeddedCardTagText}>{msg.dataCard.value}</Text>
                    </View>
                  )}
                </View>
              )}

              <Text style={styles.timestamp}>{msg.timestamp}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Customer Interactive Chat Bar */}
      <View style={styles.inputBarWrapper}>
        <View style={styles.inputBar}>
          <Pressable style={styles.attachBtn} onPress={() => alert('Attachment feature ready')}>
            <Ionicons name="add" size={22} color="#64748B" />
          </Pressable>

          <TextInput
            style={styles.textInput}
            placeholder="Type your message to customer support..."
            placeholderTextColor="#94A3B8"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
          />

          <Pressable
            style={({ pressed }) => [
              styles.sendBtn,
              !inputText.trim() && styles.sendBtnDisabled,
              pressed && styles.sendBtnPressed,
            ]}
            disabled={!inputText.trim()}
            onPress={handleSend}>
            <Ionicons name="send" size={16} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  topHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  titleCol: {},
  headerBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 1.2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 2,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    borderColor: 'rgba(16, 185, 129, 0.4)',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusPillActive: {
    backgroundColor: '#DEF7EC',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  headerSub: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  chipsTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  chipsScroll: {
    maxHeight: 40,
    marginBottom: 10,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chipBtn: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
  },
  chipBtnHighlight: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  chipBtnPressed: {
    opacity: 0.8,
  },
  chipText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  chipTextHighlight: {
    color: '#059669',
    fontWeight: '700',
  },
  chatScroll: {
    flex: 1,
    marginBottom: 10,
  },
  chatContainer: {
    gap: 12,
    paddingBottom: 90,
  },
  msgWrapper: {
    flexDirection: 'row',
    gap: 8,
    maxWidth: '88%',
  },
  userMsgWrapper: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  auraMsgWrapper: {
    alignSelf: 'flex-start',
  },
  auraAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderWidth: 1,
  },
  msgBubble: {
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: '#059669',
    borderBottomRightRadius: 4,
  },
  auraBubble: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderBottomLeftRadius: 4,
  },
  msgText: {
    fontSize: 13,
    lineHeight: 18,
  },
  userMsgText: {
    color: '#FFFFFF',
  },
  auraMsgText: {
    color: '#1E293B',
  },
  embeddedCard: {
    backgroundColor: '#F8FAFC',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
  },
  embeddedCardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 4,
  },
  embeddedCardDetail: {
    fontSize: 11,
    color: '#475569',
    marginBottom: 2,
  },
  embeddedCardTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  embeddedCardTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  timestamp: {
    fontSize: 9,
    color: '#94A3B8',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputBarWrapper: {
    paddingBottom: 72,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  attachBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    color: '#1E293B',
    fontSize: 13,
    paddingVertical: 8,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.5,
    backgroundColor: '#94A3B8',
  },
  sendBtnPressed: {
    opacity: 0.8,
  },
});
