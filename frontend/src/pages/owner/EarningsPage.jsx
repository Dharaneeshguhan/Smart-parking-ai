import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Download, Filter } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ownerAPI } from '../../services/api';

const EarningsPage = () => {
  const [earnings, setEarnings] = useState([]);
  const [timeRange, setTimeRange] = useState('month');
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, [timeRange, selectedPeriod]);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const response = await ownerAPI.getEarnings({ timeRange, period: selectedPeriod });

      // The backend returns { totalEarnings, totalBookings }
      // We'll use this to populate summary and maybe some mock trend data if backend doesn't provide history yet
      const totalEarnings = response.data.totalEarnings || 0;
      const totalBookings = response.data.totalBookings || 0;

      // Mocking some trend data based on real total for visualization if historical data is not yet in backend
      const trendData = [
        { month: 'Current', revenue: totalEarnings, bookings: totalBookings }
      ];

      setEarnings(trendData);
    } catch (error) {
      console.error('Error fetching earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = earnings.reduce((sum, item) => sum + item.revenue, 0);
  const totalBookings = earnings.reduce((sum, item) => sum + item.bookings, 0);
  const avgRevenue = earnings.length > 0 ? totalRevenue / earnings.length : 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const exportData = () => {
    const csvContent = [
      ['Date', 'Revenue', 'Bookings'],
      ...earnings.map(item => [
        item.date || item.week || item.month,
        item.revenue.toFixed(2),
        item.bookings
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `earnings-${timeRange}-${selectedPeriod}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading earnings data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Earnings Analysis</h1>
            <p className="mt-2 text-gray-600">Track your parking revenue and booking trends</p>
          </div>
          <button
            onClick={exportData}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center"
          >
            <Download className="h-5 w-5 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(avgRevenue)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Filter className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Booking Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalBookings > 0 ? formatCurrency(totalRevenue / totalBookings) : '₹0.00'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Time Range:</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Period:</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="current">Current Period</option>
              <option value="last">Last Period</option>
              <option value="year">Year to Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={earnings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey={timeRange === 'daily' ? 'date' : timeRange === 'weekly' ? 'week' : 'month'}
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value, name) => [
                  formatCurrency(value),
                  name === 'revenue' ? 'Revenue' : 'Bookings'
                ]}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bookings Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={earnings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey={timeRange === 'daily' ? 'date' : timeRange === 'weekly' ? 'week' : 'month'}
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value, name) => [
                  value,
                  name === 'bookings' ? 'Bookings' : 'Revenue'
                ]}
              />
              <Bar dataKey="bookings" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Detailed Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {timeRange === 'daily' ? 'Date' : timeRange === 'weekly' ? 'Week' : 'Month'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bookings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg per Booking
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Change
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {earnings.map((item, index) => {
                const prevItem = earnings[index - 1];
                const change = prevItem ?
                  ((item.revenue - prevItem.revenue) / prevItem.revenue * 100) : 0;

                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.date || item.week || item.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(item.revenue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.bookings}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(item.revenue / item.bookings)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {change !== 0 && (
                        <span className={`flex items-center ${change > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                          {change > 0 ? (
                            <TrendingUp className="h-4 w-4 mr-1" />
                          ) : (
                            <TrendingDown className="h-4 w-4 mr-1" />
                          )}
                          {Math.abs(change).toFixed(1)}%
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EarningsPage;
