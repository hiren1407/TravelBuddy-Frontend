import React, { useState, useEffect } from 'react';

const ItineraryCard = () => {
  const [itinerary, setItinerary] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        setLoading(true);
        const tripId = sessionStorage.getItem('user_id');
        if (!tripId) {
          console.error('Trip ID not found in session storage.');
          setError('Trip ID not found in session storage.');
          setLoading(false);
          return;
        }

        const response = await fetch('https://travelbuddy-backend-3o9d.onrender.com/api/v1/itinerary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ trip_id: tripId }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch itinerary');
        }

        const data = await response.json();
        setItinerary(data.itinerary);
        setError(null);
      } catch (err) {
        console.error('Error fetching itinerary:', err.message);
        setError('Something went wrong while fetching itinerary. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchItinerary();
  }, []);

  return (
    <div className="itinerary-card h-full w-full">
      <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
        <span className="inline-block border-b-2 border-indigo-500 pb-1">Your Itinerary</span>
      </h3>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
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

      {!loading && !error && (
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 overflow-y-auto">
          {itinerary ? (
            <div className="prose prose-sm max-w-none text-gray-700">
              {itinerary.split('\n').map((paragraph, index) => {
                // Check if the paragraph is a date header (Day 1, Day 2, etc.)
                if (/^Day \d+:/.test(paragraph)) {
                  return (
                    <h4 key={index} className="text-lg font-bold text-indigo-700 mt-4 mb-2">
                      {paragraph}
                    </h4>
                  );
                }
                // Otherwise render as paragraph
                return paragraph ? <p key={index} className="mb-2">{paragraph}</p> : <br key={index} />;
              })}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-20">No itinerary available yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ItineraryCard;