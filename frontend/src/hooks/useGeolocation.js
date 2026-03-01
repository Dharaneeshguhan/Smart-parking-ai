import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Deterministic Geolocation Hook with Fallback Strategy
 * Purpose: Ensures a reliable location is always returned even when GPS 
 * performance is unacceptable (low accuracy, null coordinates, desktop IP).
 */
const useGeolocation = (options = {}) => {
    // 10.827247, 77.059452
    const FALLBACK_COORDS = { lat: 10.827247, lng: 77.059452 };
    const ACCURACY_THRESHOLD = 300; // meters
    const DESKTOP_ACCURACY_THRESHOLD = 100; // meters
    const MAX_RETRIES = 2;

    const [location, setLocation] = useState({
        lat: null,
        lng: null,
        accuracy: null,
        timestamp: null,
        source: 'gps', // "gps" | "fallback"
    });

    const [status, setStatus] = useState('IDLE'); // IDLE, SEARCHING, STABLE, FALLBACK, ERROR
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [permissionStatus, setPermissionStatus] = useState('prompt');

    const watchId = useRef(null);
    const retryCount = useRef(0);
    const isMounted = useRef(true);

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    const switchToFallback = useCallback((reason) => {
        console.warn(`[GPS] Using fallback location due to ${reason}`);
        setLocation({
            ...FALLBACK_COORDS,
            accuracy: 300,
            timestamp: Date.now(),
            source: 'fallback'
        });
        setStatus('FALLBACK');
        setLoading(false);
    }, []);

    const handlePositionUpdate = useCallback((position) => {
        if (!isMounted.current) return;

        const { latitude, longitude, accuracy } = position.coords;

        // 1. Check for (0,0) logic
        if (latitude === 0 && longitude === 0) {
            switchToFallback("invalid (0,0) coordinates");
            return;
        }

        // 2. Desktop Preference Logic
        if (!isMobile && accuracy >= DESKTOP_ACCURACY_THRESHOLD) {
            switchToFallback(`low desktop accuracy (${accuracy.toFixed(1)}m)`);
            return;
        }

        // 3. Low Accuracy Logic (> 300m)
        if (accuracy > ACCURACY_THRESHOLD) {
            if (retryCount.current < MAX_RETRIES) {
                retryCount.current += 1;
                console.log(`[GPS] Low accuracy (${accuracy.toFixed(1)}m). Retry #${retryCount.current}...`);
                return; // Keep trying
            } else {
                switchToFallback(`unacceptable accuracy (${accuracy.toFixed(1)}m) after ${MAX_RETRIES} retries`);
                return;
            }
        }

        // Valid GPS Fix
        setLocation({
            lat: latitude,
            lng: longitude,
            accuracy: accuracy,
            timestamp: position.timestamp,
            source: 'gps'
        });
        setStatus('STABLE');
        setLoading(false);
        retryCount.current = 0;
    }, [isMobile, switchToFallback]);

    const handleError = useCallback((err) => {
        if (!isMounted.current) return;
        console.error(`[GPS] Error (${err.code}): ${err.message}`);

        if (err.code === 1) { // Permission Denied
            setError("Location access denied.");
            switchToFallback("permission denial");
            return;
        }

        if (retryCount.current < MAX_RETRIES) {
            retryCount.current += 1;
            setTimeout(initGeolocation, 1000);
        } else {
            switchToFallback(`GPS error (${err.message})`);
        }
    }, [switchToFallback]);

    const initGeolocation = useCallback(() => {
        if (!navigator.geolocation) {
            setError("Geolocation not supported");
            switchToFallback("unsupported browser");
            return;
        }

        setLoading(true);
        setStatus('SEARCHING');

        const geoOptions = {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0,
            ...options
        };

        // For mobile, we use watchPosition for better stability
        if (isMobile) {
            if (watchId.current) navigator.geolocation.clearWatch(watchId.current);
            watchId.current = navigator.geolocation.watchPosition(
                handlePositionUpdate,
                handleError,
                geoOptions
            );
        } else {
            navigator.geolocation.getCurrentPosition(
                handlePositionUpdate,
                handleError,
                geoOptions
            );
        }
    }, [handleError, handlePositionUpdate, isMobile, options, switchToFallback]);

    useEffect(() => {
        isMounted.current = true;

        // Track permissions
        if (navigator.permissions && navigator.permissions.query) {
            navigator.permissions.query({ name: 'geolocation' }).then((result) => {
                if (isMounted.current) {
                    setPermissionStatus(result.state);
                    result.onchange = () => {
                        if (isMounted.current) setPermissionStatus(result.state);
                    };
                }
            });
        }

        initGeolocation();

        return () => {
            isMounted.current = false;
            if (watchId.current) navigator.geolocation.clearWatch(watchId.current);
        };
    }, []); // Run once on mount

    return {
        location,
        status,
        error,
        loading,
        permissionStatus,
        retry: () => {
            retryCount.current = 0;
            initGeolocation();
        },
        isMobile,
        isLowConfidence: location.accuracy > 300,
        source: location.source
    };
};

export default useGeolocation;
