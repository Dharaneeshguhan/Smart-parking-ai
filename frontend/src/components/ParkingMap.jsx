import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, Circle, Polyline } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, ShieldAlert, Zap, Search, MapPin } from 'lucide-react';

// Fix for default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;

const createIcon = (color) => {
    return new L.Icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
    });
};

const icons = {
    user: createIcon('blue'),
    destination: createIcon('red'),
    parking: createIcon('green'),
    best: createIcon('gold'),
    selected: createIcon('violet')
};

// Component to handle map clicks for destination selection
const MapClickHandler = ({ onLocationSelected }) => {
    useMapEvents({
        click(e) {
            onLocationSelected({ lat: e.latlng.lat, lng: e.latlng.lng });
        },
    });
    return null;
};

const UserInteractionHandler = ({ onInteraction }) => {
    useMapEvents({
        dragstart() { onInteraction(); },
        zoomstart() { onInteraction(); },
        touchstart() { onInteraction(); }
    });
    return null;
};

// Component to handle map view animations with stability logic
const MapViewHandler = ({ center, accuracy, shouldFly }) => {
    const map = useMap();
    const lastFlyAccuracy = useRef(Infinity);
    const initialFixDone = useRef(false);

    useEffect(() => {
        if (!center || !center.lat || !center.lng || !shouldFly) return;

        // Stability Rule: Auto-center ONLY on first fix OR if accuracy improves by > 30%
        const improvement = lastFlyAccuracy.current - accuracy;
        const percentImprovement = (improvement / lastFlyAccuracy.current) * 100;

        if (!initialFixDone.current || percentImprovement > 30 || accuracy < 50) {
            console.log(`[GPS] Auto-centering map (Accuracy: ${accuracy.toFixed(1)}m)`);
            map.flyTo([center.lat, center.lng], map.getZoom() < 16 ? 16 : map.getZoom(), {
                duration: 1.5,
                easeLinearity: 0.25
            });
            lastFlyAccuracy.current = accuracy;
            initialFixDone.current = true;
        }
    }, [center, accuracy, shouldFly, map]);

    return null;
};

