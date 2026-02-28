# ===============================
# SMART PARKING ML TRAINING CODE
# ===============================

# Install dependencies (only if needed)
# pip install pandas numpy scikit-learn joblib

import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_absolute_error, accuracy_score

from sklearn.ensemble import RandomForestRegressor
from sklearn.ensemble import RandomForestClassifier

# ===============================
# 1. LOAD DATASET
# ===============================

df = pd.read_csv("smart_parking_dataset.csv")

print("Dataset Loaded")
print(df.head())

# ===============================
# 2. DATA PREPROCESSING
# ===============================

# Encode categorical columns
label_encoders = {}

categorical_cols = [
    "location",
    "vehicle_type",
    "weather",
    "event_type",
    "traffic_level"
]

for col in categorical_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    label_encoders[col] = le

# ===============================
# 3. MODEL 1 - PARKING AVAILABILITY PREDICTION
# ===============================

# Features
X_reg = df[
    [
        "day_of_week",
        "hour_of_day",
        "month",
        "location",
        "weather",
        "event_type",
        "traffic_level",
        "total_slots",
        "price_per_hour_inr"
    ]
]

# Target
y_reg = df["available_slots"]

# Split data
X_train_reg, X_test_reg, y_train_reg, y_test_reg = train_test_split(
    X_reg, y_reg, test_size=0.2, random_state=42
)

# Train model
reg_model = RandomForestRegressor(n_estimators=100, random_state=42)
reg_model.fit(X_train_reg, y_train_reg)

# Predictions
y_pred_reg = reg_model.predict(X_test_reg)

# Evaluation
mae = mean_absolute_error(y_test_reg, y_pred_reg)

print("\nParking Availability Model Trained")
print("MAE:", mae)

# Save model
joblib.dump(reg_model, "parking_availability_model.pkl")

# ===============================
# 4. MODEL 2 - DEMAND LEVEL CLASSIFICATION
# ===============================

# Encode target
demand_encoder = LabelEncoder()
df["demand_level_encoded"] = demand_encoder.fit_transform(df["demand_level"])

X_clf = X_reg
y_clf = df["demand_level_encoded"]

# Split
X_train_clf, X_test_clf, y_train_clf, y_test_clf = train_test_split(
    X_clf, y_clf, test_size=0.2, random_state=42
)

# Train classifier
clf_model = RandomForestClassifier(n_estimators=100, random_state=42)
clf_model.fit(X_train_clf, y_train_clf)

# Predict
y_pred_clf = clf_model.predict(X_test_clf)

# Accuracy
acc = accuracy_score(y_test_clf, y_pred_clf)

print("\nDemand Prediction Model Trained")
print("Accuracy:", acc)

# Save model
joblib.dump(clf_model, "demand_prediction_model.pkl")

# ===============================
# 5. SAVE ENCODERS
# ===============================

joblib.dump(label_encoders, "label_encoders.pkl")
joblib.dump(demand_encoder, "demand_encoder.pkl")

print("\nAll Models Saved Successfully!")