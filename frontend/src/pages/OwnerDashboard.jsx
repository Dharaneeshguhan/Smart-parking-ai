import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  MapPin,
  Car,
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  Activity,
  BarChart3,
  Settings,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../components/Card';
import Button from '../components/Button';
import { ownerAPI } from '../services/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

const OwnerDashboard = () => {
  const [stats, setStats] = useState({
    totalSlots: 0,
    occupiedSlots: 0,
    totalEarnings: 0,
    monthlyRevenue: 0
  });
  const [parkingSlots, setParkingSlots] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [earningsData, setEarningsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);

    fetchOwnerData();
  }, []);

  const fetchOwnerData = async () => {
    try {
      const [statsRes, slotsRes, bookingsRes, earningsRes] = await Promise.all([
        ownerAPI.getAnalytics(),
        ownerAPI.getParkingSlots(),
        ownerAPI.getBookings(),
        ownerAPI.getEarnings({ period: 'month' })
      ]);

      setStats({
        totalSlots: statsRes.data.totalSlots || 0,
        occupiedSlots: statsRes.data.occupiedSlots || 0,
        totalEarnings: statsRes.data.totalEarnings || 0,
        monthlyRevenue: statsRes.data.monthlyRevenue || 0
      });

      const mappedSlots = slotsRes.data.map(slot => ({
        ...slot,
        totalSpots: slot.totalSpots || 0,
        occupiedSpots: slot.totalSpots - (slot.availableSpots || 0),
        price: slot.pricePerHour || 0,
        revenue: slot.revenue || 0
      }));

      setParkingSlots(mappedSlots);
      setRecentBookings(bookingsRes.data.slice(0, 5));
      setEarningsData(earningsRes.data);
    } catch (error) {
      console.error('Error fetching owner data:', error);
    } finally {
      setLoading(false);
    }
  };

  const mockParkingSlots = [
    {
      id: 1,
      name: 'Downtown Plaza Parking',
      address: '123 Main St, Downtown',
      totalSpots: 100,
      occupiedSpots: 75,
      price: 8,
      status: 'active',
      revenue: 2400
    },
    {
      id: 2,
      name: 'City Center Garage',
      address: '456 Oak Ave, City Center',
      totalSpots: 200,
      occupiedSpots: 120,
      price: 12,
      status: 'active',
      revenue: 3600
    },
    {
      id: 3,
      name: 'Airport Parking Lot',
      address: '789 Airport Rd',
      totalSpots: 500,
      occupiedSpots: 180,
      price: 15,
      status: 'active',
      revenue: 5400
    }
  ];

  const mockRecentBookings = [
    {
      id: 1,
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      slotName: 'Downtown Plaza Parking',
      date: '2024-01-15',
      time: '14:30',
      duration: 3,
      amount: 24,
      status: 'active'
    },
    {
      id: 2,
      customerName: 'Jane Smith',
      customerEmail: 'jane@example.com',
      slotName: 'City Center Garage',
      date: '2024-01-15',
      time: '09:00',
      duration: 8,
      amount: 96,
      status: 'completed'
    },
    {
      id: 3,
      customerName: 'Mike Johnson',
      customerEmail: 'mike@example.com',
      slotName: 'Airport Parking Lot',
      date: '2024-01-15',
      time: '16:00',
      duration: 24,
      amount: 360,
      status: 'upcoming'
    }
  ];

  const mockEarningsData = [
    { month: 'Jan', revenue: 12000, bookings: 450 },
    { month: 'Feb', revenue: 15000, bookings: 520 },
    { month: 'Mar', revenue: 13500, bookings: 480 },
    { month: 'Apr', revenue: 18000, bookings: 620 },
    { month: 'May', revenue: 16500, bookings: 580 },
    { month: 'Jun', revenue: 20000, bookings: 700 },
  ];

  const slots = parkingSlots.length > 0 ? parkingSlots : mockParkingSlots;
  const bookings = recentBookings.length > 0 ? recentBookings : mockRecentBookings;
  const earnings = earningsData.length > 0 ? earningsData : mockEarningsData;

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'inactive':
        return 'text-gray-600 bg-gray-100';
      case 'maintenance':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getBookingStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-blue-600 bg-blue-100';
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'upcoming':
        return 'text-purple-600 bg-purple-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const occupancyRate = stats.totalSlots > 0 ? ((stats.occupiedSlots / stats.totalSlots) * 100).toFixed(1) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Owner Dashboard</h1>
            <p className="text-sm text-gray-600">Manage your parking business</p>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/owner/add-slot">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New Slot
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Slots</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalSlots || slots.reduce((sum, slot) => sum + slot.totalSpots, 0)}</p>
                  <div className="flex items-center mt-2 text-sm">
                    <Activity className="h-4 w-4 text-blue-500 mr-1" />
                    <span className="text-blue-600">{occupancyRate}% occupied</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Occupied Slots</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.occupiedSlots || slots.reduce((sum, slot) => sum + slot.occupiedSpots, 0)}</p>
                  <div className="flex items-center mt-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-600">+12% this week</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Car className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>My Parking Slots</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {slots.map((slot) => (
                  <div key={slot.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{slot.name}</h4>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(slot.status)}`}>
                        {slot.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{slot.address}</p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Spots:</span>
                        <span className="ml-1 font-medium">{slot.occupiedSpots}/{slot.totalSpots}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Price:</span>
                        <span className="ml-1 font-medium">${slot.price}/hr</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Revenue:</span>
                        <span className="ml-1 font-medium">${slot.revenue}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-end space-x-2 mt-3">
                      <Link to="/owner/parking-slots">
                        <Button size="small" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                      <Link to={`/owner/parking-slots`}>
                        <Button size="small" variant="outline">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              <CardFooter>
                <Link to="/owner/parking-slots" className="w-full">
                  <Button variant="outline" className="w-full">
                    View All Slots
                  </Button>
                </Link>
              </CardFooter>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{booking.customerName}</h4>
                        <p className="text-sm text-gray-600">{booking.customerEmail}</p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getBookingStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      <p>{booking.slotName}</p>
                      <p>{booking.date} • {booking.time} • {booking.duration} hours</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">${booking.amount}</span>
                      <div className="flex items-center space-x-2">
                        {booking.status === 'active' && (
                          <Button size="small" variant="outline">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Complete
                          </Button>
                        )}
                        <Link to="/owner/bookings">
                          <Button size="small" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <CardFooter>
                <Link to="/owner/bookings" className="w-full">
                  <Button variant="outline" className="w-full">
                    View All Bookings
                  </Button>
                </Link>
              </CardFooter>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
