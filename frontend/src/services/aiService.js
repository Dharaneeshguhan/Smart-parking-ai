// AI-Powered Parking Prediction Service
import api from './api';

class AIParkingService {
  constructor() {
    this.model = new ParkingPredictionModel();
    this.isTraining = false;
    this.historicalData = [];
    this.apiEndpoint = '/ai';
  }

  // Initialize AI model with backend status
  async initializeModel() {
    try {
      const response = await api.get(`${this.apiEndpoint}/model-status`);
      const modelData = response.data;
      
      console.log('AI Model initialized successfully from backend');
      return modelData;
    } catch (error) {
      console.error('Failed to initialize AI model:', error);
      // Fallback to local model
      await this.loadHistoricalData();
      await this.model.train(this.historicalData);
      console.log('AI Model initialized with local fallback');
    }
  }

  // Predict parking availability for specific time
  async predictAvailability(targetTime, locationId = null) {
    try {
      const response = await api.post(`${this.apiEndpoint}/predict-availability`, {
        targetTime: targetTime.toISOString(),
        locationId: locationId
      });
      
      return response.data;
    } catch (error) {
      console.error('Backend prediction failed, using local fallback:', error);
      return await this.predictAvailabilityLocal(targetTime, locationId);
    }
  }

  // Local fallback prediction
  async predictAvailabilityLocal(targetTime, locationId = null) {
    try {
      const features = this.extractFeatures(targetTime);
      const prediction = await this.model.predict(features);
      
      return {
        predictedOccupancy: prediction.occupancy,
        confidence: prediction.confidence,
        recommendation: this.generateRecommendation(prediction),
        riskLevel: this.calculateRiskLevel(prediction),
        alternativeTimes: await this.findAlternativeTimes(targetTime, prediction)
      };
    } catch (error) {
      console.error('Local prediction failed:', error);
      return this.getFallbackPrediction();
    }
  }

  // Get real-time demand trend from backend
  async predictDemandTrend(locationId, timeWindow = 60) {
    try {
      const response = await api.get(`${this.apiEndpoint}/demand-trend`, {
        params: { timeWindow, locationId }
      });
      
      return response.data;
    } catch (error) {
      console.error('Backend demand trend failed, using local fallback:', error);
      return await this.predictDemandTrendLocal(locationId, timeWindow);
    }
  }

  // Local fallback demand trend
  async predictDemandTrendLocal(locationId, timeWindow = 60) {
    try {
      const recentData = this.getRecentData(timeWindow);
      const trend = this.analyzeTrend(recentData);
      
      return {
        currentDemand: trend.current,
        trend: trend.direction,
        velocity: trend.velocity,
        acceleration: trend.acceleration,
        prediction: {
          next15Min: trend.next15Min,
          next30Min: trend.next30Min,
          next60Min: trend.next60Min
        },
        confidence: trend.confidence
      };
    } catch (error) {
      console.error('Local demand trend prediction failed:', error);
      return this.getFallbackDemandPrediction();
    }
  }

  // Get AI insights from backend
  async getAIInsights() {
    try {
      const response = await api.get(`${this.apiEndpoint}/insights`);
      return response.data;
    } catch (error) {
      console.error('Backend insights failed, using local fallback:', error);
      return await this.getAIInsightsLocal();
    }
  }

  // Local fallback insights
  async getAIInsightsLocal() {
    try {
      const insights = {
        bestBookingTimes: await this.getBestBookingTimes(),
        demandPatterns: await this.analyzeDemandPatterns(),
        priceOptimizations: await this.getPriceOptimizations(),
        alternativeLocations: await this.getAlternativeLocations()
      };
      
      return insights;
    } catch (error) {
      console.error('Local insights generation failed:', error);
      return {
        bestBookingTimes: [],
        demandPatterns: [],
        priceOptimizations: [],
        alternativeLocations: []
      };
    }
  }

  // Extract features for ML model
  extractFeatures(targetTime) {
    const date = new Date(targetTime);
    const hour = date.getHours();
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    return {
      hour: hour,
      dayOfWeek: dayOfWeek,
      isWeekend: isWeekend,
      month: date.getMonth(),
      isRushHour: (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 19),
      isLunchTime: hour >= 12 && hour <= 14,
      isNightTime: hour >= 22 || hour <= 6
    };
  }

  // Generate smart recommendations based on prediction
  generateRecommendation(prediction) {
    const { occupancy, confidence } = prediction;
    
    if (occupancy > 0.8 && confidence > 0.7) {
      return {
        action: 'avoid',
        message: 'High demand expected. Consider booking earlier or finding alternative location.',
        urgency: 'high',
        color: 'red'
      };
    } else if (occupancy > 0.6 && confidence > 0.6) {
      return {
        action: 'book_soon',
        message: 'Moderate to high demand. Recommended to book in advance.',
        urgency: 'medium',
        color: 'yellow'
      };
    } else {
      return {
        action: 'proceed',
        message: 'Good availability expected. Safe to proceed.',
        urgency: 'low',
        color: 'green'
      };
    }
  }

