import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAura } from '../context/AuraContext';

const SPONSORED_OFFERS = [
  {
    id: '1',
    badge: 'EXCLUSIVE OFFER',
    title: 'Get ₹50 Instant Petrol Cashback',
    subtitle: 'Pay at any HPCL or IOCL fuel bunk via AURA UPI',
    image: require('../../assets/images/fuel_cashback_banner.png'),
    bg: '#ECFDF5',
    borderColor: '#10B981',
    btnText: 'Claim Offer',
  },
  {
    id: '2',
    badge: 'GIG WORKER COVER',
    title: 'Free ₹2 Lakh Accidental Insurance',
    subtitle: 'Zero premium health cover for Zomato & Swiggy riders',
    image: require('../../assets/images/health_insurance_banner.png'),
    bg: '#FEF3C7',
    borderColor: '#F59E0B',
    btnText: 'Activate Cover',
  },
  {
    id: '3',
    badge: 'ZERO FEE PAYOUTS',
    title: 'Instant Weekend Earnings Payout',
    subtitle: 'Transfer platform earnings to SBI account with 0 charges',
    image: require('../../assets/images/instant_payout_banner.png'),
    bg: '#ECFDF5',
    borderColor: '#10B981',
    btnText: 'Explore',
  },
];

const PEOPLE_CONTACTS = [
  { id: '1', name: 'Dhinakaran', initial: 'D', bg: '#065F46' },
  { id: '2', name: 'Akash', initial: 'A', bg: '#7E22CE' },
  { id: '3', name: 'Lishal', initial: 'L', bg: '#78350F' },
  { id: '4', name: 'Pandian', initial: 'P', bg: '#451A03' },
  { id: '5', name: 'Muthu', initial: 'M', bg: '#047857' },
  { id: '6', name: 'Bhagaban', initial: 'B', bg: '#6B21A8' },
];

