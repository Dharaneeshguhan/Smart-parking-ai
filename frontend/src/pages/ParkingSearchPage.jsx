import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  Clock,
  Filter,
  Heart,
  Car,
  Navigation,
  Activity,
  Zap,
  Star,
  Award,
  AlertCircle,
  Brain,
  Crosshair,
  User
} from 'lucide-react';

import Navbar from '../components/Navbar';
import Card, { CardContent } from '../components/Card';
import Button from '../components/Button';
import { parkingAPI } from '../services/api';
import ParkingMap from '../components/ParkingMap';

import useGeolocation from '../hooks/useGeolocation';
import { calculateDistance } from '../utils/distance';

const COIMBATORE_CENTER = { lat: 11.0168, lng: 76.9558 };

const ParkingSearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [parkingSpots, setParkingSpots] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [bestMatchId, setBestMatchId] = useState(null);
  const [selectedSpotId, setSelectedSpotId] = useState(null);
  const [debugVisible, setDebugVisible] = useState(false);

  const {
    location: userLocation,
    status: geoStatus,
    error: geoError,
    loading: geoLoading,
    permissionStatus,
    retry: retryGeo,
    isMobile,
    isLowConfidence,
    source
  } = useGeolocation({
    enableHighAccuracy: true,
    timeout: 20000,
    maximumAge: 0
  });

  const fetchParkingSpots = useCallback(async (lat, lng, destLat, destLng) => {
    setLoading(true);
    setSearchError(null);

    try {
      // If we have a destination, use the smart search endpoint
      // Otherwise, use the nearby endpoint
      let response;
      if (destLat && destLng) {
        response = await parkingAPI.searchParking({
          userLat: lat,
          userLng: lng,
          destinationLat: destLat,
          destinationLng: destLng
        });
      } else {
        response = await parkingAPI.getNearbyParking(lat, lng);
      }

      const results = response.data || [];
      setParkingSpots(results);

      if (results.length > 0) {
        setBestMatchId(results[0].id);
      } else {
        setBestMatchId(null);
      }
    } catch (err) {
      console.error(err);
      setSearchError('Failed to fetch parking recommendations. Backend sync lost.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync favorites on load
  useEffect(() => {
    fetchFavorites();
  }, []);

  // Fetch nearby when user location is first secured
  useEffect(() => {
    if (userLocation.lat && !destinationLocation) {
      fetchParkingSpots(userLocation.lat, userLocation.lng, null, null);
    }
  }, [userLocation.lat, userLocation.lng, destinationLocation, fetchParkingSpots]);

  // Handle destination change
  useEffect(() => {
    if (userLocation.lat && destinationLocation) {
      fetchParkingSpots(
        userLocation.lat,
        userLocation.lng,
        destinationLocation.lat,
        destinationLocation.lng
      );
    }
  }, [destinationLocation, userLocation.lat, userLocation.lng, fetchParkingSpots]);

  const fetchFavorites = async () => {
    try {
      const res = await parkingAPI.getFavorites();
      setFavorites(res.data.map(f => f.id));
    } catch (e) {
      console.error(e);
    }
  };

  const toggleFavorite = async (id) => {
    try {
      if (favorites.includes(id)) {
        await parkingAPI.removeFromFavorites(id);
        setFavorites(prev => prev.filter(x => x !== id));
      } else {
        await parkingAPI.addToFavorites(id);
        setFavorites(prev => [...prev, id]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getTrafficColor = (level) => {
    if (level === 'Low') return 'text-green-600 bg-green-100';
    if (level === 'Medium') return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Desktop GPS Warning */}
        {!isMobile && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
            <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-amber-900">Desktop GPS Inaccuracy Detected</h4>
              <p className="text-xs text-amber-700/80 font-medium">Desktop browsers approximate location. For precise real-time parking navigation, please use our mobile application.</p>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Precision Parking AI</h1>
            <p className="mt-2 text-lg text-slate-600 max-w-2xl">
              Live location tracking with 1500ms heartbeat. Sorted by proximity and real-time occupancy predictive models.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setDebugVisible(!debugVisible)}
              variant="outline"
              className="h-10 px-4 text-xs font-black uppercase tracking-widest border-2"
            >
              {debugVisible ? 'Hide Diagnostics' : 'Show Diagnostics'}
            </Button>
            {destinationLocation && (
              <div className="flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full border border-primary-100">
                <Zap className="h-4 w-4 fill-current animate-pulse" />
                <span className="text-sm font-bold uppercase tracking-wider">AI Optimizer calculating...</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Column */}
          <div className="lg:col-span-2 space-y-6 relative">
            <ParkingMap
              userLocation={userLocation}
              userStatus={geoStatus}
              userSource={source}
              destinationLocation={destinationLocation}
              parkingSpots={parkingSpots}
              bestSlotId={bestMatchId}
              selectedSpotId={selectedSpotId}
              onDestinationSelected={setDestinationLocation}
              onSpotSelect={setSelectedSpotId}
              onUserLocationChange={() => { }}
              height="600px"
            />

            {/* Diagnostics Overlay */}
            {debugVisible && (
              <div className="absolute top-24 left-6 z-[100] bg-slate-900/90 backdrop-blur-md text-white p-6 rounded-3xl border border-white/10 shadow-2xl w-64 animate-in zoom-in-95 duration-200">
                <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
                  <Activity className="h-4 w-4 text-emerald-400" />
                  <h5 className="text-[10px] font-black uppercase tracking-widest">GPS Engine Diagnostics</h5>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-[8px] text-white/50 uppercase font-black">Coordinates</p>
                    <p className="text-xs font-mono font-bold text-primary-400">{userLocation.lat?.toFixed(6)}, {userLocation.lng?.toFixed(6)}</p>
                  </div>
                  <div>
                    <p className="text-[8px] text-white/50 uppercase font-black">Accuracy Radius</p>
                    <p className="text-xs font-bold">{userLocation.accuracy?.toFixed(1)} meters</p>
                    <div className="w-full bg-white/10 h-1 rounded-full mt-1 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${userLocation.accuracy < 50 ? 'bg-emerald-500 w-full' : userLocation.accuracy < 200 ? 'bg-amber-500 w-2/3' : 'bg-red-500 w-1/3'}`}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-[8px] text-white/50 uppercase font-black">Permission Status</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`w-2 h-2 rounded-full ${permissionStatus === 'granted' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                      <p className="text-xs font-black uppercase tracking-tighter">{permissionStatus}</p>
                    </div>
                  </div>
                  <button
                    onClick={retryGeo}
                    className="w-full py-2 bg-white/10 hover:bg-white/20 transition-all rounded-xl text-[10px] font-black uppercase"
                  >
                    Force Re-detection
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div> User Location
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <div className="w-3 h-3 rounded-full bg-red-500"></div> Destination
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <div className="w-3 h-3 rounded-full bg-green-500"></div> Available Parking
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <div className="w-3 h-3 rounded-full bg-violet-500"></div> Selected Path
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="space-y-6 overflow-y-auto max-h-[700px] pr-2 custom-scrollbar">
            <div className="sticky top-0 bg-slate-50 z-10 pb-4 flex justify-between items-center">
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <Search className="h-5 w-5 text-primary-600" />
                Nearest Top Rated
                <span className="ml-2 bg-slate-200 text-slate-600 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest font-black">
                  {parkingSpots.length} NODES
                </span>
              </h2>
            </div>

            {geoLoading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[32px] shadow-sm border border-slate-100">
                <div className="w-12 h-12 border-4 border-slate-100 border-t-primary-600 rounded-full animate-spin"></div>
                <p className="mt-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Securing GPS Satellite Fix...</p>
              </div>
            ) : parkingSpots.length > 0 ? (
              <div className="space-y-4">
                {parkingSpots.map((spot, index) => {
                  const isBest = spot.id === bestMatchId;
                  const isSelected = spot.id === selectedSpotId;
                  const distance = calculateDistance(userLocation.lat, userLocation.lng, spot.latitude, spot.longitude);

                  return (
                    <Card
                      key={spot.id}
                      onClick={() => setSelectedSpotId(spot.id)}
                      className={`relative overflow-hidden transition-all duration-500 cursor-pointer rounded-[32px] border-2 ${isSelected ? 'border-primary-500 bg-white shadow-2xl scale-[1.02]' : (isBest ? 'border-yellow-400 bg-white shadow-xl shadow-yellow-50' : 'bg-white border-transparent shadow-sm hover:border-slate-200 hover:shadow-md')
                        }`}
                    >
                      {isBest && (
                        <div className="absolute top-0 right-0">
                          <div className="bg-yellow-400 text-slate-900 text-[10px] font-black py-1 px-4 shadow-sm flex items-center gap-1 rounded-bl-2xl uppercase tracking-tighter">
                            <Brain className="h-3 w-3" />
                            AI PREDICTION
                          </div>
                        </div>
                      )}

                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1 min-w-0">
                            <h3 className={`text-xl font-black truncate pr-16 leading-tight ${isSelected ? 'text-primary-600' : 'text-slate-800'}`}>
                              {spot.name}
                            </h3>
                            <p className="text-[10px] text-slate-400 font-bold flex items-center mt-1 uppercase tracking-widest">
                              <MapPin className="h-3 w-3 mr-1 text-slate-300" />
                              {spot.address}
                            </p>
                          </div>
                          <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(spot.id); }}
                            className="bg-slate-50 p-2.5 rounded-2xl hover:bg-red-50 transition-colors shadow-inner"
                          >
                            <Heart className={`h-5 w-5 ${favorites.includes(spot.id) ? "text-red-500 fill-current" : "text-slate-300"}`} />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-6">
                          <div className="bg-slate-50/80 backdrop-blur-sm p-3 rounded-[20px] border border-slate-100 shadow-inner">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Live Price</p>
                            <p className="text-lg font-black text-slate-900 italic">₹{spot.pricePerHour}<span className="text-[10px] font-normal text-slate-500"> /hr</span></p>
                          </div>
                          <div className="bg-slate-50/80 backdrop-blur-sm p-3 rounded-[20px] border border-slate-100 shadow-inner">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Proximity</p>
                            <p className="text-lg font-black text-slate-900 uppercase tracking-tighter">{distance?.toFixed(2)}<span className="text-[10px] font-normal text-slate-500"> KM</span></p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                          <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map(i => (
                              <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden">
                                <User className="h-4 w-4 text-slate-400" />
                              </div>
                            ))}
                            <div className="w-8 h-8 rounded-full border-2 border-white bg-primary-100 flex items-center justify-center text-[8px] font-black text-primary-600">+{spot.predictedAvailableSpots}</div>
                          </div>
                          <Link to={`/user/booking/${spot.id}`} className="flex-1">
                            <Button className="w-full h-12 rounded-2xl bg-slate-900 hover:bg-black group shadow-xl shadow-slate-900/10">
                              Secure Spot
                              <Navigation className="h-4 w-4 ml-2 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </Button>
                          </Link>
                        </div>

                        {isBest && (
                          <div className="mt-4 flex items-start gap-3 text-[10px] bg-yellow-50/50 p-4 rounded-3xl border border-yellow-200 border-dashed">
                            <Brain className="h-5 w-5 text-yellow-600 shrink-0" />
                            <p className="text-yellow-800 leading-relaxed font-medium">
                              <span className="font-black uppercase tracking-widest block mb-1">AI Recommendation Logic</span>
                              This node represents the peak optimization between traversal time ({distance?.toFixed(2)}km) and predicted slot vacancy during your arrival window.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 px-8 text-center bg-white rounded-[48px] shadow-sm border-2 border-slate-100 border-dashed animate-in fade-in zoom-in-95">
                <div className="p-6 bg-slate-50 rounded-full mb-8 shadow-inner">
                  <Crosshair className="h-16 w-16 text-slate-300" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">System Neutral: Targeting Required</h3>
                <p className="text-slate-500 mt-4 max-w-[280px] text-sm leading-relaxed">
                  The AI engine is awaiting destination coordinates. <span className="font-black text-primary-600 border-b-2 border-primary-500/20">Tap the map</span> to designate your target parking zone.
                </p>

                <div className="mt-10 grid grid-cols-1 gap-4 w-full">
                  <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-sm transition-all hover:bg-white">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-black">1</div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Verify blue GPS indicator is locked</p>
                  </div>
                  <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-sm transition-all hover:bg-white">
                    <div className="w-8 h-8 bg-red-100 text-red-600 rounded-xl flex items-center justify-center font-black">2</div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Inject destination marker on map canvas</p>
                  </div>
                </div>
              </div>
            )}

            {searchError && (
              <div className="p-5 bg-red-50 border-2 border-red-100 rounded-3xl flex items-center gap-4 animate-shake">
                <AlertCircle className="h-6 w-6 text-red-500 shrink-0" />
                <p className="text-sm font-black text-red-700 uppercase tracking-tight">{searchError}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out infinite;
          animation-iteration-count: 2;
        }
      `}} />
    </div>
  );
};

export default ParkingSearchPage;