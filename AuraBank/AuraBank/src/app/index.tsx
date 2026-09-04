import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform, StatusBar as RNStatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAura } from '../context/AuraContext';
import { AuthView } from '../components/AuthView';
import { HomeView } from '../components/HomeView';
import { AuraDashboardView } from '../components/AuraDashboardView';
import { AiCoachView } from '../components/AiCoachView';
import { PaymentsView, CardsView, HistoryView, ProfileView } from '../components/BankingTabs';
import { BankOfficerDashboard } from '../components/BankOfficerDashboard';
import { DemoController } from '../components/DemoController';

import { ExplainableModal } from '../components/ExplainableModal';
import { AdvanceReviewModal } from '../components/AdvanceReviewModal';
import { WhatIfSimulator } from '../components/WhatIfSimulator';
import { SendMoneyModal } from '../components/modals/SendMoneyModal';
import { ReceiveMoneyModal } from '../components/modals/ReceiveMoneyModal';
import { PayBillsModal } from '../components/modals/PayBillsModal';
import { PaymentSuccessModal } from '../components/modals/PaymentSuccessModal';
import { AlertsDrawer } from '../components/AlertsDrawer';

export default function MainApp() {
  const { activeTab, setActiveTab, isBankOfficerView, isAuthenticated, isPinLocked } = useAura();
  const insets = useSafeAreaInsets();

  const topInset = Math.max(
    insets.top,
    Platform.OS === 'android' ? (RNStatusBar.currentHeight || 36) : 0
  );

  // If user is locked or not authenticated, display Security PIN / Login page
  if (!isAuthenticated || isPinLocked) {
    return (
      <View style={[styles.appShell, { paddingTop: topInset + (Platform.OS === 'web' ? 6 : 4) }]}>
        <AuthView />
      </View>
    );
  }

  return (
    <View style={[styles.appShell, { paddingTop: topInset + (Platform.OS === 'web' ? 6 : 4) }]}>
      {/* Top Hackathon Demo Controller Bar */}
      <DemoController />

      {/* Main View Area */}
      <View style={styles.viewBody}>
        {isBankOfficerView ? (
          <BankOfficerDashboard />
        ) : (
          <>
            {activeTab === 'home' && <HomeView />}
            {activeTab === 'aura' && <AuraDashboardView />}
            {activeTab === 'coach' && <AiCoachView />}
            {activeTab === 'payments' && <PaymentsView />}
            {activeTab === 'cards' && <CardsView />}
            {activeTab === 'history' && <HistoryView />}
            {activeTab === 'profile' && <ProfileView />}
          </>
        )}
      </View>

      {/* Standard Clean Bottom Navigation Bar (Hidden in Bank Officer View) */}
      {!isBankOfficerView && (
        <View style={styles.bottomNav}>
          <Pressable
            style={styles.navItem}
            onPress={() => setActiveTab('home')}>
            <Ionicons
              name={activeTab === 'home' ? 'home' : 'home-outline'}
              size={20}
              color={activeTab === 'home' ? '#059669' : '#64748B'}
            />
            <Text style={[styles.navLabel, activeTab === 'home' && styles.navLabelActive]}>
              Home
            </Text>
          </Pressable>

          <Pressable
            style={styles.navItem}
            onPress={() => setActiveTab('aura')}>
            <Ionicons
              name={activeTab === 'aura' ? 'analytics' : 'analytics-outline'}
              size={20}
              color={activeTab === 'aura' ? '#059669' : '#64748B'}
            />
            <Text style={[styles.navLabel, activeTab === 'aura' && styles.navLabelActive]}>
              AURA
            </Text>
          </Pressable>

          <Pressable
            style={styles.navItem}
            onPress={() => setActiveTab('coach')}>
            <Ionicons
              name={activeTab === 'coach' ? 'chatbubbles' : 'chatbubbles-outline'}
              size={20}
              color={activeTab === 'coach' ? '#059669' : '#64748B'}
            />
            <Text style={[styles.navLabel, activeTab === 'coach' && styles.navLabelActive]}>
              Help & Chat
            </Text>
          </Pressable>

          <Pressable
            style={styles.navItem}
            onPress={() => setActiveTab('payments')}>
            <Ionicons
              name={activeTab === 'payments' ? 'card' : 'card-outline'}
              size={20}
              color={activeTab === 'payments' ? '#059669' : '#64748B'}
            />
            <Text style={[styles.navLabel, activeTab === 'payments' && styles.navLabelActive]}>
              Pay
            </Text>
          </Pressable>

          <Pressable
            style={styles.navItem}
            onPress={() => setActiveTab('profile')}>
            <Ionicons
              name={activeTab === 'profile' ? 'person' : 'person-outline'}
              size={20}
              color={activeTab === 'profile' ? '#059669' : '#64748B'}
            />
            <Text style={[styles.navLabel, activeTab === 'profile' && styles.navLabelActive]}>
              Profile
            </Text>
          </Pressable>
        </View>
      )}

      {/* Global Modals & Overlay Drawers */}
      <ExplainableModal />
      <AdvanceReviewModal />
      <WhatIfSimulator />
      <SendMoneyModal />
      <ReceiveMoneyModal />
      <PayBillsModal />
      <PaymentSuccessModal />
      <AlertsDrawer />
    </View>
  );
}

const styles = StyleSheet.create({
  appShell: {
    flex: 1,
    maxWidth: Platform.OS === 'web' ? 460 : '100%',
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#F8FAFC',
    borderLeftColor: '#E2E8F0',
    borderRightColor: '#E2E8F0',
    borderLeftWidth: Platform.OS === 'web' ? 1 : 0,
    borderRightWidth: Platform.OS === 'web' ? 1 : 0,
    position: 'relative',
    overflow: 'hidden',
  },
  viewBody: {
    flex: 1,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    height: Platform.OS === 'web' ? 64 : 72,
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E2E8F0',
    borderTopWidth: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: Platform.OS === 'web' ? 6 : 12,
    zIndex: 100,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
  },
  navLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  navLabelActive: {
    color: '#059669',
    fontWeight: '700',
  },
});
