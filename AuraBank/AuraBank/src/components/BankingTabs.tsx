import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAura } from '../context/AuraContext';

// Payments Sub-Screen
export const PaymentsView: React.FC = () => {
  const { setShowSendMoneyModal, setShowReceiveMoneyModal, setShowPayBillsModal } = useAura();

  return (
    <ScrollView style={styles.tabContainer} contentContainerStyle={styles.tabContent}>
      <Text style={styles.tabTitle}>Payments & Transfers</Text>
      <Text style={styles.tabSubtitle}>Instant UPI transfers, bill payments, and payouts</Text>

      {/* Quick Action Grid */}
      <View style={styles.quickGrid}>
        <Pressable style={styles.quickCard} onPress={() => setShowSendMoneyModal(true)}>
          <View style={[styles.iconBg, { backgroundColor: '#ECFDF5' }]}>
            <Ionicons name="paper-plane-outline" size={22} color="#059669" />
          </View>
          <Text style={styles.quickText}>Send Money</Text>
        </Pressable>

        <Pressable style={styles.quickCard} onPress={() => setShowReceiveMoneyModal(true)}>
          <View style={[styles.iconBg, { backgroundColor: '#ECFDF5' }]}>
            <Ionicons name="qr-code-outline" size={22} color="#059669" />
          </View>
          <Text style={styles.quickText}>Receive QR</Text>
        </Pressable>

        <Pressable style={styles.quickCard} onPress={() => setShowPayBillsModal(true)}>
          <View style={[styles.iconBg, { backgroundColor: '#FEF3C7' }]}>
            <Ionicons name="receipt-outline" size={22} color="#D97706" />
          </View>
          <Text style={styles.quickText}>Pay Bills</Text>
        </Pressable>

        <Pressable style={styles.quickCard} onPress={() => setShowSendMoneyModal(true)}>
          <View style={[styles.iconBg, { backgroundColor: '#ECFDF5' }]}>
            <Ionicons name="wallet-outline" size={22} color="#059669" />
          </View>
          <Text style={styles.quickText}>UPI Transfer</Text>
        </Pressable>
      </View>

      {/* Recent Contacts */}
      <Text style={styles.sectionHeader}>Recent Contacts</Text>
      <View style={styles.listCard}>
        {['Amit Kumar (Zomato Hub)', 'Sunil Sharma (Swiggy Fleet)', 'Priya Fuel Bunk'].map(
          (contact, idx) => (
            <Pressable
              key={idx}
              style={styles.contactRow}
              onPress={() => setShowSendMoneyModal(true)}>
              <View style={styles.contactAvatar}>
                <Text style={styles.contactAvatarText}>{contact[0]}</Text>
              </View>
              <Text style={styles.contactName}>{contact}</Text>
              <Ionicons name="chevron-forward" size={16} color="#64748B" />
            </Pressable>
          )
        )}
      </View>
    </ScrollView>
  );
};

// Cards Sub-Screen
export const CardsView: React.FC = () => {
  const { userAccount } = useAura();
  const [isFrozen, setIsFrozen] = useState(false);
  const [limit, setLimit] = useState(5000);

  return (
    <ScrollView style={styles.tabContainer} contentContainerStyle={styles.tabContent}>
      <Text style={styles.tabTitle}>Virtual Debit Card</Text>
      <Text style={styles.tabSubtitle}>Manage your digital debit card</Text>

      {/* Credit Card Visual */}
      <View style={styles.cardGraphic}>
        <View style={styles.cardTopRow}>
          <Text style={styles.cardBrand}>AURA DIGITAL</Text>
          <Ionicons name="wifi-outline" size={20} color="#FFFFFF" />
        </View>

        <Text style={styles.cardNumber}>4532  ••••  ••••  {userAccount.accountNumber.slice(-4)}</Text>

        <View style={styles.cardBottomRow}>
          <View>
            <Text style={styles.cardHolderLabel}>CARD HOLDER</Text>
            <Text style={styles.cardHolderName}>{userAccount.name.toUpperCase()}</Text>
          </View>
          <View>
            <Text style={styles.cardHolderLabel}>EXPIRES</Text>
            <Text style={styles.cardHolderName}>08/29</Text>
          </View>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controlsCard}>
        <View style={styles.controlRow}>
          <View>
            <Text style={styles.controlTitle}>Freeze Card</Text>
            <Text style={styles.controlDesc}>Temporarily block all new transactions</Text>
          </View>
          <Switch
            value={isFrozen}
            onValueChange={setIsFrozen}
            trackColor={{ false: '#E2E8F0', true: '#10B981' }}
            thumbColor={isFrozen ? '#FFFFFF' : '#94A3B8'}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.controlRow}>
          <View>
            <Text style={styles.controlTitle}>Daily Spending Limit</Text>
            <Text style={styles.controlDesc}>Current limit: ₹{limit}</Text>
          </View>
          <Pressable
            style={styles.limitBtn}
            onPress={() => setLimit(prev => (prev === 5000 ? 10000 : 5000))}>
            <Text style={styles.limitBtnText}>Change</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