  // Calculate risk level
  calculateRiskLevel(prediction) {
    const { occupancy, confidence } = prediction;
    const riskScore = occupancy * confidence;
    
    if (riskScore > 0.7) return 'high';
    if (riskScore > 0.4) return 'medium';
    return 'low';
  }

  // Find alternative times with better availability
  async findAlternativeTimes(targetTime, currentPrediction) {
    const alternatives = [];
    const targetDate = new Date(targetTime);
    
    // Check 2 hours before and after
    for (let offset = -2; offset <= 2; offset++) {
      if (offset === 0) continue;
      
      const altTime = new Date(targetDate.getTime() + (offset * 3600000));
      const features = this.extractFeatures(altTime);
      const prediction = await this.model.predict(features);
      
      alternatives.push({
        time: altTime,
        occupancy: prediction.occupancy,
        confidence: prediction.confidence,
        improvement: currentPrediction.occupancy - prediction.occupancy
      });
    }
    
    return alternatives
      .filter(alt => alt.improvement > 0.1)
      .sort((a, b) => b.improvement - a.improvement)
      .slice(0, 3);
  }

  // Analyze trend from recent data
  analyzeTrend(data) {
    if (data.length < 2) {
      return {
        current: 0.5,
        direction: 'stable',
        velocity: 0,
        acceleration: 0,
        next15Min: 0.5,
        next30Min: 0.5,
        next60Min: 0.5,
        confidence: 0.3
      };
    }

    const values = data.map(d => d.occupancy);
    const current = values[values.length - 1];
    
    // Calculate velocity (rate of change)
    const velocity = values.length > 1 ? 
      (current - values[values.length - 2]) / 5 : 0; // Change per 5 minutes
    
    // Calculate acceleration (rate of change of velocity)
    const acceleration = values.length > 2 ? 
      velocity - ((values[values.length - 2] - values[values.length - 3]) / 5) : 0;
    
    // Determine trend direction
    let direction = 'stable';
    if (velocity > 0.02) direction = 'increasing';
    else if (velocity < -0.02) direction = 'decreasing';
    
    // Predict future values
    const next15Min = Math.max(0.1, Math.min(0.95, current + (velocity * 3)));
    const next30Min = Math.max(0.1, Math.min(0.95, current + (velocity * 6) + (acceleration * 18)));
    const next60Min = Math.max(0.1, Math.min(0.95, current + (velocity * 12) + (acceleration * 72)));
    
    return {
      current,
      direction,
      velocity,
      acceleration,
      next15Min,
      next30Min,
      next60Min,
      confidence: Math.min(0.9, 0.3 + (data.length * 0.1))
    };
  }

  // Get recent data for trend analysis
  getRecentData(minutes) {
    const now = new Date();
    const cutoff = new Date(now.getTime() - (minutes * 60000));
    
    return this.historicalData
      .filter(d => new Date(d.timestamp) >= cutoff)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }

  // Load historical parking data
  async loadHistoricalData() {
    // Simulate historical data - in real app, this would come from backend
    this.historicalData = this.generateMockHistoricalData();
  }

  // Generate mock historical data for demonstration
  generateMockHistoricalData() {
    const data = [];
    const now = new Date();
    
    for (let i = 0; i < 1000; i++) {
      const timestamp = new Date(now - (i * 3600000)); // Hourly data for past 1000 hours
      const hour = timestamp.getHours();
      const dayOfWeek = timestamp.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      // Simulate realistic parking patterns
      let baseOccupancy = 0.3;
      
      // Peak hours adjustment
      if (hour >= 8 && hour <= 10) baseOccupancy += 0.4; // Morning rush
      else if (hour >= 17 && hour <= 19) baseOccupancy += 0.45; // Evening rush
      else if (hour >= 12 && hour <= 14) baseOccupancy += 0.2; // Lunch time
      
      // Weekend adjustment
      if (isWeekend) {
        baseOccupancy = Math.max(0.2, baseOccupancy - 0.1);
        if (hour >= 10 && hour <= 15) baseOccupancy += 0.3; // Weekend shopping
      }
      
      // Add some randomness
      const randomFactor = (Math.random() - 0.5) * 0.2;
      const occupancy = Math.max(0.1, Math.min(0.95, baseOccupancy + randomFactor));
      
      data.push({
        timestamp: timestamp.toISOString(),
        hour: hour,
        dayOfWeek: dayOfWeek,
        isWeekend: isWeekend,
        occupancy: occupancy,
        temperature: 20 + Math.random() * 15, // Weather factor
        events: Math.random() > 0.9, // Special events
        demand: occupancy + (Math.random() - 0.5) * 0.1
      });
    }
    
    return data;
  }

