import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAura } from '../context/AuraContext';
import { SMART_SAVINGS_DATA } from '../data/auraMockData';

export const SmartSavingsWidget: React.FC = () => {
  const { emergencyFundBalance, saveToEmergencyFund, balance } = useAura();

  const target = SMART_SAVINGS_DATA.targetFund;
  const progressPercent = Math.min(Math.round((emergencyFundBalance / target) * 100), 100);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Text style={styles.badgeText}>AURA SMART SAVINGS</Text>
          <Text style={styles.title}>Dynamic Income-Based Saving</Text>
        </View>
        <Text style={styles.fundTag}>{progressPercent}% Target Reached</Text>
      </View>

      <Text style={styles.subtitle}>{SMART_SAVINGS_DATA.message}</Text>

      {/* Emergency Fund Progress Ring & Box */}
      <View style={styles.fundCard}>
        <View style={styles.fundRow}>
          <View style={styles.fundIconBg}>
            <Ionicons name="wallet-outline" size={24} color="#059669" />
          </View>
          <View style={styles.fundTextCol}>
            <Text style={styles.fundLabel}>Emergency Cushion Fund</Text>
            <Text style={styles.fundVal}>
              ₹{emergencyFundBalance.toLocaleString()} / ₹{target.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
        </View>

        <Text style={styles.fundHint}>Target covers 1 month of essential expenses (₹10,000)</Text>
      </View>

      {/* Dynamic Tier Table */}
      <Text style={styles.matrixTitle}>Dynamic Saving Matrix</Text>

      <View style={styles.tiersList}>
        {SMART_SAVINGS_DATA.tierRecommendations.map((tier, idx) => (
          <View key={idx} style={styles.tierRow}>
            <View style={styles.tierInfo}>
              <Text style={styles.tierIncome}>{tier.incomeLevel}</Text>
              <Text style={styles.tierSub}>{tier.label}</Text>
            </View>
            <View style={styles.tierAction}>
              <Text style={styles.tierSaveAmount}>Save ₹{tier.saveAmount}</Text>
              {tier.saveAmount > 0 && balance >= tier.saveAmount && (
                <Pressable
                  style={styles.quickSaveBtn}
                  onPress={() => saveToEmergencyFund(tier.saveAmount)}>
                  <Text style={styles.quickSaveBtnText}>Save Now</Text>
                </Pressable>
              )}
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
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
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
  titleContainer: {},
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
  fundTag: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 14,
    lineHeight: 17,
  },
  fundCard: {
    backgroundColor: '#F8FAFC',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },
  fundRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  fundIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fundTextCol: {},
  fundLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  fundVal: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
  },
  progressTrack: {
    height: 10,
    backgroundColor: '#E2E8F0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 5,
  },
  fundHint: {
    fontSize: 11,
    color: '#64748B',
    fontStyle: 'italic',
  },
  matrixTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tiersList: {
    gap: 8,
  },
  tierRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 10,
  },
  tierInfo: {},
  tierIncome: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  tierSub: {
    fontSize: 11,
    color: '#64748B',
  },
  tierAction: {
    alignItems: 'flex-end',
  },
  tierSaveAmount: {
    fontSize: 13,
    fontWeight: '800',
    color: '#059669',
  },
  quickSaveBtn: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 2,
  },
  quickSaveBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
});
