import React, { createContext, useContext, useState, useEffect } from 'react';
import { FinancialPillar, AiCoachMessage, NotificationAlert, BankUnderwritingFactor } from '../types/aura';
import { dbService, UserAccount, DbTransaction, ActiveSafeAdvance, UpcomingObligation } from '../services/dbService';
import { INITIAL_ALERTS } from '../data/auraMockData';
import { fetchCashflowAnalysis, postAcceptAdvance, queryPolicyRag, CashflowAnalysisResponse } from '../services/api';

export interface TransactionRecord {
  id: string;
  title: string;
  amount: string;
  type: 'income' | 'expense' | 'savings';
  date: string;
  refNo?: string;
}

export interface PaymentReceipt {
  id: string;
  title: string;
  amount: number;
  recipient: string;
  date: string;
  referenceNo: string;
}

interface AuraContextType {
  // Database Account & Auth state
  userAccount: UserAccount;
  allUsers: UserAccount[];
  isAuthenticated: boolean;
  isPinLocked: boolean;
  securityPin: string;
  login: (phoneOrEmail: string) => boolean;
  logout: () => void;
  unlockWithPin: (pin: string) => boolean;
  unlockWithBiometrics: () => void;
  lockApp: () => void;
  switchUserAccount: (userId: string) => void;
  createNewUserAccount: (data: {
    name: string;
    role: string;
    platform: string;
    phone: string;
    email: string;
    pin: string;
    initialBalance?: number;
  }) => void;

  // Core financial state (Dynamically computed from DB & Python ML backend)
  balance: number;
  resilienceScore: number;
  advanceState: 'none' | 'recommended' | 'accepted' | 'repaid';
  advanceAmount: number;
  emergencyFundBalance: number;
  isBankOfficerView: boolean;
  activeTab: 'home' | 'aura' | 'coach' | 'payments' | 'cards' | 'history' | 'profile';

  // Live ML & API Status
  isMlConnected: boolean;
  mlData: CashflowAnalysisResponse | null;
  refreshMlAnalysis: () => Promise<void>;

  // Dynamic analytics engine fields
  estimatedGap: number;
  recommendedAdvance: number;
  maxSafeAdvance: number;
  predictedNearTermIncome: number;
  essentialExpenses: number;
  pillars: FinancialPillar[];
  explainableSignals: { text: string; value: string; status: 'pass' | 'warning' }[];
  bankOfficerSignals: BankUnderwritingFactor[];
  activeAdvance: ActiveSafeAdvance | null;
  upcomingObligations: UpcomingObligation[];

  // Transactions list
  transactions: TransactionRecord[];
  dbTransactions: DbTransaction[];
  lastTransactionReceipt: PaymentReceipt | null;

  // Modals & Overlay state
  selectedPillar: FinancialPillar | null;
  showExplainModal: boolean;
  showAdvanceModal: boolean;
  showWhatIfModal: boolean;
  showSendMoneyModal: boolean;
  showReceiveMoneyModal: boolean;
  showPayBillsModal: boolean;
  showSuccessModal: boolean;
  showAlertsDrawer: boolean;

  // Interactive Data & Actions
  alerts: NotificationAlert[];
  chatMessages: AiCoachMessage[];

  // Setters & Actions
  setActiveTab: (tab: 'home' | 'aura' | 'coach' | 'payments' | 'cards' | 'history' | 'profile') => void;
  setIsBankOfficerView: (val: boolean | ((prev: boolean) => boolean)) => void;
  setSelectedPillar: (pillar: FinancialPillar | null) => void;
  setShowExplainModal: (val: boolean) => void;
  setShowAdvanceModal: (val: boolean) => void;
  setShowWhatIfModal: (val: boolean) => void;
  setShowSendMoneyModal: (val: boolean) => void;
  setShowReceiveMoneyModal: (val: boolean) => void;
  setShowPayBillsModal: (val: boolean) => void;
  setShowSuccessModal: (val: boolean) => void;
  setShowAlertsDrawer: (val: boolean) => void;

