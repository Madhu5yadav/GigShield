import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAura } from '../context/AuraContext';

export const AlertsDrawer: React.FC = () => {
  const {
    showAlertsDrawer,
    setShowAlertsDrawer,
    alerts,
    markAlertRead,
    setShowAdvanceModal,
    saveToEmergencyFund,
  } = useAura();

  const handleAction = (alertId: string, type: string) => {
    markAlertRead(alertId);
    setShowAlertsDrawer(false);
    if (type === 'warning') {
      setShowAdvanceModal(true);
    } else if (type === 'savings') {
      saveToEmergencyFund(200);
    }
  };

  return (
    <Modal
      visible={showAlertsDrawer}
      transparent
      animationType="fade"
      onRequestClose={() => setShowAlertsDrawer(false)}>
      <View style={styles.overlay}>
        <View style={styles.drawerCard}>
          <View style={styles.header}>
            <View style={styles.badgeRow}>
              <Ionicons name="notifications" size={18} color="#059669" />
              <Text style={styles.title}>AURA Intelligent Alerts</Text>
            </View>
            <Pressable onPress={() => setShowAlertsDrawer(false)} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#64748B" />
            </Pressable>
          </View>

          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {alerts.map(alert => (
              <View
                key={alert.id}
                style={[
                  styles.alertCard,
                  !alert.read && styles.unreadCard,
                ]}>
                <View style={styles.iconCol}>
                  {alert.type === 'cashflow' ? (
                    <Ionicons name="notifications-outline" size={20} color="#D97706" />
                  ) : alert.type === 'savings' ? (
                    <Ionicons name="cash-outline" size={20} color="#059669" />
                  ) : alert.type === 'warning' ? (
                    <Ionicons name="warning-outline" size={20} color="#DC2626" />
                  ) : (
                    <Ionicons name="trending-up-outline" size={20} color="#059669" />
                  )}
                </View>

                <View style={styles.contentCol}>
                  <View style={styles.topRow}>
                    <Text style={styles.alertTitle}>{alert.title}</Text>
                    <Text style={styles.timeText}>{alert.timestamp}</Text>
                  </View>
                  <Text style={styles.alertMsg}>{alert.message}</Text>

                  {alert.actionable && alert.actionText && (
                    <Pressable
                      style={styles.actionBtn}
                      onPress={() => handleAction(alert.id, alert.type)}>
                      <Text style={styles.actionBtnText}>{alert.actionText} →</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-start',
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  drawerCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 20,
    maxHeight: '80%',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomColor: '#E2E8F0',
    borderBottomWidth: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },
  closeBtn: {
    padding: 4,
  },
  list: {
    gap: 10,
  },
  alertCard: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    gap: 12,
    marginBottom: 8,
  },
  unreadCard: {
    borderColor: 'rgba(16, 185, 129, 0.3)',
    backgroundColor: '#ECFDF5',
  },
  iconCol: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentCol: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  timeText: {
    fontSize: 10,
    color: '#64748B',
  },
  alertMsg: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 16,
  },
  actionBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderColor: '#10B981',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 8,
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
});
