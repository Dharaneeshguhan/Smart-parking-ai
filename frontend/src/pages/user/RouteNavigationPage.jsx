import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
    ArrowLeft,
    Navigation,
    MapPin,
    Clock,
    Zap as RouteIcon,
    Info,
    AlertCircle,
    Loader2,
    ExternalLink
} from 'lucide-react';
import Button from '../../components/Button';
import useGeolocation from '../../hooks/useGeolocation';
import { calculateDistance } from '../../utils/distance';
import { parkingAPI } from '../../services/api';

// Fix for default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;

const createMarkerIcon = (color) => {
    return new L.Icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
    });
};

const icons = {
    start: createMarkerIcon('green'),
    end: createMarkerIcon('red')
};

// Component to auto-fit the map to include both markers and the route
const MapBoundsHandler = ({ routeCoords, start, end }) => {
    const map = useMap();

    useEffect(() => {
        if (routeCoords && routeCoords.length > 0) {
            const bounds = L.latLngBounds(routeCoords);
            map.fitBounds(bounds, { padding: [50, 50], animate: true });
        } else if (start && end) {
            const bounds = L.latLngBounds([start, end]);
            map.fitBounds(bounds, { padding: [100, 100], animate: true });
        }
    }, [map, routeCoords, start, end]);

    return null;
};

const RouteNavigationPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { parkingId } = useParams();

    const state = location.state || {};
    const defaultCoords = { lat: 10.827247, lng: 77.059452 };

    const [route, setRoute] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({ distance: 0, duration: 0 });

    const [fetchedDestination, setFetchedDestination] = useState(null);
    const [routeInitialized, setRouteInitialized] = useState(false);
    const { location: currentGeoLocation } = useGeolocation();
    const lastFetchedRef = useRef(null);

    // Fetch missing destination data if needed
    useEffect(() => {
        if (!state.destLat && parkingId) {
            const fetchDest = async () => {
                try {
                    const response = await parkingAPI.getParkingDetails(parkingId);
                    setFetchedDestination(response.data);
                } catch (e) {
                    console.error("Failed to fetch destination details:", e);
                }
            };
            fetchDest();
        }
    }, [parkingId, state.destLat]);

    const start = useMemo(() => {
        // Prefer live GPS if available
        if (currentGeoLocation && currentGeoLocation.lat != null) {
            return { lat: currentGeoLocation.lat, lng: currentGeoLocation.lng };
        }

        // Use state-passed coordinates if provided (strictly check not null/undefined)
        if (state.startLat != null && state.startLng != null) {
            return { lat: state.startLat, lng: state.startLng };
        }

        // Ultimate fallback
        return defaultCoords;
    }, [currentGeoLocation, state.startLat, state.startLng]);

    const destination = useMemo(() => {
        const lat = state.destLat ?? fetchedDestination?.latitude ?? defaultCoords.lat;
        const lng = state.destLng ?? fetchedDestination?.longitude ?? defaultCoords.lng;
        const name = state.parkingName || fetchedDestination?.name || 'Parking Slot';

        return { lat, lng, name };
    }, [state.destLat, state.destLng, state.parkingName, fetchedDestination]);

    const fetchRoute = useCallback(async () => {
        if (!start.lat || !start.lng || !destination.lat || !destination.lng) {
            console.log("[Route] Waiting for valid coordinates...", { start, destination });
            return;
        }

        // Validate coordinates are valid numbers
        if (isNaN(start.lat) || isNaN(start.lng) || isNaN(destination.lat) || isNaN(destination.lng)) {
            console.error("[Route] Invalid coordinates detected:", { start, destination });
            setError('Invalid coordinates. Please try again.');
            return;
        }

        // Validate coordinate ranges
        if (Math.abs(start.lat) > 90 || Math.abs(destination.lat) > 90 || 
            Math.abs(start.lng) > 180 || Math.abs(destination.lng) > 180) {
            console.error("[Route] Coordinates out of range:", { start, destination });
            setError('Coordinates out of range. Please try again.');
            return;
        }

        console.log("[Route] Fetching route with coordinates:", { start, destination });

        setLoading(true);
        setError(null);
        try {
            // OSRM expects [lng,lat]
            const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;

            console.log("[Route] OSRM URL:", url);
            const response = await fetch(url);
            const data = await response.json();

            console.log("[Route] OSRM Response:", data);
            console.log("[Route] Response code:", data.code);
            console.log("[Route] Routes array:", data.routes);
            console.log("[Route] First route:", data.routes?.[0]);

            if (data.code !== 'Ok') {
                throw new Error(data.message || 'Routing failed');
            }

            if (!data.routes || data.routes.length === 0) {
                throw new Error('No routes found');
            }

            const routeData = data.routes[0];
            console.log("[Route] Route data details:", {
                distance: routeData.distance,
                duration: routeData.duration,
                distanceKm: routeData.distance / 1000,
                durationMin: routeData.duration / 60,
                geometry: routeData.geometry,
                coordinates: routeData.geometry?.coordinates?.length
            });
            // GeoJSON stores as [lng, lat], Leaflet needs [lat, lng]
            const coords = routeData.geometry.coordinates.map(coord => [coord[1], coord[0]]);

            console.log("[Route] Route data:", { 
                distance: routeData.distance, 
                duration: routeData.duration,
                coordsCount: coords.length 
            });

            // Check if the route distance is too small (might indicate an error)
            if (routeData.distance < 10) { // Less than 10 meters
                console.warn("[Route] Route distance seems too small, calculating direct distance");
                const directDistance = calculateDistance(start.lat, start.lng, destination.lat, destination.lng);
                const estimatedDuration = Math.round((directDistance / 50) * 60); // Assuming 50 km/h average speed
                
                const finalStats = {
                    distance: directDistance.toFixed(2),
                    duration: estimatedDuration
                };
                console.log("[Route] Using direct distance stats:", finalStats);
                setStats(finalStats);
            } else {
                // Calculate duration in minutes, but show more precision for short routes
                const durationMinutes = routeData.duration / 60;
                let displayDuration;
                
                if (durationMinutes < 1) {
                    // For routes less than 1 minute, show "Less than 1 min"
                    displayDuration = 1;
                } else {
                    // For longer routes, round to nearest minute
                    displayDuration = Math.round(durationMinutes);
                }
                
                const finalStats = {
                    distance: (routeData.distance / 1000).toFixed(2), // KM
                    duration: displayDuration // Minutes
                };
                console.log("[Route] Using OSRM stats:", finalStats, `(raw: ${durationMinutes.toFixed(2)} minutes)`);
                setStats(finalStats);
            }

            setRoute(coords);
        } catch (err) {
            console.error('OSRM Error:', err);
            setError('Could not calculate route. Using direct view.');
        } finally {
            setLoading(false);
        }
    }, [start, destination]);

    useEffect(() => {
        // Only fetch if we haven't initialized the route yet, OR if user moved significantly
        if (!routeInitialized && !loading && start.lat && destination.lat) {
            console.log("[Route] First time initialization");
            fetchRoute();
            setRouteInitialized(true);
            lastFetchedRef.current = start;
            return;
        }

        // After initialization, only re-fetch if user moved more than 50 meters
        if (routeInitialized && !loading) {
            const distMoved = lastFetchedRef.current
                ? calculateDistance(start.lat, start.lng, lastFetchedRef.current.lat, lastFetchedRef.current.lng)
                : 0;

            console.log("[Route] Distance moved:", distMoved, "meters");

            if (distMoved > 0.05 && start.lat && destination.lat) { // 50 meters
                console.log("[Route] User moved significantly, refetching route");
                fetchRoute();
                lastFetchedRef.current = start;
            }
        }
    }, [start, destination, fetchRoute, routeInitialized, loading]);

    // Log stats changes for debugging (can be removed in production)
    // useEffect(() => {
    //     console.log("[Route] Stats updated:", stats);
    // }, [stats]);

    return (
        <div className="relative h-screen w-full flex flex-col overflow-hidden bg-slate-50">
            {/* Header / Back Button */}
            <div className="absolute top-6 left-6 z-[1000]">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-slate-200 hover:bg-white transition-all transform hover:scale-105 active:scale-95 text-slate-700 font-bold text-sm"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Booking
                </button>
            </div>

            {/* Navigation Info Card */}
            <div className="absolute top-20 left-6 z-[1000] w-full max-w-[calc(100%-48px)] sm:w-80">
                <div className="bg-white/95 backdrop-blur-lg p-5 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/20">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-primary-100 rounded-xl text-primary-600">
                            <Navigation className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider leading-tight">Live Navigation</h2>
                            <p className="text-[10px] font-bold text-slate-400 truncate w-48 italic">To: {destination.name}</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-6">
                            <Loader2 className="h-6 w-6 text-primary-600 animate-spin" />
                            <span className="ml-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Calculating...</span>
                        </div>
                    ) : error ? (
                        <div className="bg-amber-50 border border-amber-100 p-3 rounded-2xl flex items-center gap-3">
                            <AlertCircle className="h-4 w-4 text-amber-500" />
                            <p className="text-[10px] font-bold text-amber-700 leading-tight">{error}</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col items-center">
                                    <RouteIcon className="h-4 w-4 text-blue-500 mb-1" />
                                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">Distance</span>
                                    <span className="text-sm font-black text-slate-700">{stats.distance} km</span>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col items-center">
                                    <Clock className="h-4 w-4 text-emerald-500 mb-1" />
                                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">Duration</span>
                                    <span className="text-sm font-black text-slate-700">{stats.duration} min</span>
                                </div>
                            </div>

                            <div className="pt-2">
                                <Button
                                    className="w-full rounded-2xl flex items-center justify-center gap-2 py-3"
                                    onClick={() => window.open(`http://maps.google.com/maps?saddr=${start.lat},${start.lng}&daddr=${destination.lat},${destination.lng}`)}
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    <span className="text-xs font-black uppercase tracking-widest">External Navigation</span>
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Map Container */}
            <div className="h-screen w-full z-0">
                {start.lat != null && start.lng != null && (
                    <MapContainer
                        center={[start.lat, start.lng]}
                        zoom={15}
                        style={{ height: '100%', width: '100%' }}
                        zoomControl={false}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {/* Start Marker */}
                        <Marker position={[start.lat, start.lng]} icon={icons.start}>
                            <Popup>
                                <div className="text-xs font-bold text-center">Your Location</div>
                            </Popup>
                        </Marker>

                        {/* Destination Marker */}
                        <Marker position={[destination.lat, destination.lng]} icon={icons.end}>
                            <Popup>
                                <div className="text-xs font-bold text-center">
                                    <p className="text-primary-600 uppercase tracking-widest text-[8px] mb-1">Destination</p>
                                    {destination.name}
                                </div>
                            </Popup>
                        </Marker>

                        {/* Route Polyline */}
                        {route && (
                            <Polyline
                                positions={route}
                                pathOptions={{
                                    color: '#3b82f6',
                                    weight: 6,
                                    opacity: 0.8,
                                    lineJoin: 'round',
                                    lineCap: 'round'
                                }}
                            />
                        )}

                        <MapBoundsHandler routeCoords={route} start={[start.lat, start.lng]} end={[destination.lat, destination.lng]} />
                    </MapContainer>
                )}
            </div>

            {/* Bottom Status (Mobile) */}
            <div className="absolute bottom-6 left-6 right-6 lg:hidden z-[1000] pointer-events-none">
                <div className="bg-slate-900/90 backdrop-blur-md text-white px-6 py-4 rounded-[2rem] flex items-center justify-between shadow-2xl border border-white/10 pointer-events-auto">
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-emerald-400" />
                            <span className="text-sm font-black">{stats.duration} min</span>
                        </div>
                        <div className="w-px h-4 bg-white/20 self-center"></div>
                        <div className="flex items-center gap-2">
                            <RouteIcon className="h-4 w-4 text-blue-400" />
                            <span className="text-sm font-black">{stats.distance} km</span>
                        </div>
                    </div>
                    <button className="p-3 bg-primary-600 rounded-full shadow-lg transform active:scale-95 transition-all">
                        <Navigation className="h-5 w-5 fill-current" />
                    </button>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .leaflet-container { font-family: inherit; }
                .leaflet-popup-content-wrapper { border-radius: 1rem; padding: 5px; }
            `}} />
        </div>
    );
};

export default RouteNavigationPage;
