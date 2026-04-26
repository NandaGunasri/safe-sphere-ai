import { getDistanceFromLatLonInKm } from './distance';

export function calculateAdvancedRisk(userLat, userLng, reports) {
  let score = 0;
  let reasons = [];
  
  let nearbyCount = 0;
  let closeCount = 0;
  let veryCloseCount = 0;

  // 1. Distance & Density scoring
  reports.forEach(r => {
    if (r.latitude && r.longitude) {
      const dist = getDistanceFromLatLonInKm(userLat, userLng, r.latitude, r.longitude);
      
      if (dist <= 1.0) {
        nearbyCount++;
        
        if (dist <= 0.2) {
          score += 25;
          veryCloseCount++;
        } else if (dist <= 0.5) {
          score += 15;
          closeCount++;
        } else {
          score += 8;
        }
      }
    }
  });

  if (nearbyCount > 0) {
    if (veryCloseCount > 0) {
      reasons.push(`${veryCloseCount} incident(s) critically close`);
    } else if (closeCount > 0) {
      reasons.push(`${closeCount} incident(s) in proximity`);
    } else {
      reasons.push(`${nearbyCount} incidents reported within 1km`);
    }
  }

  // Density Bonus
  if (nearbyCount >= 3) {
    score += 20;
    reasons.push("High density zone detected");
  }

  // 2. Time-Based scoring
  const currentHour = new Date().getHours();
  const isNight = currentHour >= 20 || currentHour < 5;
  
  if (isNight) {
    score += 15;
    reasons.push("Night time activity increases risk");
  }

  // Base state explanation
  if (score === 0) {
    reasons.push("Area appears safe and clear");
  }

  // Final score clamping
  const finalScore = Math.min(100, score);

  return {
    score: finalScore,
    reasons: reasons,
    nearbyReports: nearbyCount
  };
}
