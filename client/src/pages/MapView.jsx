import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { API_BASE_URL } from '../config';
import useLocation from '../hooks/useLocation';
import { getDistanceFromLatLonInKm } from '../utils/distance';
import AlertPopup from '../components/AlertPopup';
import { calculateAdvancedRisk } from '../utils/riskEngine';
import { getDemoReports } from '../utils/demoData';

// Fix for default Leaflet markers in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const getMarkerIcon = (color) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const icons = {
  green: getMarkerIcon('green'),
  yellow: getMarkerIcon('gold'),
  red: getMarkerIcon('red')
};

// Custom user location icon (pulsing dot)
const userIcon = L.divIcon({
  className: 'custom-user-icon',
  html: `<div class="relative flex items-center justify-center w-6 h-6">
           <div class="absolute inset-0 bg-neon-blue/40 rounded-full animate-ping"></div>
           <div class="w-4 h-4 bg-neon-blue rounded-full border-2 border-white shadow-[0_0_15px_#00f3ff]"></div>
         </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

// Component to recenter map when location changes
function RecenterAutomatically({lat, lng}) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
}

export default function MapView() {
  const [isNight, setIsNight] = useState(new Date().getHours() >= 18 || new Date().getHours() < 6);
  const [reports, setReports] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [risk, setRisk] = useState(0);
  const [prevRisk, setPrevRisk] = useState(0);
  const [alertText, setAlertText] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const { location, error, loading } = useLocation();

  useEffect(() => {
    let interval;
    const fetchReports = async () => {
      if (!location) return;
      try {
        const response = await fetch(`${API_BASE_URL}/reports?lat=${location[0]}&lng=${location[1]}`);
        const data = await response.json();
        
        console.log("Location:", location);
        console.log("Reports:", data);
        
        // Filter ONLY recent reports (last 2 hours)
        const now = new Date();
        const recentData = data.filter(r => {
          const rTime = new Date(r.timestamp);
          return (now - rTime) <= (2 * 60 * 60 * 1000);
        });

        // Demo fallback
        let finalData = recentData;
        if (finalData.length === 0) {
          finalData = getDemoReports(location[0], location[1]);
        }
        
        setReports(finalData);

        const { score, nearbyReports } = calculateAdvancedRisk(location[0], location[1], finalData);

        setPrevRisk(risk);
        setRisk(score);

      } catch (err) {
        console.error("Error fetching map reports:", err);
      } finally {
        setFetching(false);
      }
    };
    
    fetchReports();
    // Auto-refresh every 5 seconds
    interval = setInterval(fetchReports, 5000);
    return () => clearInterval(interval);
  }, [location, loading]);

  if (!location) {
    return <div className="h-screen w-full flex items-center justify-center bg-[#111] text-neon-blue">Loading map...</div>;
  }

  const safeLocation = location || [20.5937, 78.9629];

  const isHighRisk = risk > 60 || reports.filter(r => {
    if (r.latitude && r.longitude) {
      return getDistanceFromLatLonInKm(location[0], location[1], r.latitude, r.longitude) <= 1.0;
    }
    return false;
  }).length >= 3;
  const isRiskRising = risk > prevRisk;

  let alertMessage = "";
  if (isHighRisk) alertMessage = "⚠️ Unsafe area ahead";
  else if (isRiskRising) alertMessage = "🚨 Risk level rising";

  // Trigger popup when risk increases or reaches high risk newly
  useEffect(() => {
    if (!loading && (isHighRisk || isRiskRising)) {
      if (isHighRisk) setAlertText("⚠️ Unsafe area ahead. ➡️ Move to safer direction");
      else if (isRiskRising) setAlertText("🚨 Risk level rising");
      setAlertVisible(true);
    }
  }, [risk, isHighRisk, isRiskRising, loading]);

  return (
    <div className="h-screen w-full relative overflow-hidden fade-in bg-[#111]">
      <AlertPopup message={alertText} visible={alertVisible} onClose={() => setAlertVisible(false)} />
      
      {/* Map Container */}
      <div className="absolute inset-0 z-0">
        <div style={{ height: "100vh", width: "100%" }}>
          <MapContainer center={safeLocation} zoom={15} style={{ height: "100%", width: "100%" }} zoomControl={false}>
            <RecenterAutomatically lat={safeLocation[0]} lng={safeLocation[1]} />
            
            <TileLayer 
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
              attribution='&copy; OpenStreetMap'
            />
            
            <Marker position={safeLocation} icon={userIcon}>
              <Popup><span className="font-bold">You are here</span></Popup>
            </Marker>
            
            {/* User Risk Circle */}
            <Circle 
              center={safeLocation} 
              radius={300} 
              pathOptions={{ 
                color: risk >= 80 ? '#ff3366' : risk >= 40 ? '#ffea00' : '#39ff14', 
                fillColor: risk >= 80 ? '#ff3366' : risk >= 40 ? '#ffea00' : '#39ff14', 
                fillOpacity: 0.1, 
                weight: 2 
              }}
            />

            {reports.map((report, idx) => {
              if (!report.latitude || !report.longitude) return null;

              // Calculate local density
              let localReports = 0;
              reports.forEach(r => {
                if (r.latitude && r.longitude) {
                  const dist = getDistanceFromLatLonInKm(report.latitude, report.longitude, r.latitude, r.longitude);
                  if (dist <= 0.5) localReports++; // 500m radius
                }
              });

              let iconColor = 'green';
              let circleColor = '#39ff14';
              if (localReports >= 3) {
                iconColor = 'red';
                circleColor = '#ff3366';
              } else if (localReports === 2) {
                iconColor = 'yellow';
                circleColor = '#ffea00';
              }

              return (
                <React.Fragment key={report._id || idx}>
                  <Circle 
                    center={[report.latitude, report.longitude]} 
                    radius={150} 
                    pathOptions={{ color: circleColor, fillColor: circleColor, fillOpacity: 0.15, weight: 1 }}
                  />
                  <Marker 
                    position={[report.latitude, report.longitude]}
                    icon={icons[iconColor]}
                  >
                    <Popup>
                      <div className="text-black font-sans">
                        <h3 className="font-bold text-sm">{report.category}</h3>
                        <p className="text-xs">{report.description}</p>
                        <p className="text-[10px] text-gray-500 mt-1">{new Date(report.timestamp).toLocaleString()}</p>
                      </div>
                    </Popup>
                  </Marker>
                </React.Fragment>
              );
            })}
          </MapContainer>
        </div>
      </div>

      {/* Overlays to keep the stylistic blur */}
      <div className="absolute inset-0 pointer-events-none z-0 mix-blend-overlay">
        <div className={`absolute top-1/3 left-1/4 w-96 h-96 rounded-full blur-[100px] transition-all duration-1000 ${isNight ? 'bg-neon-red/20' : 'bg-neon-yellow/10'}`} />
        <div className={`absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-[80px] transition-all duration-1000 ${isNight ? 'bg-neon-blue/20' : 'bg-neon-green/10'}`} />
      </div>

      {/* Floating Header Actions */}
      <div className="absolute top-12 left-4 right-4 flex justify-between items-center z-10 pointer-events-auto">
        <div className="glass-card px-4 py-2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neon-green shadow-[0_0_8px_#39ff14] animate-pulse" />
          <span className={`text-sm font-semibold text-white drop-shadow-md`}>Live GPS</span>
        </div>

        <button 
          onClick={() => setIsNight(!isNight)}
          className="glass-card p-3 rounded-full hover:bg-white/10 transition flex items-center justify-center border border-white/20 bg-black/50"
        >
          {isNight ? <Moon size={20} className="text-neon-blue" /> : <Sun size={20} className="text-yellow-500" />}
        </button>
      </div>

      {/* Warning Overlay Box */}
      {(isHighRisk || isRiskRising) && (
        <div className="absolute top-28 left-4 right-4 glass-card bg-neon-red/10 border-neon-red/30 p-4 border flex items-start gap-3 fade-in z-10 pointer-events-auto backdrop-blur-md">
          <span className="text-2xl">{isHighRisk ? '⚠️' : '🚨'}</span>
          <div>
            <h4 className="text-neon-red font-bold text-sm mb-1">{alertMessage}</h4>
            <p className="text-white/80 text-xs">
              {reports.length} recent incidents reported nearby.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