export const HomeView: React.FC = () => {
  const {
    userAccount,
    balance,
    resilienceScore,
    essentialExpenses,
    recommendedAdvance,
    setActiveTab,
    setShowSendMoneyModal,
    setShowReceiveMoneyModal,
    setShowPayBillsModal,
    advanceState,
    lockApp,
  } = useAura();

  const [searchQuery, setSearchQuery] = useState('');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Search Bar */}
      <View style={styles.topSearchBar}>
        <Ionicons name="search-outline" size={18} color="#64748B" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Pay by name, phone or UPI ID..."
          placeholderTextColor="#64748B"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Pressable style={styles.profileAvatar} onPress={lockApp}>
          <Text style={styles.avatarText}>{userAccount.name.charAt(0)}</Text>
        </Pressable>
      </View>

      {/* Dynamic AURA Hero Cash Flow Summary */}
      <View style={styles.heroOfferCard}>
        <View style={styles.heroHeaderRow}>
          <View style={styles.heroTag}>
            <Ionicons name="shield-checkmark" size={14} color="#059669" />
            <Text style={styles.heroTagText}>AURA REAL-TIME ENGINE</Text>
          </View>
          <Text style={styles.resiliencePillText}>Resilience Score: {resilienceScore}/100</Text>
        </View>

        <Text style={styles.heroOfferTitle}>
          {advanceState === 'accepted'
            ? `₹${recommendedAdvance.toLocaleString('en-IN')} Advance Active (${userAccount.name.split(' ')[0]})`
            : `Cash Flow Analysis: ${userAccount.name}`}
        </Text>
        
        {/* Simple 3-Line Summary */}
        <View style={styles.heroStatsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Available Balance</Text>
            <Text style={styles.statVal}>₹{balance.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Upcoming Expenses</Text>
            <Text style={[styles.statVal, { color: '#DC2626' }]}>₹{essentialExpenses.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Safe Advance Limit</Text>
            <Text style={[styles.statVal, { color: '#059669' }]}>
              {recommendedAdvance > 0 ? `₹${recommendedAdvance.toLocaleString('en-IN')}` : '₹0 (Safe)'}
            </Text>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [styles.heroCtaBtn, pressed && styles.heroCtaBtnPressed]}
          onPress={() => setActiveTab('aura')}>
          <Text style={styles.heroCtaBtnText}>View AURA Problem Solving Feature →</Text>
        </Pressable>
      </View>

      {/* 4 Primary Action Cards */}
      <View style={styles.actionCardsGrid}>
        <Pressable style={styles.actionSquare} onPress={() => setShowReceiveMoneyModal(true)}>
          <View style={styles.actionIconBg}>
            <Ionicons name="qr-code" size={22} color="#FFFFFF" />
          </View>
          <Text style={styles.actionSquareLabel}>Scan any{'\n'}QR code</Text>
        </Pressable>

        <Pressable style={styles.actionSquare} onPress={() => setShowSendMoneyModal(true)}>
          <View style={styles.actionIconBg}>
            <Ionicons name="paper-plane" size={22} color="#FFFFFF" />
          </View>
          <Text style={styles.actionSquareLabel}>Pay{'\n'}anyone</Text>
        </Pressable>

        <Pressable style={styles.actionSquare} onPress={() => setShowSendMoneyModal(true)}>
          <View style={styles.actionIconBg}>
            <Ionicons name="business" size={22} color="#FFFFFF" />
          </View>
          <Text style={styles.actionSquareLabel}>Bank{'\n'}transfer</Text>
        </Pressable>

        <Pressable style={styles.actionSquare} onPress={() => setShowPayBillsModal(true)}>
          <View style={styles.actionIconBg}>
            <Ionicons name="phone-portrait" size={22} color="#FFFFFF" />
          </View>
          <Text style={styles.actionSquareLabel}>Mobile{'\n'}recharge</Text>
        </Pressable>
      </View>

      {/* Middle Sponsored Offers Carousel with Real Visual Banners */}
      <View style={styles.sponsoredSectionHeader}>
        <Text style={styles.sponsoredTitle}>Sponsored Offers & Rewards</Text>
        <Text style={styles.sponsoredSub}>Swipe to view partner deals</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.sponsoredCarousel}
        contentContainerStyle={styles.sponsoredCarouselContent}>
        {SPONSORED_OFFERS.map(offer => (
          <View
            key={offer.id}
            style={[
              styles.offerCard,
              { backgroundColor: offer.bg, borderColor: offer.borderColor },
            ]}>
            <Image source={offer.image} style={styles.offerBannerImage} resizeMode="cover" />

            <View style={styles.offerBody}>
              <View style={styles.offerHeaderRow}>
                <Text style={styles.offerBadgeText}>{offer.badge}</Text>
              </View>

              <Text style={styles.offerCardTitle}>{offer.title}</Text>
              <Text style={styles.offerCardSub}>{offer.subtitle}</Text>

              <Pressable
                style={styles.offerBtn}
                onPress={() => setShowPayBillsModal(true)}>
                <Text style={styles.offerBtnText}>{offer.btnText} →</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Quick Category Chips */}
      <View style={styles.chipsRow}>
        <Pressable style={styles.chipPill} onPress={() => setShowSendMoneyModal(true)}>
          <Ionicons name="flash-outline" size={14} color="#059669" />
          <Text style={styles.chipPillText}>UPI Lite</Text>
        </Pressable>

        <Pressable style={styles.chipPill} onPress={() => setShowPayBillsModal(true)}>
          <Ionicons name="trophy-outline" size={14} color="#D97706" />
          <Text style={styles.chipPillText}>Rewards</Text>
        </Pressable>

        <Pressable style={styles.chipPill} onPress={() => setShowPayBillsModal(true)}>
          <Ionicons name="receipt-outline" size={14} color="#059669" />
          <Text style={styles.chipPillText}>Bills</Text>
        </Pressable>
      </View>

      {/* People / Quick Send Contacts Row */}
      <Text style={styles.sectionTitle}>People & Frequent Contacts</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.peopleCarousel}
        contentContainerStyle={styles.peopleCarouselContent}>
        {PEOPLE_CONTACTS.map(contact => (
          <Pressable
            key={contact.id}
            style={styles.personCard}
            onPress={() => setShowSendMoneyModal(true)}>
            <View style={[styles.personAvatarCircle, { backgroundColor: contact.bg }]}>
              <Text style={styles.personInitial}>{contact.initial}</Text>
            </View>
            <Text style={styles.personName} numberOfLines={1}>
              {contact.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Check Balance & History Cards */}
      <View style={styles.bottomListSection}>
        <Pressable style={styles.listRowItem} onPress={() => setActiveTab('history')}>
          <View style={[styles.listRowIconBg, { backgroundColor: '#ECFDF5' }]}>
            <Ionicons name="time-outline" size={20} color="#059669" />
          </View>
          <View style={styles.listRowMeta}>
            <Text style={styles.listRowTitle}>Check Account Balance & Ledger</Text>
            <Text style={styles.listRowSub}>Live balance: ₹{balance.toLocaleString('en-IN')} ({userAccount.name})</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
        </Pressable>

        <Pressable style={styles.listRowItem} onPress={() => setActiveTab('profile')}>
          <View style={[styles.listRowIconBg, { backgroundColor: '#EFF6FF' }]}>
            <Ionicons name="people-outline" size={20} color="#2563EB" />
          </View>
          <View style={styles.listRowMeta}>
            <Text style={styles.listRowTitle}>Switch Database Account Holder</Text>
            <Text style={styles.listRowSub}>Select between Rahul, Priya, Amit, or create new</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 90,
  },
  topSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  profileAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  heroOfferCard: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
    borderWidth: 1.5,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  heroTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heroTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 0.5,
  },
  resiliencePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#047857',
  },
  heroOfferTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  heroStatsGrid: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  statVal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
  heroCtaBtn: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  heroCtaBtnPressed: {
    opacity: 0.9,
  },
  heroCtaBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  actionCardsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 8,
  },
  actionSquare: {
    flex: 1,
    backgroundColor: '#059669',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  actionIconBg: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionSquareLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 15,
  },
  sponsoredSectionHeader: {
    marginBottom: 10,
  },
  sponsoredTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  sponsoredSub: {
    fontSize: 12,
    color: '#64748B',
  },
  sponsoredCarousel: {
    marginBottom: 16,
  },
  sponsoredCarouselContent: {
    gap: 12,
  },
  offerCard: {
    width: 250,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  offerBannerImage: {
    width: '100%',
    height: 100,
  },
  offerBody: {
    padding: 12,
  },
  offerHeaderRow: {
    marginBottom: 4,
  },
  offerBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 0.5,
  },
  offerCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  offerCardSub: {
    fontSize: 11,
    color: '#475569',
    marginVertical: 4,
    lineHeight: 14,
  },
  offerBtn: {
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  offerBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  chipPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  chipPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  peopleCarousel: {
    marginBottom: 20,
  },
  peopleCarouselContent: {
    gap: 14,
  },
  personCard: {
    alignItems: 'center',
    width: 60,
  },
  personAvatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  personInitial: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  personName: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '500',
    textAlign: 'center',
  },
  bottomListSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 8,
    gap: 4,
  },
  listRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  listRowIconBg: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  listRowMeta: {
    flex: 1,
  },
  listRowTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  listRowSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
});
