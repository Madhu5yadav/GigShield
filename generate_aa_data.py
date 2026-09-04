import json
import random
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def generate_multi_user_aa_data(num_users=50, days=365, output_file="gig_txns.json"):
    """
    Production-Scale AA Simulator.
    Generates 1 year of income/expense data for 50 users (~36,500+ rows).
    Prevents XGBoost overfitting by providing massive panel variance.
    """
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)
    
    all_transactions = []
    
    print(f"[DATA] Generating 1 year of complex cash-flow data for {num_users} users...")

    for user_id in range(1, num_users + 1):
        worker_type = random.choice(["HUSTLER", "WEEKEND_WARRIOR", "ERRATIC"])
        platform = random.choice(["Swiggy", "Zomato", "Zepto"])
        
        current_balance = round(random.uniform(500, 5000), 2)
        
        for i in range(days):
            current_date = start_date + timedelta(days=i)
            dow = current_date.weekday()
            
            # 1. PROFILE-BASED INCOME LOGIC
            if worker_type == "HUSTLER":
                # Works everyday, consistent
                income = max(0, random.normalvariate(1200, 300))
            elif worker_type == "WEEKEND_WARRIOR":
                # Only works Fri-Sun
                income = max(0, random.normalvariate(1800, 200)) if dow >= 4 else random.choice([0, 0, 400])
            else: # ERRATIC
                # High variance, random zero days
                income = max(0, random.normalvariate(800, 600)) if random.random() > 0.3 else 0.0

            # Macro Shocks: Monsoon Rain Surge (10% chance)
            if random.random() < 0.10:
                income += random.uniform(500, 1000)
                
            # Demo Target (User 1): Force the "Crisis" at the very end so the UI can demo it
            if user_id == 1 and i >= days - 2:
                income = 0.0

            income = round(income, 2)
            
            if income > 0:
                current_balance += income
                all_transactions.append({
                    "worker_id": f"GIG-W-{user_id:03d}",
                    "date": current_date.strftime("%Y-%m-%d"),
                    "amount": income,
                    "type": "CREDIT",
                    "description": f"{platform.upper()}_PAYOUT",
                    "balance_after": round(current_balance, 2)
                })

            # 2. MANDATORY EXPENSES (Fuel, Food, EMI)
            daily_expense = round(random.uniform(200, 400), 2) if income > 0 else round(random.uniform(50, 150), 2)
            
            # Weekly Bike EMI (Mondays)
            if dow == 0:
                daily_expense += 1200.0
                
            current_balance -= daily_expense
            
            all_transactions.append({
                "worker_id": f"GIG-W-{user_id:03d}",
                "date": current_date.strftime("%Y-%m-%d"),
                "amount": round(daily_expense, 2),
                "type": "DEBIT",
                "description": "EXPENSE_FUEL_FOOD_EMI",
                "balance_after": round(current_balance, 2)
            })
            
    # Schema for the React Frontend Demo (We only send User 1's profile info, but all data)
    aa_payload = {
        "account_info": {
            "worker_id": "GIG-W-001",
            "worker_name": "Rahul Sharma",
            "platform": "Swiggy",
            "data_source": "State Bank of India (via AA)",
            "report_generated_at": end_date.isoformat(),
            "total_records": len(all_transactions)
        },
        "transactions": all_transactions
    }
    
    with open(output_file, "w") as f:
        json.dump(aa_payload, f)
        
    print(f"[OK] Success: Generated {len(all_transactions)} transactions across {num_users} profiles in {output_file}")

if __name__ == "__main__":
    generate_multi_user_aa_data()