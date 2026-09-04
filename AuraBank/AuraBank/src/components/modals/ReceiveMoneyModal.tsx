import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAura } from '../../context/AuraContext';
import { RAHUL_PROFILE } from '../../data/auraMockData';

export const ReceiveMoneyModal: React.FC = () => {
  const { showReceiveMoneyModal, setShowReceiveMoneyModal } = useAura();

  return (
    <Modal
      visible={showReceiveMoneyModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowReceiveMoneyModal(false)}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <View style={styles.header}>
            <Text style={styles.title}>Receive Money via QR</Text>
            <Pressable onPress={() => setShowReceiveMoneyModal(false)} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#64748B" />
            </Pressable>
          </View>

          <View style={styles.qrContainer}>
            <View style={styles.qrDummyBox}>
              <Ionicons name="qr-code" size={140} color="#059669" />
            </View>
            <Text style={styles.upiIdText}>{RAHUL_PROFILE.upiId}</Text>
            <Text style={styles.upiSubText}>Scan using any UPI app (GPay, PhonePe, Paytm)</Text>
          </View>

          <Pressable style={styles.closeActionBtn} onPress={() => setShowReceiveMoneyModal(false)}>
            <Text style={styles.closeActionBtnText}>Done</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderColor: '#E2E8F0',
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeBtn: {
    padding: 4,
  },
  qrContainer: {
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 20,
    borderRadius: 18,
    width: '100%',
    marginBottom: 16,
  },
  qrDummyBox: {
    padding: 12,
    backgroundColor: '#ECFDF5',
    borderRadius: 16,
    borderColor: 'rgba(16, 185, 129, 0.4)',
    borderWidth: 1,
    marginBottom: 12,
  },
  upiIdText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#059669',
  },
  upiSubText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
  },
  closeActionBtn: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  closeActionBtnText: {
    color: '#0F172A',
    fontWeight: '700',
    fontSize: 14,
  },
});
