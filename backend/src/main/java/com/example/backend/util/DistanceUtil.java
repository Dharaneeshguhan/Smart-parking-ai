package com.example.backend.util;

public class DistanceUtil {

    private static final int EARTH_RADIUS_KM = 6371;

    /**
     * Calculates the distance between two points on the Earth's surface using the Haversine formula.
     *
     * @param lat1 Latitude of the first point in degrees
     * @param lon1 Longitude of the first point in degrees
     * @param lat2 Latitude of the second point in degrees
     * @param lon2 Longitude of the second point in degrees
     * @return Distance between the two points in kilometers
     */
    public static double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double originLat = Math.toRadians(lat1);
        double destinationLat = Math.toRadians(lat2);

        double a = Math.pow(Math.sin(dLat / 2), 2) + Math.pow(Math.sin(dLon / 2), 2) * Math.cos(originLat) * Math.cos(destinationLat);
        double c = 2 * Math.asin(Math.sqrt(a));

        return EARTH_RADIUS_KM * c;
    }
}
