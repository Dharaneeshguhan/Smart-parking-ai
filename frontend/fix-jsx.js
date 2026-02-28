const fs = require('fs');
const content = fs.readFileSync('src/pages/ParkingSearchPage.jsx', 'utf-8');

// Replace the problematic nested section mapping logic cleanly
const fixed = content.replace(
    /\{\s*parkingData\.map\(\(spot, index\) => \([\s\S]*?\}\s*\)\s*\}/,
    `{parkingData.map((spot, index) => (
            <Card key={spot.id} className={\`overflow-hidden hover:shadow-xl transition-all duration-300 \${index === 0 && userLocation ? 'ring-2 ring-yellow-400 transform hover:-translate-y-1' : ''}\`}>
              <div className="relative">
                {index === 0 && userLocation && (
                  <div className="absolute top-0 left-0 w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-bold px-3 py-1.5 flex items-center justify-center z-10 shadow-sm">
                    <Star className="h-3 w-3 mr-1 fill-current" /> BEST SLOT MATCH
                  </div>
                )}
                <img
                  src={spot.image || 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=400'}
                  alt={spot.name}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => toggleFavorite(spot.id)}
                  className={\`absolute \${index === 0 && userLocation ? 'top-10' : 'top-3'} right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow z-10\`}
                >
                  <Heart
                    className={\`h-5 w-5 \${favorites.includes(spot.id) ? 'text-red-500 fill-current' : 'text-gray-400'}\`}
                  />
                </button>
                <div className="absolute bottom-3 left-3 flex flex-col gap-2">
                  <span className={\`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-md \${getAvailabilityColor(spot.predictedAvailableSpots || spot.availableSpots, spot.totalSpots)}\`}>
                    <Zap className="h-3 w-3 mr-1" />
                    AI Prediction: {getAvailabilityText(spot.predictedAvailableSpots || spot.availableSpots, spot.totalSpots)}
                  </span>
                </div>
              </div>

              <CardContent>
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{spot.name}</h3>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {spot.address}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-md">
                      <Navigation className="h-4 w-4 mr-1" />
                      {spot.distance} km
                    </div>
                    {spot.trafficLevel && (
                      <div className={\`flex items-center text-xs px-2 py-1 rounded-md font-medium \${spot.trafficLevel === 'High' ? 'bg-red-50 text-red-600' : spot.trafficLevel === 'Medium' ? 'bg-yellow-50 text-yellow-600' : 'bg-green-50 text-green-600'}\`}>
                        Traffic: {spot.trafficLevel}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3 border-t border-gray-100 pt-3">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">\${spot.pricePerHour || spot.price}</span>
                    <span className="text-sm text-gray-600">/hour</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-800">
                      {spot.predictedAvailableSpots || spot.availableSpots} <span className="text-gray-500 font-normal">of {spot.totalSpots} spots</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {spot.amenities.slice(0, 3).map((amenity, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700"
                      >
                        {amenity}
                      </span>
                    ))}
                    {spot.amenities.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                        +{spot.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <Clock className="h-4 w-4 mr-1" />
                  {spot.operatingHours}
                </div>

                <Link to={\`/booking/\${spot.id}\`}>
                  <Button className="w-full">
                    Book Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}`
);

// End tags
const final = fixed.replace(
    /\{\s*!\s*loading.*\n.*\n.*\n.*\n.*\n.*\n.*\n.*\n.*\n.*\n.*\n.*\n.*\n.*\n.*\n.*\n.*\n.*\n.*\n.*\n.*\n.*\n.*\n.*\}\s*<\/\s*div\s*>\s*<\/\s*div\s*>\s*\);\s*\};\s*export default/gs,
    `      {!loading && parkingData.length === 0 && (
        <div className="text-center py-12">
          <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No parking spots found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filters to find available parking</p>
          <Button onClick={() => {
            setSearchQuery('');
            setFilters({
              priceRange: [0, 50],
              distance: 5,
              availability: 'all',
              amenities: []
            });
          }}>
            Clear Search
          </Button>
        </div>
      )}
    </div>
    </div>
  );
};
export default`
);
fs.writeFileSync('src/pages/ParkingSearchPage.jsx', final, 'utf-8');
console.log('Fixed JSX');
