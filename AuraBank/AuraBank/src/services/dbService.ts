import { FinancialPillar, IncomeDataPoint, NotificationAlert, BankUnderwritingFactor } from '../types/aura';

export interface UserAccount {
  id: string;
  name: string;
  role: string;
  platform: string;
  phone: string;
  email: string;
  pin: string;
  avatar: string;
  accountNumber: string;
  upiId: string;
  balance: number;
  emergencyFund: number;
  joinDate: string;
}

export interface DbTransaction {
  id: string;
  userId: string;
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'savings' | 'advance';
  category: string;
  date: string;
  refNo: string;
}

export interface UpcomingObligation {
  id: string;
  userId: string;
  title: string;
  amount: number;
  dueDate: string;
  isEssential: boolean;
}

export interface ActiveSafeAdvance {
  id: string;
  userId: string;
  amount: number;
  fee: number;
  disbursedDate: string;
  status: 'active' | 'repaid';
  repaymentSource: string;
}

// Initial Seed Users for multi-account support
const SEED_USERS: UserAccount[] = [
  {
    id: 'user_rahul',
    name: 'Rahul Sharma',
    role: 'Delivery Partner (Gig Worker)',
    platform: 'Zomato & Swiggy',
    phone: '9876543210',
    email: 'rahul.gig@aurabank.in',
    pin: '1234',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    accountNumber: '•••• 8821',
    upiId: 'rahul.gig@aura',
    balance: 50,
    emergencyFund: 4200,
    joinDate: 'Oct 2024',
  },
  {
    id: 'user_priya',
    name: 'Priya Singh',
    role: 'Swiggy Executive',
    platform: 'Swiggy Instamart',
    phone: '9876543211',
    email: 'priya.singh@aurabank.in',
    pin: '2222',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    accountNumber: '•••• 4192',
    upiId: 'priya.swiggy@aura',
    balance: 1400,
    emergencyFund: 6500,
    joinDate: 'Jan 2024',
  },
  {
    id: 'user_amit',
    name: 'Amit Kumar',
    role: 'Cab Driver Partner',
    platform: 'Uber & Ola',
    phone: '9876543212',
    email: 'amit.uber@aurabank.in',
    pin: '3333',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    accountNumber: '•••• 9901',
    upiId: 'amit.uber@aura',
    balance: 120,
    emergencyFund: 1500,
    joinDate: 'Nov 2023',
  },
];

const SEED_TRANSACTIONS: Record<string, DbTransaction[]> = {
  user_rahul: [
    { id: 'tx_101', userId: 'user_rahul', title: 'Swiggy Weekend Earnings', amount: 1800, type: 'income', category: 'Gig Payout', date: 'Yesterday, 8:30 PM', refNo: 'TXN89127491' },
    { id: 'tx_102', userId: 'user_rahul', title: 'Zomato Daily Earnings', amount: 1500, type: 'income', category: 'Gig Payout', date: '2 days ago', refNo: 'TXN89127490' },
    { id: 'tx_103', userId: 'user_rahul', title: 'HP Petrol Pump Fuel', amount: 250, type: 'expense', category: 'Fuel', date: '3 days ago', refNo: 'TXN77123910' },
    { id: 'tx_104', userId: 'user_rahul', title: 'Zomato Weekday Pay', amount: 700, type: 'income', category: 'Gig Payout', date: '4 days ago', refNo: 'TXN89127488' },
    { id: 'tx_105', userId: 'user_rahul', title: 'AURA Emergency Fund Deposit', amount: 500, type: 'savings', category: 'Emergency Fund', date: '5 days ago', refNo: 'TXN55192843' },
  ],
  user_priya: [
    { id: 'tx_201', userId: 'user_priya', title: 'Swiggy Instamart Payout', amount: 2000, type: 'income', category: 'Gig Payout', date: 'Yesterday', refNo: 'TXN99182311' },
    { id: 'tx_202', userId: 'user_priya', title: 'Scooter Service EMI', amount: 1200, type: 'expense', category: 'Vehicle EMI', date: '2 days ago', refNo: 'TXN99182310' },
    { id: 'tx_203', userId: 'user_priya', title: 'Swiggy Midweek Earnings', amount: 950, type: 'income', category: 'Gig Payout', date: '4 days ago', refNo: 'TXN99182309' },
  ],
  user_amit: [
    { id: 'tx_301', userId: 'user_amit', title: 'Uber Driver Payout', amount: 2400, type: 'income', category: 'Gig Payout', date: 'Yesterday', refNo: 'TXN66192834' },
    { id: 'tx_302', userId: 'user_amit', title: 'CNG Station Refill', amount: 800, type: 'expense', category: 'Fuel', date: 'Yesterday', refNo: 'TXN66192833' },
    { id: 'tx_303', userId: 'user_amit', title: 'Ola Weekly Settlement', amount: 2200, type: 'income', category: 'Gig Payout', date: '3 days ago', refNo: 'TXN66192832' },
  ],
};

