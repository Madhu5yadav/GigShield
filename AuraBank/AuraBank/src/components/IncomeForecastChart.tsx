import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FORECAST_DATA_POINTS, FORECAST_SUMMARY } from '../data/auraMockData';

export const IncomeForecastChart: React.FC = () => {
  const maxForecastVal = 2000;

  return (
    <View style={styles.container}>
      {/* Header Banner */}
      <View style={styles.headerBanner}>
        <View style={styles.badgeRow}>
          <View style={styles.badgeLabelGroup}>
            <Ionicons name="trending-up-outline" size={14} color="#059669" />
            <Text style={styles.badgeText}>AI FORECAST ENGINE</Text>
          </View>
          <View style={styles.activeTag}>
            <View style={styles.pulseDot} />
            <Text style={styles.activeTagText}>90% Model Confidence</Text>
          </View>
        </View>

        <Text style={styles.headerTitle}>Next 7 Days Forecast</Text>
        <Text style={styles.rangeText}>
          ₹{FORECAST_SUMMARY.rangeMin.toLocaleString()} – ₹{FORECAST_SUMMARY.rangeMax.toLocaleString()}
        </Text>

        <View style={styles.avgPill}>
          <Text style={styles.avgPillLabel}>Expected Average:</Text>
          <Text style={styles.avgPillVal}>₹{FORECAST_SUMMARY.expectedAverage.toLocaleString()}</Text>
        </View>
      </View>

      {/* Chart Visual Card */}
      <View style={styles.chartCard}>
        <View style={styles.chartMetaRow}>
          <View style={styles.metaLegend}>
            <View style={[styles.dot, { backgroundColor: '#059669' }]} />
            <Text style={styles.metaText}>Historical Trend</Text>
          </View>
          <View style={styles.metaLegend}>
            <View style={[styles.dot, { backgroundColor: '#10B981' }]} />
            <Text style={styles.metaText}>Predicted Earning Region</Text>
          </View>
        </View>

        {/* Forecast Bars */}
        <View style={styles.forecastBarsRow}>
          {FORECAST_DATA_POINTS.map(item => {
            const barHeight = Math.min((item.income / maxForecastVal) * 100, 100);
            const isWeekend = item.day === 'Sat' || item.day === 'Sun';

            return (
              <View key={item.day} style={styles.forecastCol}>
                <Text style={styles.valText}>₹{item.income}</Text>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: `${Math.max(barHeight, 8)}%`,
                        backgroundColor: isWeekend ? '#10B981' : '#059669',
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.dayLabel, isWeekend && styles.weekendDayLabel]}>
                  {item.day}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Why This Prediction Explainability Card */}
      <View style={styles.explainCard}>
        <View style={styles.explainTitleRow}>
          <Ionicons name="information-circle-outline" size={16} color="#059669" />
          <Text style={styles.explainTitle}>Why this prediction?</Text>
        </View>

        <View style={styles.factorsList}>
          {FORECAST_SUMMARY.factors.map((factor, idx) => (
            <View key={idx} style={styles.factorItem}>
              <Ionicons name="checkmark-circle" size={15} color="#10B981" />
              <Text style={styles.factorText}>{factor}</Text>
            </View>
          ))}
        </View>

        <View style={styles.disclaimerBox}>
          <Ionicons name="shield-checkmark-outline" size={14} color="#64748B" />
          <Text style={styles.disclaimerText}>{FORECAST_SUMMARY.disclaimer}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 12,
  },
  headerBanner: {
    backgroundColor: '#ECFDF5',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 1.5,
  },
  activeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 4,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  activeTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  headerTitle: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  rangeText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E293B',
    marginVertical: 4,
  },
  avgPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  avgPillLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  avgPillVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#059669',
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  chartMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  metaLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  metaText: {
    fontSize: 11,
    color: '#64748B',
  },
  forecastBarsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    paddingTop: 16,
  },
  forecastCol: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  valText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
  },
  barTrack: {
    width: 22,
    height: 90,
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 6,
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 8,
  },
  weekendDayLabel: {
    color: '#059669',
    fontWeight: '800',
  },
  explainCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  explainTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  explainTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  factorsList: {
    gap: 8,
    marginBottom: 12,
  },
  factorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  factorText: {
    fontSize: 12,
    color: '#334155',
    flex: 1,
  },
  disclaimerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 8,
  },
  disclaimerText: {
    fontSize: 11,
    color: '#64748B',
    fontStyle: 'italic',
    flex: 1,
  },
});