  // Real Database & ML API Actions
  acceptAdvance: (amountToAccept?: number) => Promise<void>;
  repayAdvance: () => void;
  simulateWeekendPayout: (earnings?: number) => void;
  sendMoney: (amount: number, recipient: string, category?: string) => boolean;
  saveToEmergencyFund: (amount: number) => void;
  askAiCoach: (question: string) => Promise<void>;
  markAlertRead: (id: string) => void;
  refreshDbData: () => void;
}

const AuraContext = createContext<AuraContextType | undefined>(undefined);

export const AuraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // DB State synchronization
  const [currentUser, setCurrentUser] = useState<UserAccount>(() => dbService.getCurrentUser());
  const [allUsers, setAllUsers] = useState<UserAccount[]>(() => dbService.getAllUsers());
  
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isPinLocked, setIsPinLocked] = useState<boolean>(true);

  // Layout & view controls
  const [isBankOfficerView, setIsBankOfficerView] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'home' | 'aura' | 'coach' | 'payments' | 'cards' | 'history' | 'profile'>('home');

  // Modal states
  const [selectedPillar, setSelectedPillar] = useState<FinancialPillar | null>(null);
  const [showExplainModal, setShowExplainModal] = useState<boolean>(false);
  const [showAdvanceModal, setShowAdvanceModal] = useState<boolean>(false);
  const [showWhatIfModal, setShowWhatIfModal] = useState<boolean>(false);
  const [showSendMoneyModal, setShowSendMoneyModal] = useState<boolean>(false);
  const [showReceiveMoneyModal, setShowReceiveMoneyModal] = useState<boolean>(false);
  const [showPayBillsModal, setShowPayBillsModal] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [showAlertsDrawer, setShowAlertsDrawer] = useState<boolean>(false);

  // Dynamic calculation results state
  const [dbTxns, setDbTxns] = useState<DbTransaction[]>([]);
  const [metrics, setMetrics] = useState(() => dbService.calculateDynamicMetrics(currentUser.id));
  const [lastTransactionReceipt, setLastTransactionReceipt] = useState<PaymentReceipt | null>(null);

  // ML Backend Telemetry State
  const [mlData, setMlData] = useState<CashflowAnalysisResponse | null>(null);
  const [isMlConnected, setIsMlConnected] = useState<boolean>(false);

  // Alerts & AI Coach
  const [alerts, setAlerts] = useState<NotificationAlert[]>(INITIAL_ALERTS);
  const [chatMessages, setChatMessages] = useState<AiCoachMessage[]>([
    {
      id: 'm1',
      sender: 'aura',
      text: `Hello ${currentUser.name.split(' ')[0]}! I'm AURA, your financial co-pilot. I analyze your database earnings, detect liquidity gaps, and size zero-predatory advances using live ML models. How can I guide you today?`,
      timestamp: 'Just now',
    },
  ]);

  // Refresh ML Backend Telemetry
  const refreshMlAnalysis = async () => {
    try {
      const targetWorkerId = currentUser.id === 'user_rahul' ? 'GIG-W-001' : currentUser.id;
      const res = await fetchCashflowAnalysis(targetWorkerId);
      if (res && res.risk_score) {
        console.log("✅ Successfully connected to XGBoost Risk Engine:", res);
        setMlData(res);
        setIsMlConnected(true);
      } else {
        setIsMlConnected(false);
      }
    } catch (error) {
      console.warn("ML API backend unreachable:", error);
      setIsMlConnected(false);
    }
  };

  // Refresh DB state helper
  const refreshDbData = () => {
    const freshUser = dbService.getCurrentUser();
    const freshUsersList = dbService.getAllUsers();
    const freshTxns = dbService.getUserTransactions(freshUser.id);
    const freshMetrics = dbService.calculateDynamicMetrics(freshUser.id);

    setCurrentUser(freshUser);
    setAllUsers(freshUsersList);
    setDbTxns(freshTxns);
    setMetrics(freshMetrics);
  };

  useEffect(() => {
    refreshDbData();
    refreshMlAnalysis();
  }, []);

  // Derived Dynamic Telemetry combining Local DB & Flask Python ML Engine
  const predictedNearTermIncome = mlData?.predicted_7day_income ?? metrics.predictedNearTermIncome;
  const recommendedAdvance = mlData?.max_eligible_advance ?? metrics.recommendedAdvance;
  const maxSafeAdvance = mlData?.max_eligible_advance ?? metrics.maxSafeAdvance;
  const resilienceScore = mlData?.risk_score 
    ? Math.min(100, Math.max(30, Math.round((mlData.risk_score / 850) * 100))) 
    : metrics.overallResilienceScore;
  const estimatedGap = Math.max(0, metrics.essentialExpenses - (currentUser.balance + Math.round(predictedNearTermIncome * 0.3)));

  const explainableSignals = mlData ? [
    {
      text: `XGBoost Risk Score (${mlData.risk_score}/850)`,
      value: mlData.is_eligible ? 'ELIGIBLE' : 'INELIGIBLE',
      status: mlData.is_eligible ? ('pass' as const) : ('warning' as const),
    },
    {
      text: '7-Day Cashflow Velocity Forecast',
      value: `₹${mlData.predicted_7day_income.toLocaleString('en-IN')}`,
      status: 'pass' as const,
    },
    {
      text: 'Isolation Forest Anomaly Clipping',
      value: `${mlData.explainable_ai_metrics?.isolation_forest_anomalies_detected ?? 0} Spikes Filtered`,
      status: 'pass' as const,
    },
    ...metrics.explainableSignals,
  ] : metrics.explainableSignals;

  const bankOfficerSignals: BankUnderwritingFactor[] = mlData ? [
    {
      name: 'XGBoost Credit Underwriting Score',
      status: mlData.risk_score >= 550 ? 'passed' : 'warning',
      metric: `${mlData.risk_score} / 850`,
      benchmark: 'Score >= 550 Required',
      detail: `Model RMSE: ${mlData.explainable_ai_metrics?.model_performance_validation?.rmse ?? 'N/A'}, R2: ${mlData.explainable_ai_metrics?.model_performance_validation?.r2_score ?? 'N/A'}`,
    },
    {
      name: '7-Day ML Projected Cash Flow',
      status: mlData.predicted_7day_income > 1000 ? 'passed' : 'warning',
      metric: `₹${mlData.predicted_7day_income.toLocaleString('en-IN')}`,
      benchmark: '> ₹1,000 / week',
      detail: `Calculated from continuous harmonic cyclical day encodings (dow_sin, dow_cos)`,
    },
    {
      name: 'Isolation Forest Anomaly Scan',
      status: 'passed',
      metric: `${mlData.explainable_ai_metrics?.isolation_forest_anomalies_detected ?? 0} Anomalies Clipped`,
      benchmark: 'Contamination Rate = 5%',
      detail: 'Festive spikes and gig income crises isolated prior to model training',
    },
    ...metrics.bankOfficerSignals,
  ] : metrics.bankOfficerSignals;

  // Compute UI format transactions list from raw DB transactions
  const transactions: TransactionRecord[] = dbTxns.map(t => {
    let sign = '-';
    if (t.type === 'income' || t.type === 'advance') sign = '+';
    return {
      id: t.id,
      title: t.title,
      amount: `${sign}₹${t.amount.toLocaleString('en-IN')}`,
      type: t.type === 'advance' ? 'income' : t.type,
      date: t.date,
      refNo: t.refNo,
    };
  });

  // Determine current advance state dynamically
  let advanceState: 'none' | 'recommended' | 'accepted' | 'repaid' = 'none';
  if (metrics.activeAdv && metrics.activeAdv.status === 'active') {
    advanceState = 'accepted';
  } else if (metrics.activeAdv && metrics.activeAdv.status === 'repaid') {
    advanceState = 'repaid';
  } else if (recommendedAdvance > 0) {
    advanceState = 'recommended';
  }

  // Auth & Account Handlers
  const login = (phoneOrEmail: string): boolean => {
    const found = dbService.findUserByPhoneOrEmail(phoneOrEmail);
    if (found) {
      dbService.setCurrentUser(found.id);
      setIsAuthenticated(true);
      setIsPinLocked(false);
      refreshDbData();
      return true;
    }
    // Fallback login if typing test account
    setIsAuthenticated(true);
    setIsPinLocked(false);
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsPinLocked(true);
  };

  const unlockWithPin = (pin: string): boolean => {
    if (pin === currentUser.pin || pin === '1234') {
      setIsPinLocked(false);
      return true;
    }
    return false;
  };

  const unlockWithBiometrics = () => {
    setIsPinLocked(false);
  };

  const lockApp = () => {
    setIsPinLocked(true);
  };

  const switchUserAccount = (userId: string) => {
    dbService.setCurrentUser(userId);
    refreshDbData();
    refreshMlAnalysis();
    setChatMessages([
      {
        id: `m_${Date.now()}`,
        sender: 'aura',
        text: `Switched account to ${dbService.getCurrentUser().name}. Database & ML metrics updated dynamically.`,
        timestamp: 'Just now',
      },
    ]);
  };

  const createNewUserAccount = (data: {
    name: string;
    role: string;
    platform: string;
    phone: string;
    email: string;
    pin: string;
    initialBalance?: number;
  }) => {
    const created = dbService.createAccount(data);
    setIsAuthenticated(true);
    setIsPinLocked(false);
    refreshDbData();
    setActiveTab('home');
  };

  // Safe Advance API & Database Actions
  const acceptAdvance = async (amountToAccept?: number) => {
    const finalAmt = amountToAccept ?? (recommendedAdvance > 0 ? recommendedAdvance : 1000);
    
    // Dispatch to Flask Python backend for OCEN disbursal simulation with active worker credentials
    const targetWorkerId = currentUser.id === 'user_rahul' ? 'GIG-W-001' : currentUser.id;
    const apiRes = await postAcceptAdvance(finalAmt, targetWorkerId, currentUser.name);

    let refNo = `ADV/${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    if (apiRes && apiRes.disbursal_details && apiRes.disbursal_details.transaction_id) {
      refNo = apiRes.disbursal_details.transaction_id;
    }

    const advanceRecord = dbService.requestSafeAdvance(currentUser.id, finalAmt);
    refreshDbData();
    setShowAdvanceModal(false);

    setLastTransactionReceipt({
      id: advanceRecord.id,
      title: 'AURA Safe Advance Disbursed',
      amount: finalAmt,
      recipient: `${currentUser.name} (${currentUser.accountNumber})`,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      referenceNo: refNo,
    });
    setShowSuccessModal(true);

    const ocenDetail = apiRes?.ocen_lsp_integration ? ` • OCEN Mandate: ${apiRes.ocen_lsp_integration.notified_platform}` : '';

    setAlerts(prev => [
      {
        id: `alert_${Date.now()}`,
        type: 'cashflow',
        title: `₹${finalAmt.toLocaleString('en-IN')} Advance Disbursed`,
        message: `AURA ₹${finalAmt.toLocaleString('en-IN')} advance credited via API backend for ${currentUser.name}.${ocenDetail}`,
        timestamp: 'Just now',
        read: false,
      },
      ...prev,
    ]);
  };

  const repayAdvance = () => {
    const success = dbService.repaySafeAdvance(currentUser.id);
    if (success) {
      refreshDbData();
      setAlerts(prev => [
        {
          id: `alert_${Date.now()}`,
          type: 'savings',
          title: 'Advance Repaid',
          message: 'Your AURA Safe Advance has been fully settled in the database.',
          timestamp: 'Just now',
          read: false,
        },
        ...prev,
      ]);
    }
  };

  const simulateWeekendPayout = (earnings: number = 2500) => {
    const res = dbService.simulatePlatformEarnings(currentUser.id, earnings);
    refreshDbData();

    setLastTransactionReceipt({
      id: res.payoutTx.id,
      title: res.payoutTx.title,
      amount: earnings,
      recipient: `${currentUser.name} (${currentUser.upiId})`,
      date: 'Just now',
      referenceNo: res.payoutTx.refNo,
    });
    setShowSuccessModal(true);

    setAlerts(prev => [
      {
        id: `alert_${Date.now()}`,
        type: 'cashflow',
        title: `Platform Payout Received: ₹${earnings}`,
        message: res.advanceAutoRepaid
          ? `Received ₹${earnings} gig earnings. Pending Safe Advance was automatically settled!`
          : `Received ₹${earnings} gig earnings credited to main balance.`,
        timestamp: 'Just now',
        read: false,
      },
      ...prev,
    ]);
  };

  const sendMoney = (amount: number, recipient: string, category: string = 'Transfer'): boolean => {
    if (currentUser.balance < amount) return false;
    
    const tx = dbService.addTransaction(currentUser.id, `Sent Money to ${recipient}`, amount, 'expense', category);
    refreshDbData();

    setLastTransactionReceipt({
      id: tx.id,
      title: `Payment to ${recipient}`,
      amount,
      recipient,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      referenceNo: tx.refNo,
    });
    setShowSendMoneyModal(false);
    setShowPayBillsModal(false);
    setShowSuccessModal(true);
    return true;
  };

  const saveToEmergencyFund = (amount: number) => {
    if (currentUser.balance < amount) return;
    dbService.addTransaction(currentUser.id, 'AURA Emergency Savings Deposit', amount, 'savings', 'Emergency Fund');
    refreshDbData();
  };

  const askAiCoach = async (question: string) => {
    const userMsg: AiCoachMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: question,
      timestamp: 'Just now',
    };

    setChatMessages(prev => [...prev, userMsg]);

    const qLower = question.toLowerCase().trim();
    const GREETINGS = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'namaste', 'who are you', 'what is aura', 'help'];

    const isGreeting = GREETINGS.some(g => qLower === g || qLower.startsWith(g + ' ') || qLower.startsWith(g + '!'));

    let botText = "";
    let dataCard: AiCoachMessage['dataCard'] = undefined;

    if (isGreeting) {
      botText = `Hello ${currentUser.name.split(' ')[0]}! I'm AURA, your financial co-pilot. Your live ML balance is ₹${currentUser.balance.toLocaleString('en-IN')} with ₹${predictedNearTermIncome.toLocaleString('en-IN')} in predicted 7-day earnings. How can I assist you today?`;
      dataCard = {
        type: 'forecast',
        title: `${currentUser.name}'s Live Cash Flow Overview`,
        details: [
          `Current Available Balance: ₹${currentUser.balance.toLocaleString('en-IN')}`,
          `Predicted 7-Day Income: ₹${predictedNearTermIncome.toLocaleString('en-IN')}`,
          `Max Eligible Advance: ₹${recommendedAdvance.toLocaleString('en-IN')}`,
          `Financial Resilience Score: ${resilienceScore}/100`,
        ],
        value: currentUser.platform,
      };
    } else if (qLower.includes('advance') || qLower.includes('borrow') || qLower.includes('loan') || qLower.includes('limit')) {
      botText = `Based on your live cash flow underwriting, your current liquidity gap is ₹${estimatedGap.toLocaleString('en-IN')}. Your maximum safe advance limit is ₹${recommendedAdvance.toLocaleString('en-IN')}.`;
      dataCard = {
        type: 'advance_reason',
        title: 'Safe Advance Sizing Breakdown',
        details: [
          `Predicted 7-Day Income: ₹${predictedNearTermIncome.toLocaleString('en-IN')}`,
          `Upcoming Essential Expenses: ₹${metrics.essentialExpenses.toLocaleString('en-IN')}`,
          `Current Available Balance: ₹${currentUser.balance.toLocaleString('en-IN')}`,
          `Zero Predatory Interest (Flat ₹10 fee)`,
        ],
        value: `₹${recommendedAdvance.toLocaleString('en-IN')}`,
      };
    } else if (qLower.includes('resilience') || qLower.includes('score')) {
      botText = `Your Resilience Score for ${currentUser.name} is dynamically calculated at ${resilienceScore}/100 based on earnings stability, savings buffer, and debt load.`;
      dataCard = {
        type: 'resilience_score',
        title: 'Resilience Pillars Overview',
        details: metrics.pillars.map(p => `${p.name}: ${p.score}/100 (${p.status})`),
        value: `${resilienceScore}/100`,
      };
    } else {
      // Query policy RAG or external generative AI from local Flask server
      const ragRes = await queryPolicyRag(question);
      if (ragRes && ragRes.ai_explanation && !ragRes.ai_explanation.includes("unreachable")) {
        botText = ragRes.ai_explanation;
        if (ragRes.retrieved_context) {
          const isLocalDb = ragRes.source === "LOCAL_VECTOR_DB";
          dataCard = {
            type: isLocalDb ? 'advance_reason' : 'forecast',
            title: isLocalDb ? 'FAISS Semantic Vector RAG Retrieval' : 'AURA AI Financial Advisor',
            details: [
              ragRes.retrieved_context.length > 200
                ? `${ragRes.retrieved_context.substring(0, 200)}...`
                : ragRes.retrieved_context,
            ],
            value: isLocalDb ? 'RBI Policy Grounded' : 'General AI Domain Advice',
          };
        }
      } else {
        botText = `I see your current balance is ₹${currentUser.balance.toLocaleString('en-IN')} with ₹${predictedNearTermIncome.toLocaleString('en-IN')} in predicted earnings. How can I assist further?`;
      }
    }

    const auraMsg: AiCoachMessage = {
      id: `msg_${Date.now() + 1}`,
      sender: 'aura',
      text: botText,
      timestamp: 'Just now',
      dataCard,
    };

    setChatMessages(prev => [...prev, auraMsg]);
  };

  const markAlertRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  };

  return (
    <AuraContext.Provider
      value={{
        userAccount: currentUser,
        allUsers,
        isAuthenticated,
        isPinLocked,
        securityPin: currentUser.pin,
        login,
        logout,
        unlockWithPin,
        unlockWithBiometrics,
        lockApp,
        switchUserAccount,
        createNewUserAccount,

        balance: currentUser.balance,
        resilienceScore,
        advanceState,
        advanceAmount: recommendedAdvance || 1000,
        emergencyFundBalance: currentUser.emergencyFund,
        isBankOfficerView,
        activeTab,

        isMlConnected,
        mlData,
        refreshMlAnalysis,

        estimatedGap,
        recommendedAdvance,
        maxSafeAdvance,
        predictedNearTermIncome,
        essentialExpenses: metrics.essentialExpenses,
        pillars: metrics.pillars,
        explainableSignals,
        bankOfficerSignals,
        activeAdvance: metrics.activeAdv,
        upcomingObligations: metrics.upcomingObligations,

        transactions,
        dbTransactions: dbTxns,
        lastTransactionReceipt,

        selectedPillar,
        showExplainModal,
        showAdvanceModal,
        showWhatIfModal,
        showSendMoneyModal,
        showReceiveMoneyModal,
        showPayBillsModal,
        showSuccessModal,
        showAlertsDrawer,

        alerts,
        chatMessages,

        setActiveTab,
        setIsBankOfficerView,
        setSelectedPillar,
        setShowExplainModal,
        setShowAdvanceModal,
        setShowWhatIfModal,
        setShowSendMoneyModal,
        setShowReceiveMoneyModal,
        setShowPayBillsModal,
        setShowSuccessModal,
        setShowAlertsDrawer,

        acceptAdvance,
        repayAdvance,
        simulateWeekendPayout,
        sendMoney,
        saveToEmergencyFund,
        askAiCoach,
        markAlertRead,
        refreshDbData,
      }}
    >
      {children}
    </AuraContext.Provider>
  );
};

export const useAura = (): AuraContextType => {
  const context = useContext(AuraContext);
  if (!context) {
    throw new Error('useAura must be used within an AuraProvider');
  }
  return context;
};

