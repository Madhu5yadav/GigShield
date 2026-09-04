import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAura } from '../context/AuraContext';
import { fetchWorkerList } from '../services/api';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const TestProfileSelectorModal: React.FC<Props> = ({ visible, onClose }) => {
  const { switchUserAccount, createNewUserAccount, refreshMlAnalysis } = useAura();
  
  const [activeSubTab, setActiveSubTab] = useState<'presets' | 'all_workers' | 'custom'>('presets');
  const [serverWorkers, setServerWorkers] = useState<any[]>([]);
  const [loadingWorkers, setLoadingWorkers] = useState<boolean>(false);

  // Custom Test Case Form
  const [customName, setCustomName] = useState('');
  const [customPlatform, setCustomPlatform] = useState('Zepto Express');
  const [customRole, setCustomRole] = useState('Quick-Commerce Delivery');
  const [customBalance, setCustomBalance] = useState('150');

  useEffect(() => {
    if (visible && activeSubTab === 'all_workers') {
      loadServerWorkers();
    }
  }, [visible, activeSubTab]);

  const loadServerWorkers = async () => {
    setLoadingWorkers(true);
    const workers = await fetchWorkerList();
    setServerWorkers(workers);
    setLoadingWorkers(false);
  };

  const handleSelectPreset = (userId: string) => {
    switchUserAccount(userId);
    onClose();
  };

  const handleSelectServerWorker = (worker: any) => {
    // Register or switch to worker profile
    createNewUserAccount({
      name: worker.worker_name || 'Gig Partner',
      role: `${worker.platform || 'Gig'} Partner (${worker.worker_type || 'HUSTLER'})`,
      platform: worker.platform || 'Multi-platform',
      phone: `98765${worker.worker_id.replace(/\D/g, '').padStart(5, '0')}`,
      email: `${worker.worker_name.toLowerCase().replace(/\s+/g, '.')}@aurabank.in`,
      pin: '1234',
      initialBalance: worker.worker_type === 'HUSTLER' ? 1200 : worker.worker_type === 'WEEKEND_WARRIOR' ? 850 : 50,
    });
    onClose();
  };

  const handleCreateCustomTest = () => {
    if (!customName.trim()) return;
    createNewUserAccount({
      name: customName.trim(),
      role: customRole || 'Custom Gig Partner',
      platform: customPlatform || 'Zepto Express',
      phone: '9988776655',
      email: `${customName.toLowerCase().replace(/\s+/g, '.')}@aurabank.in`,
      pin: '1234',
      initialBalance: parseFloat(customBalance) || 100,
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          {/* Modal Header */}
          <View style={styles.headerRow}>
            <View style={styles.titleBadgeRow}>
              <Ionicons name="flask" size={18} color="#059669" />
              <Text style={styles.modalTitle}>ML Test Profiles & Cases</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#64748B" />
            </Pressable>
          </View>

          <Text style={styles.modalSubtitle}>
            Switch test profiles or inject custom worker data directly into the XGBoost underwriting engine.
          </Text>

          {/* Sub Tab Switcher */}
          <View style={styles.tabRow}>
            <Pressable
              style={[styles.tabBtn, activeSubTab === 'presets' && styles.tabBtnActive]}
              onPress={() => setActiveSubTab('presets')}>
              <Text style={[styles.tabBtnText, activeSubTab === 'presets' && styles.tabBtnTextActive]}>
                Presets
              </Text>
            </Pressable>

            <Pressable
              style={[styles.tabBtn, activeSubTab === 'all_workers' && styles.tabBtnActive]}
              onPress={() => setActiveSubTab('all_workers')}>
              <Text style={[styles.tabBtnText, activeSubTab === 'all_workers' && styles.tabBtnTextActive]}>
                50 Profiles
              </Text>
            </Pressable>

            <Pressable
              style={[styles.tabBtn, activeSubTab === 'custom' && styles.tabBtnActive]}
              onPress={() => setActiveSubTab('custom')}>
              <Text style={[styles.tabBtnText, activeSubTab === 'custom' && styles.tabBtnTextActive]}>
                + Custom Case
              </Text>
            </Pressable>
          </View>

          {/* Content Area */}
          <ScrollView style={styles.scrollArea} keyboardShouldPersistTaps="handled">
            {activeSubTab === 'presets' && (
              <View style={styles.listContainer}>
                {/* TestCase 1: Rahul Sharma */}
                <Pressable style={styles.presetCard} onPress={() => handleSelectPreset('user_rahul')}>
                  <View style={styles.presetIconBg}>
                    <Ionicons name="alert-circle" size={24} color="#DC2626" />
                  </View>
                  <View style={styles.presetMeta}>
                    <View style={styles.presetHeader}>
                      <Text style={styles.presetName}>Rahul Sharma</Text>
                      <Text style={styles.tagCrisis}>INCOME DIP CRISIS</Text>
                    </View>
                    <Text style={styles.presetSub}>Swiggy Driver • Balance: ₹50</Text>
                    <Text style={styles.presetDesc}>
                      Simulates a 2-day zero income period. Triggers liquidity gap alert & safe micro-advance.
                    </Text>
                  </View>
                </Pressable>

                {/* TestCase 2: Priya Singh */}
                <Pressable style={styles.presetCard} onPress={() => handleSelectPreset('user_priya')}>
                  <View style={[styles.presetIconBg, { backgroundColor: '#ECFDF5' }]}>
                    <Ionicons name="checkmark-circle" size={24} color="#059669" />
                  </View>
                  <View style={styles.presetMeta}>
                    <View style={styles.presetHeader}>
                      <Text style={styles.presetName}>Priya Singh</Text>
                      <Text style={styles.tagHigh}>HIGH STABILITY</Text>
                    </View>
                    <Text style={styles.presetSub}>Zomato Partner • Balance: ₹1,400</Text>
                    <Text style={styles.presetDesc}>
                      High earnings velocity (₹8,000+/wk). Qualifies for maximum eligible safe advance.
                    </Text>
                  </View>
                </Pressable>

                {/* TestCase 3: Amit Kumar */}
                <Pressable style={styles.presetCard} onPress={() => handleSelectPreset('user_amit')}>
                  <View style={[styles.presetIconBg, { backgroundColor: '#FEF3C7' }]}>
                    <Ionicons name="flash" size={24} color="#D97706" />
                  </View>
                  <View style={styles.presetMeta}>
                    <View style={styles.presetHeader}>
                      <Text style={styles.presetName}>Amit Kumar</Text>
                      <Text style={styles.tagErratic}>ERRATIC / ANOMALY</Text>
                    </View>
                    <Text style={styles.presetSub}>Uber & Ola Driver • Balance: ₹120</Text>
                    <Text style={styles.presetDesc}>
                      Demonstrates Isolation Forest clipping festive income spikes to prevent over-borrowing.
                    </Text>
                  </View>
                </Pressable>
              </View>
            )}

            {activeSubTab === 'all_workers' && (
              <View style={styles.listContainer}>
                {loadingWorkers ? (
                  <View style={styles.loadingBox}>
                    <ActivityIndicator size="large" color="#059669" />
                    <Text style={styles.loadingText}>Fetching 50 profiles from Python backend...</Text>
                  </View>
                ) : (
                  serverWorkers.map((w) => (
                    <Pressable
                      key={w.worker_id}
                      style={styles.workerRow}
                      onPress={() => handleSelectServerWorker(w)}>
                      <View style={styles.workerAvatarCircle}>
                        <Text style={styles.workerAvatarText}>{w.worker_name.charAt(0)}</Text>
                      </View>
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={styles.workerNameText}>{w.worker_name}</Text>
                        <Text style={styles.workerSubText}>{w.platform} • {w.worker_type}</Text>
                      </View>
                      <View style={styles.workerIdBadge}>
                        <Text style={styles.workerIdText}>{w.worker_id}</Text>
                      </View>
                    </Pressable>
                  ))
                )}
              </View>
            )}

            {activeSubTab === 'custom' && (
              <View style={styles.customForm}>
                <Text style={styles.inputLabel}>Custom Worker Name</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Kavita Nair"
                  placeholderTextColor="#94A3B8"
                  value={customName}
                  onChangeText={setCustomName}
                />

                <Text style={styles.inputLabel}>Platform</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Zepto, Blinkit, Swiggy, Uber"
                  placeholderTextColor="#94A3B8"
                  value={customPlatform}
                  onChangeText={setCustomPlatform}
                />

                <Text style={styles.inputLabel}>Gig Role</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Express Delivery Partner"
                  placeholderTextColor="#94A3B8"
                  value={customRole}
                  onChangeText={setCustomRole}
                />

                <Text style={styles.inputLabel}>Initial Account Balance (₹)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="150"
                  placeholderTextColor="#94A3B8"
                  keyboardType="number-pad"
                  value={customBalance}
                  onChangeText={setCustomBalance}
                />

                <Pressable
                  style={[styles.createBtn, !customName.trim() && styles.disabledBtn]}
                  onPress={handleCreateCustomTest}
                  disabled={!customName.trim()}>
                  <Ionicons name="flash" size={18} color="#FFFFFF" />
                  <Text style={styles.createBtnText}>Inject & Underwrite Live →</Text>
                </Pressable>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeBtn: {
    padding: 4,
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 14,
    lineHeight: 16,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  tabBtnTextActive: {
    color: '#059669',
    fontWeight: '700',
  },
  scrollArea: {
    maxHeight: 450,
  },
  listContainer: {
    gap: 12,
    paddingBottom: 20,
  },
  presetCard: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  presetIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  presetMeta: {
    flex: 1,
  },
  presetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  presetName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  tagCrisis: {
    fontSize: 9,
    fontWeight: '800',
    color: '#DC2626',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagHigh: {
    fontSize: 9,
    fontWeight: '800',
    color: '#059669',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagErratic: {
    fontSize: 9,
    fontWeight: '800',
    color: '#D97706',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  presetSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  presetDesc: {
    fontSize: 11,
    color: '#334155',
    marginTop: 4,
    lineHeight: 14,
  },
  loadingBox: {
    padding: 30,
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    fontSize: 13,
    color: '#64748B',
  },
  workerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  workerAvatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
  },
  workerAvatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  workerNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  workerSubText: {
    fontSize: 11,
    color: '#64748B',
  },
  workerIdBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  workerIdText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  customForm: {
    paddingBottom: 20,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 4,
    marginTop: 10,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 20,
    gap: 8,
  },
  disabledBtn: {
    backgroundColor: '#94A3B8',
  },
  createBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
