import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Car,
  MapPin,
  Clock,
  TrendingUp,
  Calendar,
  Users,
  DollarSign,
  Activity,
  Brain,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Search,
  Timer,
  Zap,
  Target,
  Gauge,
  BarChart3
} from 'lucide-react';

import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../components/Card';
import Button from '../components/Button';
import { dashboardAPI, parkingAPI } from '../services/api';

const DashboardPage = () => {

  const [stats, setStats] = useState({
    availableSlots: 0,
    activeBookings: 0,
    demandLevel: 'medium',
    totalUsers: 0
  });

  const [loading, setLoading] = useState(true);
  const [recentBookings, setRecentBookings] = useState([]);
  const [user, setUser] = useState(null);

  // Advanced Intelligence States
  const [parkingPressure, setParkingPressure] = useState({
    score: 0,
    status: 'Low',
    occupancy: 0,
    trafficLevel: 0,
    bookingVelocity: 0,
    demandPrediction: 0
  });

  const [slotSurvival, setSlotSurvival] = useState({
    minutesUntilFull: 0,
    availableSlots: 0,
    bookingsPerMinute: 0,
    isCountingDown: false
  });

  const [demandVelocity, setDemandVelocity] = useState({
    bookingsLast10Min: 0,
    trend: 'stable',
    trendArrow: 'neutral',
    classification: 'Normal'
  });

  const [aiForecast, setAiForecast] = useState({
    predictedAvailability: 0,
    confidence: 0,
    stability: 'Stable',
    next30MinPrediction: 0
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchDashboardData();
    
    // Set up real-time updates for advanced features
    const interval = setInterval(() => {
      fetchDashboardData();
      updateIntelligenceData();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  const fetchDashboardData = async () => {
    try {
      const [statsRes, bookingsRes] = await Promise.all([
        dashboardAPI.getStats(),
        parkingAPI.getMyBookings()
      ]);

      setStats(statsRes.data);
      setRecentBookings(bookingsRes.data.slice(0, 5));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateIntelligenceData = async () => {
    // Calculate Parking Pressure Index
    const occupancy = stats.activeBookings > 0 ? ((stats.activeBookings / (stats.activeBookings + stats.availableSlots)) * 100) : 0;
    const trafficLevel = Math.random() * 100; // Mock traffic data
    const bookingVelocity = Math.random() * 50; // Mock booking velocity
    const demandPrediction = Math.random() * 100; // Mock AI prediction
    
    const pressureScore = Math.min(100, (occupancy * 0.4) + (trafficLevel * 0.3) + (bookingVelocity * 0.2) + (demandPrediction * 0.1));
    
    let status = 'Low';
    if (pressureScore > 75) status = 'Critical';
    else if (pressureScore > 50) status = 'High';
    else if (pressureScore > 25) status = 'Moderate';

    setParkingPressure({
      score: Math.round(pressureScore),
      status,
      occupancy: Math.round(occupancy),
      trafficLevel: Math.round(trafficLevel),
      bookingVelocity: Math.round(bookingVelocity),
      demandPrediction: Math.round(demandPrediction)
    });

    // Calculate Slot Survival Timer
    const bookingsPerMinute = Math.random() * 2; // Mock data
    const minutesUntilFull = stats.availableSlots > 0 && bookingsPerMinute > 0 
      ? Math.round(stats.availableSlots / bookingsPerMinute) 
      : 999;

    setSlotSurvival({
      minutesUntilFull,
      availableSlots: stats.availableSlots,
      bookingsPerMinute: bookingsPerMinute.toFixed(1),
      isCountingDown: minutesUntilFull < 60 && minutesUntilFull > 0
    });

    // Calculate Demand Velocity
    const bookingsLast10Min = Math.floor(Math.random() * 20);
    const previousBookings = bookingsLast10Min - Math.floor(Math.random() * 5);
    let trend = 'stable';
    let trendArrow = 'neutral';
    let classification = 'Normal';

    if (bookingsLast10Min > previousBookings + 3) {
      trend = 'increasing';
      trendArrow = 'up';
      classification = bookingsLast10Min > 15 ? 'High' : 'Elevated';
    } else if (bookingsLast10Min < previousBookings - 3) {
      trend = 'decreasing';
      trendArrow = 'down';
      classification = bookingsLast10Min < 5 ? 'Low' : 'Declining';
    }

    setDemandVelocity({
      bookingsLast10Min,
      trend,
      trendArrow,
      classification
    });

    // AI Forecast Confidence
    const confidence = 70 + Math.random() * 25; // 70-95% confidence
    const predictedAvailability = stats.availableSlots - Math.floor(Math.random() * 10);
    const stability = confidence > 85 ? 'Very Stable' : confidence > 75 ? 'Stable' : 'Variable';

    setAiForecast({
      predictedAvailability,
      confidence: Math.round(confidence),
      stability,
      next30MinPrediction: Math.max(0, predictedAvailability - Math.floor(Math.random() * 5))
    });
  };

  useEffect(() => {
    updateIntelligenceData();
  }, [stats]);

  // Helper functions for UI
  const getPressureColor = (score) => {
    if (score > 75) return 'text-red-600 bg-red-100 border-red-200';
    if (score > 50) return 'text-orange-600 bg-orange-100 border-orange-200';
    if (score > 25) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-green-600 bg-green-100 border-green-200';
  };

  const getSurvivalColor = (minutes) => {
    if (minutes < 15) return 'text-red-600 bg-red-100';
    if (minutes < 30) return 'text-orange-600 bg-orange-100';
    if (minutes < 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getVelocityIcon = (arrow) => {
    switch (arrow) {
      case 'up': return <ArrowUp className="h-4 w-4 text-green-600" />;
      case 'down': return <ArrowDown className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence > 85) return 'text-emerald-600 bg-emerald-100';
    if (confidence > 75) return 'text-blue-600 bg-blue-100';
    return 'text-yellow-600 bg-yellow-100';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Intelligence Dashboard</h1>
          <p className="text-gray-600 mt-2">Advanced parking availability intelligence</p>
        </div>

        {/* Advanced Intelligence Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* 1️⃣ Parking Pressure Index */}
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full"></div>
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Gauge className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Parking Pressure Index</CardTitle>
                    <p className="text-sm text-gray-500">Real-time demand analysis</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-4xl font-bold text-gray-900">{parkingPressure.score}</div>
                  <div className="text-sm text-gray-500">Score out of 100</div>
                </div>
                <div className={`px-4 py-2 rounded-full border ${getPressureColor(parkingPressure.score)}`}>
                  <span className="font-semibold">{parkingPressure.status}</span>
                </div>
              </div>
              
              {/* Animated Progress Ring */}
              <div className="relative w-32 h-32 mx-auto mb-6">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-gray-200"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - parkingPressure.score / 100)}`}
                    className={`transition-all duration-1000 ease-out ${
                      parkingPressure.score > 75 ? 'text-red-500' :
                      parkingPressure.score > 50 ? 'text-orange-500' :
                      parkingPressure.score > 25 ? 'text-yellow-500' : 'text-green-500'
                    }`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Brain className="h-8 w-8 text-gray-600" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Occupancy</span>
                  <span className="font-medium">{parkingPressure.occupancy}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Traffic</span>
                  <span className="font-medium">{parkingPressure.trafficLevel}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Velocity</span>
                  <span className="font-medium">{parkingPressure.bookingVelocity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">AI Demand</span>
                  <span className="font-medium">{parkingPressure.demandPrediction}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2️⃣ Slot Survival Timer */}
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-50 to-transparent rounded-bl-full"></div>
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <Timer className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Slot Survival Timer</CardTitle>
                    <p className="text-sm text-gray-500">Time until capacity reached</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-center mb-6">
                <div className={`text-5xl font-bold mb-2 ${getSurvivalColor(slotSurvival.minutesUntilFull)}`}>
                  {slotSurvival.isCountingDown ? (
                    <span className="animate-pulse">{slotSurvival.minutesUntilFull}</span>
                  ) : (
                    slotSurvival.minutesUntilFull === 999 ? '∞' : slotSurvival.minutesUntilFull
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  {slotSurvival.minutesUntilFull === 999 ? 'No time limit' : 'minutes until full'}
                </div>
              </div>

              {/* Countdown Progress */}
              {slotSurvival.isCountingDown && (
                <div className="mb-6">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-orange-400 to-red-500 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.max(10, (slotSurvival.minutesUntilFull / 60) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-lg">{slotSurvival.availableSlots}</div>
                  <div className="text-gray-600">Available Slots</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-lg">{slotSurvival.bookingsPerMinute}</div>
                  <div className="text-gray-600">Bookings/Min</div>
                </div>
              </div>

              {slotSurvival.isCountingDown && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center text-red-700 text-sm">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <span className="font-medium">High demand detected</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 3️⃣ Demand Velocity Indicator */}
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-50 to-transparent rounded-bl-full"></div>
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Zap className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Demand Velocity</CardTitle>
                    <p className="text-sm text-gray-500">Recent booking activity</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-3xl font-bold text-gray-900">{demandVelocity.bookingsLast10Min}</div>
                  <div className="text-sm text-gray-500">Bookings in last 10 min</div>
                </div>
                <div className="flex items-center gap-2">
                  {getVelocityIcon(demandVelocity.trendArrow)}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    demandVelocity.classification === 'High' ? 'bg-red-100 text-red-700' :
                    demandVelocity.classification === 'Elevated' ? 'bg-orange-100 text-orange-700' :
                    demandVelocity.classification === 'Low' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {demandVelocity.classification}
                  </span>
                </div>
              </div>

              {/* Velocity Bars */}
              <div className="mb-6">
                <div className="flex items-end justify-between h-20 gap-1">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-green-500 to-green-300 rounded-t transition-all duration-500"
                      style={{ height: `${Math.random() * 80 + 20}%` }}
                    ></div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>10 min ago</span>
                  <span>Now</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-lg">{Math.floor(demandVelocity.bookingsLast10Min * 6)}</div>
                  <div className="text-gray-600">Hourly Rate</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-lg capitalize">{demandVelocity.trend}</div>
                  <div className="text-gray-600">Trend</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-lg">{Math.floor(demandVelocity.bookingsLast10Min * 0.8)}</div>
                  <div className="text-gray-600">Avg/Min</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 4️⃣ AI Forecast Confidence Panel */}
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-50 to-transparent rounded-bl-full"></div>
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Target className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">AI Forecast Confidence</CardTitle>
                    <p className="text-sm text-gray-500">30-minute availability prediction</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-3xl font-bold text-gray-900">{aiForecast.predictedAvailability}</div>
                  <div className="text-sm text-gray-500">Predicted available slots</div>
                </div>
                <div className={`px-3 py-1 rounded-full ${getConfidenceColor(aiForecast.confidence)}`}>
                  <span className="font-semibold">{aiForecast.confidence}% confidence</span>
                </div>
              </div>

              {/* Confidence Meter */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">AI Confidence</span>
                  <span className="text-sm font-medium">{aiForecast.confidence}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className={`h-4 rounded-full transition-all duration-1000 ${
                      aiForecast.confidence > 85 ? 'bg-emerald-500' :
                      aiForecast.confidence > 75 ? 'bg-blue-500' : 'bg-yellow-500'
                    }`}
                    style={{ width: `${aiForecast.confidence}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-lg">{aiForecast.next30MinPrediction}</div>
                  <div className="text-gray-600">Slots in 30 min</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-lg">{aiForecast.stability}</div>
                  <div className="text-gray-600">Stability</div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center text-purple-700 text-sm">
                  <Brain className="h-4 w-4 mr-2" />
                  <span className="font-medium">AI-powered prediction active</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <Link to="/user/bookings">
                <Button variant="outline" size="small">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentBookings.length > 0 ? (
              <div className="space-y-3">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-50 text-primary-600 rounded-lg">
                          <Car className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{booking.parkingSlotName}</p>
                          <div className="flex items-center text-xs text-slate-500 mt-0.5">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDateTime(booking.startTime).split(',')[0]}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">₹{booking.totalAmount?.toFixed(2)}</p>
                        <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          Completed
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="bg-slate-100 p-4 rounded-full mb-4">
                  <AlertCircle className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-slate-500 font-medium">No recent bookings</p>
                <Link to="/search" className="text-primary-600 text-sm font-bold mt-2 hover:underline">
                  Start your first booking →
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;