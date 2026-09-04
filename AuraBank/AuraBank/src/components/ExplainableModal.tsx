import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAura } from '../context/AuraContext';

export const ExplainableModal: React.FC = () => {
  const {
    showExplainModal,
    setShowExplainModal,
    setShowAdvanceModal,
    explainableSignals,
    recommendedAdvance,
    userAccount,
  } = useAura();

  return (
    <Modal
      visible={showExplainModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowExplainModal(false)}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleGroup}>
              <Ionicons name="sparkles" size={18} color="#059669" />
              <Text style={styles.title}>Why ₹{recommendedAdvance.toLocaleString('en-IN')} Advance?</Text>
            </View>
            <Pressable onPress={() => setShowExplainModal(false)} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#64748B" />
            </Pressable>
          </View>

          <Text style={styles.modalSubtitle}>
            AURA evaluated {userAccount.name}'s database earnings & essential expenses to size this advance safely without debt overload.
          </Text>

          {/* Dynamic Scannable Signals List */}
          <ScrollView style={styles.listScroll} contentContainerStyle={styles.listContainer}>
            {explainableSignals.map((signal, idx) => (
              <View key={idx} style={styles.signalItem}>
                <View style={styles.iconCircle}>
                  <Ionicons name="checkmark" size={16} color="#059669" />
                </View>
                <View style={styles.signalContent}>
                  <View style={styles.signalTopRow}>
                    <Text style={styles.signalTitle}>{signal.text}</Text>
                    <Text style={styles.signalValue}>{signal.value}</Text>
                  </View>
                  <Text style={styles.signalDesc}>Status: Verified in Database ({signal.status.toUpperCase()})</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Action Row */}
          <View style={styles.footerRow}>
            <Pressable
              style={styles.closeFooterBtn}
              onPress={() => setShowExplainModal(false)}>
              <Text style={styles.closeFooterBtnText}>Close</Text>
            </Pressable>
            <Pressable
              style={styles.proceedBtn}
              onPress={() => {
                setShowExplainModal(false);
                setShowAdvanceModal(true);
              }}>
              <Text style={styles.proceedBtnText}>Review ₹{recommendedAdvance.toLocaleString('en-IN')} Advance →</Text>
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
    paddingHorizontal: 16,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderColor: '#E2E8F0',
    borderWidth: 1,
    padding: 18,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeBtn: {
    padding: 4,
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
    lineHeight: 16,
  },
  listScroll: {
    maxHeight: 280,
    marginBottom: 14,
  },
  listContainer: {
    gap: 8,
  },
  signalItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    gap: 10,
  },
  iconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  signalContent: {
    flex: 1,
  },
  signalTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  signalTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
  },
  signalValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#059669',
  },
  signalDesc: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  footerRow: {
    flexDirection: 'row',
    gap: 8,
  },
  closeFooterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeFooterBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  proceedBtn: {
    flex: 1,
    backgroundColor: '#059669',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proceedBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