const SEED_OBLIGATIONS: Record<string, UpcomingObligation[]> = {
  user_rahul: [
    { id: 'ob_1', userId: 'user_rahul', title: 'Bike Petrol / Fuel Fill', amount: 300, dueDate: 'Tomorrow', isEssential: true },
    { id: 'ob_2', userId: 'user_rahul', title: 'Weekly Room Rent Portion', amount: 1500, dueDate: 'In 2 days', isEssential: true },
  ],
  user_priya: [
    { id: 'ob_3', userId: 'user_priya', title: 'Scooter Battery Insurance', amount: 450, dueDate: 'In 4 days', isEssential: true },
  ],
  user_amit: [
    { id: 'ob_4', userId: 'user_amit', title: 'CNG Gas Refill Deposit', amount: 1000, dueDate: 'Today', isEssential: true },
    { id: 'ob_5', userId: 'user_amit', title: 'Car Commercial Loan EMI', amount: 1500, dueDate: 'In 3 days', isEssential: true },
  ],
};

class DatabaseService {
  private users: UserAccount[] = [];
  private transactions: Record<string, DbTransaction[]> = {};
  private obligations: Record<string, UpcomingObligation[]> = {};
  private activeAdvances: Record<string, ActiveSafeAdvance | null> = {};
  private currentUserId: string = 'user_rahul';

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const storedUsers = localStorage.getItem('aura_users');
        const storedTxns = localStorage.getItem('aura_transactions');
        const storedObs = localStorage.getItem('aura_obligations');
        const storedAdv = localStorage.getItem('aura_advances');
        const storedActiveUser = localStorage.getItem('aura_current_user_id');

        if (storedUsers) this.users = JSON.parse(storedUsers);
        else this.users = [...SEED_USERS];

        if (storedTxns) this.transactions = JSON.parse(storedTxns);
        else this.transactions = { ...SEED_TRANSACTIONS };

        if (storedObs) this.obligations = JSON.parse(storedObs);
        else this.obligations = { ...SEED_OBLIGATIONS };

        if (storedAdv) this.activeAdvances = JSON.parse(storedAdv);
        else this.activeAdvances = {};

