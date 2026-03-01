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
  Search
} from 'lucide-react';

import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../components/Card';
import Button from '../components/Button';
import { dashboardAPI, parkingAPI } from '../services/api';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

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

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    fetchDashboardData();
  }, []);

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

  const availabilityChartData = [
    { time: '6AM', available: 120, occupied: 30 },
    { time: '9AM', available: 80, occupied: 70 },
    { time: '12PM', available: 45, occupied: 105 },
    { time: '3PM', available: 60, occupied: 90 },
    { time: '6PM', available: 90, occupied: 60 },
    { time: '9PM', available: 110, occupied: 40 },
  ];

  const demandPredictionData = [
    { day: 'Mon', prediction: 85, actual: 82 },
    { day: 'Tue', prediction: 90, actual: 88 },
    { day: 'Wed', prediction: 95, actual: 92 },
    { day: 'Thu', prediction: 88, actual: 85 },
    { day: 'Fri', prediction: 92, actual: 90 },
    { day: 'Sat', prediction: 70, actual: 68 },
    { day: 'Sun', prediction: 65, actual: 63 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">

      {/* TOP HEADER */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-gray-600">
              Welcome back, {user?.name || user?.email}
            </p>
          </div>

          <Link to="/search">
            <Button>
              <Search className="h-4 w-4 mr-2" />
              Find Parking
            </Button>
          </Link>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-6 max-w-7xl mx-auto">

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Active Bookings</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.activeBookings}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                  <Calendar className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Spent</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">${stats.totalSpent?.toFixed(2)}</p>
                </div>
                <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600">
                  <DollarSign className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Time Saved</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.savedTime}</p>
                </div>
                <div className="bg-amber-100 p-3 rounded-xl text-amber-600">
                  <Clock className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Available Slots</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.availableSlots}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-xl text-purple-600">
                  <Activity className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CHARTS & RECENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT COLUMN: CHARTS */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader className="border-b pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-emerald-500" />
                  Real-time Availability (Weekly)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={availabilityChartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dx={-10} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line type="monotone" dataKey="available" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="occupied" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4, fill: '#f43f5e' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-500" />
                  AI Demand Prediction (Weekly)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={demandPredictionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dx={-10} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="prediction" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="actual" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN: RECENT ACTIVITY */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader className="border-b pb-4 bg-slate-50/50">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary-600" />
                  Recent Bookings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {recentBookings.length > 0 ? (
                  <div className="divide-y">
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
                                {new Date(booking.startTime).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-slate-900">${booking.totalAmount?.toFixed(2)}</p>
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
              <CardFooter className="border-t p-4">
                <Link to="/my-bookings" className="w-full">
                  <Button variant="outline" className="w-full">View All History</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardPage;