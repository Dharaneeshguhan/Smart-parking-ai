import React from 'react';
import { Brain, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

const AvailabilityIndicator = ({ availabilityPercent, availabilityStatus, aiPredictedAvailability, recommended, totalSlots, showAiPrediction = true }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'HIGH':
        return 'bg-green-500';
      case 'MEDIUM':
        return 'bg-yellow-500';
      case 'LOW':
        return 'bg-orange-500';
      case 'FULL':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'HIGH':
        return 'text-green-600';
      case 'MEDIUM':
        return 'text-yellow-600';
      case 'LOW':
        return 'text-orange-600';
      case 'FULL':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'HIGH':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'MEDIUM':
        return <TrendingUp className="w-4 h-4 text-yellow-600" />;
      case 'LOW':
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'FULL':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const availableSlots = Math.round(totalSlots * availabilityPercent / 100);

  return (
    <div className="space-y-2">
      {/* Main Availability Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getStatusIcon(availabilityStatus)}
          <span className={`text-sm font-medium ${getStatusTextColor(availabilityStatus)}`}>
            {availabilityStatus}
          </span>
          {recommended && (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              Recommended
            </span>
          )}
        </div>
        <span className="text-sm text-gray-600">
          {availableSlots}/{totalSlots} available
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getStatusColor(availabilityStatus)}`}
          style={{ width: `${availabilityPercent}%` }}
        />
      </div>

      {/* AI Prediction Badge */}
      {showAiPrediction && aiPredictedAvailability !== undefined && (
        <div className="flex items-center space-x-1 text-xs text-gray-600">
          <Brain className="w-3 h-3" />
          <span>AI predicts: {aiPredictedAvailability} available</span>
        </div>
      )}
    </div>
  );
};

export default AvailabilityIndicator;
