import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAura } from '../context/AuraContext';

export const LiquidityGapCard: React.FC = () => {
  const {
    userAccount,
    balance,
    essentialExpenses,
    estimatedGap,
    recommendedAdvance,
    predictedNearTermIncome,
    advanceState,
    setShowExplainModal,
    setShowAdvanceModal,
    acceptAdvance,
    repayAdvance,
  } = useAura();

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.headerRow}>
        <View style={styles.badgeGroup}>
          <Ionicons name="alert-circle" size={16} color="#D97706" />
          <Text style={styles.badgeText}>LIQUIDITY GAP ENGINE</Text>
        </View>

        <Pressable style={styles.whyBtn} onPress={() => setShowExplainModal(true)}>
          <Text style={styles.whyBtnText}>Why this limit? 🤔</Text>
        </Pressable>
      </View>

      <Text style={styles.cardTitle}>
        {advanceState === 'accepted'
          ? `₹${recommendedAdvance.toLocaleString('en-IN')} Safe Advance Active`
          : estimatedGap > 0
          ? `Short-Term Cash Deficit Detected (₹${estimatedGap.toLocaleString('en-IN')})`
          : 'Cash Flow Healthy • No Deficit'}
      </Text>

      <Text style={styles.cardSubtitle}>
        {estimatedGap > 0
          ? `AURA analyzed ${userAccount.name}'s DB ledger and detected a ₹${estimatedGap.toLocaleString('en-IN')} deficit before upcoming essential bills.`
          : `${userAccount.name}'s balance and earnings prediction cover all upcoming essential obligations.`}
      </Text>

      {/* Simplified Math Grid */}
      <View style={styles.mathGrid}>
        <View style={styles.mathItem}>
          <Text style={styles.mathLabel}>Current Balance</Text>
          <Text style={styles.mathValue}>₹{balance.toLocaleString('en-IN')}</Text>
        </View>

        <Text style={styles.operatorText}>−</Text>

        <View style={styles.mathItem}>
          <Text style={styles.mathLabel}>Upcoming Bills</Text>
          <Text style={[styles.mathValue, { color: '#DC2626' }]}>
            ₹{essentialExpenses.toLocaleString('en-IN')}
          </Text>
        </View>

        <Text style={styles.operatorText}>=</Text>

        <View style={styles.mathItemHighlight}>
          <Text style={styles.mathLabelHighlight}>Deficit Gap</Text>
          <Text style={styles.mathValueHighlight}>
            ₹{estimatedGap.toLocaleString('en-IN')}
          </Text>
        </View>
      </View>

      {/* Dynamic Key Takeaways */}
      <View style={styles.takeawayBox}>
        <View style={styles.takeawayRow}>
          <Ionicons name="checkmark-circle" size={16} color="#059669" />
          <Text style={styles.takeawayText}>
            Predicted 7-Day Income: <Text style={styles.boldText}>₹{predictedNearTermIncome.toLocaleString('en-IN')}</Text>
          </Text>
        </View>
        <View style={styles.takeawayRow}>
          <Ionicons name="checkmark-circle" size={16} color="#059669" />
          <Text style={styles.takeawayText}>
            Safe Repayment Fee: <Text style={styles.boldText}>₹{Math.max(10, Math.round(recommendedAdvance * 0.01))}</Text> (Flat 1%, 0% Interest)
          </Text>
        </View>
      </View>

      {/* CTA Button Row */}
      {advanceState !== 'accepted' && estimatedGap > 0 ? (
        <View style={styles.actionRow}>
          <Pressable
            style={({ pressed }) => [styles.primaryCta, pressed && styles.btnPressed]}
            onPress={() => setShowAdvanceModal(true)}>
            <Text style={styles.primaryCtaText}>Review & Get ₹{recommendedAdvance.toLocaleString('en-IN')} →</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.instantCta, pressed && styles.btnPressed]}
            onPress={() => acceptAdvance(recommendedAdvance)}>
            <Text style={styles.instantCtaText}>Instant Disburse</Text>
          </Pressable>
        </View>
      ) : advanceState === 'accepted' ? (
        <View style={{ gap: 8 }}>
          <View style={styles.activeAdvanceBox}>
            <Ionicons name="shield-checkmark" size={18} color="#059669" />
            <Text style={styles.activeAdvanceText}>
              ₹{recommendedAdvance.toLocaleString('en-IN')} Disbursed to {userAccount.name} • Settlement scheduled on next payout
            </Text>
          </View>

          <Pressable style={styles.repayBtn} onPress={repayAdvance}>
            <Ionicons name="checkmark-done" size={16} color="#FFFFFF" />
            <Text style={styles.repayBtnText}>Settle & Repay Advance Now</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginVertical: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D97706',
    letterSpacing: 1,
  },
  whyBtn: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  whyBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
    lineHeight: 16,
  },
  mathGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  mathItem: {
    alignItems: 'center',
  },
  mathItemHighlight: {
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  mathLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  mathLabelHighlight: {
    fontSize: 10,
    color: '#D97706',
    fontWeight: '700',
  },
  mathValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 2,
  },
  mathValueHighlight: {
    fontSize: 15,
    fontWeight: '800',
    color: '#B45309',
    marginTop: 2,
  },
  operatorText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#94A3B8',
  },
  takeawayBox: {
    gap: 6,
    marginBottom: 12,
  },
  takeawayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  takeawayText: {
    fontSize: 12,
    color: '#334155',
  },
  boldText: {
    fontWeight: '700',
    color: '#0F172A',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  primaryCta: {
    flex: 1,
    backgroundColor: '#059669',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryCtaText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  instantCta: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  instantCtaText: {
    color: '#059669',
    fontSize: 13,
    fontWeight: '700',
  },
  btnPressed: {
    opacity: 0.85,
  },
  activeAdvanceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    gap: 8,
  },
  activeAdvanceText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  repayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    borderRadius: 10,
    paddingVertical: 10,
    gap: 6,
  },
  repayBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
