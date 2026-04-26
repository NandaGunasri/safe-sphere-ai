# 🛡️ SafeSphere AI

**SafeSphere AI** is a futuristic, real-time AI-powered safety companion. Designed as a mobile-first web application, it operates as an autonomous risk-prediction engine that dynamically tracks user movement, analyzes nearby incident densities, and provides explainable AI insights to keep users safe in dynamic environments.

![SafeSphere AI Concept](https://img.shields.io/badge/Status-Active-brightgreen) ![React](https://img.shields.io/badge/React-18-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-V3-38B2AC) ![Node.js](https://img.shields.io/badge/Node.js-Backend-green)

---

## 🌟 Key Features

### 🧠 Explainable AI Risk Engine
- **Live Risk Scoring**: Risk isn't just a static number. The engine constantly calculates a dynamic score based on physical distance to incidents, cluster density, and time of day (e.g., night-time penalties).
- **"Why Risk?" Insights**: The system doesn't just warn you; it tells you *why*. Example: `"4 incidents critically close"`, `"High density zone detected"`, `"Night time activity increases risk"`.

### 📍 Real-Time GPS Tracking & Map Intelligence
- **Live Location Engine**: Powered by `navigator.geolocation.watchPosition`, the app continuously reacts to every physical step you take.
- **Dynamic Risk Circles**: The map renders a live 300m safety aura around your location, shifting colors (Green/Yellow/Red) based on immediate local threat models.
- **Visual Heatmaps**: Nearby reports are clustered and color-coded based on density severity to provide immediate visual situational awareness.

### 🚶 Journey Mode
- **Live Route Analysis**: Start a journey to lock in your starting coordinates. The app tracks the distance traveled in real-time while actively monitoring the route ahead.
- **Intelligent Direction Guidance**: If you walk into a high-risk zone, the app immediately triggers an alert: *"⚠️ Danger ahead. ➡️ Move to safer direction."*

### 🚨 Smart Alert System & SOS
- **Continuous Change Detection**: Automatically flashes non-intrusive popup alerts if the background risk level begins rising.
- **Instant SOS**: A single-tap emergency button that immediately logs a high-priority distress signal mapped to your exact GPS coordinates.

### 🎭 Automated Demo Mode
- **Never Empty**: If the backend is unavailable or the user is in a completely clear zone, the system intelligently injects realistic, localized demo data relative to the user's GPS coordinates to demonstrate the AI engine in action.

---

## 💻 Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Lucide React (Icons).
- **Map Engine**: Leaflet.js (`react-leaflet`) integrated with OpenStreetMap tiles.
- **Backend**: Node.js, Express.js.
- **Data Persistence**: File-system based JSON store (`db.json`) optimized for high-speed, lightweight geospatial polling.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/safe-sphere-ai.git
cd safe-sphere-ai
```

### 2. Start the Backend Server
The backend handles the persistent storage of reports and SOS logs.
```bash
cd server
npm install
npm run dev
```
*(The server runs on `http://localhost:5000` by default).*

### 3. Start the Frontend Client
In a new terminal window, boot up the React application.
```bash
cd client
npm install
npm run dev
```

### 4. Experience SafeSphere AI
Open your browser and navigate to the local Vite URL (e.g., `http://localhost:5173`). 
*Note: Make sure to **allow Location Permissions** when prompted, as the AI engine relies heavily on real-time GPS coordinates.*

---

## 📁 Architecture Overview

```text
safe-sphere-ai/
├── client/
│   ├── src/
│   │   ├── components/       # Reusable UI (AlertPopup, Navigation)
│   │   ├── hooks/            # Custom logic (useLocation tracking engine)
│   │   ├── pages/            # Core Views (Dashboard, MapView, Journey, Report)
│   │   ├── utils/            # Math logic (riskEngine, distance Haversine, demoData)
│   │   └── App.jsx           # Main Application Router
├── server/
│   ├── index.js              # Express API (GET/POST /reports, /sos)
│   ├── db.json               # Local database file
│   └── package.json
└── README.md
```

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!
Feel free to check [issues page](#) if you want to contribute.

## 📝 License
This project is licensed under the MIT License - see the LICENSE file for details.
