import { FinancialPillar, IncomeDataPoint, AiInsight, NotificationAlert, BankUnderwritingFactor } from '../types/aura';

export const RAHUL_PROFILE = {
  name: 'Rahul',
  role: 'Delivery Partner (Gig Worker)',
  platform: 'Zomato & Swiggy',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  accountNumber: '•••• 8821',
  upiId: 'rahul.gig@aura',
  joinDate: 'Oct 2024',
};

export const INITIAL_RESILIENCE_SCORE = 82;

export const RESILIENCE_PILLARS: FinancialPillar[] = [
  {
    id: 'income_stability',
    name: 'Income Stability',
    score: 82,
    weight: '30%',
    status: 'good',
    explanation: 'Evaluates variance in earnings across a 90-day rolling period.',
    calculationMethod: 'Derived from coefficient of variation in weekly gig payouts.',
    recommendation: 'Maintain consistent weekday hours to further reduce volatility.',
  },
  {
    id: 'savings_buffer',
    name: 'Savings Buffer',
    score: 70,
    weight: '20%',
    status: 'good',
    explanation: 'Measures liquid funds available relative to average daily burn rate.',
    calculationMethod: 'Calculated as total savings divided by 30-day essential expenses.',
    recommendation: 'Target saving ₹250 on weekend days to reach 80%+ buffer.',
  },
  {
    id: 'expense_stability',
    name: 'Expense Stability',
    score: 80,
    weight: '20%',
    status: 'good',
    explanation: 'Assesses predictability of monthly essential recurring costs.',
    calculationMethod: 'Compares fixed rent & fuel costs against variable discretionary spending.',
    recommendation: 'Your essential expenses are stable at ₹1,800 per payout cycle.',
  },
  {
    id: 'debt_load',
    name: 'Debt Load',
    score: 90,
    weight: '15%',
    status: 'excellent',
    explanation: 'Ratio of active debt repayments to average weekly net cash flow.',
    calculationMethod: 'Zero active high-cost loans, minimal BNPL exposure.',
    recommendation: 'Keep short-term advances under ₹1,200 to protect this score.',
  },
  {
    id: 'emergency_fund',
    name: 'Emergency Fund',
    score: 50,
    weight: '15%',
    status: 'moderate',
    explanation: 'Progress toward a 1-month essential expense safety cushion (₹10,000 target).',
    calculationMethod: 'Current emergency fund balance (₹4,200) / Target (₹10,000).',
    recommendation: 'Set up auto-save of ₹100 on days earnings cross ₹1,200.',
  },
];

export const WEEKLY_INCOME_PATTERN: IncomeDataPoint[] = [
  { day: 'Mon', date: 'Feb 24', income: 600, expenses: 250 },
  { day: 'Tue', date: 'Feb 25', income: 550, expenses: 200 },
  { day: 'Wed', date: 'Feb 26', income: 700, expenses: 300 },
  { day: 'Thu', date: 'Feb 27', income: 0, expenses: 150, notes: 'Rest / Maintenance Day' },
  { day: 'Fri', date: 'Feb 28', income: 500, expenses: 400 },
  { day: 'Sat', date: 'Mar 01', income: 1500, expenses: 300, notes: 'Peak Weekend Demand' },
  { day: 'Sun', date: 'Mar 02', income: 1800, expenses: 200, notes: 'Peak Weekend Demand' },
];

export const FORECAST_DATA_POINTS: IncomeDataPoint[] = [
  { day: 'Mon', date: 'Mar 03', income: 650, expenses: 200, isPredicted: true },
  { day: 'Tue', date: 'Mar 04', income: 600, expenses: 220, isPredicted: true },
  { day: 'Wed', date: 'Mar 05', income: 750, expenses: 250, isPredicted: true },
  { day: 'Thu', date: 'Mar 06', income: 200, expenses: 150, isPredicted: true },
  { day: 'Fri', date: 'Mar 07', income: 600, expenses: 300, isPredicted: true },
  { day: 'Sat', date: 'Mar 08', income: 1600, expenses: 350, isPredicted: true },
  { day: 'Sun', date: 'Mar 09', income: 1800, expenses: 250, isPredicted: true },
];

export const FORECAST_SUMMARY = {
  rangeMin: 2800,
  rangeMax: 3400,
  expectedAverage: 3100,
  predictionPeriod: 'Next 7 Days',
  factors: [
    'Recent earning pattern (Last 12 weeks consistency)',
    'Historical weekly pattern (65% earnings concentrated Fri-Sun)',
    'Weekend income trend (Average ₹3,300 per weekend)',
    'Recent payout activity (Verified Zomato & Swiggy platform deposits)',
  ],
  disclaimer: 'Prediction is an estimate based on historical transaction patterns.',
};

