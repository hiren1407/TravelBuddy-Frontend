import React, { useState, useEffect } from 'react';

const RestaurantCard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const tripId = sessionStorage.getItem('user_id');
        if (!tripId) {
          console.error('Trip ID not found in session storage.');
          setError('Trip ID not found in session storage.');
          setLoading(false);
          return;
        }

        const response = await fetch('https://travelbuddy-backend-3o9d.onrender.com/api/v1/restaurants', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ trip_id: tripId }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch restaurants');
        }

        const data = await response.json();
        setRestaurants(data.restaurants || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching restaurants:', err.message);
        setError('Something went wrong while fetching restaurants. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <div className="restaurant-card bg-gradient-to-br from-rose-50 to-orange-50 p-6 rounded-xl shadow-lg w-full mt-8 border border-gray-200">
      <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
        <span className="inline-block border-b-2 border-rose-500 pb-1">Recommended Restaurants</span>
      </h3>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 shadow-sm">
          <p className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </p>
        </div>
      )}

      {!loading && !error && restaurants.length === 0 && (
        <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v4m0 2v4m-2-2h4m6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-600">No restaurant recommendations available yet.</p>
        </div>
      )}

      {!loading && !error && restaurants.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto">
          {restaurants.map((restaurant, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl hover:transform hover:-translate-y-1 flex flex-col h-full"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={restaurant?.photo_url || 'https://via.placeholder.com/300x200?text=Restaurant'}
                  alt={restaurant.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=Restaurant' }}
                />
                {restaurant.price_level && (
                  <div className="absolute top-0 right-0 bg-rose-500 text-white px-3 py-1 rounded-bl-lg font-medium">
                    {'$'.repeat(restaurant.price_level)}
                  </div>
                )}
              </div>

              <div className="p-4 flex-grow">
                <h4 className="text-lg font-bold text-gray-900 mb-2">{restaurant.name}</h4>

                <div className="flex items-start gap-1 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-gray-700">{restaurant.address}</p>
                </div>

                {restaurant.rating && (
                  <div className="flex items-center mb-3">
                    <div className="flex mr-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-4 w-4 ${i < Math.floor(restaurant.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">{restaurant.rating}</span>
                  </div>
                )}

                {restaurant.categories && restaurant.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {restaurant.categories.map((category, idx) => (
                      <span key={idx} className="bg-rose-100 text-rose-800 text-xs px-2 py-1 rounded">
                        {category}
                      </span>
                    ))}
                  </div>
                )}

                {restaurant.description && (
                  <p className="text-gray-600 text-sm">{restaurant.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantCard;