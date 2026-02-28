from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load trained model
model = joblib.load("parking_availability_model.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    features = np.array([[
        data["day_of_week"],
        data["hour_of_day"],
        data["month"],
        data["location"],
        data["weather"],
        data["event_type"],
        data["traffic_level"],
        data["total_slots"],
        data["price_per_hour_inr"]
    ]])

    prediction = model.predict(features)

    return jsonify({
        "predicted_available_slots": float(prediction[0])
    })

if __name__ == "__main__":
    app.run(port=5000)