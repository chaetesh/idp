// source venv/bin/activate
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { spawn } = require("child_process");

const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(bodyParser.json());
app.use(cors());

// Endpoint to predict disease
app.post("/predict", (req, res) => {
  const inputSymptoms = req.body;

  // Validate input
  const requiredFields = [
    "COUGH",
    "MUSCLE_ACHES",
    "TIREDNESS",
    "SORE_THROAT",
    "RUNNY_NOSE",
    "STUFFY_NOSE",
    "FEVER",
    "NAUSEA",
    "VOMITING",
    "DIARRHEA",
    "SHORTNESS_OF_BREATH",
    "DIFFICULTY_BREATHING",
    "LOSS_OF_TASTE",
    "LOSS_OF_SMELL",
    "ITCHY_NOSE",
    "ITCHY_EYES",
    "ITCHY_MOUTH",
    "ITCHY_INNER_EAR",
    "SNEEZING",
    "PINK_EYE",
  ];

  for (let field of requiredFields) {
    if (!(field in inputSymptoms)) {
      return res.status(400).json({ error: `Missing field: ${field}` });
    }
  }

  // Spawn a Python process
  const pythonProcess = spawn("python3", ["predict_model.py"]);

  // Send input to the Python script
  pythonProcess.stdin.write(JSON.stringify(inputSymptoms));
  pythonProcess.stdin.end();

  // Handle output from Python script
  let result = "";
  pythonProcess.stdout.on("data", (data) => {
    result += data.toString();
  });

  // Handle error
  pythonProcess.stderr.on("data", (data) => {
    console.error(`Error: ${data}`);
  });

  // Send the final output
  pythonProcess.on("close", (code) => {
    if (code !== 0) {
      return res
        .status(500)
        .json({ error: "Error executing prediction script." });
    }
    try {
      const output = JSON.parse(result);
      res.json(output);
    } catch (err) {
      res.status(500).json({ error: "Error parsing prediction output." });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
