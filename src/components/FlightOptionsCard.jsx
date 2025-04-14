import React, { useState, useEffect } from 'react';

const FlightOptionsCard = () => {
  const [flights, setFlights] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlightOptions = async () => {
      try {
        setLoading(true);
        const tripId = sessionStorage.getItem('user_id');
        if (!tripId) {
          console.error('Trip ID not found in session storage.');
          setError('Trip ID not found in session storage.');
          setLoading(false);
          return;
        }

        const response = await fetch('https://travelbuddy-backend-3o9d.onrender.com/api/v1/search-flights', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: 'i live in new york', trip_id: tripId }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch flight options');
        }

        const data = await response.json();
        setFlights(data.flights || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching flight options:', err.message);
        setError('Something went wrong while fetching flight options. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchFlightOptions();
  }, []);

  const formatDuration = (duration) => {
    const match = duration?.match(/PT(\d+H)?(\d+M)?/);
    if (!match) return duration;
    const hours = match[1] ? match[1].replace('H', 'h ') : '';
    const minutes = match[2] ? match[2].replace('M', 'm') : '';
    return `${hours}${minutes}`.trim();
  };

  // Format layover duration between segments
  const formatLayoverDuration = (departureTime, arrivalTime) => {
    const departure = new Date(departureTime);
    const arrival = new Date(arrivalTime);
    const durationMs = departure - arrival;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  // Render a flight segment
  const renderSegment = (segment) => {
    return (
      <div className="mb-3 last:mb-0">
        <div className="flex justify-between items-baseline">
          <div className="text-center">
            <p className="text-lg font-bold">
              {new Date(segment.departure.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="text-xs text-gray-500">{segment.departure.airport}</p>
          </div>

          <div className="flex-grow px-3 py-2">
            <div className="relative flex items-center">
              <div className="h-0.5 bg-gray-300 w-full"></div>
              <div className="absolute w-full flex justify-center">
                <span className="bg-white px-2 text-xs text-gray-500">{formatDuration(segment.duration)}</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-lg font-bold">
              {new Date(segment.arrival.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="text-xs text-gray-500">{segment.arrival.airport}</p>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          {segment.airline} • {segment.flight_number}
          {segment.departure.terminal && ` • Terminal ${segment.departure.terminal}`}
        </p>
      </div>
    );
  };

  // Render flight journey (can have multiple segments)
  const renderJourney = (journey, type) => {
    const segments = journey.segments || [];
    const isMultiSegment = segments.length > 1;

    return (
      <div className={`${type === 'return' ? 'pt-3 lg:pt-0 border-t lg:border-t-0 border-gray-200 lg:pl-4' : 'border-r-0 lg:border-r border-gray-200 pr-0 lg:pr-4'}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {type === 'outbound' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              )}
            </svg>
            <span className="font-medium text-gray-700">{type === 'outbound' ? 'Outbound Flight' : 'Return Flight'}</span>
          </div>

          {isMultiSegment && (
            <span className="text-xs font-medium px-2 py-1 bg-amber-50 text-amber-800 rounded-full">
              {journey.stops} {journey.stops === 1 ? 'stop' : 'stops'} • {formatDuration(journey.total_duration)}
            </span>
          )}
        </div>

        {segments.map((segment, i) => (
          <React.Fragment key={i}>
            {renderSegment(segment)}

            {/* Add layover information if this isn't the last segment */}
            {i < segments.length - 1 && (
              <div className="flex items-center my-2 pl-4 border-l-2 border-dashed border-indigo-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs text-amber-700">
                  {formatLayoverDuration(segments[i + 1].departure.time, segment.arrival.time)} layover in {segment.arrival.airport}
                </span>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="flight-options-card bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl shadow-lg w-full border border-gray-200">
      <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
        <span className="inline-block border-b-2 border-indigo-500 pb-1">Flight Options</span>
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

      {!loading && !error && flights.length === 0 && (
        <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          <p className="text-gray-600">No flight options available for your trip.</p>
        </div>
      )}

      {!loading && !error && flights.length > 0 && (
        <div className="space-y-4 overflow-y-auto max-h-[70vh]">
          {flights.map((flight, index) => {
            // Get airlines from all segments for display
            const outboundAirlines = [...new Set(flight.outbound.segments.map(s => s.airline))];
            const returnAirlines = [...new Set(flight.return.segments.map(s => s.airline))];

            return (
              <div
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="p-5">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">
                          {outboundAirlines.join(', ')} + {returnAirlines.join(', ')}
                        </p>
                        <p className="text-sm text-gray-500">
                          Round Trip • {flight.outbound.stops > 0 ? `${flight.outbound.stops} stop${flight.outbound.stops > 1 ? 's' : ''}` : 'Direct'} /
                          {flight.return.stops > 0 ? ` ${flight.return.stops} stop${flight.return.stops > 1 ? 's' : ''}` : ' Direct'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-indigo-600">{flight.price.currency} {flight.price.total}</p>
                      <p className="text-xs text-gray-500">per person</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                    {/* Render outbound and return journeys */}
                    {renderJourney(flight.outbound, 'outbound')}
                    {renderJourney(flight.return, 'return')}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FlightOptionsCard;