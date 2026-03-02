import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    GoogleMap,
    useJsApiLoader,
    DirectionsService,
    DirectionsRenderer,
    TrafficLayer
} from '@react-google-maps/api';
import {
    Navigation,
    ArrowLeft,
    Clock,
    MapPin,
    TrendingUp,
    Map as MapIcon,
    ChevronRight,
    ExternalLink,
    AlertCircle,
    Loader2
} from 'lucide-react';
import Button from '../../components/Button';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const mapContainerStyle = {
    width: '100%',
    height: '100%'
};

const options = {
    disableDefaultUI: false,
    zoomControl: true,
};

const NavigationPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const routeData = location.state || {};

    useEffect(() => {
        if (!routeData.userLat || !routeData.destinationLat) {
            console.warn("No navigation data detected. Redirecting to search.");
            navigate('/user/search');
        }
    }, [routeData, navigate]);

    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [travelInfo, setTravelInfo] = useState({
        distance: '',
        duration: '',
        steps: []
    });

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: ['places', 'geometry']
    });

    const directionsCallback = useCallback((res) => {
        if (res !== null) {
            if (res.status === 'OK') {
                setResponse(res);
                setTravelInfo({
                    distance: res.routes[0].legs[0].distance.text,
                    duration: res.routes[0].legs[0].duration.text,
                    steps: res.routes[0].legs[0].steps
                });
            } else {
                console.error('Directions request failed:', res.status);
                setError(`Failed to calculate route: ${res.status}`);
            }
        }
    }, []);

    const openInGoogleMaps = () => {
        if (routeData.destinationLat && routeData.destinationLng) {
            const url = `https://www.google.com/maps/dir/?api=1&origin=${routeData.userLat},${routeData.userLng}&destination=${routeData.destinationLat},${routeData.destinationLng}&travelmode=driving`;
            window.open(url, '_blank');
        }
    };

    if (loadError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <h2 className="text-xl font-bold text-slate-800">Map Loading Error</h2>
                <p className="text-slate-600 mt-2">Could not load Google Maps. Please check your API key.</p>
                <Button onClick={() => navigate(-1)} className="mt-6">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Go Back
                </Button>
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
                <Loader2 className="h-12 w-12 text-primary-600 animate-spin mb-4" />
                <p className="text-slate-600 font-bold uppercase tracking-widest text-xs">Initializing Navigation Engine...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-slate-50">
            {/* Sidebar for Directions */}
            <div className="w-full lg:w-96 bg-white shadow-2xl z-20 flex flex-col h-[40vh] lg:h-full border-r border-slate-200">
                <div className="p-6 border-b border-slate-100">
                    <button
                        onClick={() => navigate(-1)}
                        className="mb-4 flex items-center text-slate-500 hover:text-primary-600 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5 mr-1" />
                        <span className="text-sm font-bold uppercase tracking-wider">Back to Search</span>
                    </button>

                    <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none mb-4">
                        SmartPark Navigation
                    </h1>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-primary-50 p-3 rounded-2xl border border-primary-100 text-center">
                            <span className="block text-[8px] font-black text-primary-400 uppercase tracking-widest mb-1">Distance</span>
                            <span className="text-lg font-black text-primary-700">{travelInfo.distance || '--'}</span>
                        </div>
                        <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100 text-center">
                            <span className="block text-[8px] font-black text-emerald-400 uppercase tracking-widest mb-1">Duration</span>
                            <span className="text-lg font-black text-emerald-700">{travelInfo.duration || '--'}</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
                    {error ? (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                            <p className="text-xs font-bold text-red-700">{error}</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <Navigation className="h-4 w-4 text-primary-600" />
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Step-by-Step Guide</h3>
                            </div>

                            {travelInfo.steps.length > 0 ? (
                                travelInfo.steps.map((step, index) => (
                                    <div key={index} className="relative pl-10">
                                        {/* Visual Connector */}
                                        {index !== travelInfo.steps.length - 1 && (
                                            <div className="absolute left-[15px] top-6 bottom-[-24px] w-0.5 bg-slate-100 dot-pattern"></div>
                                        )}

                                        {/* Step Icon Container */}
                                        <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-slate-50 border-2 border-slate-100 flex items-center justify-center z-10">
                                            <span className="text-[10px] font-black text-slate-400">{index + 1}</span>
                                        </div>

                                        <div className="pt-1">
                                            <div
                                                dangerouslySetInnerHTML={{ __html: step.instructions }}
                                                className="text-sm font-bold text-slate-700 leading-tight"
                                            />
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-black uppercase">{step.distance.text}</span>
                                                <ChevronRight className="h-3 w-3 text-slate-300" />
                                                <span className="text-[10px] text-slate-400 font-bold italic">{step.duration.text}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-20 text-center">
                                    <div className="inline-flex p-4 bg-slate-50 rounded-full mb-4">
                                        <MapIcon className="h-8 w-8 text-slate-300 animate-pulse" />
                                    </div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">Calculating your precision route...</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-slate-100 space-y-3 bg-white">
                    <Button
                        className="w-full h-14 rounded-2xl flex items-center justify-center gap-2"
                        onClick={openInGoogleMaps}
                        disabled={!travelInfo.distance}
                    >
                        <ExternalLink className="h-5 w-5" />
                        <span className="font-black uppercase tracking-widest">Open in Apps</span>
                    </Button>
                    <p className="text-center text-[10px] text-slate-400 font-bold italic">
                        Powered by SmartPark Real-time Traffic Intelligence
                    </p>
                </div>
            </div>

            {/* Main Map View */}
            <div className="flex-1 relative bg-slate-200">
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    zoom={14}
                    center={routeData.userLat ? { lat: routeData.userLat, lng: routeData.userLng } : { lat: 11.0168, lng: 76.9558 }}
                    options={options}
                >
                    {routeData.userLat && routeData.destinationLat && !response && (
                        <DirectionsService
                            options={{
                                origin: new google.maps.LatLng(routeData.userLat, routeData.userLng),
                                destination: new google.maps.LatLng(routeData.destinationLat, routeData.destinationLng),
                                travelMode: 'DRIVING',
                                drivingOptions: {
                                    departureTime: new Date(),
                                    trafficModel: 'bestguess'
                                }
                            }}
                            callback={directionsCallback}
                        />
                    )}

                    {response !== null && (
                        <DirectionsRenderer
                            options={{
                                directions: response,
                                polylineOptions: {
                                    strokeColor: '#3b82f6',
                                    strokeWeight: 6,
                                    strokeOpacity: 0.8
                                }
                            }}
                        />
                    )}

                    <TrafficLayer />
                </GoogleMap>

                {/* Floating Route Info Overlay (Mobile Only) */}
                <div className="absolute top-4 left-4 right-4 lg:hidden pointer-events-none">
                    <div className="bg-white/95 backdrop-blur-md p-4 rounded-[32px] shadow-2xl border border-white/20 flex items-center justify-between">
                        <div className="flex gap-4">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">ETA</span>
                                <span className="text-lg font-black text-emerald-600">{travelInfo.duration || '--'}</span>
                            </div>
                            <div className="flex flex-col border-l border-slate-100 pl-4">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">DIST</span>
                                <span className="text-lg font-black text-primary-600">{travelInfo.distance || '--'}</span>
                            </div>
                        </div>
                        <button
                            className="p-4 bg-primary-600 rounded-full text-white shadow-lg pointer-events-auto active:scale-95 transition-transform"
                            onClick={openInGoogleMaps}
                        >
                            <Navigation className="h-6 w-6 fill-current" />
                        </button>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .dot-pattern {
          background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
          background-size: 8px 8px;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
      `}} />
        </div>
    );
};

export default NavigationPage;