const ParkingMap = ({
    userLocation,
    destinationLocation,
    parkingSpots,
    bestSlotId,
    userStatus,
    userSource, // "gps" | "fallback"
    onDestinationSelected,
    onUserLocationChange,
    height = "500px",
    selectedSpotId = null,
    onSpotSelect = () => { }
}) => {
    const navigate = useNavigate();
    const COIMBATORE_CENTER = { lat: 11.0168, lng: 76.9558 };
    const center = (userLocation && userLocation.lat) ? userLocation : COIMBATORE_CENTER;
    const userAccuracy = userLocation?.accuracy || 0;
    const [shouldFly, setShouldFly] = useState(true);

    const markerRef = useRef(null);
    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current;
                if (marker != null) {
                    const newPos = marker.getLatLng();
                    setShouldFly(false);
                    if (onUserLocationChange) {
                        onUserLocationChange({ lat: newPos.lat, lng: newPos.lng });
                    }
                }
            },
        }),
        [onUserLocationChange],
    );

    // Accuracy Visualization Styles
    const getCircleOptions = () => {
        const isLowConfidence = userAccuracy > 500;
        return {
            fillColor: isLowConfidence ? '#94a3b8' : '#3b82f6',
            color: isLowConfidence ? '#64748b' : '#3b82f6',
            weight: 2,
            opacity: 0.5,
            fillOpacity: 0.15,
            dashArray: isLowConfidence ? '10, 10' : null
        };
    };

    const selectedSpot = useMemo(() => {
        return parkingSpots.find(s => s.id === (selectedSpotId || bestSlotId));
    }, [parkingSpots, selectedSpotId, bestSlotId]);

    const routeCoords = useMemo(() => {
        if (!userLocation || !userLocation.lat || !selectedSpot) return null;
        return [[userLocation.lat, userLocation.lng], [selectedSpot.latitude, selectedSpot.longitude]];
    }, [userLocation, selectedSpot]);

    return (
        <div className="w-full relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
            {/* GPS Status Overlay */}
            <div className="absolute top-4 right-4 z-[20] flex flex-col gap-2 pointer-events-none">
                {userStatus === 'REFINING' && (
                    <div className="bg-blue-600/90 backdrop-blur-md text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 animate-pulse">
                        <Zap className="h-4 w-4 fill-current" />
                        <span className="text-xs font-bold uppercase tracking-wider">Refining GPS Precision...</span>
                    </div>
                )}
                {userAccuracy > 500 && (
                    <div className="bg-amber-500/90 backdrop-blur-md text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
                        <Search className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Searching for better signal</span>
                    </div>
                )}
                {userAccuracy > 1000 && (
                    <div className="bg-red-600/90 backdrop-blur-md text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
                        <ShieldAlert className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Low Accuracy detected</span>
                    </div>
                )}
                {userSource === 'fallback' && (
                    <div className="bg-slate-700/90 backdrop-blur-md text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Using approximate location</span>
                    </div>
                )}
            </div>

            <MapContainer
                center={center}
                zoom={14}
                style={{ height, width: '100%', zIndex: 10 }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {userLocation && userLocation.lat && (
                    <>
                        <Marker
                            position={userLocation}
                            icon={icons.user}
                            draggable={true}
                            eventHandlers={eventHandlers}
                            ref={markerRef}
                        >
                            <Popup>
                                <div className="text-center font-bold">You are here</div>
                            </Popup>
                        </Marker>
                        <Circle
                            center={userLocation}
                            radius={userAccuracy}
                            pathOptions={getCircleOptions()}
                        />
                    </>
                )}

                {destinationLocation && <Marker position={destinationLocation} icon={icons.destination} />}

                {parkingSpots.map((spot) => (
                    <Marker
                        key={spot.id}
                        position={{ lat: spot.latitude, lng: spot.longitude }}
                        icon={spot.id === selectedSpotId ? icons.selected : (spot.id === bestSlotId ? icons.best : icons.parking)}
                        eventHandlers={{ click: () => onSpotSelect(spot.id) }}
                    >
                        <Popup>
                            <div className="p-1 min-w-[150px]">
                                <h3 className="font-black text-slate-900 leading-tight">{spot.name}</h3>
                                <p className="text-[10px] text-slate-500 mt-1">{spot.address}</p>
                                <div className="mt-3 grid grid-cols-2 gap-2 border-t pt-2 text-center">
                                    <p className="text-xs font-black text-emerald-600">{spot.predictedAvailableSpots} spots</p>
                                    <p className="text-xs font-black text-blue-600">₹{spot.pricePerHour}/hr</p>
                                </div>
                                <button
                                    onClick={() => navigate(`/user/booking/${spot.id}`)}
                                    className="w-full mt-3 py-1.5 bg-primary-600 text-white text-xs font-bold rounded-lg hover:bg-primary-700 transition-colors"
                                >
                                    Quick Book
                                </button>
                                <button
                                    onClick={() => navigate(`/user/navigate/${spot.id}`, {
                                        state: {
                                            startLat: userLocation.lat,
                                            startLng: userLocation.lng,
                                            destLat: spot.latitude,
                                            destLng: spot.longitude,
                                            parkingName: spot.name
                                        }
                                    })}
                                    className="w-full mt-2 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-wider rounded-xl hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg"
                                >
                                    <Navigation className="h-3 w-3" />
                                    Start Navigation
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {routeCoords && (
                    <Polyline
                        positions={routeCoords}
                        pathOptions={{ color: '#8b5cf6', weight: 4, dashArray: '8, 12', opacity: 0.8 }}
                    />
                )}

                <MapClickHandler onLocationSelected={onDestinationSelected} />
                <UserInteractionHandler onInteraction={() => setShouldFly(false)} />
                <MapViewHandler center={userLocation} accuracy={userAccuracy} shouldFly={shouldFly} />
            </MapContainer>

            {!shouldFly && userLocation?.lat && (
                <button
                    onClick={() => setShouldFly(true)}
                    className="absolute bottom-6 right-6 z-[20] p-4 bg-white/90 backdrop-blur-md hover:bg-white text-primary-600 rounded-2xl shadow-2xl border border-slate-200 transition-all transform hover:scale-110 active:scale-95"
                >
                    <Navigation className="h-6 w-6 stroke-[3]" />
                </button>
            )}

            {!destinationLocation && (
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-[20] bg-white/95 backdrop-blur-md px-8 py-3 rounded-2xl shadow-2xl text-sm font-bold text-slate-800 border border-primary-100 flex items-center gap-3">
                    <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]"></span>
                    Tap map to set destination
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                .leaflet-popup-content-wrapper { border-radius: 20px; border: 1px solid #e2e8f0; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
                .leaflet-container { font-family: 'Inter', system-ui, sans-serif; }
            `}} />
        </div>
    );
};

export default ParkingMap;
