const fs = require('fs');
const content = fs.readFileSync('src/pages/ParkingSearchPage.jsx', 'utf-8');

// The error is around line 370 matching the CardContent closing tag.
const fixed = content.replace(
    /\{\s*showFilters && \([\s\S]*?\}\s*\)\s*\}\s*<\/\s*CardContent\s*>\s*<\/\s*Card\s*>/,
    `{showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range (per hour)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={filters.priceRange[1]}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        priceRange: [prev.priceRange[0], parseInt(e.target.value)]
                      }))}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-600 w-16">
                      \${filters.priceRange[0]} - \${filters.priceRange[1]}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Distance (miles)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={filters.distance}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        distance: parseInt(e.target.value)
                      }))}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-600 w-8">{filters.distance} mi</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                  </label>
                  <select
                    value={filters.availability}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      availability: e.target.value
                    }))}
                    className="input-field"
                  >
                    <option value="all">All</option>
                    <option value="available">Available Now</option>
                    <option value="upcoming">Available Soon</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setFilters({
                    priceRange: [0, 50],
                    distance: 5,
                    availability: 'all',
                    amenities: []
                  })}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>`
);

// End tags
const final = fixed.replace(
    /\{\s*!\s*loading\s*&&\s*parkingData\.length\s*===\s*0\s*&&.*\n.*\}\s*<\/\s*div\s*>\s*<\/\s*div\s*>\s*<\/\s*div\s*>\s*\);\s*\};\s*export default/gs,
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
console.log('Fixed JSX Card');
