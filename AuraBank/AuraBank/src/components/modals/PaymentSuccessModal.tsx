import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAura } from '../../context/AuraContext';

export const PaymentSuccessModal: React.FC = () => {
  const { showSuccessModal, setShowSuccessModal, lastTransactionReceipt, balance, setActiveTab } = useAura();

  if (!lastTransactionReceipt) return null;

  const handleDone = () => {
    setShowSuccessModal(false);
  };

  const handleViewCashFlow = () => {
    setShowSuccessModal(false);
    setActiveTab('aura');
  };

  return (
    <Modal
      visible={showSuccessModal}
      transparent
      animationType="slide"
      onRequestClose={handleDone}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Animated Success Check Circle */}
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={44} color="#FFFFFF" />
          </View>

          <Text style={styles.successTitle}>Payment Successful!</Text>
          <Text style={styles.amountText}>₹{lastTransactionReceipt.amount.toLocaleString()}</Text>
          <Text style={styles.recipientText}>Paid to {lastTransactionReceipt.recipient}</Text>

          {/* Receipt Breakdown Card */}
          <View style={styles.receiptCard}>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Transaction Category</Text>
              <Text style={styles.receiptVal}>{lastTransactionReceipt.title}</Text>
            </View>

            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Date & Time</Text>
              <Text style={styles.receiptVal}>{lastTransactionReceipt.date}</Text>
            </View>

            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>UPI Reference No</Text>
              <Text style={styles.receiptValMono}>{lastTransactionReceipt.referenceNo}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabelBold}>Updated Available Balance</Text>
              <Text style={styles.receiptValBold}>₹{balance.toLocaleString()}</Text>
            </View>
          </View>

          {/* AI Note */}
          <View style={styles.aiNoteBox}>
            <Ionicons name="shield-checkmark" size={16} color="#059669" />
            <Text style={styles.aiNoteText}>
              AURA has recorded this payment and dynamically updated your 7-day cash flow forecast.
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            <Pressable style={styles.cashFlowBtn} onPress={handleViewCashFlow}>
              <Text style={styles.cashFlowBtnText}>View Cash Flow →</Text>
            </Pressable>
            <Pressable style={styles.doneBtn} onPress={handleDone}>
              <Text style={styles.doneBtnText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderColor: '#E2E8F0',
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  checkCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
  },
  amountText: {
    fontSize: 34,
    fontWeight: '900',
    color: '#059669',
    marginVertical: 4,
  },
  recipientText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 18,
  },
  receiptCard: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 8,
    marginBottom: 16,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  receiptVal: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
  },
  receiptValMono: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
  },
  receiptLabelBold: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  receiptValBold: {
    fontSize: 14,
    fontWeight: '800',
    color: '#059669',
  },
  aiNoteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderWidth: 1,
    padding: 10,
    borderRadius: 12,
    marginBottom: 18,
  },
  aiNoteText: {
    fontSize: 11,
    color: '#059669',
    flex: 1,
    lineHeight: 15,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  cashFlowBtn: {
    flex: 1,
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cashFlowBtnText: {
    color: '#059669',
    fontWeight: '700',
    fontSize: 13,
  },
  doneBtn: {
    flex: 1,
    backgroundColor: '#059669',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});
