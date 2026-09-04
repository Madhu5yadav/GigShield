import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAura } from '../../context/AuraContext';

export const SendMoneyModal: React.FC = () => {
  const { showSendMoneyModal, setShowSendMoneyModal, sendMoney, balance } = useAura();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSend = () => {
    setErrorMsg('');
    const numAmount = parseFloat(amount);

    if (!recipient.trim()) {
      setErrorMsg('Please enter a valid recipient UPI ID or phone number.');
      return;
    }
    if (!numAmount || isNaN(numAmount) || numAmount <= 0) {
      setErrorMsg('Please enter a valid positive amount.');
      return;
    }
    if (numAmount > balance) {
      setErrorMsg(`Insufficient funds. Your current available balance is ₹${balance}.`);
      return;
    }

    const success = sendMoney(numAmount, recipient.trim(), 'UPI Transfer');
    if (success) {
      setRecipient('');
      setAmount('');
      setErrorMsg('');
    }
  };

  return (
    <Modal
      visible={showSendMoneyModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowSendMoneyModal(false)}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <View style={styles.header}>
            <Text style={styles.title}>Send Money (UPI / Transfer)</Text>
            <Pressable onPress={() => setShowSendMoneyModal(false)} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#64748B" />
            </Pressable>
          </View>

          <View style={styles.balanceRow}>
            <Text style={styles.balanceLabel}>Available Account Balance:</Text>
            <Text style={styles.balanceText}>₹{balance.toLocaleString()}</Text>
          </View>

          {errorMsg ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle-outline" size={16} color="#DC2626" />
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          ) : null}

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>UPI ID / Mobile Number</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. friend@upi or 9876543210"
              placeholderTextColor="#94A3B8"
              value={recipient}
              onChangeText={setRecipient}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Amount (₹)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. 500"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
          </View>

          <Pressable style={styles.sendBtn} onPress={handleSend}>
            <Text style={styles.sendBtnText}>Send Money Now →</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderColor: '#E2E8F0',
    borderWidth: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  closeBtn: {
    padding: 4,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ECFDF5',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
  },
  balanceLabel: {
    fontSize: 12,
    color: '#059669',
  },
  balanceText: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '800',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 11,
    color: '#DC2626',
    flex: 1,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 6,
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    color: '#1E293B',
    fontSize: 14,
  },
  sendBtn: {
    backgroundColor: '#059669',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  sendBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});
