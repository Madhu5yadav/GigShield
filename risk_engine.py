import json
import numpy as np
import pandas as pd
import xgboost as xgb
from sklearn.ensemble import IsolationForest
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

class RiskEngine:
    """
    Production-Grade Hybrid Underwriting Engine (Aura Protocol).
    - Unsupervised Anomaly Clipping: Isolation Forest
    - Temporal Cash-Flow Modeling: Extreme Gradient Boosting (XGBoost)
    - Signal Processing Features: Harmonic Cyclical Day Encodings
    - Regulatory Compliance: Explainable Feature Attribution (Gain Metrics)
    """
    def __init__(self, raw_json_data, target_worker_id="GIG-W-001"):
        self.raw_data = json.loads(raw_json_data) if isinstance(raw_json_data, str) else raw_json_data
        profiles = self.raw_data.get("worker_profiles", {})
        
        self.target_worker_id = target_worker_id or "GIG-W-001"
        self.account_info = profiles.get(self.target_worker_id) or self.raw_data.get("account_info", {})
        self.df = self._preprocess_data(self.raw_data.get("transactions", []))

    def _preprocess_data(self, txns):
        if not txns:
            return pd.DataFrame(columns=["date", "amount"])
            
        df = pd.DataFrame(txns)
        df["date"] = pd.to_datetime(df["date"])
        if "worker_id" not in df.columns:
            df["worker_id"] = self.target_worker_id
        
        # Calculate NET CASH-FLOW (Credits - Debits)
        credits = df[df["type"] == "CREDIT"].groupby(["worker_id", "date"])["amount"].sum().reset_index() if "CREDIT" in df["type"].values else pd.DataFrame(columns=["worker_id", "date", "amount"])
        debits = df[df["type"] == "DEBIT"].groupby(["worker_id", "date"])["amount"].sum().reset_index() if "DEBIT" in df["type"].values else pd.DataFrame(columns=["worker_id", "date", "amount"])
        
        if credits.empty and not debits.empty:
            merged = debits.rename(columns={"amount": "amount_out"})
            merged["amount_in"] = 0.0
        elif debits.empty and not credits.empty:
            merged = credits.rename(columns={"amount": "amount_in"})
            merged["amount_out"] = 0.0
        elif not credits.empty and not debits.empty:
            merged = pd.merge(credits, debits, on=["worker_id", "date"], how="outer", suffixes=('_in', '_out')).fillna(0)
        else:
            merged = pd.DataFrame(columns=["worker_id", "date", "amount_in", "amount_out"])

        merged['net_margin'] = merged['amount_in'] - merged['amount_out']
        merged['amount'] = merged['amount_in'] 
        
        # Isolate requested worker from dataset, falling back to first available worker if needed
        worker_df = merged[merged['worker_id'] == self.target_worker_id].copy()
        if worker_df.empty and not merged.empty:
            first_worker = merged['worker_id'].iloc[0]
            worker_df = merged[merged['worker_id'] == first_worker].copy()

        worker_df = worker_df.sort_values("date").set_index("date")
        
        if not worker_df.empty:
            full_idx = pd.date_range(start=worker_df.index.min(), end=worker_df.index.max(), freq="D")
            worker_df = worker_df.reindex(full_idx, fill_value=0.0)
            
        return worker_df

    def extract_harmonic_features(self, df):
        """Signal Processing: Cyclical continuous phase encoding for days of the week."""
        df_feat = df.copy()
        dow = df_feat.index.dayofweek
        
        df_feat['dow_sin'] = np.sin(2 * np.pi * dow / 7.0)
        df_feat['dow_cos'] = np.cos(2 * np.pi * dow / 7.0)
        df_feat['is_weekend'] = dow.isin([5, 6]).astype(int)
        
        df_feat['lag_1'] = df_feat['amount'].shift(1).fillna(0)
        df_feat['lag_2'] = df_feat['amount'].shift(2).fillna(0)
        df_feat['lag_7'] = df_feat['amount'].shift(7).fillna(0)
        
        df_feat['rolling_mean_7'] = df_feat['amount'].rolling(window=7, min_periods=1).mean()
        df_feat['rolling_std_7'] = df_feat['amount'].rolling(window=7, min_periods=1).std().fillna(0)
        
        return df_feat

    def detect_and_clip_anomalies(self, df_feat):
        """Unsupervised Isolation Forest to isolate festive spikes and crises."""
        X = df_feat[['amount']].values
        iso = IsolationForest(contamination=0.05, random_state=42)
        df_feat['anomaly'] = iso.fit_predict(X)
        
        spike_mask = (df_feat['anomaly'] == -1) & (df_feat['amount'] > df_feat['rolling_mean_7'])
        anomalies_count = int(spike_mask.sum())
        
        df_clean = df_feat.copy()
        df_clean.loc[spike_mask, 'amount'] = df_clean.loc[spike_mask, 'rolling_mean_7']
        
        return df_clean, anomalies_count

    def train_and_forecast_xgboost(self, df_clean):
        """Supervised XGBoost Regressor with Out-of-Time Temporal Validation."""
        features = [
            'dow_sin', 'dow_cos', 'is_weekend', 
            'lag_1', 'lag_2', 'lag_7', 
            'rolling_mean_7', 'rolling_std_7'
        ]
        
        if len(df_clean) < 14:
            return [350.0] * 7, 2450.0, {}

        # Temporal split (Train on past history, validate on last 14 days)
        train_df = df_clean.iloc[:-14].dropna()
        val_df = df_clean.iloc[-14:].dropna()
        
        X_train, y_train = train_df[features], train_df['amount']
        X_val, y_val = val_df[features], val_df['amount']

        model = xgb.XGBRegressor(
            n_estimators=45,
            max_depth=3,
            learning_rate=0.08,
            subsample=0.85,
            colsample_bytree=0.85,
            random_state=42,
            eval_metric="rmse"
        )
        model.fit(X_train, y_train, eval_set=[(X_val, y_val)], verbose=False)

        val_preds = model.predict(X_val)
        mae = float(np.round(mean_absolute_error(y_val, val_preds), 2))
        rmse = float(np.round(np.sqrt(mean_squared_error(y_val, val_preds)), 2))
        r2 = float(np.round(r2_score(y_val, val_preds), 3))

        booster = model.get_booster()
        importance_scores = booster.get_score(importance_type='gain')
        total_gain = sum(importance_scores.values()) if importance_scores else 1.0
        normalized_gain = {k: round(v / total_gain, 3) for k, v in importance_scores.items()}

        forecast_7days = []
        simulated_history = list(df_clean['amount'].values)
        current_date = df_clean.index[-1]

        for step in range(1, 8):
            target_date = current_date + pd.Timedelta(days=step)
            dow = target_date.dayofweek
            
            step_features = pd.DataFrame([{
                'dow_sin': np.sin(2 * np.pi * dow / 7.0),
                'dow_cos': np.cos(2 * np.pi * dow / 7.0),
                'is_weekend': int(dow in [5, 6]),
                'lag_1': simulated_history[-1],
                'lag_2': simulated_history[-2],
                'lag_7': simulated_history[-7],
                'rolling_mean_7': np.mean(simulated_history[-7:]),
                'rolling_std_7': np.std(simulated_history[-7:])
            }])
            
            pred = float(model.predict(step_features[features])[0])
            pred_clamped = max(0.0, round(pred, 2))
            forecast_7days.append(pred_clamped)
            simulated_history.append(pred_clamped)

        total_income = float(np.round(sum(forecast_7days), 2))
        metrics = {"mae": mae, "rmse": rmse, "r2_score": r2, "feature_gain": normalized_gain}
        
        return forecast_7days, total_income, metrics

    def calculate_risk_score(self, df_clean, raw_df):
        """Calculates credit score based on volatility and recent crisis penalties."""
        recent_14 = raw_df["amount"].tail(14)
        zero_days = int((recent_14 == 0).sum())
        crisis_penalty = zero_days * 45  
        
        mean_val = df_clean["amount"].mean()
        std_dev = df_clean["amount"].std()
        cv = float(std_dev / mean_val) if mean_val > 0 else 1.0
        
        stability = max(0, 320 - int(cv * 160))
        volume = min(230, int(((mean_val * 7) / 7000.0) * 230))
        
        base_score = 480 + stability + volume - crisis_penalty
        return int(max(300, min(850, base_score))), zero_days

    def evaluate_risk(self):
        """Main execution pipeline maintaining strict API compatibility."""
        df_feat = self.extract_harmonic_features(self.df)
        df_clean, anomalies_count = self.detect_and_clip_anomalies(df_feat)
        daily_forecast, predicted_income, metrics = self.train_and_forecast_xgboost(df_clean)
        risk_score, zero_days = self.calculate_risk_score(df_clean, self.df)
        
        max_advance = round(0.20 * predicted_income, 2)
        is_eligible = bool(risk_score >= 550 and predicted_income > 1000 and max_advance > 0)

        return {
            "worker_id": self.account_info.get("worker_id", self.target_worker_id),
            "worker_name": self.account_info.get("worker_name", "Gig Economy Partner"),
            "platform": self.account_info.get("platform", "Multi-platform"),
            "worker_type": self.account_info.get("worker_type", "HUSTLER"),
            "risk_score": risk_score,
            "predicted_7day_income": predicted_income,
            "max_eligible_advance": max_advance,
            "convenience_fee": 10.0,
            "is_eligible": is_eligible,
            "explainable_ai_metrics": {
                "algorithm": "Extreme Gradient Boosting (XGBoost Regressor)",
                "isolation_forest_anomalies_detected": anomalies_count,
                "model_performance_validation": {
                    "rmse": metrics.get("rmse"),
                    "mae": metrics.get("mae"),
                    "r2_score": metrics.get("r2_score")
                },
                "xgboost_feature_importance_gain": metrics.get("feature_gain"),
                "recent_zero_income_days": zero_days,
                "daily_forecast_7days": daily_forecast,
                "underwriting_guardrail": "Max 20% of Projected Cash Flow"
            }
        }

if __name__ == "__main__":
    with open("gig_txns.json") as f:
        data = json.load(f)
    engine = RiskEngine(data)
    print(json.dumps(engine.evaluate_risk(), indent=2))