export const AI_INSIGHTS: AiInsight[] = [
  {
    id: 'insight_1',
    category: 'cashflow',
    title: 'Weekend Earnings Dominance',
    description: 'Your weekend earnings (Sat & Sun: ₹3,300 avg) are significantly higher than your weekday earnings (Mon–Fri: ₹2,350 avg).',
    icon: 'trending-up',
    impact: 'positive',
  },
  {
    id: 'insight_2',
    category: 'income',
    title: 'Rapid Low-Income Recovery',
    description: 'You typically recover from low-income or zero-earning days (like Thursday ₹0) within 2–3 days.',
    icon: 'repeat',
    impact: 'positive',
  },
  {
    id: 'insight_3',
    category: 'cashflow',
    title: 'Stable Average Weekly Cash Flow',
    description: 'Your average weekly income across 90 days is approximately ₹3,100.',
    icon: 'bar-chart-2',
    impact: 'positive',
  },
  {
    id: 'insight_4',
    category: 'risk',
    title: 'Predictable Essential Expenses',
    description: 'Your essential expenses (₹1,800/cycle) are relatively stable compared with your daily income fluctuations.',
    icon: 'shield-check',
    impact: 'positive',
  },
];

export const LIQUIDITY_GAP_DATA = {
  currentBalance: 50,
  todayIncome: 0,
  upcomingExpenses: 1800,
  predictedNearTermIncome: 3100,
  estimatedGap: 1000,
  recommendedAdvance: 1000,
  maxSafeAdvance: 1200,
  demoFee: 10,
  totalRepayment: 1010,
  expectedRecovery: 'Upcoming Weekend Payout (Mar 09)',
};

export const EXPLAINABLE_SIGNALS = [
  { text: 'Predicted 7-day income', value: '₹3,100', status: 'pass' },
  { text: 'Current available balance', value: '₹50', status: 'pass' },
  { text: 'Essential expenses obligation', value: '₹1,800', status: 'pass' },
  { text: 'Recent income stability score', value: 'High (82%)', status: 'pass' },
  { text: 'Existing debt burden', value: 'Low (0 active loans)', status: 'pass' },
  { text: 'Historical recovery after low-income periods', value: 'Strong (2-3 days)', status: 'pass' },
];

export const SMART_SAVINGS_DATA = {
  currentFund: 4200,
  targetFund: 10000,
  percentage: 42,
  tierRecommendations: [
    { incomeLevel: '₹2,000+ earning day', saveAmount: 250, label: 'High earning day' },
    { incomeLevel: '₹1,200 earning day', saveAmount: 100, label: 'Moderate earning day' },
    { incomeLevel: '₹500 earning day', saveAmount: 0, label: 'Low earning day (Cash protected)' },
  ],
  message: 'On higher-income days, AURA recommends saving more. On low-income days, AURA protects your available cash.',
};

export const SAFE_TO_SPEND_DATA = {
  defaultBalance: 5200,
  upcomingExpenses: 2000,
  emergencyReserve: 1000,
  safeToSpend: 2200,
  message: 'Based on your upcoming obligations and emergency buffer.',
};

export const BANK_OFFICER_SIGNALS: BankUnderwritingFactor[] = [
  { name: 'Income history (90 days)', status: 'passed', metric: '₹3,100/wk avg', benchmark: '> ₹2,000/wk', detail: 'Verified 90-day recurring gig payout logs' },
  { name: 'Income prediction (7 days)', status: 'passed', metric: '₹3,100 forecast', benchmark: '> ₹1,800 expenses', detail: 'High statistical confidence (89%)' },
  { name: 'Essential expenses', status: 'passed', metric: '₹1,800', benchmark: '< 60% of income', detail: 'Fixed rent & fuel costs verified' },
  { name: 'Debt obligations', status: 'passed', metric: '₹0 active DTI', benchmark: '< 35% DTI', detail: 'No high-cost payday loan defaults' },
  { name: 'Cash-flow volatility', status: 'passed', metric: 'Controlled (82%)', benchmark: '> 60% stability', detail: 'Weekend demand compensates weekday dips' },
  { name: 'Repayment capacity', status: 'passed', metric: '3.1x coverage', benchmark: '> 1.5x gap', detail: 'Predicted income comfortably covers ₹1,000' },
];

export const INITIAL_ALERTS: NotificationAlert[] = [
  {
    id: 'alert_1',
    type: 'cashflow',
    title: 'Cash Flow Alert',
    message: 'Your income today (Thursday ₹0) is lower than your usual weekday average.',
    timestamp: '2 hours ago',
    read: false,
  },
  {
    id: 'alert_2',
    type: 'savings',
    title: 'Savings Opportunity',
    message: 'Your income last Sunday was ₹1,800 (above average). AURA recommends saving ₹200 today.',
    timestamp: '1 day ago',
    read: false,
    actionable: true,
    actionText: 'Save ₹200 Now',
  },
  {
    id: 'alert_3',
    type: 'warning',
    title: 'Liquidity Warning',
    message: 'Your current balance (₹50) may fall below your essential-expense buffer (₹1,800).',
    timestamp: '3 hours ago',
    read: false,
    actionable: true,
    actionText: 'View Safe Advance',
  },
  {
    id: 'alert_4',
    type: 'trend',
    title: 'Positive Trend',
    message: 'Your average weekly income increased 14% over the last four weeks.',
    timestamp: '3 days ago',
    read: true,
  },
];
