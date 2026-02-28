import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map clicks for destination selection
const LocationMarker = ({ position, setPosition, onLocationSelected }) => {
    useMapEvents({
        click(e) {
            const newPos = { lat: e.latlng.lat, lng: e.latlng.lng };
            setPosition(newPos);
            if (onLocationSelected) {
                onLocationSelected(newPos);
            }
        },
    });

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
};

// Component to recenter the map when user location is found
const RecenterMap = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, 13);
        }
    }, [center, map]);
    return null;
};

const MapSelector = ({ initialCenter, onLocationSelected, height = "300px" }) => {
    // Default to Chennai if initialCenter is not provided
    const defaultCenter = { lat: 13.0827, lng: 80.2707 };
    const center = initialCenter || defaultCenter;

    const [position, setPosition] = useState(initialCenter);

    // Update pin if initial center changes (e.g., GPS loads late)
    useEffect(() => {
        if (initialCenter && !position) {
            setPosition(initialCenter);
        }
    }, [initialCenter])

    return (
        <div className="w-full relative rounded-xl overflow-hidden shadow-sm border border-slate-200">
            <MapContainer
                center={center}
                zoom={13}
                style={{ height, width: '100%', zIndex: 10 }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker
                    position={position}
                    setPosition={setPosition}
                    onLocationSelected={onLocationSelected}
                />
                {initialCenter && <RecenterMap center={initialCenter} />}
            </MapContainer>

            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[20] bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md text-sm font-medium text-slate-700 pointer-events-none border border-slate-200">
                Tap anywhere to set your destination
            </div>
        </div>
    );
};

export default MapSelector;