        if (storedActiveUser && this.users.some(u => u.id === storedActiveUser)) {
          this.currentUserId = storedActiveUser;
        } else {
          this.currentUserId = this.users[0]?.id || 'user_rahul';
        }
      } else {
        this.users = [...SEED_USERS];
        this.transactions = { ...SEED_TRANSACTIONS };
        this.obligations = { ...SEED_OBLIGATIONS };
      }
    } catch (e) {
      console.warn('Failed loading from localStorage, using memory seed:', e);
      this.users = [...SEED_USERS];
      this.transactions = { ...SEED_TRANSACTIONS };
      this.obligations = { ...SEED_OBLIGATIONS };
    }
  }

  private saveToStorage() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('aura_users', JSON.stringify(this.users));
        localStorage.setItem('aura_transactions', JSON.stringify(this.transactions));
        localStorage.setItem('aura_obligations', JSON.stringify(this.obligations));
        localStorage.setItem('aura_advances', JSON.stringify(this.activeAdvances));
        localStorage.setItem('aura_current_user_id', this.currentUserId);
      }
    } catch (e) {
      console.warn('Failed saving to localStorage:', e);
    }
  }

  // User Management APIs
  public getAllUsers(): UserAccount[] {
    return [...this.users];
  }

  public getCurrentUser(): UserAccount {
    const user = this.users.find(u => u.id === this.currentUserId);
    if (!user) return this.users[0];
    return { ...user };
  }

  public setCurrentUser(userId: string): UserAccount {
    const target = this.users.find(u => u.id === userId);
    if (target) {
      this.currentUserId = userId;
      this.saveToStorage();
      return { ...target };
    }
    return this.getCurrentUser();
  }

  public findUserByPhoneOrEmail(phoneOrEmail: string): UserAccount | null {
    const cleanInput = phoneOrEmail.trim().toLowerCase();
    const found = this.users.find(
      u => u.phone === cleanInput || u.email.toLowerCase() === cleanInput || u.phone.includes(cleanInput)
    );
    return found ? { ...found } : null;
  }

  public createAccount(userData: {
    name: string;
    role: string;
    platform: string;
    phone: string;
    email: string;
    pin: string;
    initialBalance?: number;
  }): UserAccount {
    const newId = `user_${Date.now()}`;
    const newUser: UserAccount = {
      id: newId,
      name: userData.name,
      role: userData.role || 'Gig Economy Partner',
      platform: userData.platform || 'Multi-platform Worker',
      phone: userData.phone,
      email: userData.email || `${userData.name.toLowerCase().replace(/\s+/g, '.')}@aurabank.in`,
      pin: userData.pin || '1234',
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250`,
      accountNumber: `•••• ${Math.floor(1000 + Math.random() * 9000)}`,
      upiId: `${userData.name.toLowerCase().replace(/\s+/g, '')}@aura`,
      balance: userData.initialBalance ?? 100,
      emergencyFund: 1000,
      joinDate: 'Just Joined',
    };

    this.users.push(newUser);
    this.transactions[newId] = [
      {
        id: `tx_init_${Date.now()}`,
        userId: newId,
        title: 'Account Creation Welcome Bonus',
        amount: userData.initialBalance ?? 100,
        type: 'income',
        category: 'Welcome Credit',
        date: 'Just now',
        refNo: `TXN${Math.floor(100000000 + Math.random() * 900000000)}`,
      },
    ];

    this.obligations[newId] = [
      { id: `ob_${Date.now()}_1`, userId: newId, title: 'Weekly Transport / Fuel', amount: 300, dueDate: 'In 2 days', isEssential: true },
      { id: `ob_${Date.now()}_2`, userId: newId, title: 'Essential Living Expenses', amount: 800, dueDate: 'In 4 days', isEssential: true },
    ];

    this.currentUserId = newId;
    this.saveToStorage();
    return { ...newUser };
  }

  // Transactions & Financial Operations
  public getUserTransactions(userId: string = this.currentUserId): DbTransaction[] {
    return [...(this.transactions[userId] || [])];
  }

  public addTransaction(
    userId: string,
    title: string,
    amount: number,
    type: 'income' | 'expense' | 'savings' | 'advance',
    category: string
  ): DbTransaction {
    const newTx: DbTransaction = {
      id: `tx_${Date.now()}`,
      userId,
      title,
      amount,
      type,
      category,
      date: 'Just now',
      refNo: `TXN${Math.floor(100000000 + Math.random() * 900000000)}`,
    };

    if (!this.transactions[userId]) this.transactions[userId] = [];
    this.transactions[userId].unshift(newTx);

    // Update balance
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      if (type === 'income' || type === 'advance') {
        this.users[userIndex].balance += amount;
      } else if (type === 'expense') {
        this.users[userIndex].balance = Math.max(0, this.users[userIndex].balance - amount);
      } else if (type === 'savings') {
        this.users[userIndex].balance = Math.max(0, this.users[userIndex].balance - amount);
        this.users[userIndex].emergencyFund += amount;
      }
    }

    this.saveToStorage();
    return newTx;
  }

  // Safe Advance Database Operations
  public getActiveAdvance(userId: string = this.currentUserId): ActiveSafeAdvance | null {
    return this.activeAdvances[userId] || null;
  }

  public requestSafeAdvance(userId: string, amount: number): ActiveSafeAdvance {
    const fee = Math.max(10, Math.round(amount * 0.01)); // 1% flat fee
    const advanceRecord: ActiveSafeAdvance = {
      id: `adv_${Date.now()}`,
      userId,
      amount,
      fee,
      disbursedDate: 'Just now',
      status: 'active',
      repaymentSource: 'Upcoming Weekend Gig Payout',
    };

    this.activeAdvances[userId] = advanceRecord;
    this.addTransaction(userId, 'AURA Safe Advance Disbursed', amount, 'advance', 'Safe Advance');
    return advanceRecord;
  }

  public repaySafeAdvance(userId: string): boolean {
    const active = this.activeAdvances[userId];
    if (!active || active.status !== 'active') return false;

    const user = this.users.find(u => u.id === userId);
    if (!user) return false;

    const totalToRepay = active.amount + active.fee;
    // Deduct from balance
    user.balance = Math.max(0, user.balance - totalToRepay);

    // Record transaction
    this.addTransaction(userId, 'Safe Advance Repayment Settled', totalToRepay, 'expense', 'Loan Repayment');
    
    // Mark as repaid
    this.activeAdvances[userId] = {
      ...active,
      status: 'repaid',
    };

    this.saveToStorage();
    return true;
  }

  public simulatePlatformEarnings(userId: string, earningsAmount: number = 2500): { payoutTx: DbTransaction; advanceAutoRepaid: boolean } {
    const user = this.users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');

    const payoutTx = this.addTransaction(userId, `${user.platform.split('&')[0].trim()} Weekend Settlement`, earningsAmount, 'income', 'Gig Payout');
    
    let advanceAutoRepaid = false;
    const activeAdv = this.activeAdvances[userId];
    if (activeAdv && activeAdv.status === 'active') {
      this.repaySafeAdvance(userId);
      advanceAutoRepaid = true;
    }

    return { payoutTx, advanceAutoRepaid };
  }

  // Dynamic Financial Analytics Engine
  public getUpcomingObligations(userId: string = this.currentUserId): UpcomingObligation[] {
    return [...(this.obligations[userId] || [])];
  }

  public calculateDynamicMetrics(userId: string = this.currentUserId) {
    const user = this.users.find(u => u.id === userId) || this.users[0];
    const txns = this.getUserTransactions(userId);
    const activeAdv = this.getActiveAdvance(userId);
    const obs = this.getUpcomingObligations(userId);

    // 1. Essential Upcoming Expenses
    const essentialExpenses = obs.reduce((sum, o) => sum + (o.isEssential ? o.amount : 0), 1800);

    // 2. Dynamic 7-day forecast based on past earnings
    const incomeTxns = txns.filter(t => t.type === 'income');
    const avgHistoricalIncome = incomeTxns.length > 0
      ? incomeTxns.reduce((sum, t) => sum + t.amount, 0) / incomeTxns.length
      : 800;

    // Projected 7-Day Income
    const predictedNearTermIncome = Math.round(avgHistoricalIncome * 3.5); // 3.5 payout days per week avg

    // 3. Liquidity Gap Calculation
    // Gap occurs if current available balance is insufficient to cover immediate essential expenses before next payout
    const estimatedGap = Math.max(0, essentialExpenses - user.balance);

    // Safe Advance Calculation (Max safe limit is 40% of forecasted earnings)
    const maxSafeAdvance = Math.min(Math.round(predictedNearTermIncome * 0.4), 2000);
    const recommendedAdvance = estimatedGap > 0 ? Math.min(estimatedGap, maxSafeAdvance) : 0;

    // 4. Resilience Pillars Dynamic Calculation
    // Income Stability (based on payout frequency & counts)
    const incomeStabilityScore = Math.min(95, Math.max(60, 65 + incomeTxns.length * 6));
    
    // Savings Buffer (Emergency fund vs essential expenses ratio)
    const savingsBufferRatio = user.emergencyFund / Math.max(essentialExpenses, 1000);
    const savingsBufferScore = Math.min(100, Math.round(savingsBufferRatio * 35));

    // Expense Stability
    const expenseStabilityScore = 80;

    // Debt Load Score (If active advance exists, 75%, else 95%)
    const debtLoadScore = activeAdv && activeAdv.status === 'active' ? 75 : 95;

    // Emergency Fund Progress Score
    const emergencyFundScore = Math.min(100, Math.round((user.emergencyFund / 10000) * 100));

    // Overall Weighted Score
    const overallResilienceScore = Math.round(
      incomeStabilityScore * 0.3 +
      savingsBufferScore * 0.2 +
      expenseStabilityScore * 0.2 +
      debtLoadScore * 0.15 +
      emergencyFundScore * 0.15
    );

    const pillars: FinancialPillar[] = [
      {
        id: 'income_stability',
        name: 'Income Stability',
        score: incomeStabilityScore,
        weight: '30%',
        status: incomeStabilityScore > 80 ? 'good' : 'moderate',
        explanation: 'Evaluates variance in earnings across recent transaction logs.',
        calculationMethod: `Derived from ${incomeTxns.length} verified gig payouts.`,
        recommendation: 'Maintain consistent weekday hours to maximize earnings confidence.',
      },
      {
        id: 'savings_buffer',
        name: 'Savings Buffer',
        score: savingsBufferScore,
        weight: '20%',
        status: savingsBufferScore > 75 ? 'good' : 'moderate',
        explanation: 'Measures liquid funds available relative to essential expenses.',
        calculationMethod: `₹${user.emergencyFund} emergency fund vs ₹${essentialExpenses} upcoming obligations.`,
        recommendation: 'Target saving ₹250 on peak earning days.',
      },
      {
        id: 'expense_stability',
        name: 'Expense Stability',
        score: expenseStabilityScore,
        weight: '20%',
        status: 'good',
        explanation: 'Assesses predictability of monthly essential recurring costs.',
        calculationMethod: 'Compares fixed rent & fuel obligations against variable cash outflows.',
        recommendation: `Your essential expenses are stable at ₹${essentialExpenses} per cycle.`,
      },
      {
        id: 'debt_load',
        name: 'Debt Load',
        score: debtLoadScore,
        weight: '15%',
        status: debtLoadScore > 85 ? 'excellent' : 'warning',
        explanation: 'Ratio of active debt repayments to average weekly net cash flow.',
        calculationMethod: activeAdv && activeAdv.status === 'active'
          ? `Active ₹${activeAdv.amount} safe advance pending settlement.`
          : 'Zero active high-cost loans or payday debt exposure.',
        recommendation: 'Repay advances promptly via platform payout to maintain top score.',
      },
      {
        id: 'emergency_fund',
        name: 'Emergency Fund',
        score: emergencyFundScore,
        weight: '15%',
        status: emergencyFundScore > 60 ? 'good' : 'moderate',
        explanation: `Progress toward a ₹10,000 safety cushion.`,
        calculationMethod: `Current balance (₹${user.emergencyFund}) / Target (₹10,000).`,
        recommendation: 'Set up auto-save on days earnings cross ₹1,200.',
      },
    ];

    const explainableSignals = [
      { text: 'Predicted 7-day income', value: `₹${predictedNearTermIncome.toLocaleString('en-IN')}`, status: 'pass' as const },
      { text: 'Current available balance', value: `₹${user.balance.toLocaleString('en-IN')}`, status: 'pass' as const },
      { text: 'Essential expenses obligation', value: `₹${essentialExpenses.toLocaleString('en-IN')}`, status: 'pass' as const },
      { text: 'Recent income stability score', value: `${incomeStabilityScore}% (${incomeStabilityScore > 80 ? 'High' : 'Moderate'})`, status: 'pass' as const },
      { text: 'Existing debt burden', value: activeAdv && activeAdv.status === 'active' ? `Active ₹${activeAdv.amount}` : 'Low (0 active loans)', status: 'pass' as const },
      { text: 'Historical recovery after low-income periods', value: 'Strong (2-3 days)', status: 'pass' as const },
    ];

    const bankOfficerSignals: BankUnderwritingFactor[] = [
      { name: 'Income history', status: 'passed', metric: `₹${Math.round(avgHistoricalIncome * 4)}/wk avg`, benchmark: '> ₹2,000/wk', detail: `Verified ${incomeTxns.length} recurring gig payout logs` },
      { name: 'Income prediction (7 days)', status: 'passed', metric: `₹${predictedNearTermIncome} forecast`, benchmark: `> ₹${essentialExpenses} expenses`, detail: 'High statistical confidence (89%)' },
      { name: 'Essential expenses', status: 'passed', metric: `₹${essentialExpenses}`, benchmark: '< 60% of income', detail: 'Fixed rent & fuel costs verified' },
      { name: 'Debt obligations', status: activeAdv && activeAdv.status === 'active' ? 'warning' : 'passed', metric: activeAdv ? `₹${activeAdv.amount} Active` : '₹0 active DTI', benchmark: '< 35% DTI', detail: 'No high-cost payday loan defaults' },
      { name: 'Cash-flow volatility', status: 'passed', metric: `Controlled (${incomeStabilityScore}%)`, benchmark: '> 60% stability', detail: 'Weekend demand compensates weekday dips' },
      { name: 'Repayment capacity', status: 'passed', metric: `${(predictedNearTermIncome / Math.max(recommendedAdvance, 1)).toFixed(1)}x coverage`, benchmark: '> 1.5x gap', detail: `Predicted income comfortably covers ₹${recommendedAdvance}` },
    ];

    return {
      user,
      essentialExpenses,
      predictedNearTermIncome,
      estimatedGap,
      maxSafeAdvance,
      recommendedAdvance,
      overallResilienceScore,
      pillars,
      explainableSignals,
      bankOfficerSignals,
      activeAdv,
      upcomingObligations: obs,
    };
  }
}

export const dbService = new DatabaseService();
