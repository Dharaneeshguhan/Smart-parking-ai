import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Users, Car, DollarSign, Clock, MapPin, BarChart3, PieChart, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RePieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const AnalysisPage = () => {
  const [analytics, setAnalytics] = useState({
    overview: {},
    trends: [],
    topSlots: [],
    peakHours: [],
    revenueBreakdown: [],
    customerAnalytics: {}
  });
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockData = {
        overview: {
          totalRevenue: 45678.50,
          totalBookings: 1247,
          averageOccupancy: 72.5,
          peakOccupancy: 95,
          averageDuration: 4.2,
          customerRetention: 85.3,
          newCustomers: 186,
          returningCustomers: 1061
        },
        trends: [
          { date: '2024-02-01', revenue: 1250.50, bookings: 45, occupancy: 68 },
          { date: '2024-02-02', revenue: 1380.75, bookings: 52, occupancy: 72 },
          { date: '2024-02-03', revenue: 1420.00, bookings: 48, occupancy: 75 },
          { date: '2024-02-04', revenue: 1580.25, bookings: 58, occupancy: 82 },
          { date: '2024-02-05', revenue: 1650.50, bookings: 62, occupancy: 88 },
          { date: '2024-02-06', revenue: 1520.75, bookings: 55, occupancy: 78 },
          { date: '2024-02-07', revenue: 1480.00, bookings: 51, occupancy: 74 }
        ],
        topSlots: [
          { name: 'Downtown Parking Complex', revenue: 12500.50, bookings: 425, occupancy: 78 },
          { name: 'Airport Parking Lot', revenue: 18200.75, bookings: 598, occupancy: 85 },
          { name: 'Shopping Mall Parking', revenue: 14977.25, bookings: 224, occupancy: 65 }
        ],
        peakHours: [
          { hour: '8:00', bookings: 45, occupancy: 45 },
          { hour: '9:00', bookings: 78, occupancy: 62 },
          { hour: '10:00', bookings: 92, occupancy: 74 },
          { hour: '11:00', bookings: 88, occupancy: 70 },
          { hour: '12:00', bookings: 65, occupancy: 52 },
          { hour: '13:00', bookings: 72, occupancy: 58 },
          { hour: '14:00', bookings: 95, occupancy: 76 },
          { hour: '15:00', bookings: 102, occupancy: 82 },
          { hour: '16:00', bookings: 98, occupancy: 78 },
          { hour: '17:00', bookings: 85, occupancy: 68 },
          { hour: '18:00', bookings: 72, occupancy: 58 }
        ],
        revenueBreakdown: [
          { name: 'Hourly', value: 28500.50, percentage: 62.4 },
          { name: 'Daily', value: 12478.00, percentage: 27.3 },
          { name: 'Weekly', value: 3200.00, percentage: 7.0 },
          { name: 'Monthly', value: 1500.00, percentage: 3.3 }
        ],
        customerAnalytics: {
          demographics: {
            new: 186,
            returning: 1061,
            retention: 85.3
          },
          bookingPatterns: {
            advance: 847,
            sameDay: 400,
            averageLeadTime: 2.3
          },
          vehicleTypes: [
            { type: 'Sedan', count: 523, percentage: 42.0 },
            { type: 'SUV', count: 374, percentage: 30.0 },
            { type: 'Compact', count: 224, percentage: 18.0 },
            { type: 'Electric', count: 126, percentage: 10.0 }
          ]
        }
      };
      setAnalytics(mockData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
      <div className="w-full">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="mt-2 text-gray-600">Comprehensive insights into your parking business performance</p>
            </div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(analytics.overview.totalRevenue)}
                </p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12.5% from last period
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.overview.totalBookings.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8.2% from last period
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Activity className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Occupancy</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.overview.averageOccupancy}%
                </p>
                <p className="text-xs text-red-600 flex items-center mt-1">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  -2.1% from last period
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Duration</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.overview.averageDuration}h
                </p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +0.3h from last period
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue & Bookings Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="bookings" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Occupancy Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics.trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="occupancy" stroke="#F59E0B" fill="#FEF3C7" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Peak Hours Analysis</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.peakHours}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="bookings" fill="#3B82F6" />
                <Bar dataKey="occupancy" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RePieChart>
                <Pie
                  data={analytics.revenueBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.revenueBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </RePieChart>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Performing Slots */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Performing Slots</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parking Slot
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bookings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Occupancy
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analytics.topSlots.map((slot, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        {slot.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(slot.revenue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {slot.bookings}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${slot.occupancy}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-900">{slot.occupancy}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        slot.occupancy >= 80 ? 'bg-green-100 text-green-800' :
                        slot.occupancy >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {slot.occupancy >= 80 ? 'Excellent' :
                         slot.occupancy >= 60 ? 'Good' : 'Poor'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Demographics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">New Customers</span>
                <span className="text-lg font-bold text-gray-900">
                  {analytics.customerAnalytics.demographics.new}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Returning Customers</span>
                <span className="text-lg font-bold text-gray-900">
                  {analytics.customerAnalytics.demographics.returning}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Retention Rate</span>
                <span className="text-lg font-bold text-green-600">
                  {analytics.customerAnalytics.demographics.retention}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Patterns</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Advance Bookings</span>
                <span className="text-lg font-bold text-gray-900">
                  {analytics.customerAnalytics.bookingPatterns.advance}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Same Day Bookings</span>
                <span className="text-lg font-bold text-gray-900">
                  {analytics.customerAnalytics.bookingPatterns.sameDay}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Lead Time</span>
                <span className="text-lg font-bold text-gray-900">
                  {analytics.customerAnalytics.bookingPatterns.averageLeadTime} days
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Types</h3>
            <div className="space-y-3">
              {analytics.customerAnalytics.vehicleTypes.map((vehicle, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{vehicle.type}</span>
                  <div className="flex items-center">
                    <span className="text-lg font-bold text-gray-900 mr-2">
                      {vehicle.count}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({vehicle.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
};

export default AnalysisPage;
