import os
import json
import uuid
from datetime import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS
from generate_aa_data import generate_multi_user_aa_data
from risk_engine import RiskEngine
from real_rag import RealLocalRAG

app = Flask(__name__)
CORS(app)  # Enable cross-origin requests for React frontend integration

DATA_FILE = "gig_txns.json"
POLICY_FILE = "rbi_policy.txt"

# Initialize local semantic vector RAG on boot
rag_engine = RealLocalRAG(POLICY_FILE)

def get_or_create_aa_data():
    """Ensure gig_txns.json exists with complex multi-profile panel data."""
    if not os.path.exists(DATA_FILE):
        generate_multi_user_aa_data(num_users=50, days=365, output_file=DATA_FILE)
    with open(DATA_FILE, "r") as f:
        return json.load(f)

@app.route("/", methods=["GET"])
@app.route("/api/v1", methods=["GET"])
@app.route("/api/v1/", methods=["GET"])
def health_check():
    """System health check endpoint."""
    return jsonify({
        "service": "Aura Micro-Credit Risk Engine API",
        "status": "ONLINE",
        "version": "v2.0-xgboost-rag",
        "endpoints": [
            "GET /api/v1/analyze_cashflow?worker_id=GIG-W-002",
            "GET /api/v1/workers",
            "POST /api/v1/analyze_custom_data",
            "POST /api/v1/upload_dataset",
            "POST /api/v1/accept_advance",
            "POST /api/v1/explain_policy",
            "POST /api/v1/regenerate_data"
        ]
    }), 200

@app.route("/api/v1/analyze_cashflow", methods=["GET"])
def analyze_cashflow():
    """
    Endpoint 1: Executes Isolation Forest anomaly clipping and 
    XGBoost 7-day cash-flow velocity forecasting for requested worker.
    """
    try:
        worker_id = request.args.get("worker_id", "GIG-W-001")
        raw_data = get_or_create_aa_data()
        engine = RiskEngine(raw_data, target_worker_id=worker_id)
        decision = engine.evaluate_risk()
        return jsonify(decision), 200
    except Exception as e:
        return jsonify({
            "error": "Failed to execute machine learning underwriting pipeline",
            "details": str(e)
        }), 500

@app.route("/api/v1/accept_advance", methods=["POST"])
def accept_advance():
    """
    Endpoint 2: Validates requested micro-credit advance against ML limits, 
    simulates UPI AutoPay disbursal, and triggers OCEN 4.0 LSP webhook.
    """
    try:
        req_data = request.get_json() or {}
        requested_amount = req_data.get("advance_amount", 1000)
        worker_id = req_data.get("worker_id", "GIG-W-001")
        worker_name = req_data.get("worker_name", "Gig Economy Partner")

        raw_data = get_or_create_aa_data()
        engine = RiskEngine(raw_data, target_worker_id=worker_id)
        decision = engine.evaluate_risk()
        
        max_limit = decision.get("max_eligible_advance", 0)
        is_eligible = decision.get("is_eligible", False)

        if not is_eligible:
            return jsonify({
                "status": "REJECTED",
                "message": "Worker is currently ineligible for micro-credit advance based on ML risk scoring."
            }), 400

        if requested_amount > max_limit:
            return jsonify({
                "status": "REJECTED",
                "message": f"Requested advance (₹{requested_amount}) exceeds max eligible limit of ₹{max_limit}."
            }), 400

        convenience_fee = decision.get("convenience_fee", 10.0)
        total_repayment = requested_amount + convenience_fee

        # Core Transaction Response Package
        transaction_response = {
            "status": "SUCCESS",
            "message": f"₹{requested_amount} successfully disbursed via institutional lender through OCEN network!",
            "disbursal_details": {
                "transaction_id": f"DISB-UPI-{uuid.uuid4().hex[:8].upper()}",
                "worker_id": worker_id,
                "worker_name": worker_name,
                "advance_amount": requested_amount,
                "convenience_fee": convenience_fee,
                "total_repayment_amount": total_repayment,
                "autopay_mandate_status": "ACTIVE",
                "disbursal_timestamp": datetime.now().isoformat()
            }
        }

        # OCEN 4.0 LSP (Zomato/Swiggy) Webhook Simulation Packet
        transaction_response["ocen_lsp_integration"] = {
            "notified_platform": "Swiggy Delivery Partner Network",
            "webhook_status": "200 OK - ACKNOWLEDGED",
            "action_required": "Initiate Source-Deduction Settlement Mandate",
            "deduction_amount": total_repayment,
            "target_deduction_date": "NEXT_WEEKLY_PAYOUT_CYCLE",
            "message": f"Platform nodal server programmed to auto-recover ₹{total_repayment} at source before wage release."
        }

        return jsonify(transaction_response), 200

    except Exception as e:
        return jsonify({
            "error": "Failed to process OCEN advance disbursal protocol",
            "details": str(e)
        }), 500

