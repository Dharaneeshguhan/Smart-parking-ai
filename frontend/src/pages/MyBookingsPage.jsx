import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Car,
  DollarSign,
  Search,
  Filter,
  X,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  RefreshCw,
  Eye
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../components/Card';
import Button from '../components/Button';
import { parkingAPI } from '../services/api';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await parkingAPI.getMyBookings();
      const mappedData = response.data.map(booking => ({
        ...booking,
        bookingId: `BK${booking.id.toString().padStart(3, '0')}`,
        parkingName: booking.parkingSlotName,
        address: booking.parkingSlotAddress,
        date: booking.startTime.split('T')[0],
        startTime: booking.startTime.split('T')[1].substring(0, 5),
        endTime: booking.endTime.split('T')[1].substring(0, 5),
        duration: 0, // Should be calculated or returned by backend DTO
        status: booking.status.toLowerCase(),
        paymentStatus: 'paid', // Hardcoded for now
        amount: booking.totalAmount,
        spotNumber: 'Standard'
      }));
      setBookings(mappedData);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const bookingsData = bookings;

  const filteredBookings = bookingsData.filter(booking => {
    const matchesSearch = booking.parkingName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.bookingId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <AlertCircle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'upcoming':
        return <Calendar className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'refunded':
        return 'text-blue-600 bg-blue-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await parkingAPI.cancelBooking(bookingId);
        fetchBookings();
      } catch (error) {
        console.error('Error cancelling booking:', error);
      }
    }
  };

  const handleDownloadReceipt = (booking) => {
    // Generate and download receipt
    console.log('Downloading receipt for booking:', booking.bookingId);
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchBookings();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex-1">
      <div className="flex flex-col">
        <div className="flex-1">
          <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
                  <p className="text-sm text-gray-600">View and manage your parking reservations</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Button variant="outline" onClick={handleRefresh}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  <Link to="/search">
                    <Button>
                      <Calendar className="h-4 w-4 mr-2" />
                      New Booking
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Search and Filters */}
            <Card className="mb-6">
              <CardContent>
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        placeholder="Search by booking ID, location, or address..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-field pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="input-field w-40"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{bookingsData.length}</div>
                  <div className="text-sm text-gray-600">Total Bookings</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {bookingsData.filter(b => b.status === 'active').length}
                  </div>
                  <div className="text-sm text-gray-600">Active</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {bookingsData.filter(b => b.status === 'upcoming').length}
                  </div>
                  <div className="text-sm text-gray-600">Upcoming</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    ${bookingsData.reduce((sum, b) => sum + b.amount, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Spent</div>
                </CardContent>
              </Card>
            </div>

            {/* Bookings List */}
            <Card>
              <CardHeader>
                <CardTitle>Booking History</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredBookings.length > 0 ? (
                  <div className="space-y-4">
                    {filteredBookings.map((booking) => (
                      <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 mr-3">{booking.parkingName}</h3>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                {getStatusIcon(booking.status)}
                                <span className="ml-1 capitalize">{booking.status}</span>
                              </span>
                              <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>
                                {booking.paymentStatus}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2" />
                                {booking.address}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                {new Date(booking.date).toLocaleDateString()}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2" />
                                {booking.startTime} - {booking.endTime}
                              </div>
                              <div className="flex items-center">
                                <Car className="h-4 w-4 mr-2" />
                                {booking.vehicleNumber}
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 text-sm">
                                <span className="font-medium text-gray-900">
                                  Booking ID: {booking.bookingId}
                                </span>
                                <span className="text-gray-600">
                                  Spot: {booking.spotNumber}
                                </span>
                                <span className="text-gray-600">
                                  Duration: {booking.duration} hours
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-lg font-bold text-gray-900">${booking.amount}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 ml-4">
                            <Button
                              variant="outline"
                              size="small"
                              onClick={() => setSelectedBooking(booking)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Details
                            </Button>
                            {booking.status === 'upcoming' && (
                              <Button
                                variant="outline"
                                size="small"
                                onClick={() => handleCancelBooking(booking.id)}
                                className="text-red-600 border-red-300 hover:bg-red-50"
                              >
                                <X className="h-4 w-4 mr-1" />
                                Cancel
                              </Button>
                            )}
                            {booking.status === 'completed' && (
                              <Button
                                variant="outline"
                                size="small"
                                onClick={() => handleDownloadReceipt(booking)}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Receipt
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                    <p className="text-gray-600 mb-4">
                      {searchQuery || statusFilter !== 'all'
                        ? 'Try adjusting your search or filters'
                        : 'You haven\'t made any bookings yet'}
                    </p>
                    <Link to="/search">
                      <Button>Find Parking</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Booking Details</h2>
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => setSelectedBooking(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{selectedBooking.parkingName}</h3>
                  <p className="text-gray-600">{selectedBooking.address}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Booking ID</span>
                    <p className="font-medium">{selectedBooking.bookingId}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Spot Number</span>
                    <p className="font-medium">{selectedBooking.spotNumber}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Date</span>
                    <p className="font-medium">{new Date(selectedBooking.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Time</span>
                    <p className="font-medium">{selectedBooking.startTime} - {selectedBooking.endTime}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Duration</span>
                    <p className="font-medium">{selectedBooking.duration} hours</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Vehicle</span>
                    <p className="font-medium">{selectedBooking.vehicleNumber}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                    <span className="text-2xl font-bold text-primary-600">${selectedBooking.amount}</span>
                  </div>
                </div>

                {selectedBooking.qrCode && (
                  <div className="border-t pt-4 text-center">
                    <p className="text-sm text-gray-600 mb-2">QR Code for Entry</p>
                    <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                      <span className="text-gray-600">{selectedBooking.qrCode}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
