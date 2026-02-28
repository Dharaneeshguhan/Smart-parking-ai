import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, MapPin, Car, Clock, TrendingUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ownerAPI } from '../../services/api';

const MyParkingSlotsPage = () => {
  const [parkingSlots, setParkingSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchParkingSlots();
  }, []);

  const fetchParkingSlots = async () => {
    try {
      setLoading(true);
      const response = await ownerAPI.getParkingSlots();
      // Ensure each slot has some required UI fields like occupancy/revenue if missing from backend
      const data = response.data.map(slot => {
        const total = slot.totalSpots || 0;
        const available = slot.availableSpots || 0;
        const occupancy = total > 0 ? Math.round(((total - available) / total) * 100) : 0;

        return {
          ...slot,
          totalSlots: total,
          availableSlots: available,
          image: slot.image || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
          revenue: slot.revenue || 0,
          occupancy: isNaN(occupancy) ? 0 : occupancy,
          status: 'active' // Default for now
        };
      });
      setParkingSlots(data);
    } catch (error) {
      console.error('Error fetching parking slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSlot = async (id) => {
    if (window.confirm('Are you sure you want to delete this parking slot?')) {
      try {
        await ownerAPI.deleteParkingSlot(id);
        setParkingSlots(parkingSlots.filter(slot => slot.id !== id));
      } catch (error) {
        console.error('Error deleting slot:', error);
        alert('Failed to delete slot');
      }
    }
  };

  const filteredSlots = parkingSlots.filter(slot => {
    const matchesSearch = slot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slot.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || slot.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOccupancyColor = (occupancy) => {
    if (occupancy >= 80) return 'text-red-600';
    if (occupancy >= 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading parking slots...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Parking Slots</h1>
            <p className="mt-2 text-gray-600">Manage your parking locations and track performance</p>
          </div>
          <Link to="/owner/add-slot" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Add New Slot
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Slots</p>
              <p className="text-2xl font-bold text-gray-900">{parkingSlots.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Car className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-2xl font-bold text-gray-900">
                {parkingSlots.reduce((sum, slot) => sum + slot.availableSlots, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ${parkingSlots.reduce((sum, slot) => sum + slot.revenue, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Occupancy</p>
              <p className="text-2xl font-bold text-gray-900">
                {parkingSlots.length > 0
                  ? Math.round(parkingSlots.reduce((sum, slot) => sum + slot.occupancy, 0) / parkingSlots.length)
                  : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search parking slots..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="maintenance">Maintenance</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Parking Slots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSlots.map((slot) => (
          <div key={slot.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${slot.image})` }}>
              <div className="h-full bg-black bg-opacity-40 flex items-end p-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(slot.status)}`}>
                  {slot.status.charAt(0).toUpperCase() + slot.status.slice(1)}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{slot.name}</h3>
              <p className="text-sm text-gray-600 mb-4 flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {slot.address}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Available/Total</p>
                  <p className="text-sm font-medium">
                    {slot.availableSlots}/{slot.totalSlots}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Occupancy</p>
                  <p className={`text-sm font-medium ${getOccupancyColor(slot.occupancy)}`}>
                    {slot.occupancy}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Hourly Rate</p>
                  <p className="text-sm font-medium">${(slot.pricePerHour || 0).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Revenue</p>
                  <p className="text-sm font-medium">${(slot.revenue || 0).toFixed(2)}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 bg-primary-600 text-white px-3 py-2 rounded hover:bg-primary-700 flex items-center justify-center">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteSlot(slot.id)}
                  className="flex-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 flex items-center justify-center"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSlots.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No parking slots found</h3>
          <p className="text-gray-600">
            {searchTerm || filterStatus !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by adding your first parking slot'}
          </p>
        </div>
      )}
    </div>
  );
};

export default MyParkingSlotsPage;
