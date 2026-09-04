export interface FinancialPillar {
  id: string;
  name: string;
  score: number;
  weight: string;
  status: 'excellent' | 'good' | 'moderate' | 'warning';
  explanation: string;
  calculationMethod: string;
  recommendation: string;
}

export interface IncomeDataPoint {
  day: string;
  date: string;
  income: number;
  expenses: number;
  isPredicted?: boolean;
  notes?: string;
}

export interface AiInsight {
  id: string;
  category: 'cashflow' | 'income' | 'savings' | 'risk';
  title: string;
  description: string;
  icon: string;
  impact: 'positive' | 'neutral' | 'warning';
}

export interface AiCoachMessage {
  id: string;
  sender: 'user' | 'aura';
  text: string;
  timestamp: string;
  dataCard?: {
    type: 'safe_to_spend' | 'advance_reason' | 'resilience_score' | 'forecast' | 'savings';
    title: string;
    details: string[];
    value?: string;
  };
}

export interface NotificationAlert {
  id: string;
  type: 'cashflow' | 'savings' | 'warning' | 'trend';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionable?: boolean;
  actionText?: string;
}

export interface BankUnderwritingFactor {
  name: string;
  status: 'passed' | 'warning' | 'failed';
  metric: string;
  benchmark: string;
  detail: string;
}

export interface ScenarioStep {
  stepNumber: 1 | 2 | 3;
  title: string;
  description: string;
  balance: number;
  gapDetected: boolean;
  advanceStatus: 'none' | 'recommended' | 'accepted' | 'repaid';
}
