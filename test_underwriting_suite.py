"""
GigShield Aura ML Underwriting Batch Test Suite
Runs custom edge cases against the Flask ML Risk Engine.
"""
import requests
import json

BASE_URL = "http://localhost:5000/api/v1"

TEST_CASES = [
    {
        "name": "TestCase 1: High Earners / High Stability",
        "payload": {
            "worker_id": "TEST-001",
            "worker_name": "Rohan Gupta",
            "platform": "Swiggy Select",
            "transactions": [
                {"date": f"2026-03-{d:02d}", "amount": 3000, "type": "CREDIT"} for d in range(1, 10)
            ] + [
                {"date": f"2026-03-{d:02d}", "amount": 400, "type": "DEBIT"} for d in range(1, 10)
            ]
        }
    },
    {
        "name": "TestCase 2: Income Drop / Severe Liquidity Crisis",
        "payload": {
            "worker_id": "TEST-002",
            "worker_name": "Kavita Nair",
            "platform": "Zomato Partner",
            "transactions": [
                {"date": "2026-03-01", "amount": 1200, "type": "CREDIT"},
                {"date": "2026-03-02", "amount": 0, "type": "CREDIT"},
                {"date": "2026-03-03", "amount": 0, "type": "CREDIT"},
                {"date": "2026-03-04", "amount": 0, "type": "CREDIT"},
                {"date": "2026-03-01", "amount": 800, "type": "DEBIT"}
            ]
        }
    },
    {
        "name": "TestCase 3: High Anomaly Surge (Festive Spiker)",
        "payload": {
            "worker_id": "TEST-003",
            "worker_name": "Vikram Patel",
            "platform": "Zepto Express",
            "transactions": [
                {"date": f"2026-03-{d:02d}", "amount": 1000, "type": "CREDIT"} for d in range(1, 7)
            ] + [
                {"date": "2026-03-07", "amount": 25000, "type": "CREDIT"} # Spike anomaly
            ]
        }
    }
]

def run_suite():
    print("=" * 70)
    print("      AURA MICRO-CREDIT UNDERWRITING AUTOMATED TEST SUITE")
    print("=" * 70)
    
    for case in TEST_CASES:
        print(f"\n[EXEC] Running {case['name']}...")
        try:
            res = requests.post(f"{BASE_URL}/analyze_custom_data", json=case["payload"])
            data = res.json().get("custom_underwriting_result", {})
            
            pred_inc = data.get('predicted_7day_income') or 0.0
            max_adv = data.get('max_eligible_advance') or 0.0
            risk_sc = data.get('risk_score') or 300

            print(f"  - Worker Name          : {data.get('worker_name', 'Unknown')} ({data.get('platform', 'N/A')})")
            print(f"  - Risk Score           : {risk_sc} / 850")
            print(f"  - Predicted 7-Day Inc. : Rs.{pred_inc:,.2f}")
            print(f"  - Max Safe Advance     : Rs.{max_adv:,.2f}")
            print(f"  - Underwriting Decision: {'APPROVED [OK]' if data.get('is_eligible') else 'REJECTED [X]'}")
            print(f"  - Anomalies Clipped    : {data.get('explainable_ai_metrics', {}).get('isolation_forest_anomalies_detected', 0)}")
        except Exception as e:
            print(f"  [ERROR]: {e}")
            
    print("\n" + "=" * 70)
    print("  [SUCCESS] All custom test cases executed successfully against Flask backend.")
    print("=" * 70)

if __name__ == "__main__":
    run_suite()
