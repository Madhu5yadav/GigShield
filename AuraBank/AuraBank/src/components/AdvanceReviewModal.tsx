import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAura } from '../context/AuraContext';

export const AdvanceReviewModal: React.FC = () => {
  const {
    userAccount,
    showAdvanceModal,
    setShowAdvanceModal,
    acceptAdvance,
    setShowWhatIfModal,
    recommendedAdvance,
    maxSafeAdvance,
    estimatedGap,
  } = useAura();

  const finalAmount = recommendedAdvance > 0 ? recommendedAdvance : 1000;
  const fee = Math.max(10, Math.round(finalAmount * 0.01));
  const totalRepayment = finalAmount + fee;

  return (
    <Modal
      visible={showAdvanceModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowAdvanceModal(false)}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.badgeText}>RESPONSIBLE ADVANCE ENGINE</Text>
              <Text style={styles.title}>AURA Income Advance</Text>
            </View>
            <Pressable onPress={() => setShowAdvanceModal(false)} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#64748B" />
            </Pressable>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Amount Box */}
            <View style={styles.amountBox}>
              <Text style={styles.amountLabel}>Recommended Advance Sizing ({userAccount.name})</Text>
              <Text style={styles.amountValue}>₹{finalAmount.toLocaleString('en-IN')}</Text>

              <View style={styles.feeDivider} />

              <View style={styles.feeRow}>
                <Text style={styles.feeLabel}>Flat Platform Fee (1%)</Text>
                <Text style={styles.feeVal}>₹{fee}</Text>
              </View>

              <View style={styles.feeRow}>
                <Text style={styles.feeLabel}>Total Repayment</Text>
                <Text style={[styles.feeVal, { color: '#059669', fontWeight: '800' }]}>
                  ₹{totalRepayment.toLocaleString('en-IN')}
                </Text>
              </View>

              <View style={styles.feeRow}>
                <Text style={styles.feeLabel}>Expected Recovery Source</Text>
                <Text style={styles.feeVal}>Upcoming Platform Payout ({userAccount.platform})</Text>
              </View>
            </View>

            {/* Responsible Credit Sizing Display */}
            <View style={styles.sizingCard}>
              <Text style={styles.sizingHeadline}>
                "AURA doesn't recommend more credit than necessary."
              </Text>
              <Text style={styles.sizingSub}>
                Sized strictly according to your ₹{estimatedGap.toLocaleString('en-IN')} deficit to prevent predatory debt cycles.
              </Text>

              <View style={styles.sizingGrid}>
                <View style={styles.sizingItem}>
                  <Text style={styles.sizingLabel}>Liquidity Deficit</Text>
                  <Text style={styles.sizingValue}>₹{estimatedGap.toLocaleString('en-IN')}</Text>
                </View>
                <View style={styles.sizingItemHighlight}>
                  <Text style={styles.sizingLabelHighlight}>AURA Sized</Text>
                  <Text style={styles.sizingValueHighlight}>₹{finalAmount.toLocaleString('en-IN')}</Text>
                </View>
                <View style={styles.sizingItem}>
                  <Text style={styles.sizingLabel}>Maximum Safe Limit</Text>
                  <Text style={styles.sizingValue}>₹{maxSafeAdvance.toLocaleString('en-IN')}</Text>
                </View>
              </View>

              {/* Link to What-If Simulator */}
              <Pressable
                style={styles.simLinkPressable}
                onPress={() => {
                  setShowAdvanceModal(false);
                  setShowWhatIfModal(true);
                }}>
                <Ionicons name="calculator-outline" size={16} color="#059669" />
                <Text style={styles.simLinkText}>Run "What If?" Risk Simulation →</Text>
              </Pressable>
            </View>

            {/* Protected Repayment Guarantee */}
            <View style={styles.guaranteeCard}>
              <View style={styles.guaranteeHeader}>
                <Ionicons name="shield-checkmark" size={20} color="#059669" />
                <Text style={styles.guaranteeTitle}>Protected Repayment Guarantee</Text>
              </View>
              <Text style={styles.guaranteeText}>
                No interest compounding, no late penalty fees, and zero hidden charges if platform earnings are delayed.
              </Text>
            </View>
          </ScrollView>

          {/* Action Footer */}
          <View style={styles.footer}>
            <Pressable
              style={({ pressed }) => [styles.acceptBtn, pressed && styles.btnPressed]}
              onPress={() => acceptAdvance(finalAmount)}>
              <Text style={styles.acceptBtnText}>Accept & Disburse ₹{finalAmount.toLocaleString('en-IN')} →</Text>
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
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderColor: '#E2E8F0',
    borderWidth: 1,
    padding: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  body: {
    marginBottom: 12,
  },
  amountBox: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  amountLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  amountValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#059669',
    marginVertical: 4,
  },
  feeDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    width: '100%',
    marginVertical: 12,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 6,
  },
  feeLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  feeVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  sizingCard: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sizingHeadline: {
    fontSize: 13,
    fontWeight: '800',
    color: '#047857',
    marginBottom: 4,
  },
  sizingSub: {
    fontSize: 11,
    color: '#334155',
    marginBottom: 12,
  },
  sizingGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    gap: 6,
  },
  sizingItem: {
    flex: 1,
    alignItems: 'center',
  },
  sizingItemHighlight: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#059669',
  },
  sizingLabel: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: '600',
  },
  sizingLabelHighlight: {
    fontSize: 9,
    color: '#059669',
    fontWeight: '800',
  },
  sizingValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 2,
  },
  sizingValueHighlight: {
    fontSize: 14,
    fontWeight: '800',
    color: '#059669',
    marginTop: 2,
  },
  simLinkPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 6,
  },
  simLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  guaranteeCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  guaranteeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  guaranteeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  guaranteeText: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
  },
  footer: {
    paddingTop: 8,
  },
  acceptBtn: {
    backgroundColor: '#059669',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  acceptBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  btnPressed: {
    opacity: 0.9,
  },
});
