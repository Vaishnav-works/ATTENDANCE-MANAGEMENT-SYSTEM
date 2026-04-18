/**
 * Calculates the Haversine distance between two sets of coordinates.
 * Returns the distance in meters.
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
};

export const validateGeofence = (studentLat, studentLon, classLat, classLon, radius = 40) => {
  const distance = calculateDistance(studentLat, studentLon, classLat, classLon);
  return {
    isValid: distance <= radius,
    distance,
  };
};
