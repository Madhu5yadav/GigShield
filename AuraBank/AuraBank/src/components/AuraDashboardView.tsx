import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ResilienceGauge } from './ResilienceGauge';
import { CashFlowChart } from './CashFlowChart';
import { IncomeForecastChart } from './IncomeForecastChart';
import { LiquidityGapCard } from './LiquidityGapCard';
import { SmartSavingsWidget } from './SmartSavingsWidget';
import { SafeToSpendWidget } from './SafeToSpendWidget';

export const AuraDashboardView: React.FC = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Banner */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <Ionicons name="analytics" size={24} color="#059669" />
          <Text style={styles.brandTitle}>AURA</Text>
        </View>
        <Text style={styles.brandSubtitle}>Your Financial Co-Pilot</Text>
        <Text style={styles.brandTagline}>
          "Understand your money. Predict what's next. Stay financially resilient."
        </Text>
      </View>

      {/* Resilience Score Gauge & Pillar Breakdown */}
      <View style={styles.sectionCard}>
        <ResilienceGauge />
      </View>

      {/* Liquidity Gap Detection Hero Moment */}
      <LiquidityGapCard />

      {/* AI Income Forecast Feature */}
      <IncomeForecastChart />

      {/* AURA Brain Cash-Flow Analysis */}
      <CashFlowChart />

      {/* Smart Savings Widget */}
      <SmartSavingsWidget />

      {/* Safe To Spend Widget */}
      <SafeToSpendWidget />

      {/* Final Product Message Callout */}
      <View style={styles.finalMessageCard}>
        <Ionicons name="information-circle-outline" size={22} color="#059669" />
        <Text style={styles.finalMessageTitle}>Traditional Banking vs AURA</Text>
        <Text style={styles.finalMessageText}>
          Traditional banking tells you where your money is. AURA tells you what your money is likely to do next — and what you can safely do about it.
        </Text>
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
    paddingBottom: 90,
  },
  header: {
    marginBottom: 16,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1E293B',
    letterSpacing: 2,
  },
  brandSubtitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#059669',
    marginTop: 2,
  },
  brandTagline: {
    fontSize: 12,
    color: '#64748B',
    fontStyle: 'italic',
    marginTop: 4,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  finalMessageCard: {
    backgroundColor: '#ECFDF5',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  finalMessageTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#059669',
    marginVertical: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  finalMessageText: {
    fontSize: 13,
    color: '#1E293B',
    textAlign: 'center',
    lineHeight: 18,
    fontStyle: 'italic',
  },
});
