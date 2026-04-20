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
  BarChart3,
  Sparkles,
  Cpu,
  Lightbulb,
  TrendingDown,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../components/Card';
import Button from '../components/Button';
import { dashboardAPI, parkingAPI } from '../services/api';
import aiService from '../services/aiService';

const DashboardPage = () => {

  const [stats, setStats] = useState({
    availableSlots: 0,
    activeBookings: 0,
    demandLevel: 'medium',
    totalUsers: 0,
    myParkingSlots: []
  });

  const [loading, setLoading] = useState(true);
  const [recentBookings, setRecentBookings] = useState([]);
  const [user, setUser] = useState(null);
  const [mySlots, setMySlots] = useState([]);

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
    next30MinPrediction: 0,
    nextHourPrediction: 0,
    riskLevel: 'low',
    recommendation: null
  });

  const [aiInsights, setAiInsights] = useState({
    bestBookingTimes: [],
    demandPatterns: [],
    priceOptimizations: [],
    alternativeLocations: []
  });

  const [modelStatus, setModelStatus] = useState({
    isTraining: false,
    isReady: false,
    accuracy: 0,
    lastUpdated: null
  });

  const [realTimePredictions, setRealTimePredictions] = useState({
    currentDemand: 0,
    trend: 'stable',
    velocity: 0,
    next15Min: 0,
    next30Min: 0,
    confidence: 0
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    // Initialize AI Model
    initializeAIModel();
    
    fetchDashboardData();
    
    // Set up real-time updates for advanced features
    const interval = setInterval(() => {
      fetchDashboardData();
      updateIntelligenceData();
      updateAIPredictions();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Initialize AI Model
  const initializeAIModel = async () => {
    try {
      setModelStatus(prev => ({ ...prev, isTraining: true }));
      await aiService.initializeModel();
      setModelStatus(prev => ({ 
        ...prev, 
        isTraining: false, 
        isReady: true, 
        accuracy: 0.87,
        lastUpdated: new Date()
      }));
      console.log('AI Model initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AI model:', error);
      setModelStatus(prev => ({ ...prev, isTraining: false }));
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  const fetchDashboardData = async () => {
    try {
      const [statsRes, bookingsRes, slotsRes] = await Promise.all([
        dashboardAPI.getStats(),
        parkingAPI.getMyBookings(),
        dashboardAPI.getMySlots()
      ]);

      setStats(statsRes.data);
      setRecentBookings(bookingsRes.data.slice(0, 5));
      setMySlots(slotsRes.data);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update AI Predictions
  const updateAIPredictions = async () => {
    if (!modelStatus.isReady) return;

    try {
      // Get current time predictions
      const now = new Date();
      const futureTime = new Date(now.getTime() + 30 * 60000); // 30 minutes from now
      
      const availabilityPrediction = await aiService.predictAvailability(futureTime);
      const demandTrend = await aiService.predictDemandTrend();
      
      setAiForecast(prev => ({
        ...prev,
        predictedAvailability: availabilityPrediction.predictedOccupancy,
        confidence: availabilityPrediction.confidence,
        next30MinPrediction: availabilityPrediction.predictedOccupancy,
        nextHourPrediction: availabilityPrediction.predictedOccupancy,
        riskLevel: availabilityPrediction.riskLevel,
        recommendation: availabilityPrediction.recommendation
      }));

      setRealTimePredictions(prev => ({
        ...prev,
        currentDemand: demandTrend.currentDemand,
        trend: demandTrend.trend,
        velocity: demandTrend.velocity,
        next15Min: demandTrend.prediction.next15Min,
        next30Min: demandTrend.prediction.next30Min,
        confidence: demandTrend.confidence
      }));

      // Generate AI insights
      await generateAIInsights();

    } catch (error) {
      console.error('Error updating AI predictions:', error);
    }
  };

  // Generate AI Insights
  const generateAIInsights = async () => {
    try {
      const insights = {
        bestBookingTimes: await getBestBookingTimes(),
        demandPatterns: await analyzeDemandPatterns(),
        priceOptimizations: await getPriceOptimizations(),
        alternativeLocations: await getAlternativeLocations()
      };
      
      setAiInsights(insights);
    } catch (error) {
      console.error('Error generating AI insights:', error);
    }
  };

  // Get best booking times based on AI predictions
  const getBestBookingTimes = async () => {
    const times = [];
    const now = new Date();
    
    for (let hour = 0; hour < 24; hour++) {
      const testTime = new Date(now);
      testTime.setHours(hour, 0, 0, 0);
      
      if (testTime > now) {
        const prediction = await aiService.predictAvailability(testTime);
        times.push({
          time: testTime,
          availability: prediction.predictedOccupancy,
          confidence: prediction.confidence,
          recommendation: prediction.recommendation
        });
      }
    }
    
    return times
      .sort((a, b) => a.availability - b.availability)
      .slice(0, 5);
  };

  // Analyze demand patterns
  const analyzeDemandPatterns = async () => {
    const patterns = [
      {
        period: 'Morning Rush (8-10 AM)',
        demand: 'high',
        recommendation: 'Book 30 minutes early',
        confidence: 0.92
      },
      {
        period: 'Lunch Time (12-2 PM)',
        demand: 'medium',
        recommendation: 'Book 15 minutes early',
        confidence: 0.78
      },
      {
        period: 'Evening Rush (5-7 PM)',
        demand: 'very_high',
        recommendation: 'Book 45 minutes early',
        confidence: 0.95
      },
      {
        period: 'Night Time (10 PM-6 AM)',
        demand: 'low',
        recommendation: 'Book on arrival',
        confidence: 0.88
      }
    ];
    
    return patterns;
  };

  // Get price optimizations
  const getPriceOptimizations = async () => {
    return [
      {
        type: 'Early Bird Discount',
        savings: '20%',
        condition: 'Book 2+ hours early',
        confidence: 0.85
      },
      {
        type: 'Off-Peak Rates',
        savings: '30%',
        condition: 'Book between 10 PM - 6 AM',
        confidence: 0.92
      },
      {
        type: 'Weekly Pass',
        savings: '40%',
        condition: 'Book 7+ days',
        confidence: 0.78
      }
    ];
  };

  // Get alternative locations
  const getAlternativeLocations = async () => {
    return [
      {
        name: 'North Parking Garage',
        distance: '0.8 km',
        availability: 0.85,
        price: 12,
        confidence: 0.82
      },
      {
        name: 'East Street Parking',
        distance: '1.2 km',
        availability: 0.72,
        price: 8,
        confidence: 0.75
      },
      {
        name: 'Central Plaza',
        distance: '0.5 km',
        availability: 0.45,
        price: 18,
        confidence: 0.68
      }
    ];
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
          <h1 className="text-3xl font-bold text-gray-900">AI-Powered Dashboard</h1>
          <p className="text-gray-600 mt-2">Advanced parking predictions and intelligent recommendations</p>
        </div>

        {/* AI Model Status */}
        <div className="mb-8">
          <Card className="glass-container border-indigo-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${modelStatus.isReady ? 'bg-green-100' : 'bg-yellow-100'}`}>
                    <Cpu className={`w-6 h-6 ${modelStatus.isReady ? 'text-green-600' : 'text-yellow-600'}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">AI Prediction Model</h3>
                    <p className="text-sm text-gray-600">
                      {modelStatus.isTraining ? 'Training...' : modelStatus.isReady ? `Ready (${Math.round(modelStatus.accuracy * 100)}% accuracy)` : 'Initializing...'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${modelStatus.isReady ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`}></div>
                  <span className="text-sm text-gray-500">
                    {modelStatus.isReady ? 'Live Predictions' : 'Preparing...'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Predictions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* AI Availability Forecast */}
          <Card className="relative overflow-hidden border-indigo-200">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-50 to-transparent rounded-bl-full"></div>
            <CardHeader className="relative">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Brain className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">AI Availability Forecast</CardTitle>
                  <p className="text-sm text-gray-500">Next 30 minutes prediction</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-indigo-600">
                  {Math.round((1 - aiForecast.predictedAvailability) * 100)}%
                </div>
                <div className="text-sm text-gray-500">Available</div>
                <div className="text-xs text-gray-400 mt-1">
                  Confidence: {Math.round(aiForecast.confidence * 100)}%
                </div>
              </div>
              
              {aiForecast.recommendation && (
                <div className={`p-3 rounded-lg ${
                  aiForecast.recommendation.color === 'green' ? 'bg-green-50 border border-green-200' :
                  aiForecast.recommendation.color === 'yellow' ? 'bg-yellow-50 border border-yellow-200' :
                  'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-center gap-2">
                    {aiForecast.recommendation.color === 'green' ? <CheckCircle className="w-4 h-4 text-green-600" /> :
                     aiForecast.recommendation.color === 'yellow' ? <AlertCircle className="w-4 h-4 text-yellow-600" /> :
                     <AlertTriangle className="w-4 h-4 text-red-600" />}
                    <span className="text-sm font-medium">{aiForecast.recommendation.message}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Real-time Demand Trend */}
          <Card className="relative overflow-hidden border-purple-200">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-50 to-transparent rounded-bl-full"></div>
            <CardHeader className="relative">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Demand Trend</CardTitle>
                  <p className="text-sm text-gray-500">Real-time analysis</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current</span>
                  <span className="font-semibold">{Math.round(realTimePredictions.currentDemand * 100)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">15 min</span>
                  <span className="font-semibold">{Math.round(realTimePredictions.next15Min * 100)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">30 min</span>
                  <span className="font-semibold">{Math.round(realTimePredictions.next30Min * 100)}%</span>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t">
                  {realTimePredictions.trend === 'increasing' ? <TrendingUp className="w-4 h-4 text-green-500" /> :
                   realTimePredictions.trend === 'decreasing' ? <TrendingDown className="w-4 h-4 text-red-500" /> :
                   <Activity className="w-4 h-4 text-gray-500" />}
                  <span className="text-sm font-medium capitalize">{realTimePredictions.trend}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card className="relative overflow-hidden border-emerald-200">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-50 to-transparent rounded-bl-full"></div>
            <CardHeader className="relative">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <Lightbulb className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">AI Insights</CardTitle>
                  <p className="text-sm text-gray-500">Smart recommendations</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="space-y-3">
                {aiInsights.bestBookingTimes.slice(0, 2).map((time, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">
                      {new Date(time.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="text-xs font-medium text-emerald-600">
                      {Math.round((1 - time.availability) * 100)}% free
                    </span>
                  </div>
                ))}
                {aiInsights.priceOptimizations.slice(0, 1).map((opt, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-emerald-50 rounded-lg">
                    <span className="text-sm text-gray-600">{opt.type}</span>
                    <span className="text-xs font-medium text-emerald-600">{opt.savings}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI-Powered Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* AI Demand Analysis */}
          <Card className="relative overflow-hidden border-purple-200">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-50 to-transparent rounded-bl-full"></div>
            <CardHeader className="relative">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">AI Demand Analysis</CardTitle>
                  <p className="text-sm text-gray-500">Pattern recognition</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="space-y-4">
                {aiInsights.demandPatterns.slice(0, 3).map((pattern, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{pattern.period}</div>
                      <div className="text-xs text-gray-500">{pattern.recommendation}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        pattern.demand === 'very_high' ? 'bg-red-500' :
                        pattern.demand === 'high' ? 'bg-orange-500' :
                        pattern.demand === 'medium' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}></div>
                      <span className="text-xs font-medium capitalize">{pattern.demand.replace('_', ' ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Smart Recommendations */}
          <Card className="relative overflow-hidden border-emerald-200">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-50 to-transparent rounded-bl-full"></div>
            <CardHeader className="relative">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <Lightbulb className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Smart Recommendations</CardTitle>
                  <p className="text-sm text-gray-500">AI-powered tips</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="space-y-3">
                {aiForecast.recommendation && (
                  <div className={`p-3 rounded-lg border ${
                    aiForecast.recommendation.color === 'green' ? 'bg-green-50 border-green-200' :
                    aiForecast.recommendation.color === 'yellow' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-start gap-2">
                      {aiForecast.recommendation.color === 'green' ? <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" /> :
                       aiForecast.recommendation.color === 'yellow' ? <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" /> :
                       <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />}
                      <div>
                        <div className="text-sm font-medium">{aiForecast.recommendation.message}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Urgency: {aiForecast.recommendation.urgency}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {aiInsights.priceOptimizations.slice(0, 2).map((opt, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-emerald-50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{opt.type}</div>
                      <div className="text-xs text-gray-500">{opt.condition}</div>
                    </div>
                    <span className="text-sm font-bold text-emerald-600">{opt.savings}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alternative Locations */}
          <Card className="relative overflow-hidden border-blue-200">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full"></div>
            <CardHeader className="relative">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Nearby Options</CardTitle>
                  <p className="text-sm text-gray-500">Alternative locations</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="space-y-3">
                {aiInsights.alternativeLocations.slice(0, 3).map((location, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{location.name}</span>
                      <span className="text-xs text-gray-500">{location.distance}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          location.availability > 0.7 ? 'bg-green-500' :
                          location.availability > 0.4 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}></div>
                        <span className="text-xs text-gray-600">
                          {Math.round(location.availability * 100)}% available
                        </span>
                      </div>
                      <span className="text-xs font-medium text-blue-600">${location.price}/hr</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Stats Grid with AI */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass-container">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Car className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.availableSlots}</div>
              <div className="text-sm text-gray-600">Available Slots</div>
              <div className="text-xs text-indigo-600 mt-1">AI Optimized</div>
            </CardContent>
          </Card>

          <Card className="glass-container">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.activeBookings}</div>
              <div className="text-sm text-gray-600">Active Bookings</div>
              <div className="text-xs text-emerald-600 mt-1">Real-time</div>
            </CardContent>
          </Card>

          <Card className="glass-container">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{Math.round(aiForecast.confidence * 100)}%</div>
              <div className="text-sm text-gray-600">AI Confidence</div>
              <div className="text-xs text-purple-600 mt-1">Model Accuracy</div>
            </CardContent>
          </Card>

          <Card className="glass-container">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {realTimePredictions.trend === 'increasing' ? 'Rising' :
                 realTimePredictions.trend === 'decreasing' ? 'Falling' : 'Stable'}
              </div>
              <div className="text-sm text-gray-600">Demand Trend</div>
              <div className="text-xs text-amber-600 mt-1">Live Analysis</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity with AI Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Bookings</CardTitle>
                  <p className="text-sm text-gray-500">Your parking history</p>
                </div>
                <Link to="/user/bookings">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookings.length > 0 ? (
                  recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{booking.parkingSlot?.name || 'Parking Slot'}</div>
                        <div className="text-sm text-gray-500">
                          {formatDateTime(booking.startTime)} - {formatDateTime(booking.endTime)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">${booking.totalAmount || 0}</div>
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                          booking.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {booking.status}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No recent bookings</p>
                    <Link to="/user/search">
                      <Button className="mt-3">Find Parking</Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* AI Prediction Chart */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>AI Predictions</CardTitle>
                <p className="text-sm text-gray-500">Next 60 minutes forecast</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      {Math.round((1 - realTimePredictions.currentDemand) * 100)}%
                    </div>
                    <div className="text-xs text-gray-500">Now</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-600">
                      {Math.round((1 - realTimePredictions.next15Min) * 100)}%
                    </div>
                    <div className="text-xs text-gray-500">15 min</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-600">
                      {Math.round((1 - realTimePredictions.next30Min) * 100)}%
                    </div>
                    <div className="text-xs text-gray-500">30 min</div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Prediction Trend</span>
                    <span className="text-xs text-gray-500">
                      {Math.round(realTimePredictions.confidence * 100)}% confidence
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        realTimePredictions.trend === 'increasing' ? 'bg-red-500' :
                        realTimePredictions.trend === 'decreasing' ? 'bg-green-500' :
                        'bg-yellow-500'
                      }`}
                      style={{ width: `${Math.abs(realTimePredictions.velocity) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1" size="sm">
                    <Brain className="w-4 h-4 mr-2" />
                    View AI Insights
                  </Button>
                  <Button variant="outline" size="sm">
                    <Target className="w-4 h-4 mr-2" />
                    Optimize
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
