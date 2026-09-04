import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useAura } from '../context/AuraContext';
import { RESILIENCE_PILLARS } from '../data/auraMockData';
import { FinancialPillar } from '../types/aura';

interface Props {
  onSelectPillar?: (pillar: FinancialPillar) => void;
  showBreakdown?: boolean;
}

export const ResilienceGauge: React.FC<Props> = ({ onSelectPillar, showBreakdown = true }) => {
  const { resilienceScore, setSelectedPillar, setShowExplainModal } = useAura();

  const size = 180;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * resilienceScore) / 100;

  const handlePillarPress = (pillar: FinancialPillar) => {
    setSelectedPillar(pillar);
    if (onSelectPillar) {
      onSelectPillar(pillar);
    } else {
      setShowExplainModal(true);
    }
  };

  return (
    <View style={styles.container}>
      {/* Circle Gauge Container */}
      <View style={styles.gaugeWrapper}>
        <Svg width={size} height={size} style={styles.svg}>
          <Defs>
            <LinearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#34D399" />
              <Stop offset="50%" stopColor="#10B981" />
              <Stop offset="100%" stopColor="#059669" />
            </LinearGradient>
          </Defs>
          {/* Background Ring */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Ring */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#scoreGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        <View style={styles.scoreCenterContent}>
          <Text style={styles.scoreNumber}>{resilienceScore}</Text>
          <Text style={styles.scoreDenom}>/ 100</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>Good Resilience</Text>
          </View>
        </View>
      </View>

      <Text style={styles.scoreSubhead}>
        "Your income is irregular, but your cash flow remains stable."
      </Text>

      {/* Breakdown Section */}
      {showBreakdown && (
        <View style={styles.breakdownContainer}>
          <Text style={styles.breakdownTitle}>Your Score Factors</Text>
          <Text style={styles.breakdownSubtitle}>Tap any metric to view calculation details</Text>

          {RESILIENCE_PILLARS.map(pillar => (
            <Pressable
              key={pillar.id}
              style={({ pressed }) => [styles.pillarCard, pressed && styles.pillarCardPressed]}
              onPress={() => handlePillarPress(pillar)}>
              <View style={styles.pillarHeader}>
                <Text style={styles.pillarName}>{pillar.name}</Text>
                <Text style={styles.pillarScoreText}>{pillar.score}%</Text>
              </View>

              {/* Custom Bar */}
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width: `${pillar.score}%`,
                      backgroundColor:
                        pillar.score >= 85
                          ? '#10B981'
                          : pillar.score >= 70
                          ? '#059669'
                          : '#F59E0B',
                    },
                  ]}
                />
              </View>

              <View style={styles.pillarFooter}>
                <Text style={styles.pillarWeight}>Weight: {pillar.weight}</Text>
                <Text style={styles.tapDetailText}>Details →</Text>
              </View>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  gaugeWrapper: {
    position: 'relative',
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
  },
  svg: {
    position: 'absolute',
  },
  scoreCenterContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNumber: {
    fontSize: 42,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -1,
  },
  scoreDenom: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
    marginTop: -4,
  },
  statusBadge: {
    backgroundColor: '#ECFDF5',
    borderColor: 'rgba(16, 185, 129, 0.4)',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginTop: 6,
  },
  statusBadgeText: {
    color: '#059669',
    fontSize: 11,
    fontWeight: '700',
  },
  scoreSubhead: {
    color: '#64748B',
    fontSize: 13,
    textAlign: 'center',
    fontStyle: 'italic',
    marginHorizontal: 16,
    marginBottom: 20,
  },
  breakdownContainer: {
    width: '100%',
    marginTop: 8,
  },
  breakdownTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  breakdownSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 14,
  },
  pillarCard: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  pillarCardPressed: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  pillarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pillarName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  pillarScoreText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#059669',
  },
  barTrack: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  pillarFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pillarWeight: {
    fontSize: 11,
    color: '#64748B',
  },
  tapDetailText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
  },
});
