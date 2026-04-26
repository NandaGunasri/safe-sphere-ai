export const getDemoReports = (userLat, userLng) => {
  const now = new Date().getTime();
  
  // Offset a few reports close to the user so the demo works
  return [
    {
      _id: "demo_1",
      category: "Suspicious Activity",
      description: "Person loitering near alleyway.",
      latitude: userLat + 0.001, // ~100m away
      longitude: userLng + 0.001,
      timestamp: new Date(now - 1000 * 60 * 15).toISOString(), // 15 mins ago
      status: "Verified"
    },
    {
      _id: "demo_2",
      category: "Poor Lighting",
      description: "Streetlights are broken in this section.",
      latitude: userLat - 0.003, // ~300m away
      longitude: userLng - 0.002,
      timestamp: new Date(now - 1000 * 60 * 60).toISOString(), // 1 hour ago
      status: "Reported"
    },
    {
      _id: "demo_3",
      category: "Harassment",
      description: "Group of people catcalling passersby.",
      latitude: userLat + 0.005, // ~500m away
      longitude: userLng - 0.004,
      timestamp: new Date(now - 1000 * 60 * 30).toISOString(), // 30 mins ago
      status: "Verified"
    }
  ];
};
