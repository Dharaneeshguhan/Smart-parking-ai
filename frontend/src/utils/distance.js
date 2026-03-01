/**
 * Calculates the distance between two points on Earth using the Haversine formula.
 * @param {number} lat1 
 * @param {number} lon1 
 * @param {number} lat2 
 * @param {number} lon2 
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 0;

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
};

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

/**
 * Sorts parking slots based on multiple criteria:
 * 1. Distance (ASC)
 * 2. Availability (DESC)
 * 3. Price (ASC)
 */
export const sortParkingSlots = (slots, userLat, userLng) => {
    return [...slots].sort((a, b) => {
        const distA = calculateDistance(userLat, userLng, a.latitude, a.longitude);
        const distB = calculateDistance(userLat, userLng, b.latitude, b.longitude);

        if (distA !== distB) return distA - distB;

        // If distance is equal, check availability (descending)
        if (a.availableSpots !== b.availableSpots) return b.availableSpots - a.availableSpots;

        // If still equal, check price (ascending)
        return a.pricePerHour - b.pricePerHour;
    });
};