  // Get best booking times based on AI predictions
  async getBestBookingTimes() {
    const times = [];
    const now = new Date();
    
    for (let hour = 0; hour < 24; hour++) {
      const testTime = new Date(now);
      testTime.setHours(hour, 0, 0, 0);
      
      if (testTime > now) {
        const prediction = await this.predictAvailability(testTime);
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
  }

  // Analyze demand patterns
  async analyzeDemandPatterns() {
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
  }

  // Get price optimizations
  async getPriceOptimizations() {
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
  }

  // Get alternative locations
  async getAlternativeLocations() {
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
  }

  // Fallback predictions
  getFallbackPrediction() {
    return {
      predictedOccupancy: 0.5,
      confidence: 0.3,
      recommendation: {
        action: 'proceed',
        message: 'Limited data available. Proceed with caution.',
        urgency: 'medium',
        color: 'yellow'
      },
      riskLevel: 'medium',
      alternativeTimes: []
    };
  }

  getFallbackDemandPrediction() {
    return {
      currentDemand: 0.5,
      trend: 'stable',
      velocity: 0,
      acceleration: 0,
      prediction: {
        next15Min: 0.5,
        next30Min: 0.5,
        next60Min: 0.5
      },
      confidence: 0.3
    };
  }

  // Optimize parking slot allocation
  async optimizeAllocation(userPreferences, constraints) {
    try {
      const options = await this.generateParkingOptions(userPreferences, constraints);
      const scoredOptions = options.map(option => ({
        ...option,
        score: this.calculateOptionScore(option, userPreferences)
      }));
      
      return scoredOptions
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
    } catch (error) {
      console.error('Allocation optimization failed:', error);
      return [];
    }
  }

  // Calculate option score based on user preferences
  calculateOptionScore(option, preferences) {
    let score = 0;
    
    // Distance factor
    score += (1 - option.distance / 10) * 30;
    
    // Price factor
    score += (1 - option.price / 50) * 25;
    
    // Availability factor
    score += option.availability * 20;
    
    // User preference factors
    if (preferences.covered && option.covered) score += 10;
    if (preferences.secured && option.secured) score += 10;
    if (preferences.evCharging && option.evCharging) score += 5;
    
    return Math.max(0, Math.min(100, score));
  }

  // Generate parking options
  async generateParkingOptions(preferences, constraints) {
    // This would integrate with real parking data
    return [
      {
        id: 1,
        name: 'Downtown Plaza Parking',
        distance: 0.5,
        price: 15,
        availability: 0.8,
        covered: true,
        secured: true,
        evCharging: false
      },
      {
        id: 2,
        name: 'City Center Garage',
        distance: 0.8,
        price: 12,
        availability: 0.6,
        covered: true,
        secured: true,
        evCharging: true
      }
    ];
  }
}

// Simplified ML Model for Parking Predictions
class ParkingPredictionModel {
  constructor() {
    this.weights = null;
    this.bias = null;
    this.isTrained = false;
  }

  async train(data) {
    console.log('Training AI model with', data.length, 'data points...');
    
    // Simple linear regression model (in real app, use more sophisticated models)
    const features = data.map(d => [
      d.hour / 24,
      d.dayOfWeek / 7,
      d.isWeekend ? 1 : 0,
      d.temperature / 35,
      d.events ? 1 : 0
    ]);
    
    const targets = data.map(d => d.occupancy);
    
    // Train simple model
    const result = this.simpleLinearRegression(features, targets);
    this.weights = result.weights;
    this.bias = result.bias;
    this.isTrained = true;
    
    console.log('Model training completed');
  }

  simpleLinearRegression(features, targets) {
    const n = features.length;
    const m = features[0].length;
    
    // Initialize weights and bias
    let weights = new Array(m).fill(0.1);
    let bias = 0.5;
    
    // Simple gradient descent
    const learningRate = 0.01;
    const epochs = 100;
    
    for (let epoch = 0; epoch < epochs; epoch++) {
      for (let i = 0; i < n; i++) {
        const prediction = this.predictSingle(features[i], weights, bias);
        const error = prediction - targets[i];
        
        // Update weights
        for (let j = 0; j < m; j++) {
          weights[j] -= learningRate * error * features[i][j];
        }
        
        // Update bias
        bias -= learningRate * error;
      }
    }
    
    return { weights, bias };
  }

  predictSingle(features, weights, bias) {
    let prediction = bias;
    for (let i = 0; i < features.length; i++) {
      prediction += features[i] * weights[i];
    }
    return Math.max(0.1, Math.min(0.95, prediction));
  }

  async predict(features) {
    if (!this.isTrained) {
      throw new Error('Model not trained yet');
    }

    const featureVector = [
      features.hour / 24,
      features.dayOfWeek / 7,
      features.isWeekend ? 1 : 0,
      0.7, // Normalized temperature (assumed)
      0.1  // Events probability (assumed)
    ];
    
    const prediction = this.predictSingle(featureVector, this.weights, this.bias);
    
    // Calculate confidence based on time of day and historical patterns
    let confidence = 0.7;
    if (features.isRushHour) confidence = 0.9;
    else if (features.isNightTime) confidence = 0.5;
    
    return {
      occupancy: prediction,
      confidence: confidence
    };
  }
}

// Export singleton instance
export const aiService = new AIParkingService();
export default aiService;
