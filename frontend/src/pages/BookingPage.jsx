import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Car,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';

import Card, { CardHeader, CardTitle, CardContent } from '../components/Card';
import Button from '../components/Button';
import { parkingAPI } from '../services/api';
import useGeolocation from '../hooks/useGeolocation';

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { location: userLocation } = useGeolocation();

  const [parking, setParking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [bookingData, setBookingData] = useState({
    date: '',
    startTime: '',
    duration: 1,
    vehicleNumber: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchParking();
  }, [id]);

  const fetchParking = async () => {
    try {
      const res = await parkingAPI.getParkingDetails(id);
      setParking(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const err = {};

    if (!bookingData.date) err.date = 'Date required';
    if (!bookingData.startTime) err.startTime = 'Time required';
    if (!bookingData.vehicleNumber) err.vehicleNumber = 'Vehicle number required';

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const totalPrice = () => {
    return (parking?.pricePerHour || 0) * bookingData.duration;
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setBookingLoading(true);

    try {
      await parkingAPI.bookParking({
        parkingSlotId: parking.id,
        startTime: `${bookingData.date}T${bookingData.startTime}:00`,
        totalAmount: totalPrice()
      });

      setShowSuccess(true);
    } catch (e) {
      console.error(e);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  if (showSuccess) {
    return (
      <div className="text-center p-20">
        <CheckCircle className="mx-auto mb-4 text-green-500" />
        <h2 className="text-2xl font-bold">Booking Confirmed</h2>
        <Button onClick={() => navigate('/user/dashboard')}>
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">

      <button onClick={() => navigate('/search')} className="mb-4 flex items-center">
        <ArrowLeft className="mr-2" /> Back
      </button>

      <div className="grid md:grid-cols-2 gap-6">

        {/* FORM */}
        <form onSubmit={handleBooking}>
          <Card>
            <CardHeader>
              <CardTitle>Booking</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">

              <input type="date" name="date" onChange={handleChange} />
              {errors.date && <p className="text-red-500">{errors.date}</p>}

              <input type="time" name="startTime" onChange={handleChange} />
              {errors.startTime && <p className="text-red-500">{errors.startTime}</p>}

              <input
                type="text"
                name="vehicleNumber"
                placeholder="Vehicle Number"
                onChange={handleChange}
              />
              {errors.vehicleNumber && <p className="text-red-500">{errors.vehicleNumber}</p>}

              <Button loading={bookingLoading}>
                Confirm Booking
              </Button>

            </CardContent>
          </Card>
        </form>

        {/* DETAILS */}
        <Card>
          <CardHeader>
            <CardTitle>{parking.name}</CardTitle>
          </CardHeader>

          <CardContent>
            <p>{parking.address}</p>

            <div className="mt-4">
              <p>₹{parking.pricePerHour}/hour</p>
              <p>Total: ₹{totalPrice()}</p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default BookingPage;