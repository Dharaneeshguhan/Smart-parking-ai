import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Car,
  Shield,
  Zap,
  CreditCard,
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../components/Card';
import Button from '../components/Button';
import { parkingAPI } from '../services/api';

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [parkingDetails, setParkingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    date: '',
    startTime: '',
    duration: 1,
    vehicleNumber: '',
    paymentMethod: 'card'
  });
  const [errors, setErrors] = useState({});
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchParkingDetails();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setBookingData(prev => ({
      ...prev,
      date: tomorrow.toISOString().split('T')[0]
    }));
  }, [id]);

  const fetchParkingDetails = async () => {
    try {
      const response = await parkingAPI.getParkingDetails(id);
      setParkingDetails(response.data);
    } catch (error) {
      console.error('Error fetching parking details:', error);
    } finally {
      setLoading(false);
    }
  };

  const mockParkingDetails = {
    id: id,
    name: 'Downtown Plaza Parking',
    address: '123 Main St, Downtown',
    image: 'https://images.unsplash.com/photo-1579532586980-284d4fd16b91?w=800',
    rating: 4.5,
    totalSpots: 100,
    availableSpots: 45,
    pricePerHour: 8,
    amenities: ['Covered', 'Security', 'EV Charging', 'Disabled Access', '24/7'],
    operatingHours: '24/7',
    description: 'Premium parking facility in the heart of downtown with state-of-the-art security and EV charging stations.',
    rules: [
      'Valid parking permit must be displayed',
      'Maximum stay: 24 hours',
      'No overnight parking without prior arrangement',
      'Payment required before exit'
    ]
  };

  const parking = parkingDetails || mockParkingDetails;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!bookingData.date) {
      newErrors.date = 'Date is required';
    }

    if (!bookingData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!bookingData.vehicleNumber) {
      newErrors.vehicleNumber = 'Vehicle number is required';
    } else if (!/^[A-Z0-9]{2,10}$/i.test(bookingData.vehicleNumber.replace(/\s/g, ''))) {
      newErrors.vehicleNumber = 'Invalid vehicle number format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotalPrice = () => {
    const rate = parking.pricePerHour || parking.price || 0;
    return rate * bookingData.duration;
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setBookingLoading(true);

    try {
      const startTime = new Date(`${bookingData.date}T${bookingData.startTime}:00`);
      const endTime = new Date(startTime.getTime() + bookingData.duration * 60 * 60 * 1000);

      const bookingPayload = {
        parkingSlotId: parseInt(parking.id),
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        totalAmount: calculateTotalPrice() + 2 // Including service fee
      };

      const response = await parkingAPI.bookParking(bookingPayload);

      navigate('/my-bookings', { // Redirecting to my bookings directly for now
        state: {
          booking: response.data,
          parking: parking
        }
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      setErrors({ submit: error.response?.data?.message || 'Booking failed. Please try again.' });
    } finally {
      setBookingLoading(false);
    }
  };

  const timeSlots = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeSlots.push(time);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/search')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Search
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Book Parking</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleBooking}>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Booking Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={bookingData.date}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        className={`input-field ${errors.date ? 'border-red-500' : ''}`}
                      />
                      {errors.date && (
                        <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Time
                      </label>
                      <select
                        name="startTime"
                        value={bookingData.startTime}
                        onChange={handleChange}
                        className={`input-field ${errors.startTime ? 'border-red-500' : ''}`}
                      >
                        <option value="">Select time</option>
                        {timeSlots.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                      {errors.startTime && (
                        <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (hours)
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="range"
                        name="duration"
                        min="1"
                        max="24"
                        value={bookingData.duration}
                        onChange={handleChange}
                        className="flex-1"
                      />
                      <div className="w-16 text-center">
                        <span className="text-lg font-medium text-gray-900">{bookingData.duration}</span>
                        <span className="text-sm text-gray-600 block">hours</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehicle Number
                    </label>
                    <input
                      type="text"
                      name="vehicleNumber"
                      value={bookingData.vehicleNumber}
                      onChange={handleChange}
                      placeholder="e.g., ABC 1234"
                      className={`input-field ${errors.vehicleNumber ? 'border-red-500' : ''}`}
                    />
                    {errors.vehicleNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.vehicleNumber}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={bookingData.paymentMethod === 'card'}
                        onChange={handleChange}
                        className="h-4 w-4 text-primary-600"
                      />
                      <CreditCard className="h-5 w-5 ml-3 mr-2 text-gray-600" />
                      <div>
                        <div className="font-medium text-gray-900">Credit/Debit Card</div>
                        <div className="text-sm text-gray-600">Pay with your card</div>
                      </div>
                    </label>

                    <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="wallet"
                        checked={bookingData.paymentMethod === 'wallet'}
                        onChange={handleChange}
                        className="h-4 w-4 text-primary-600"
                      />
                      <DollarSign className="h-5 w-5 ml-3 mr-2 text-gray-600" />
                      <div>
                        <div className="font-medium text-gray-900">Wallet Balance</div>
                        <div className="text-sm text-gray-600">Use your wallet balance</div>
                      </div>
                    </label>
                  </div>
                </CardContent>
              </Card>

              {errors.submit && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-sm text-red-700">{errors.submit}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                loading={bookingLoading}
                disabled={bookingLoading}
              >
                {bookingLoading ? 'Processing...' : 'Confirm Booking'}
              </Button>
            </form>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Parking Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <img
                    src={parking.image || 'https://images.unsplash.com/photo-1579532586980-284d4fd16b91?w=800'}
                    alt={parking.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{parking.name}</h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {parking.address}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    {parking.operatingHours || '24/7'}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Car className="h-4 w-4 mr-2" />
                    {parking.availableSpots} of {parking.totalSpots} spots available
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {(parking.amenities || ['Security', '24/7 Access']).map((amenity, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-medium text-gray-900 mb-3">Price Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Base Price</span>
                      <span className="font-medium">${parking.pricePerHour || parking.price}/hour</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Duration</span>
                      <span className="font-medium">{bookingData.duration} hours</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Service Fee</span>
                      <span className="font-medium">$2.00</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-900">Total</span>
                        <span className="text-lg font-bold text-gray-900">
                          ${(calculateTotalPrice() + 2).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div className="text-sm text-green-800">
                      <p className="font-medium mb-1">Free Cancellation</p>
                      <p>Cancel up to 1 hour before start time for a full refund</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
