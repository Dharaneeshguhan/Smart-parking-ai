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
  Crosshair
} from 'lucide-react';

import Navbar from '../components/Navbar';
import Card, { CardContent } from '../components/Card';
import Button from '../components/Button';
import { parkingAPI } from '../services/api';
import ParkingMap from '../components/ParkingMap';

const COIMBATORE_CENTER = { lat: 11.0168, lng: 76.9558 };

const ParkingSearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [parkingSpots, setParkingSpots] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [bestMatchId, setBestMatchId] = useState(null);

  // Acquire user GPS on load
  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn("Geolocation not supported by this browser.");
      setUserLocation(COIMBATORE_CENTER);
      return;
    }

    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        console.log("Real-time location detected:", coords);
        setUserLocation(coords);
        // Pre-fetch spots around current location even without a destination set
        fetchParkingSpots(coords.lat, coords.lng, null, null);
      },
      (err) => {
        console.warn(`GPS Error (${err.code}): ${err.message}. Falling back to Coimbatore.`);
        setUserLocation(COIMBATORE_CENTER);
        fetchParkingSpots(COIMBATORE_CENTER.lat, COIMBATORE_CENTER.lng, null, null);
      },
      geoOptions
    );

    fetchFavorites();
  }, []);

  const fetchParkingSpots = useCallback(async (lat, lng, destLat, destLng) => {
    setLoading(true);
    setSearchError(null);

    try {
      const response = await parkingAPI.searchParking({
        userLat: lat,
        userLng: lng,
        destinationLat: destLat,
        destinationLng: destLng
      });

      const results = response.data || [];
      setParkingSpots(results);

      if (results.length > 0) {
        setBestMatchId(results[0].id);
      } else {
        setBestMatchId(null);
      }
    } catch (err) {
      console.error(err);
      setSearchError('Failed to fetch parking recommendations from AI backend.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-search when destination changes
  useEffect(() => {
    if (userLocation && destinationLocation) {
      fetchParkingSpots(
        userLocation.lat,
        userLocation.lng,
        destinationLocation.lat,
        destinationLocation.lng
      );
    }
  }, [destinationLocation, userLocation, fetchParkingSpots]);

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
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Find Smarter Parking</h1>
            <p className="mt-2 text-lg text-slate-600 max-w-2xl">
              AI-powered optimization based on real-time traffic, distance, and predictive availability.
            </p>
          </div>
          {destinationLocation && (
            <div className="flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full border border-primary-100 animate-pulse">
              <Zap className="h-4 w-4 fill-current" />
              <span className="text-sm font-bold uppercase tracking-wider">AI Optimizer calculating...</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Column */}
          <div className="lg:col-span-2 space-y-6">
            <ParkingMap
              userLocation={userLocation}
              destinationLocation={destinationLocation}
              parkingSpots={parkingSpots}
              bestSlotId={bestMatchId}
              onDestinationSelected={setDestinationLocation}
              onUserLocationChange={setUserLocation}
              height="550px"
            />

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
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div> AI Top Choice
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="space-y-6 overflow-y-auto max-h-[650px] pr-2 custom-scrollbar">
            <div className="sticky top-0 bg-slate-50 z-10 pb-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Search className="h-5 w-5 text-primary-600" />
                Recommended Slots
                <span className="ml-2 bg-slate-200 text-slate-600 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest font-bold">
                  {parkingSpots.length} found
                </span>
              </h2>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
                <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                <p className="mt-4 font-bold text-slate-500">Analyzing live parking data...</p>
              </div>
            ) : parkingSpots.length > 0 ? (
              <div className="space-y-4">
                {parkingSpots.map((spot, index) => {
                  const isBest = spot.id === bestMatchId;
                  return (
                    <Card
                      key={spot.id}
                      className={`relative overflow-hidden transition-all duration-300 transform hover:-translate-y-1 ${isBest ? 'ring-2 ring-yellow-400 shadow-yellow-100 shadow-xl bg-white' : 'bg-white shadow-sm border border-slate-100 hover:shadow-md'
                        }`}
                    >
                      {isBest && (
                        <div className="absolute top-0 right-0">
                          <div className="bg-yellow-400 text-slate-900 text-[10px] font-black py-1 px-4 shadow-sm flex items-center gap-1 rounded-bl-xl uppercase tracking-tighter animate-bounce-short">
                            <Award className="h-3 w-3" />
                            AI Recommended Match
                          </div>
                        </div>
                      )}

                      <CardContent className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className={`text-lg font-bold truncate pr-16 ${isBest ? 'text-slate-900' : 'text-slate-800'}`}>
                              {spot.name}
                            </h3>
                            <p className="text-xs text-slate-500 flex items-center mt-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              {spot.address}
                            </p>
                          </div>
                          <button
                            onClick={(e) => { e.preventDefault(); toggleFavorite(spot.id); }}
                            className="bg-slate-50 p-2 rounded-full hover:bg-red-50 transition-colors"
                          >
                            <Heart className={`h-4 w-4 ${favorites.includes(spot.id) ? "text-red-500 fill-current" : "text-slate-400"}`} />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pricing</p>
                            <p className="text-sm font-black text-slate-900">${spot.pricePerHour}<span className="text-[10px] font-normal text-slate-500">/hr</span></p>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Distance</p>
                            <p className="text-sm font-black text-slate-900">{spot.distance?.toFixed(2)}<span className="text-[10px] font-normal text-slate-500"> km to dest</span></p>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Availability</p>
                            <p className="text-sm font-black text-slate-900 flex items-center gap-1">
                              <Activity className="h-3 w-3 text-primary-500" />
                              {spot.predictedAvailableSpots} <span className="text-[10px] font-normal text-slate-500">spots</span>
                            </p>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Traffic</p>
                            <p className={`text-[11px] font-bold px-2 py-0.5 mt-0.5 rounded-full text-center ${getTrafficColor(spot.trafficLevel)}`}>
                              {spot.trafficLevel}
                            </p>
                          </div>
                        </div>

                        <Link to={`/user/booking/${spot.id}`}>
                          <Button className={`w-full group shadow-lg ${isBest ? 'bg-slate-900 hover:bg-black' : 'bg-primary-600 hover:bg-primary-700'}`}>
                            Reserve Spot
                            <Navigation className="h-4 w-4 ml-2 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          </Button>
                        </Link>

                        {isBest && (
                          <div className="mt-3 flex items-start gap-2 text-[10px] bg-yellow-50 p-2 rounded border border-yellow-100 border-dashed">
                            <Brain className="h-4 w-4 text-yellow-600 shrink-0" />
                            <p className="text-yellow-800 leading-tight">
                              AI Recommendation Reason: Calculated highest optimization score based on
                              60% Proximity to Destination and optimal pricing.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-white rounded-2xl shadow-sm border border-slate-100 border-dashed">
                <Crosshair className="h-16 w-16 text-slate-200 mb-6" />
                <h3 className="text-xl font-bold text-slate-800">Where are you heading?</h3>
                <p className="text-slate-500 mt-2 max-w-[250px]">
                  Detect your location or tap on the map to find optimized parking near your destination.
                  <br /><span className="text-[10px] text-primary-500 font-bold mt-2 inline-block italic">Tip: Drag the blue marker if GPS is inaccurate!</span>
                </p>
                <div className="mt-8 flex flex-col gap-3 w-full">
                  <div className="flex items-center gap-2 justify-center text-xs font-bold text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div> Wait for blue GPS dot
                  </div>
                  <div className="flex items-center gap-2 justify-center text-xs font-bold text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div> Tap for red destination mark
                  </div>
                </div>
              </div>
            )}

            {searchError && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
                <p className="text-sm font-medium text-red-700">{searchError}</p>
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
        @keyframes bounce-short {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-bounce-short {
          animation: bounce-short 1s infinite ease-in-out;
        }
      `}} />
    </div>
  );
};

export default ParkingSearchPage;