const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const dbPath = path.join(__dirname, 'data', 'db.json');

// Helper to read DB
const readDB = () => {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return { reports: [], sos_events: [], dangerScore: 30 };
  }
};

// Helper to write DB
const writeDB = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
};

// GET /reports
app.get('/reports', (req, res) => {
  const db = readDB();
  res.json(db.reports);
});

// POST /report
app.post('/report', (req, res) => {
  const { id, category, description, location } = req.body;
  if (!category || !description) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const db = readDB();
  const newReport = {
    _id: Date.now().toString(),
    userId: id || 'ANONYMOUS',
    category,
    description,
    location: location || 'Unknown',
    status: 'Submitted',
    timestamp: new Date().toISOString()
  };

  db.reports.push(newReport);
  
  // Dynamically slightly increase danger score on report
  db.dangerScore = Math.min(100, db.dangerScore + 5);

  writeDB(db);
  res.status(201).json({ message: 'Report submitted successfully', report: newReport });
});

// GET /danger-score
app.get('/danger-score', (req, res) => {
  const db = readDB();
  const currentHour = new Date().getHours();
  let currentScore = db.dangerScore;

  // Simulate higher risk at night (8 PM to 5 AM)
  if (currentHour >= 20 || currentHour <= 5) {
    currentScore = Math.min(100, currentScore + 20);
  }

  res.json({ score: currentScore });
});

// GET /ai-prediction
app.get('/ai-prediction', (req, res) => {
  const currentHour = new Date().getHours();
  // Simulate prediction
  let predictedScore = 30;
  let insight = "AI predicts stable conditions.";

  if (currentHour >= 18 && currentHour <= 22) {
    predictedScore = 85;
    insight = "AI predicts increased risk after 9 PM. High probability of incidents.";
  } else if (currentHour < 6) {
    predictedScore = 60;
    insight = "AI predicts moderate risk due to late hours.";
  } else {
    predictedScore = 40;
    insight = "AI predicts relatively safe conditions for the next few hours.";
  }

  res.json({ predictedScore, insight });
});

// POST /sos
app.post('/sos', (req, res) => {
  const { id, location } = req.body;
  const db = readDB();

  const sosEvent = {
    _id: Date.now().toString(),
    userId: id || 'ANONYMOUS',
    location: location || 'Unknown',
    timestamp: new Date().toISOString()
  };

  db.sos_events.push(sosEvent);

  // Spikes danger score
  db.dangerScore = Math.min(100, db.dangerScore + 20);

  writeDB(db);
  res.status(201).json({ message: 'SOS Event Logged', event: sosEvent });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