// History / Transactions Sub-Screen
export const HistoryView: React.FC = () => {
  const { transactions } = useAura();

  return (
    <ScrollView style={styles.tabContainer} contentContainerStyle={styles.tabContent}>
      <Text style={styles.tabTitle}>Transaction History</Text>
      <Text style={styles.tabSubtitle}>Live database ledger: income, expenses, & advances</Text>

      <View style={styles.listCard}>
        {transactions.length === 0 ? (
          <Text style={{ textAlign: 'center', color: '#64748B', padding: 20 }}>
            No transactions found for this account.
          </Text>
        ) : (
          transactions.map(t => (
            <View key={t.id} style={styles.txRow}>
              <View
                style={[
                  styles.txIconBg,
                  {
                    backgroundColor:
                      t.type === 'income'
                        ? '#ECFDF5'
                        : t.type === 'savings'
                        ? '#ECFDF5'
                        : '#FEF2F2',
                  },
                ]}>
                <Ionicons
                  name={
                    t.type === 'income'
                      ? 'arrow-down-circle-outline'
                      : t.type === 'savings'
                      ? 'wallet-outline'
                      : 'arrow-up-circle-outline'
                  }
                  size={20}
                  color={
                    t.type === 'income'
                      ? '#059669'
                      : t.type === 'savings'
                      ? '#059669'
                      : '#DC2626'
                  }
                />
              </View>
              <View style={styles.txMeta}>
                <Text style={styles.txTitle}>{t.title}</Text>
                <Text style={styles.txDate}>{t.date} {t.refNo ? `• ${t.refNo}` : ''}</Text>
              </View>
              <Text
                style={[
                  styles.txAmount,
                  {
                    color:
                      t.type === 'income'
                        ? '#059669'
                        : t.type === 'savings'
                        ? '#059669'
                        : '#DC2626',
                  },
                ]}>
                {t.amount}
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

// Profile Sub-Screen
export const ProfileView: React.FC = () => {
  const { userAccount, allUsers, switchUserAccount, setIsBankOfficerView, logout, simulateWeekendPayout } = useAura();
  const [showSwitchMenu, setShowSwitchMenu] = useState(false);

  return (
    <ScrollView style={styles.tabContainer} contentContainerStyle={styles.tabContent}>
      <Text style={styles.tabTitle}>Profile & Database Account</Text>
      <Text style={styles.tabSubtitle}>Manage stored account data & switch database profiles</Text>

      {/* User Header */}
      <View style={styles.profileHeaderCard}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarLargeText}>{userAccount.name.charAt(0)}</Text>
        </View>
        <Text style={styles.profileName}>{userAccount.name}</Text>
        <Text style={styles.profileRole}>{userAccount.role}</Text>
        <Text style={styles.profileUpi}>Platform: {userAccount.platform}</Text>
        <Text style={styles.profileUpi}>UPI ID: {userAccount.upiId}</Text>
        <Text style={styles.profileUpi}>Account: {userAccount.accountNumber}</Text>
      </View>

      {/* Database Switcher */}
      <View style={styles.dbSwitcherCard}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <Text style={styles.dbSwitcherTitle}>Database Account Holders</Text>
          <Pressable onPress={() => setShowSwitchMenu(!showSwitchMenu)}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#059669' }}>
              {showSwitchMenu ? 'Hide List' : 'Switch Account'}
            </Text>
          </Pressable>
        </View>

        {showSwitchMenu && (
          <View style={{ gap: 8, marginTop: 8 }}>
            {allUsers.map(user => (
              <Pressable
                key={user.id}
                style={[
                  styles.miniUserRow,
                  user.id === userAccount.id && styles.miniUserRowActive,
                ]}
                onPress={() => {
                  switchUserAccount(user.id);
                  setShowSwitchMenu(false);
                }}
              >
                <View style={styles.miniAvatar}>
                  <Text style={styles.miniAvatarText}>{user.name.charAt(0)}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.miniUserName}>{user.name}</Text>
                  <Text style={styles.miniUserRole}>{user.role} (Bal: ₹{user.balance.toLocaleString('en-IN')})</Text>
                </View>
                {user.id === userAccount.id && <Ionicons name="checkmark-circle" size={20} color="#059669" />}
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {/* Simulate Platform Payout */}
      <Pressable
        style={styles.payoutSimCard}
        onPress={() => simulateWeekendPayout(2500)}
      >
        <Ionicons name="cash-outline" size={22} color="#059669" />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.payoutSimTitle}>Simulate Gig Earnings Deposit (+₹2,500)</Text>
          <Text style={styles.payoutSimSub}>Test live payout settlement into main database balance</Text>
        </View>
      </Pressable>

      {/* Bank Officer View Switch */}
      <Pressable
        style={styles.officerSwitchCard}
        onPress={() => setIsBankOfficerView(true)}>
        <Ionicons name="business" size={24} color="#059669" />
        <View style={styles.officerTextCol}>
          <Text style={styles.officerTitle}>Switch to Bank Officer View</Text>
          <Text style={styles.officerSub}>View AURA institutional credit underwriting matrix</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#059669" />
      </Pressable>

      {/* Logout Button */}
      <Pressable style={styles.logoutCard} onPress={logout}>
        <Ionicons name="log-out-outline" size={22} color="#DC2626" />
        <Text style={styles.logoutText}>Log Out / Switch Account</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  tabContent: {
    padding: 16,
    paddingBottom: 100,
  },
  tabTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
  },
  tabSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 16,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  quickCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  iconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 10,
  },
  listCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderColor: '#E2E8F0',
    borderWidth: 1,
    padding: 12,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  contactAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactAvatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  contactName: {
    flex: 1,
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '600',
  },
  cardGraphic: {
    backgroundColor: '#059669',
    borderRadius: 18,
    padding: 20,
    height: 180,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardBrand: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  cardNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 3,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardHolderLabel: {
    fontSize: 9,
    color: '#ECFDF5',
  },
  cardHolderName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 2,
  },
  controlsCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  controlDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 14,
  },
  limitBtn: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  limitBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  txIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txMeta: {
    flex: 1,
  },
  txTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  txDate: {
    fontSize: 11,
    color: '#64748B',
  },
  txAmount: {
    fontSize: 14,
    fontWeight: '800',
  },
  profileHeaderCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarLargeText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  profileRole: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
    marginTop: 2,
  },
  profileUpi: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  dbSwitcherCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  dbSwitcherTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  miniUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  miniUserRowActive: {
    backgroundColor: '#F0FDF4',
    borderColor: '#059669',
  },
  miniAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniAvatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  miniUserName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  miniUserRole: {
    fontSize: 11,
    color: '#64748B',
  },
  payoutSimCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  payoutSimTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#059669',
  },
  payoutSimSub: {
    fontSize: 11,
    color: '#334155',
    marginTop: 2,
  },
  officerSwitchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 12,
    marginBottom: 12,
  },
  officerTextCol: {
    flex: 1,
  },
  officerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#059669',
  },
  officerSub: {
    fontSize: 11,
    color: '#334155',
  },
  logoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    padding: 14,
    borderRadius: 14,
  },
  logoutText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC2626',
  },
});
