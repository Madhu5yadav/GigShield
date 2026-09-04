import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAura } from '../context/AuraContext';
import { BANK_OFFICER_SIGNALS, RAHUL_PROFILE } from '../data/auraMockData';

export const BankOfficerDashboard: React.FC = () => {
  const {
    resilienceScore,
    balance,
    predictedNearTermIncome,
    estimatedGap,
    recommendedAdvance,
    bankOfficerSignals,
    userAccount,
    setIsBankOfficerView,
  } = useAura();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Banner Mode Indicator */}
      <View style={styles.topBar}>
        <View style={styles.bankBadge}>
          <Ionicons name="business" size={16} color="#059669" />
          <Text style={styles.bankBadgeText}>AURA INSTITUTIONAL UNDERWRITING DASHBOARD</Text>
        </View>
        <Pressable
          style={styles.exitBtn}
          onPress={() => setIsBankOfficerView(false)}>
          <Text style={styles.exitBtnText}>← Switch to Customer View</Text>
        </Pressable>
      </View>

      <Text style={styles.mainTitle}>Cash-Flow Underwriting Signal</Text>
      <Text style={styles.subTitle}>
        Real-time risk assessment for gig workers with non-traditional credit histories.
      </Text>

      {/* Customer Overview Card */}
      <View style={styles.customerCard}>
        <View style={styles.customerHeader}>
          <View style={styles.avatarBox}>
            <Text style={styles.avatarText}>{userAccount.name.charAt(0)}</Text>
          </View>
          <View style={styles.customerMeta}>
            <Text style={styles.customerName}>{userAccount.name}</Text>
            <Text style={styles.customerRole}>{userAccount.role} ({userAccount.platform})</Text>
            <Text style={styles.customerAcc}>Account: {userAccount.accountNumber}</Text>
          </View>

          <View style={styles.riskSignalPill}>
            <Ionicons name="shield-checkmark" size={14} color="#059669" />
            <Text style={styles.riskSignalText}>Risk Signal: LOW</Text>
          </View>
        </View>

        <View style={styles.metricsGrid}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Financial Resilience</Text>
            <Text style={[styles.metricVal, { color: '#059669' }]}>{resilienceScore}/100</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Current Balance</Text>
            <Text style={styles.metricVal}>₹{balance.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Predicted 7-Day Income</Text>
            <Text style={[styles.metricVal, { color: '#059669' }]}>₹{predictedNearTermIncome.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Liquidity Gap</Text>
            <Text style={[styles.metricVal, { color: '#D97706' }]}>₹{estimatedGap.toLocaleString('en-IN')}</Text>
          </View>
        </View>

        <View style={styles.underwriteResultBox}>
          <View style={styles.resultCol}>
            <Text style={styles.resultLabel}>Recommended Safe Advance</Text>
            <Text style={styles.resultAmount}>₹{recommendedAdvance.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.resultColRight}>
            <Text style={styles.resultLabel}>Expected Repayment</Text>
            <Text style={styles.resultRecovery}>₹{(recommendedAdvance + Math.max(10, Math.round(recommendedAdvance * 0.01))).toLocaleString('en-IN')} (Next Payout)</Text>
          </View>
        </View>
      </View>

      {/* Decision Factors Checklist */}
      <Text style={styles.sectionHeaderTitle}>AURA Decision Factors Checklist</Text>

      <View style={styles.checklistContainer}>
        {bankOfficerSignals.map((factor, idx) => (
          <View key={idx} style={styles.factorCard}>
            <View style={styles.factorHeaderRow}>
              <View style={styles.factorNameGroup}>
                <Ionicons name="checkmark-circle" size={18} color="#059669" />
                <Text style={styles.factorName}>{factor.name}</Text>
              </View>
              <Text style={styles.factorMetric}>{factor.metric}</Text>
            </View>

            <Text style={styles.factorDetail}>{factor.detail}</Text>
            <Text style={styles.factorBenchmark}>Benchmark: {factor.benchmark}</Text>
          </View>
        ))}
      </View>

      {/* Institutional Value Banner */}
      <View style={styles.institutionalBanner}>
        <Ionicons name="sparkles" size={20} color="#059669" />
        <View style={styles.instContent}>
          <Text style={styles.instTitle}>The AURA Advantage for Banks</Text>
          <Text style={styles.instDesc}>
            Rather than relying on static bureau scores that reject 80% of gig workers, AURA provides banks with dynamic cash-flow visibility, reduced default rates, and safe short-term credit underwriting.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomColor: '#E2E8F0',
    borderBottomWidth: 1,
  },
  bankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bankBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 1,
  },
  exitBtn: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  exitBtnText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
  },
  subTitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 16,
  },
  customerCard: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(16, 185, 129, 0.4)',
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
  },
  customerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 12,
  },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  customerMeta: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },
  customerRole: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
  },
  customerAcc: {
    fontSize: 11,
    color: '#64748B',
  },
  riskSignalPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  riskSignalText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  metricItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  metricLabel: {
    fontSize: 10,
    color: '#64748B',
  },
  metricVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 2,
  },
  underwriteResultBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ECFDF5',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
  },
  resultCol: {},
  resultLabel: {
    fontSize: 10,
    color: '#059669',
    textTransform: 'uppercase',
  },
  resultAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: '#059669',
  },
  resultColRight: {
    alignItems: 'flex-end',
  },
  resultRecovery: {
    fontSize: 13,
    fontWeight: '700',
    color: '#059669',
    marginTop: 2,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  checklistContainer: {
    gap: 8,
    marginBottom: 18,
  },
  factorCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  factorHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  factorNameGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  factorName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  factorMetric: {
    fontSize: 13,
    fontWeight: '800',
    color: '#059669',
  },
  factorDetail: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },
  factorBenchmark: {
    fontSize: 10,
    color: '#64748B',
    fontStyle: 'italic',
  },
  institutionalBanner: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#ECFDF5',
    borderColor: 'rgba(16, 185, 129, 0.4)',
    borderWidth: 1,
    padding: 14,
    borderRadius: 14,
    alignItems: 'flex-start',
  },
  instContent: {
    flex: 1,
  },
  instTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 4,
  },
  instDesc: {
    fontSize: 11,
    color: '#334155',
    lineHeight: 16,
  },
});
