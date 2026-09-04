import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAura } from '../context/AuraContext';

export const WhatIfSimulator: React.FC = () => {
  const { showWhatIfModal, setShowWhatIfModal, acceptAdvance } = useAura();
  const [selectedOption, setSelectedOption] = useState<1000 | 2000>(1000);

  return (
    <Modal
      visible={showWhatIfModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowWhatIfModal(false)}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.badgeText}>FINANCIAL SIMULATION ENGINE</Text>
              <Text style={styles.title}>"What If?" Financial Simulator</Text>
            </View>
            <Pressable onPress={() => setShowWhatIfModal(false)} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#64748B" />
            </Pressable>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            <Text style={styles.subtitle}>
              Test how different advance amounts impact your future cash cushion before taking action.
            </Text>

            {/* Toggle Switch */}
            <View style={styles.toggleRow}>
              <Pressable
                style={[
                  styles.toggleBtn,
                  selectedOption === 1000 && styles.toggleBtnActive,
                ]}
                onPress={() => setSelectedOption(1000)}>
                <Text
                  style={[
                    styles.toggleBtnText,
                    selectedOption === 1000 && styles.toggleBtnTextActive,
                  ]}>
                  Take Recommended ₹1,000
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.toggleBtn,
                  selectedOption === 2000 && styles.toggleBtnActiveWarning,
                ]}
                onPress={() => setSelectedOption(2000)}>
                <Text
                  style={[
                    styles.toggleBtnText,
                    selectedOption === 2000 && styles.toggleBtnTextWarning,
                  ]}>
                  Take Unsafe ₹2,000
                </Text>
              </Pressable>
            </View>

            {/* Simulation Results Card */}
            {selectedOption === 1000 ? (
              <View style={styles.simCardSuccess}>
                <View style={styles.simHeader}>
                  <View style={styles.safeTag}>
                    <Ionicons name="shield-checkmark" size={14} color="#059669" />
                    <Text style={styles.safeTagText}>AURA RECOMMENDED (SAFE)</Text>
                  </View>
                  <Text style={styles.riskLevelText}>Risk Level: LOW</Text>
                </View>

                <View style={styles.metricsList}>
                  <View style={styles.metricRow}>
                    <Text style={styles.metricLabel}>Current Available Balance</Text>
                    <Text style={styles.metricVal}>₹50</Text>
                  </View>
                  <View style={styles.metricRow}>
                    <Text style={styles.metricLabel}>Immediate Balance After Advance</Text>
                    <Text style={[styles.metricVal, { color: '#059669' }]}>₹1,050</Text>
                  </View>
                  <View style={styles.metricRow}>
                    <Text style={styles.metricLabel}>Expected 7-Day Income</Text>
                    <Text style={styles.metricVal}>+₹3,100</Text>
                  </View>
                  <View style={styles.metricRow}>
                    <Text style={styles.metricLabel}>Scheduled Auto-Repayment (Principal + Fee)</Text>
                    <Text style={[styles.metricVal, { color: '#DC2626' }]}>-₹1,010</Text>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.metricRowHighlight}>
                    <Text style={styles.metricLabelHighlight}>Estimated Remaining Net Cash</Text>
                    <Text style={styles.metricValHighlight}>₹2,090</Text>
                  </View>
                </View>

                <View style={styles.aiOpinionBox}>
                  <Ionicons name="sparkles" size={16} color="#059669" />
                  <Text style={styles.aiOpinionText}>
                    AURA Decision Engine: ₹1,000 provides a healthy ₹2,090 post-repayment cash cushion to cover non-essential expenses and start emergency savings.
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.simCardWarning}>
                <View style={styles.simHeader}>
                  <View style={styles.warningTag}>
                    <Ionicons name="warning" size={14} color="#DC2626" />
                    <Text style={styles.warningTagText}>ELEVATED RISK WARNING</Text>
                  </View>
                  <Text style={[styles.riskLevelText, { color: '#DC2626' }]}>Risk Level: HIGH</Text>
                </View>

                <View style={styles.metricsList}>
                  <View style={styles.metricRow}>
                    <Text style={styles.metricLabel}>Current Available Balance</Text>
                    <Text style={styles.metricVal}>₹50</Text>
                  </View>
                  <View style={styles.metricRow}>
                    <Text style={styles.metricLabel}>Immediate Balance After Advance</Text>
                    <Text style={[styles.metricVal, { color: '#D97706' }]}>₹2,050</Text>
                  </View>
                  <View style={styles.metricRow}>
                    <Text style={styles.metricLabel}>Expected 7-Day Income</Text>
                    <Text style={styles.metricVal}>+₹3,100</Text>
                  </View>
                  <View style={styles.metricRow}>
                    <Text style={styles.metricLabel}>Scheduled Auto-Repayment</Text>
                    <Text style={[styles.metricVal, { color: '#DC2626' }]}>-₹2,020</Text>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.metricRowHighlight}>
                    <Text style={styles.metricLabelHighlight}>Estimated Remaining Net Cash</Text>
                    <Text style={[styles.metricValHighlight, { color: '#DC2626' }]}>₹1,080</Text>
                  </View>
                </View>

                <View style={styles.aiOpinionBoxWarning}>
                  <Ionicons name="alert-circle" size={16} color="#DC2626" />
                  <Text style={styles.aiOpinionTextWarning}>
                    AURA Decision Engine Warning: ₹2,000 consumes 65% of your expected weekend income. A single rainy weekend could trigger a secondary liquidity gap next week.
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Bottom CTA */}
          <View style={styles.footer}>
            <Pressable
              style={styles.actionBtn}
              onPress={() => {
                setShowWhatIfModal(false);
                acceptAdvance();
              }}>
              <Text style={styles.actionBtnText}>
                Accept Safe ₹1,000 Recommendation
              </Text>
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
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderColor: '#E2E8F0',
    borderWidth: 1,
    maxHeight: '85%',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomColor: '#E2E8F0',
    borderBottomWidth: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  body: {
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 14,
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 14,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleBtnActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#10B981',
    borderWidth: 1,
  },
  toggleBtnActiveWarning: {
    backgroundColor: '#FFFFFF',
    borderColor: '#EF4444',
    borderWidth: 1,
  },
  toggleBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  toggleBtnTextActive: {
    color: '#059669',
    fontWeight: '800',
  },
  toggleBtnTextWarning: {
    color: '#DC2626',
    fontWeight: '800',
  },
  simCardSuccess: {
    backgroundColor: '#ECFDF5',
    borderColor: 'rgba(16, 185, 129, 0.4)',
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 16,
  },
  simCardWarning: {
    backgroundColor: '#FEF2F2',
    borderColor: 'rgba(239, 68, 68, 0.4)',
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 16,
  },
  simHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  safeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  safeTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
  },
  warningTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  warningTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#DC2626',
  },
  riskLevelText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  metricsList: {
    gap: 8,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  metricVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    marginVertical: 4,
  },
  metricRowHighlight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
  },
  metricLabelHighlight: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  metricValHighlight: {
    fontSize: 18,
    fontWeight: '800',
    color: '#059669',
  },
  aiOpinionBox: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
    marginTop: 12,
    alignItems: 'flex-start',
  },
  aiOpinionText: {
    fontSize: 11,
    color: '#1E293B',
    lineHeight: 16,
    flex: 1,
  },
  aiOpinionBoxWarning: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
    marginTop: 12,
    alignItems: 'flex-start',
  },
  aiOpinionTextWarning: {
    fontSize: 11,
    color: '#991B1B',
    lineHeight: 16,
    flex: 1,
  },
  footer: {},
  actionBtn: {
    backgroundColor: '#059669',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});
