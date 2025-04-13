import React, { useState, useEffect } from 'react';

const RouteCard = () => {
  const [routeInfo, setRouteInfo] = useState(null);

  useEffect(() => {
    const fetchRouteInfo = async () => {
      try {
        const tripId = sessionStorage.getItem('user_id'); // Retrieve trip_id from session storage
        if (!tripId) {
          console.error('Trip ID not found in session storage.');
          return;
        }

        const response = await fetch('https://travelbuddy-backend-3o9d.onrender.com/api/v1/route-summary', {
          method: 'POST', // Use POST request
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ trip_id: tripId }), // Pass trip_id in the request body
        });

        if (!response.ok) {
          throw new Error('Failed to fetch route information');
        }

        const data = await response.json();
        setRouteInfo(data); // Assuming the API returns the `summary` field
      } catch (err) {
        console.error('Error fetching route information:', err.message);
      }
    };

    fetchRouteInfo();
  }, []);

  if (!routeInfo) {
    return <div className="text-center">Loading route information...</div>;
  }

  return (
    <div className="route-card bg-gray-100 p-4 rounded-lg shadow-md float-left">
      <h3 className="text-lg font-bold mb-2">Route Information</h3>
      <p>{routeInfo.summary}</p>
    </div>
  );
};

export default RouteCard;