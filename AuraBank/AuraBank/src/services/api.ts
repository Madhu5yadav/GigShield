import Constants from 'expo-constants';
import { Platform } from 'react-native';

const getApiBaseUrl = (): string => {
  // Auto-detect host IP when running via Expo Go on physical mobile devices!
  const hostUri = Constants.expoConfig?.hostUri || Constants.manifest2?.extra?.expoGo?.debuggerHost || (Constants.manifest as any)?.debuggerHost;
  
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
      return `http://${ip}:5000/api/v1`;
    }
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api/v1';
  }

  // Active Laptop LAN IP fallback for physical phone testing
  return 'http://10.175.115.108:5000/api/v1';
};

const API_BASE_URL = getApiBaseUrl();
console.log('[API] Connected API Endpoint:', API_BASE_URL);

export interface CashflowAnalysisResponse {
  worker_id: string;
  risk_score: number;
  predicted_7day_income: number;
  max_eligible_advance: number;
  convenience_fee: number;
  is_eligible: boolean;
  explainable_ai_metrics?: {
    algorithm: string;
    isolation_forest_anomalies_detected: number;
    model_performance_validation: {
      rmse: number;
      mae: number;
      r2_score: number;
    };
    xgboost_feature_importance_gain: Record<string, number>;
    recent_zero_income_days: number;
    daily_forecast_7days: number[];
    underwriting_guardrail: string;
  };
  error?: string;
  details?: string;
}

export interface AcceptAdvanceResponse {
  status: string;
  message: string;
  disbursal_details?: {
    transaction_id: string;
    worker_id: string;
    worker_name: string;
    advance_amount: number;
    convenience_fee: number;
    total_repayment_amount: number;
    autopay_mandate_status: string;
    disbursal_timestamp: string;
  };
  ocen_lsp_integration?: {
    notified_platform: string;
    webhook_status: string;
    action_required: string;
    deduction_amount: number;
    target_deduction_date: string;
    message: string;
  };
  error?: string;
}

export interface PolicyRagResponse {
  query?: string;
  source?: string;
  distance?: number;
  retrieved_context?: string;
  ai_explanation: string;
  error?: string;
}

export async function fetchCashflowAnalysis(workerId: string = "GIG-W-001"): Promise<CashflowAnalysisResponse | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze_cashflow?worker_id=${encodeURIComponent(workerId)}`);
    if (!response.ok) throw new Error("Failed to fetch XGBoost risk metrics");
    return await response.json();
  } catch (error) {
    console.error("API Error (analyze_cashflow):", error);
    return null;
  }
}

export async function postAcceptAdvance(amount: number, workerId: string = "GIG-W-001", workerName: string = "Gig Economy Partner"): Promise<AcceptAdvanceResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/accept_advance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ advance_amount: amount, worker_id: workerId, worker_name: workerName }),
    });
    return await response.json();
  } catch (error: any) {
    console.error("API Error (accept_advance):", error);
    return { status: "ERROR", message: error.message || "Network Error" };
  }
}

export async function queryPolicyRag(question: string): Promise<PolicyRagResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/explain_policy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: question }),
    });
    return await response.json();
  } catch (error) {
    console.error("API Error (explain_policy):", error);
    return { ai_explanation: "Local FAISS vector RAG unreachable." };
  }
}

export async function fetchWorkerList(): Promise<any[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/workers`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.workers || [];
  } catch (error) {
    console.error("API Error (workers):", error);
    return [];
  }
}
