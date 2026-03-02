import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  MapPin,
  Clock,
  DollarSign,
  Star,
  Search,
  Filter,
  X,
  Navigation,
  Car,
  Shield,
  Zap,
  Grid,
  List
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../components/Card';
import Button from '../components/Button';
import { parkingAPI } from '../services/api';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await parkingAPI.getFavorites();
      setFavorites(response.data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const mockFavorites = [
    {
      id: 1,
      name: 'Downtown Plaza Parking',
      address: '123 Main St, Downtown',
      distance: 0.5,
      pricePerHour: 8,
      rating: 4.5,
      totalSpots: 100,
      availableSpots: 45,
      amenities: ['Covered', 'Security', 'EV Charging'],
      image: 'https://images.unsplash.com/photo-1579532586980-284d4fd16b91?w=400',
      operatingHours: '24/7',
      lastVisited: '2024-01-18',
      visitCount: 12,
      isFavorite: true
    },
    {
      id: 2,
      name: 'City Center Garage',
      address: '456 Oak Ave, City Center',
      distance: 0.8,
      pricePerHour: 12,
      rating: 4.2,
      totalSpots: 200,
      availableSpots: 23,
      amenities: ['Covered', 'Security', 'Disabled Access'],
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      operatingHours: '6AM - 11PM',
      lastVisited: '2024-01-15',
      visitCount: 8,
      isFavorite: true
    },
    {
      id: 3,
      name: 'Airport Parking Lot',
      address: '789 Airport Rd',
      distance: 2.5,
      pricePerHour: 15,
      rating: 4.7,
      totalSpots: 500,
      availableSpots: 180,
      amenities: ['Shuttle Service', 'Security', 'Long-term'],
      image: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=400',
      operatingHours: '24/7',
      lastVisited: '2024-01-10',
      visitCount: 5,
      isFavorite: true
    },
    {
      id: 4,
      name: 'Shopping Mall Parking',
      address: '321 Commerce St',
      distance: 1.2,
      pricePerHour: 5,
      rating: 4.0,
      totalSpots: 300,
      availableSpots: 120,
      amenities: ['Covered', 'Security', 'Free 2hrs'],
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400',
      operatingHours: '8AM - 10PM',
      lastVisited: '2024-01-08',
      visitCount: 15,
      isFavorite: true
    }
  ];

  const favoritesData = favorites.length > 0 ? favorites : mockFavorites;

  const filteredFavorites = favoritesData.filter(favorite =>
    favorite.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    favorite.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedFavorites = [...filteredFavorites].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price':
        return (a.pricePerHour || a.price) - (b.pricePerHour || b.price);
      case 'distance':
        return a.distance - b.distance;
      case 'rating':
        return b.rating - a.rating;
      case 'visits':
        return b.visitCount - a.visitCount;
      default:
        return 0;
    }
  });

  const toggleFavorite = async (parkingId) => {
    try {
      const favorite = favoritesData.find(f => f.id === parkingId);
      if (favorite.isFavorite) {
        await parkingAPI.removeFromFavorites(parkingId);
        setFavorites(prev => prev.filter(f => f.id !== parkingId));
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const getAvailabilityColor = (available, total) => {
    const avail = available !== undefined ? available : 0;
    const percentage = (avail / (total || 1)) * 100;
    if (percentage > 50) return 'text-green-600 bg-green-100';
    if (percentage > 20) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getAvailabilityText = (available, total) => {
    const avail = available !== undefined ? available : 0;
    const percentage = (avail / (total || 1)) * 100;
    if (percentage > 50) return 'High Availability';
    if (percentage > 20) return 'Limited Spots';
    return 'Almost Full';
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
                  <h1 className="text-2xl font-bold text-gray-900">Favorite Parking Spots</h1>
                  <p className="text-sm text-gray-600">Quick access to your preferred parking locations</p>
                </div>
                <Link to="/search">
                  <Button>
                    <Search className="h-4 w-4 mr-2" />
                    Find More
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Search and Controls */}
            <Card className="mb-6">
              <CardContent>
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        placeholder="Search favorite spots..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-field pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="input-field w-40"
                    >
                      <option value="name">Sort by Name</option>
                      <option value="price">Sort by Price</option>
                      <option value="distance">Sort by Distance</option>
                      <option value="rating">Sort by Rating</option>
                      <option value="visits">Sort by Visits</option>
                    </select>
                    <div className="flex border border-gray-300 rounded-lg">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-gray-600'}`}
                      >
                        <Grid className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-gray-600'}`}
                      >
                        <List className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{favoritesData.length}</div>
                  <div className="text-sm text-gray-600">Total Favorites</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {favoritesData.reduce((sum, f) => sum + f.visitCount, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Visits</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    ${favoritesData.reduce((sum, f) => sum + (f.pricePerHour || f.price || 0), 0) / favoritesData.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Avg Price/hr</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {favoritesData.reduce((sum, f) => sum + f.rating, 0) / favoritesData.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Avg Rating</div>
                </CardContent>
              </Card>
            </div>

            {/* Favorites Grid/List */}
            {sortedFavorites.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedFavorites.map((favorite) => (
                    <Card key={favorite.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                      <div className="relative">
                        <img
                          src={favorite.image || 'https://images.unsplash.com/photo-1579532586980-284d4fd16b91?w=400'}
                          alt={favorite.name}
                          className="w-full h-48 object-cover"
                        />
                        <button
                          onClick={() => toggleFavorite(favorite.id)}
                          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                        >
                          <Heart className="h-5 w-5 text-red-500 fill-current" />
                        </button>
                        <div className="absolute bottom-3 left-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(favorite.predictedAvailableSpots ?? favorite.availableSpots, favorite.totalSpots)}`}>
                            {getAvailabilityText(favorite.predictedAvailableSpots ?? favorite.availableSpots, favorite.totalSpots)}
                          </span>
                        </div>
                      </div>

                      <CardContent>
                        <div className="mb-3">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{favorite.name}</h3>
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <MapPin className="h-4 w-4 mr-1" />
                            {favorite.address}
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center text-gray-600">
                              <Navigation className="h-4 w-4 mr-1" />
                              {favorite.distance} mi away
                            </div>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                              <span className="text-gray-700">{favorite.rating}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <span className="text-2xl font-bold text-gray-900">${favorite.pricePerHour || favorite.price}</span>
                            <span className="text-sm text-gray-600">/hour</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-600">
                              {favorite.predictedAvailableSpots ?? favorite.availableSpots} of {favorite.totalSpots} spots
                            </div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {(favorite.amenities || ['Covered', 'Security']).slice(0, 3).map((amenity, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700"
                              >
                                {amenity}
                              </span>
                            ))}
                            {(favorite.amenities || []).length > 3 && (
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                                +{(favorite.amenities || []).length - 3} more
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center text-sm text-gray-600 mb-4">
                          <Clock className="h-4 w-4 mr-1" />
                          {favorite.operatingHours || '24/7'}
                        </div>

                        <div className="border-t pt-3">
                          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                            <span>Last visited: {favorite.lastVisited ? new Date(favorite.lastVisited).toLocaleDateString() : 'N/A'}</span>
                            <span>{favorite.visitCount || 0} visits</span>
                          </div>
                          <Link to={`/booking/${favorite.id}`}>
                            <Button className="w-full">
                              Book Now
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedFavorites.map((favorite) => (
                    <Card key={favorite.id} className="hover:shadow-md transition-shadow">
                      <CardContent>
                        <div className="flex items-start">
                          <img
                            src={favorite.image || 'https://images.unsplash.com/photo-1579532586980-284d4fd16b91?w=400'}
                            alt={favorite.name}
                            className="w-24 h-24 object-cover rounded-lg mr-4"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">{favorite.name}</h3>
                                <p className="text-sm text-gray-600">{favorite.address}</p>
                              </div>
                              <button
                                onClick={() => toggleFavorite(favorite.id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                              >
                                <Heart className="h-5 w-5 fill-current" />
                              </button>
                            </div>

                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center">
                                <Navigation className="h-4 w-4 mr-1" />
                                {favorite.distance} mi
                              </div>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                                {favorite.rating}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {favorite.operatingHours || '24/7'}
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-xl font-bold text-gray-900">${favorite.pricePerHour || favorite.price}</span>
                                <span className="text-sm text-gray-600">/hour</span>
                                <span className="ml-2 text-sm text-gray-600">
                                  ({favorite.predictedAvailableSpots ?? favorite.availableSpots}/{favorite.totalSpots} available)
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">
                                  {favorite.visitCount || 0} visits
                                </span>
                                <Link to={`/booking/${favorite.id}`}>
                                  <Button size="small">Book Now</Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No favorite spots yet</h3>
                  <p className="text-gray-600 mb-4">
                    {searchQuery ? 'Try adjusting your search' : 'Start adding your preferred parking locations'}
                  </p>
                  <Link to="/search">
                    <Button>Find Parking</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;
