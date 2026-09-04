import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAura } from '../../context/AuraContext';

const BILL_CATEGORIES = [
  { id: 'mobile', name: 'Mobile Recharge', icon: 'phone-portrait-outline', amount: 299 },
  { id: 'electricity', name: 'Electricity Bill', icon: 'flash-outline', amount: 850 },
  { id: 'fuel', name: 'Vehicle Fuel Card', icon: 'speedometer-outline', amount: 450 },
  { id: 'broadband', name: 'Broadband / Wi-Fi', icon: 'wifi-outline', amount: 699 },
];

export const PayBillsModal: React.FC = () => {
  const { showPayBillsModal, setShowPayBillsModal, balance, sendMoney } = useAura();
  const [selectedBill, setSelectedBill] = useState<string>('fuel');
  const [errorMsg, setErrorMsg] = useState('');

  const billObj = BILL_CATEGORIES.find(b => b.id === selectedBill) || BILL_CATEGORIES[2];

  const handlePay = () => {
    setErrorMsg('');
    if (balance < billObj.amount) {
      setErrorMsg(`Insufficient funds to pay ₹${billObj.amount}. Current balance is ₹${balance}.`);
      return;
    }

    sendMoney(billObj.amount, billObj.name, 'Utility Bill');
  };

  return (
    <Modal
      visible={showPayBillsModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowPayBillsModal(false)}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <View style={styles.header}>
            <Text style={styles.title}>Pay Utility Bills</Text>
            <Pressable onPress={() => setShowPayBillsModal(false)} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#64748B" />
            </Pressable>
          </View>

          <View style={styles.balanceRow}>
            <Text style={styles.balanceLabel}>Current Available Balance:</Text>
            <Text style={styles.balanceVal}>₹{balance.toLocaleString()}</Text>
          </View>

          {errorMsg ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle-outline" size={16} color="#DC2626" />
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          ) : null}

          <View style={styles.grid}>
            {BILL_CATEGORIES.map(b => (
              <Pressable
                key={b.id}
                style={[
                  styles.billItem,
                  selectedBill === b.id && styles.billItemSelected,
                ]}
                onPress={() => {
                  setSelectedBill(b.id);
                  setErrorMsg('');
                }}>
                <Ionicons
                  name={b.icon as any}
                  size={24}
                  color={selectedBill === b.id ? '#059669' : '#64748B'}
                />
                <Text style={styles.billName}>{b.name}</Text>
                <Text style={styles.billAmount}>₹{b.amount}</Text>
              </Pressable>
            ))}
          </View>

          <Pressable style={styles.payBtn} onPress={handlePay}>
            <Text style={styles.payBtnText}>
              Pay ₹{billObj.amount} for {billObj.name} →
            </Text>
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
    marginBottom: 8,
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
  balanceVal: {
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  billItem: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
  },
  billItemSelected: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  billName: {
    fontSize: 12,
    color: '#1E293B',
    fontWeight: '600',
    marginTop: 6,
  },
  billAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: '#059669',
    marginTop: 2,
  },
  payBtn: {
    backgroundColor: '#059669',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  payBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});
