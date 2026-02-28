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
      <div className="p-6">

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card><CardContent>Available Slots: {stats.availableSlots}</CardContent></Card>
          <Card><CardContent>Active Bookings: {stats.activeBookings}</CardContent></Card>
          <Card><CardContent>Demand Level: {stats.demandLevel}</CardContent></Card>
          <Card><CardContent>Active Users: {stats.totalUsers}</CardContent></Card>
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <Card>
            <CardHeader><CardTitle>Real-time Availability</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={availabilityChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line dataKey="available" stroke="#22c55e" />
                  <Line dataKey="occupied" stroke="#ef4444" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>AI Demand Prediction</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={demandPredictionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="prediction" fill="#3b82f6" />
                  <Bar dataKey="actual" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default DashboardPage;