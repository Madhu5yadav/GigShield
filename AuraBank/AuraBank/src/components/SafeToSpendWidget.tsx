import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAura } from '../context/AuraContext';
import { SAFE_TO_SPEND_DATA } from '../data/auraMockData';

export const SafeToSpendWidget: React.FC = () => {
  const { balance } = useAura();

  const displayBalance = balance > 1000 ? balance : SAFE_TO_SPEND_DATA.defaultBalance;
  const upcomingExpenses = SAFE_TO_SPEND_DATA.upcomingExpenses;
  const emergencyReserve = SAFE_TO_SPEND_DATA.emergencyReserve;
  const safeToSpend = Math.max(displayBalance - upcomingExpenses - emergencyReserve, 0);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <Text style={styles.badgeText}>AURA INTELLIGENCE</Text>
          <Text style={styles.title}>Safe-to-Spend Calculator</Text>
        </View>
        <Ionicons name="sparkles" size={20} color="#059669" />
      </View>

      <Text style={styles.subtitle}>
        AURA subtracts locked essential obligations and emergency reserves from raw bank balance.
      </Text>

      {/* Main Safe to Spend Hero Box */}
      <View style={styles.safeHeroBox}>
        <Text style={styles.safeHeroLabel}>AURA SAFE TO SPEND TODAY</Text>
        <Text style={styles.safeHeroValue}>₹{safeToSpend.toLocaleString()}</Text>
        <Text style={styles.safeHeroMessage}>{SAFE_TO_SPEND_DATA.message}</Text>
      </View>

      {/* Math Breakdown Table */}
      <View style={styles.breakdownTable}>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Total Account Balance</Text>
          <Text style={styles.tableVal}>₹{displayBalance.toLocaleString()}</Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Less: Upcoming Essential Expenses</Text>
          <Text style={[styles.tableVal, { color: '#DC2626' }]}>
            -₹{upcomingExpenses.toLocaleString()}
          </Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Less: Locked Emergency Reserve</Text>
          <Text style={[styles.tableVal, { color: '#D97706' }]}>
            -₹{emergencyReserve.toLocaleString()}
          </Text>
        </View>

        <View style={styles.tableDivider} />

        <View style={styles.tableRowResult}>
          <Text style={styles.resultLabel}>Net Spendable Cash</Text>
          <Text style={styles.resultVal}>₹{safeToSpend.toLocaleString()}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(16, 185, 129, 0.4)',
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginVertical: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  titleGroup: {},
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
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 14,
    lineHeight: 17,
  },
  safeHeroBox: {
    backgroundColor: '#ECFDF5',
    borderColor: 'rgba(16, 185, 129, 0.4)',
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 14,
  },
  safeHeroLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 1,
  },
  safeHeroValue: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1E293B',
    marginVertical: 4,
  },
  safeHeroMessage: {
    fontSize: 12,
    color: '#059669',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  breakdownTable: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tableLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  tableVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  tableDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 2,
  },
  tableRowResult: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#059669',
  },
  resultVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#059669',
  },
});
