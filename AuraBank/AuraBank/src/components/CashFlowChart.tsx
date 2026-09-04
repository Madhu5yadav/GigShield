import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WEEKLY_INCOME_PATTERN, AI_INSIGHTS } from '../data/auraMockData';

export const CashFlowChart: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<string | null>('Sun');

  const maxIncome = 2000;

  const dayData = WEEKLY_INCOME_PATTERN.find(d => d.day === selectedDay) || WEEKLY_INCOME_PATTERN[6];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Text style={styles.sectionBadge}>AURA ENGINE</Text>
          <Text style={styles.sectionTitle}>Cash-Flow Intelligence</Text>
        </View>
        <Text style={styles.periodText}>90-Day Rolling Window</Text>
      </View>

      <Text style={styles.subtitle}>
        AURA analyzes daily volatility to identify your true earning potential and stability.
      </Text>

      {/* Chart Card */}
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartLabel}>Weekly Income Pattern</Text>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
              <Text style={styles.legendText}>Income</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
              <Text style={styles.legendText}>Expenses</Text>
            </View>
          </View>
        </View>

        {/* Bar Graph Visual */}
        <View style={styles.barsContainer}>
          {WEEKLY_INCOME_PATTERN.map(item => {
            const isSelected = item.day === selectedDay;
            const incomeHeightPercent = Math.min((item.income / maxIncome) * 100, 100);

            return (
              <Pressable
                key={item.day}
                style={styles.barColumn}
                onPress={() => setSelectedDay(item.day)}>
                <Text style={styles.barValueText}>
                  {item.income > 0 ? `₹${item.income}` : '₹0'}
                </Text>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: `${Math.max(incomeHeightPercent, 6)}%`,
                        backgroundColor: isSelected
                          ? '#10B981'
                          : item.income >= 1500
                          ? '#34D399'
                          : item.income === 0
                          ? '#94A3B8'
                          : '#059669',
                      },
                    ]}
                  />
                </View>
                <View
                  style={[
                    styles.dayPill,
                    isSelected && styles.dayPillSelected,
                  ]}>
                  <Text style={[styles.dayText, isSelected && styles.dayTextSelected]}>
                    {item.day}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Day Detail Card */}
        {dayData && (
          <View style={styles.dayDetailCard}>
            <View style={styles.dayDetailHeader}>
              <Text style={styles.dayDetailTitle}>{dayData.day} Breakdown ({dayData.date})</Text>
              {dayData.notes && <Text style={styles.dayTag}>{dayData.notes}</Text>}
            </View>
            <View style={styles.dayMetricsRow}>
              <View style={styles.dayMetric}>
                <Text style={styles.metricLabel}>Income Earned</Text>
                <Text style={[styles.metricValue, { color: '#059669' }]}>₹{dayData.income}</Text>
              </View>
              <View style={styles.dayMetric}>
                <Text style={styles.metricLabel}>Essential Costs</Text>
                <Text style={[styles.metricValue, { color: '#DC2626' }]}>₹{dayData.expenses}</Text>
              </View>
              <View style={styles.dayMetric}>
                <Text style={styles.metricLabel}>Net Cash Flow</Text>
                <Text
                  style={[
                    styles.metricValue,
                    { color: dayData.income - dayData.expenses >= 0 ? '#059669' : '#D97706' },
                  ]}>
                  ₹{dayData.income - dayData.expenses}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* AI Interpretations Section */}
      <Text style={styles.insightsHeaderTitle}>AI Insights & Pattern Analysis</Text>

      <View style={styles.insightsList}>
        {AI_INSIGHTS.map(insight => (
          <View key={insight.id} style={styles.insightCard}>
            <View style={styles.insightIconContainer}>
              <Ionicons name="analytics" size={18} color="#059669" />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>{insight.title}</Text>
              <Text style={styles.insightDesc}>{insight.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  titleContainer: {},
  sectionBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 1.5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
  },
  periodText: {
    fontSize: 11,
    color: '#64748B',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 16,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  legendRow: {
    flexDirection: 'row',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: '#64748B',
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
    paddingTop: 20,
    paddingBottom: 10,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  barValueText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
  },
  barTrack: {
    width: 22,
    height: 100,
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 6,
  },
  dayPill: {
    marginTop: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  dayPillSelected: {
    backgroundColor: '#ECFDF5',
  },
  dayText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  dayTextSelected: {
    color: '#059669',
    fontWeight: '700',
  },
  dayDetailCard: {
    backgroundColor: '#ECFDF5',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginTop: 14,
  },
  dayDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dayDetailTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  dayTag: {
    fontSize: 10,
    fontWeight: '600',
    color: '#059669',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  dayMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayMetric: {
    alignItems: 'flex-start',
  },
  metricLabel: {
    fontSize: 10,
    color: '#64748B',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  insightsHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 10,
  },
  insightsList: {
    gap: 10,
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'flex-start',
    gap: 12,
  },
  insightIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  insightDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
  },
});
