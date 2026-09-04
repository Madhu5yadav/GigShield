import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAura } from '../context/AuraContext';

export const AuthView: React.FC = () => {
  const {
    userAccount,
    allUsers,
    unlockWithPin,
    unlockWithBiometrics,
    login,
    switchUserAccount,
    createNewUserAccount,
  } = useAura();

  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [viewMode, setViewMode] = useState<'pin' | 'switch' | 'register'>('pin');

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regRole, setRegRole] = useState('Gig Worker');
  const [regPlatform, setRegPlatform] = useState('Zomato & Swiggy');
  const [regPhone, setRegPhone] = useState('');
  const [regPin, setRegPin] = useState('1234');
  const [regBalance, setRegBalance] = useState('150');

  const handleKeyPress = (num: string) => {
    setPinError(false);
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 4) {
        setTimeout(() => {
          const success = unlockWithPin(newPin);
          if (!success) {
            setPinError(true);
            setPin('');
          }
        }, 150);
      }
    }
  };

  const handleDelete = () => {
    setPinError(false);
    setPin(prev => prev.slice(0, -1));
  };

  const handleBiometricTap = () => {
    unlockWithBiometrics();
  };

  const handleCreateAccountSubmit = () => {
    if (!regName.trim() || !regPhone.trim()) return;
    createNewUserAccount({
      name: regName.trim(),
      role: regRole || 'Gig Economy Worker',
      platform: regPlatform || 'Multi-platform Partner',
      phone: regPhone.trim(),
      email: `${regName.toLowerCase().replace(/\s+/g, '.')}@aurabank.in`,
      pin: regPin || '1234',
      initialBalance: parseFloat(regBalance) || 100,
    });
  };

  if (viewMode === 'register') {
    return (
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.headerArea}>
          <Pressable style={styles.backBtn} onPress={() => setViewMode('pin')}>
            <Ionicons name="arrow-back" size={24} color="#1E293B" />
          </Pressable>
          <Text style={styles.headerTitle}>Create New Account</Text>
        </View>

        <Text style={styles.subtitleText}>
          Store your financial profile dynamically in the AURA Database.
        </Text>

        <View style={styles.formCard}>
          <Text style={styles.inputLabel}>Full Name</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g. Vikram Verma"
            value={regName}
            onChangeText={setRegName}
          />

          <Text style={styles.inputLabel}>Gig Work Role</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g. Delivery Partner / Rideshare Driver"
            value={regRole}
            onChangeText={setRegRole}
          />

          <Text style={styles.inputLabel}>Platform(s)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g. Zomato, Swiggy, Uber, Porter"
            value={regPlatform}
            onChangeText={setRegPlatform}
          />

          <Text style={styles.inputLabel}>Mobile Phone Number</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g. 9876543219"
            keyboardType="phone-pad"
            value={regPhone}
            onChangeText={setRegPhone}
          />

          <View style={styles.rowInputs}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.inputLabel}>Security PIN</Text>
              <TextInput
                style={styles.textInput}
                placeholder="1234"
                keyboardType="number-pad"
                maxLength={4}
                value={regPin}
                onChangeText={setRegPin}
              />
            </View>

            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.inputLabel}>Initial Balance (₹)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="150"
                keyboardType="number-pad"
                value={regBalance}
                onChangeText={setRegBalance}
              />
            </View>
          </View>

          <Pressable
            style={[styles.primaryBtn, (!regName.trim() || !regPhone.trim()) && styles.disabledBtn]}
            onPress={handleCreateAccountSubmit}
            disabled={!regName.trim() || !regPhone.trim()}
          >
            <Text style={styles.primaryBtnText}>Register & Enter App →</Text>
          </Pressable>
        </View>

        <Pressable onPress={() => setViewMode('pin')} style={{ marginTop: 20, alignSelf: 'center' }}>
          <Text style={styles.linkText}>Back to PIN Unlock</Text>
        </Pressable>
      </ScrollView>
    );
  }

  if (viewMode === 'switch') {
    return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerArea}>
          <Pressable style={styles.backBtn} onPress={() => setViewMode('pin')}>
            <Ionicons name="arrow-back" size={24} color="#1E293B" />
          </Pressable>
          <Text style={styles.headerTitle}>Select Account Holder</Text>
        </View>

        <Text style={styles.subtitleText}>
          Choose an account stored in the AURA database to test dynamic resilience & liquidity gap calculations.
        </Text>

        <View style={styles.userList}>
          {allUsers.map(user => {
            const isSelected = user.id === userAccount.id;
            return (
              <Pressable
                key={user.id}
                style={[styles.userCard, isSelected && styles.userCardSelected]}
                onPress={() => {
                  switchUserAccount(user.id);
                  setViewMode('pin');
                }}
              >
                <View style={styles.avatarCircleSmall}>
                  <Text style={styles.avatarLetterSmall}>{user.name.charAt(0)}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.userCardName}>{user.name}</Text>
                  <Text style={styles.userCardSub}>{user.role} • {user.platform}</Text>
                  <Text style={styles.userCardBal}>Balance: ₹{user.balance.toLocaleString('en-IN')}</Text>
                </View>
                {isSelected && <Ionicons name="checkmark-circle" size={24} color="#059669" />}
              </Pressable>
            );
          })}
        </View>

        <Pressable style={styles.secondaryBtn} onPress={() => setViewMode('register')}>
          <Ionicons name="person-add" size={18} color="#059669" />
          <Text style={styles.secondaryBtnText}>+ Register New Account Holder</Text>
        </Pressable>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      {/* Security Header */}
      <View style={styles.lockHeader}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarLetter}>{userAccount.name.charAt(0)}</Text>
        </View>
        <Text style={styles.userName}>{userAccount.name}</Text>
        <Text style={styles.userRole}>{userAccount.role}</Text>
        <Pressable style={styles.switchBadge} onPress={() => setViewMode('switch')}>
          <Ionicons name="swap-horizontal" size={14} color="#059669" />
          <Text style={styles.switchBadgeText}>Switch Account Holder</Text>
        </Pressable>
      </View>

      <Text style={styles.pinPromptTitle}>Enter 4-Digit Security PIN</Text>

      {/* 4 PIN Dots */}
      <View style={styles.pinDotsRow}>
        {[0, 1, 2, 3].map(idx => (
          <View
            key={idx}
            style={[
              styles.pinDot,
              pin.length > idx && styles.pinDotFilled,
              pinError && styles.pinDotError,
            ]}
          />
        ))}
      </View>

      {pinError && <Text style={styles.errorText}>Incorrect PIN. Try {userAccount.pin} or use Fingerprint.</Text>}

      {/* Numeric Keypad */}
      <View style={styles.keypadGrid}>
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
          <Pressable
            key={num}
            style={({ pressed }) => [styles.keyBtn, pressed && styles.keyBtnPressed]}
            onPress={() => handleKeyPress(num)}>
            <Text style={styles.keyText}>{num}</Text>
          </Pressable>
        ))}

        <Pressable style={styles.keyBtnIcon} onPress={handleBiometricTap}>
          <Ionicons name="finger-print" size={28} color="#059669" />
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.keyBtn, pressed && styles.keyBtnPressed]}
          onPress={() => handleKeyPress('0')}>
          <Text style={styles.keyText}>0</Text>
        </Pressable>

        <Pressable style={styles.keyBtnIcon} onPress={handleDelete}>
          <Ionicons name="backspace-outline" size={24} color="#64748B" />
        </Pressable>
      </View>

      {/* Quick Switch Links */}
      <View style={styles.bottomLinks}>
        <Pressable onPress={() => setViewMode('register')}>
          <Text style={styles.linkText}>+ Register New Account</Text>
        </Pressable>
        <Pressable onPress={() => unlockWithBiometrics()} style={styles.quickDemoBadge}>
          <Ionicons name="flash-outline" size={14} color="#059669" />
          <Text style={styles.quickDemoText}>Quick Unlock</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 30,
    justifyContent: 'space-between',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 40,
    backgroundColor: '#F8FAFC',
  },
  headerArea: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  backBtn: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
  },
  subtitleText: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
    lineHeight: 20,
  },
  lockHeader: {
    alignItems: 'center',
    marginTop: 10,
  },
  avatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarLetter: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },
  userRole: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  switchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F4EA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 10,
    gap: 4,
  },
  switchBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  pinPromptTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
    marginVertical: 10,
  },
  pinDotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginBottom: 10,
  },
  pinDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#CBD5E1',
  },
  pinDotFilled: {
    backgroundColor: '#059669',
  },
  pinDotError: {
    backgroundColor: '#EF4444',
  },
  errorText: {
    fontSize: 13,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 10,
  },
  keypadGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    width: '100%',
    maxWidth: 320,
    alignSelf: 'center',
  },
  keyBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  keyBtnPressed: {
    backgroundColor: '#E2E8F0',
  },
  keyBtnIcon: {
    width: 72,
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyText: {
    fontSize: 26,
    fontWeight: '600',
    color: '#1E293B',
  },
  bottomLinks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  linkText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#059669',
  },
  quickDemoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  quickDemoText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
  },

  // Register Form Styles
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
    marginTop: 12,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0F172A',
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  primaryBtn: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  disabledBtn: {
    backgroundColor: '#94A3B8',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 16,
    gap: 8,
  },
  secondaryBtnText: {
    color: '#059669',
    fontSize: 15,
    fontWeight: '700',
  },

  // User Switcher list styles
  userList: {
    gap: 12,
    marginBottom: 16,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  userCardSelected: {
    borderColor: '#059669',
    backgroundColor: '#F0FDF4',
    borderWidth: 2,
  },
  avatarCircleSmall: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetterSmall: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  userCardName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  userCardSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  userCardBal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#059669',
    marginTop: 4,
  },
});
