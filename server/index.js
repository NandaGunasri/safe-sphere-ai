const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());

const dbPath = path.join(__dirname, 'data', 'db.json');

// Helper to read DB
const readDB = () => {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return { reports: [], sos_events: [] };
  }
};

// Helper to write DB
const writeDB = (data) => {
  const dir = path.join(__dirname, 'data');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
};

// Haversine formula to calculate distance between two coordinates in km
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity;
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// GET /reports
// Optional query params: ?lat=20.59&lng=78.96
app.get('/reports', (req, res) => {
  const db = readDB();
  const { lat, lng } = req.query;

  if (lat && lng) {
    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const nearbyReports = db.reports.filter(report => {
      const dist = getDistanceFromLatLonInKm(userLat, userLng, report.latitude, report.longitude);
      return dist <= 1.0; // within 1km radius
    });
    return res.json(nearbyReports);
  }

  res.json(db.reports);
});

// POST /report
app.post('/report', (req, res) => {
  const { userId, category, description, latitude, longitude } = req.body;
  if (!category || !description) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const db = readDB();
  const newReport = {
    _id: Date.now().toString(),
    userId: userId || 'ANONYMOUS',
    category,
    description,
    latitude: latitude || null,
    longitude: longitude || null,
    status: 'Submitted',
    timestamp: new Date().toISOString()
  };

  db.reports.push(newReport);
  writeDB(db);
  res.status(201).json({ message: 'Report submitted successfully', report: newReport });
});

// GET /danger-score
app.get('/danger-score', (req, res) => {
  const db = readDB();
  const now = new Date();
  
  // Filter for recent reports (last 2 hours)
  const recentReports = db.reports.filter(r => {
    const reportTime = new Date(r.timestamp);
    return (now - reportTime) <= (2 * 60 * 60 * 1000);
  });

  const recentSOS = db.sos_events.filter(s => {
    const sosTime = new Date(s.timestamp);
    return (now - sosTime) <= (2 * 60 * 60 * 1000);
  });

  // Calculate based on number of recent reports and SOS events
  const calculatedScore = (recentReports.length * 20) + (recentSOS.length * 30);
  const score = Math.min(100, calculatedScore);
  
  let level = "LOW";
  if (score >= 80) level = "HIGH";
  else if (score >= 40) level = "MEDIUM";

  res.json({ score, level });
});

// GET /ai-prediction
app.get('/ai-prediction', (req, res) => {
  const db = readDB();
  const now = new Date();
  const currentHour = now.getHours();
  
  const recentReports = db.reports.filter(r => {
    const reportTime = new Date(r.timestamp);
    return (now - reportTime) <= (2 * 60 * 60 * 1000);
  });

  const isNight = currentHour >= 20 || currentHour <= 5;
  const riskScore = Math.min(100, (recentReports.length * 20) + (isNight ? 20 : 0));

  let insight = "AI predicts stable conditions.";
  if (riskScore >= 80) insight = "AI predicts increased risk based on recent reports.";
  else if (riskScore >= 40) insight = "AI predicts moderate risk in the area.";

  res.json({ predictedScore: riskScore, insight });
});

// POST /sos
app.post('/sos', (req, res) => {
  const { userId, latitude, longitude } = req.body;
  const db = readDB();

  const sosEvent = {
    _id: Date.now().toString(),
    userId: userId || 'ANONYMOUS',
    latitude: latitude || null,
    longitude: longitude || null,
    timestamp: new Date().toISOString()
  };

  db.sos_events.push(sosEvent);

  writeDB(db);
  res.status(201).json({ message: 'SOS Event Logged', event: sosEvent });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
