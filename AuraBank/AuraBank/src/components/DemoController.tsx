import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAura } from '../context/AuraContext';

import { TestProfileSelectorModal } from './TestProfileSelectorModal';

export const DemoController: React.FC = () => {
  const { userAccount, balance, advanceState, isBankOfficerView, setIsBankOfficerView, setActiveTab } = useAura();
  const [collapsed, setCollapsed] = useState(false);
  const [showSelector, setShowSelector] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Pressable
          style={styles.titlePressable}
          onPress={() => setCollapsed(prev => !prev)}>
          <View style={styles.livePulseDot} />
          <Text style={styles.badgeText}>DB PERSISTENCE ENGINE</Text>
          <Ionicons
            name={collapsed ? 'chevron-down' : 'chevron-up'}
            size={12}
            color="#059669"
          />
        </Pressable>

        <Pressable
          style={[styles.bankToggleBtn, isBankOfficerView && styles.bankToggleBtnActive]}
          onPress={() => setIsBankOfficerView(prev => !prev)}>
          <Ionicons
            name="business-outline"
            size={12}
            color={isBankOfficerView ? '#FFFFFF' : '#059669'}
          />
          <Text style={[styles.bankToggleText, isBankOfficerView && styles.bankToggleTextActive]}>
            {isBankOfficerView ? 'Customer Mode' : 'Bank Officer Mode'}
          </Text>
        </Pressable>
      </View>

      {!collapsed && (
        <View style={styles.infoRow}>
          <Pressable style={styles.userBadge} onPress={() => setShowSelector(true)}>
            <Ionicons name="swap-horizontal" size={14} color="#059669" />
            <Text style={styles.userBadgeText}>{userAccount.name}</Text>
            <Text style={{ fontSize: 10, color: '#059669', fontWeight: '700' }}>(Switch)</Text>
          </Pressable>

          <Text style={styles.balText}>DB Bal: ₹{balance.toLocaleString('en-IN')}</Text>

          <Pressable style={styles.statusPill} onPress={() => setShowSelector(true)}>
            <Text style={styles.statusPillText}>
              Test Cases ⚡
            </Text>
          </Pressable>
        </View>
      )}

      <TestProfileSelectorModal
        visible={showSelector}
        onClose={() => setShowSelector(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(16, 185, 129, 0.4)',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginHorizontal: 12,
    marginTop: 6,
    marginBottom: 4,
    zIndex: 90,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titlePressable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 2,
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 0.5,
  },
  bankToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  bankToggleBtnActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  bankToggleText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  bankToggleTextActive: {
    color: '#FFFFFF',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  userBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  balText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  statusPill: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#047857',
  },
});
