import sys
import pandas as pd
import json
import joblib

# Load the model
loaded_pipeline = joblib.load("multioutput_classifier.joblib")
loaded_scaler = loaded_pipeline["scaler"]
loaded_classifier = loaded_pipeline["classifier"]

# Read input from Node.js
input_data = json.loads(sys.stdin.read())

# Convert input to DataFrame
input_df = pd.DataFrame([input_data])

# Scale the input
input_scaled = loaded_scaler.transform(input_df)

# Predict
predictions = loaded_classifier.predict(input_scaled)

# Target columns (ensure this matches training columns)
target_columns = ["TYPE", "Seasons", "Precautions"]

# Format output
output = {column: prediction for column,
          prediction in zip(target_columns, predictions[0])}

# Return the output as JSON
print(json.dumps(output))