@app.route("/api/v1/explain_policy", methods=["POST"])
def explain_policy():
    """
    Endpoint 3: Local Semantic RAG Assistant. 
    Retrieves official RBI guidelines and KFS rules using FAISS vector similarity search.
    """
    try:
        req_data = request.get_json() or {}
        query = req_data.get("query", "Why do we need a Key Fact Statement?")
        result = rag_engine.query(query)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({
            "error": "Failed to execute semantic retrieval on local vector database",
            "details": str(e)
        }), 500

@app.route("/api/v1/workers", methods=["GET"])
def list_workers():
    """Returns list of all available worker profiles in the synthetic panel dataset."""
    try:
        raw_data = get_or_create_aa_data()
        profiles = raw_data.get("worker_profiles", {})
        if not profiles and "account_info" in raw_data:
            profiles = {raw_data["account_info"]["worker_id"]: raw_data["account_info"]}
        return jsonify({
            "status": "SUCCESS",
            "total_workers": len(profiles),
            "workers": list(profiles.values())
        }), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch worker list", "details": str(e)}), 500

@app.route("/api/v1/analyze_custom_data", methods=["POST"])
def analyze_custom_data():
    """
    Endpoint: Underwrites ANY custom synthetic dataset or test case JSON payload provided by the user.
    Body format:
    {
       "worker_name": "Custom User",
       "platform": "Swiggy",
       "transactions": [ {"date": "2026-03-01", "amount": 1500, "type": "CREDIT"}, ... ]
    }
    """
    try:
        custom_payload = request.get_json() or {}
        if not custom_payload.get("transactions"):
            return jsonify({
                "error": "Invalid payload format. Must include a 'transactions' array containing credit/debit records."
            }), 400

        target_worker_id = custom_payload.get("worker_id", "CUSTOM-W-999")
        if "account_info" not in custom_payload:
            custom_payload["account_info"] = {
                "worker_id": target_worker_id,
                "worker_name": custom_payload.get("worker_name", "Custom Test User"),
                "platform": custom_payload.get("platform", "Custom Platform")
            }

        engine = RiskEngine(custom_payload, target_worker_id=target_worker_id)
        decision = engine.evaluate_risk()
        return jsonify({
            "status": "SUCCESS",
            "custom_underwriting_result": decision
        }), 200
    except Exception as e:
        return jsonify({"error": "Failed to underwrite custom dataset", "details": str(e)}), 500

@app.route("/api/v1/upload_dataset", methods=["POST"])
def upload_dataset():
    """Endpoint: Overwrite or save a custom synthetic dataset JSON file directly on the server."""
    try:
        custom_data = request.get_json()
        if not custom_data or "transactions" not in custom_data:
            return jsonify({"error": "Payload must contain a valid dataset with 'transactions'."}), 400

        with open(DATA_FILE, "w") as f:
            json.dump(custom_data, f, indent=2)

        return jsonify({
            "status": "SUCCESS",
            "message": "Custom synthetic dataset successfully saved to server!"
        }), 200
    except Exception as e:
        return jsonify({"error": "Failed to upload custom dataset", "details": str(e)}), 500

@app.route("/api/v1/regenerate_data", methods=["POST"])
def regenerate_data():
    """Helper route to reset synthetic panel dataset for live testing."""
    generate_multi_user_aa_data(num_users=50, days=365, output_file=DATA_FILE)
    return jsonify({
        "status": "SUCCESS",
        "message": "Regenerated 1-year complex multi-user dataset across 50 profiles."
    }), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False, threaded=True)