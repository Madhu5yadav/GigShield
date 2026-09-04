import json
import random
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

WORKER_NAMES = [
    "Rahul Sharma", "Priya Singh", "Amit Kumar", "Sunita Devi", "Vikram Patel",
    "Rajesh Verma", "Ananya Roy", "Deepak Joshi", "Meera Nair", "Sanjay Gupta",
    "Kavita Reddy", "Arjun Das", "Pooja Mishra", "Rohan Mehta", "Neha Choudhury",
    "Suresh Yadav", "Aarti Saxena", "Manish Tiwari", "Divya Rao", "Karan Malhotra",
    "Shweta Bhatia", "Vijay Swamy", "Ritu Kulkarni", "Pankaj Jain", "Bhavna Patel",
    "Gaurav Sen", "Tanya Kapoor", "Alok Sharma", "Smita Deshmukh", "Nitin Bansal",
    "Preeti Agarwal", "Harish Kumar", "Vandana Sethi", "Ashok Pandey", "Geeta Biswas",
    "Tarun Saxena", "Kiran Hegde", "Siddharth Shukla", "Pallavi Gill", "Mahesh Iyer",
    "Swati Menon", "Nilesh Gore", "Monika Shah", "Dinesh Kadam", "Rachna Solanki",
    "Vikas Narang", "Sarita Ahuja", "Hemant Rastogi", "Anjali Bhardwaj", "Yash Chopra"
]

PLATFORMS = ["Swiggy", "Zomato", "Zepto", "Uber", "Ola", "Blinkit", "Porter", "Urban Company"]

def generate_multi_user_aa_data(num_users=50, days=365, output_file="gig_txns.json"):
    """
    Production-Scale Account Aggregator Simulator.
    Generates 1 year of income/expense data for 50 distinct gig workers with rich metadata.
    """
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)
    
    all_transactions = []
    worker_profiles = {}
    
    print(f"[DATA] Generating 1 year of complex cash-flow data for {num_users} users...")

    for user_id in range(1, num_users + 1):
        worker_id = f"GIG-W-{user_id:03d}"
        worker_name = WORKER_NAMES[(user_id - 1) % len(WORKER_NAMES)]
        platform = PLATFORMS[(user_id - 1) % len(PLATFORMS)]
        
        # Archetypes for diverse risk profiles
        if user_id == 1:
            worker_type = "HUSTLER" # Rahul: High activity but recent crisis dip
        elif user_id == 2:
            worker_type = "WEEKEND_WARRIOR" # Priya: Steady weekend earnings
        elif user_id == 3:
            worker_type = "ERRATIC" # Amit: High variance driver
        else:
            worker_type = random.choice(["HUSTLER", "WEEKEND_WARRIOR", "ERRATIC"])

        worker_profiles[worker_id] = {
            "worker_id": worker_id,
            "worker_name": worker_name,
            "platform": platform,
            "worker_type": worker_type,
            "data_source": "Account Aggregator (SBI / HDFC / ICICI via AA)",
            "account_number": f"•••• {random.randint(1000, 9999)}",
            "upi_id": f"{worker_name.split()[0].lower()}.{platform.lower()}@aura"
        }
        
        current_balance = round(random.uniform(500, 5000), 2)
        
        for i in range(days):
            current_date = start_date + timedelta(days=i)
            dow = current_date.weekday()
            
            # 1. PROFILE-BASED INCOME LOGIC
            if worker_type == "HUSTLER":
                income = max(0, random.normalvariate(1200, 300))
            elif worker_type == "WEEKEND_WARRIOR":
                income = max(0, random.normalvariate(1800, 200)) if dow >= 4 else random.choice([0, 0, 400])
            else: # ERRATIC
                income = max(0, random.normalvariate(800, 600)) if random.random() > 0.3 else 0.0

            # Macro Shocks: Festive surge
            if random.random() < 0.08:
                income += random.uniform(500, 1500)
                
            # Demo Edge Case (User 1): Force recent zero-income crisis days at the end
            if user_id == 1 and i >= days - 2:
                income = 0.0

            income = round(income, 2)
            
            if income > 0:
                current_balance += income
                all_transactions.append({
                    "worker_id": worker_id,
                    "date": current_date.strftime("%Y-%m-%d"),
                    "amount": income,
                    "type": "CREDIT",
                    "description": f"{platform.upper()}_PAYOUT",
                    "balance_after": round(current_balance, 2)
                })

            # 2. MANDATORY EXPENSES (Fuel, Food, EMI)
            daily_expense = round(random.uniform(200, 400), 2) if income > 0 else round(random.uniform(50, 150), 2)
            
            # Weekly Bike / Vehicle EMI (Mondays)
            if dow == 0:
                daily_expense += 1200.0
                
            current_balance -= daily_expense
            
            all_transactions.append({
                "worker_id": worker_id,
                "date": current_date.strftime("%Y-%m-%d"),
                "amount": round(daily_expense, 2),
                "type": "DEBIT",
                "description": "EXPENSE_FUEL_FOOD_EMI",
                "balance_after": round(current_balance, 2)
            })
            
    aa_payload = {
        "report_info": {
            "title": "GigShield Multi-Worker Account Aggregator Synthetic Telemetry",
            "report_generated_at": end_date.isoformat(),
            "total_records": len(all_transactions),
            "total_workers": len(worker_profiles)
        },
        "account_info": worker_profiles["GIG-W-001"], # Default for backwards compatibility
        "worker_profiles": worker_profiles,
        "transactions": all_transactions
    }
    
    with open(output_file, "w") as f:
        json.dump(aa_payload, f, indent=2)
        
    print(f"[OK] Success: Generated {len(all_transactions)} transactions across {num_users} profiles in {output_file}")

if __name__ == "__main__":
    generate_multi_user_aa_data()