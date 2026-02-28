import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;

const createIcon = (color) => {
    return new L.Icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
};

const icons = {
    user: createIcon('blue'),
    destination: createIcon('red'),
    parking: createIcon('green'),
    best: createIcon('yellow')
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

// Component to recenter the map
const RecenterMap = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, map.getZoom());
        }
    }, [center, map]);
    return null;
};

const ParkingMap = ({
    userLocation,
    destinationLocation,
    parkingSpots,
    bestSlotId,
    onDestinationSelected,
    height = "400px"
}) => {
    const defaultCenter = { lat: 13.0827, lng: 80.2707 };
    const center = userLocation || defaultCenter;

    return (
        <div className="w-full relative rounded-xl overflow-hidden shadow-lg border border-slate-200">
            <MapContainer
                center={center}
                zoom={13}
                style={{ height, width: '100%', zIndex: 10 }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* User Location Marker */}
                {userLocation && (
                    <Marker position={userLocation} icon={icons.user}>
                        <Popup>Your Location</Popup>
                    </Marker>
                )}

                {/* Destination Marker */}
                {destinationLocation && (
                    <Marker position={destinationLocation} icon={icons.destination}>
                        <Popup>Destination</Popup>
                    </Marker>
                )}

                {/* Parking Markers */}
                {parkingSpots.map((spot) => {
                    const isBest = spot.id === bestSlotId;
                    return (
                        <Marker
                            key={spot.id}
                            position={{ lat: spot.latitude, lng: spot.longitude }}
                            icon={isBest ? icons.best : icons.parking}
                            className={isBest ? 'best-marker-glow' : ''}
                        >
                            <Popup>
                                <div className="p-1">
                                    <h3 className="font-bold text-slate-900">{spot.name}</h3>
                                    {isBest && <p className="text-yellow-600 font-bold text-xs uppercase mb-1">⭐ BEST MATCH</p>}
                                    <p className="text-xs text-slate-600">{spot.address}</p>
                                    <div className="mt-2 flex justify-between items-center border-t pt-2">
                                        <span className="font-bold text-primary-600">${spot.pricePerHour}/hr</span>
                                        <span className="text-xs bg-slate-100 px-2 py-0.5 rounded">{spot.distance} km</span>
                                    </div>
                                    <p className="text-[10px] mt-1 text-slate-400">Traffic: {spot.trafficLevel}</p>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}

                <MapClickHandler onLocationSelected={onDestinationSelected} />
                <RecenterMap center={userLocation} />
            </MapContainer>

            {!destinationLocation && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[20] bg-white/95 backdrop-blur-sm px-6 py-2 rounded-full shadow-xl text-sm font-semibold text-slate-800 pointer-events-none border border-primary-100 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                    Click on the map to set your destination
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                .best-marker-glow {
                    filter: drop-shadow(0 0 10px rgba(234, 179, 8, 0.8));
                    animation: marker-pulse 2s infinite ease-in-out;
                }
                @keyframes marker-pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }
            `}} />
        </div>
    );
};

export default ParkingMap;
