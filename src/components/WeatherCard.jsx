import React, { useState, useEffect } from 'react';

const WeatherCard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        const tripId = sessionStorage.getItem('user_id');
        if (!tripId) {
          console.error('Trip ID not found in session storage.');
          setError('Trip ID not found in session storage.');
          setLoading(false);
          return;
        }

        const response = await fetch('https://travelbuddy-backend-3o9d.onrender.com/api/v1/smart-weather', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ trip_id: tripId }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();
        setWeatherData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching weather data:', err.message);
        setError('Something went wrong while fetching weather data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  const getWeatherIcon = (condition) => {
    const icons = {
      rain: 'https://cdn-icons-png.flaticon.com/512/1163/1163624.png',
      cloudy: 'https://cdn-icons-png.flaticon.com/512/1163/1163625.png',
      sunny: 'https://cdn-icons-png.flaticon.com/512/869/869869.png',
      default: 'https://cdn-icons-png.flaticon.com/512/869/869869.png',
    };

    if (!condition) return icons.default;

    if (condition.toLowerCase().includes('rain')) return icons.rain;
    if (condition.toLowerCase().includes('cloud')) return icons.cloudy;
    if (condition.toLowerCase().includes('sunny') || condition.toLowerCase().includes('clear')) return icons.sunny;
    return icons.default;
  };

  const renderWeatherRow = (forecast, cityName, trip_dates, weatherType = 'forecast', note = null) => {
    if (!forecast || Object.keys(forecast).length === 0) {
      return <p className="text-center text-gray-500 italic py-4">No forecast data available</p>;
    }

    // For dates beyond 14 days, we need to adjust the date format
    let filteredDates = [];
    if (weatherType === 'historical') {
      // For historical data, we don't filter by trip dates because the dates are from last year
      // Instead, we show all the historical data with a note that it's from last year
      filteredDates = Object.entries(forecast);
    } else {
      // For regular forecast data, filter by trip dates
      filteredDates = Object.entries(forecast).filter(([date]) =>
        date >= trip_dates?.start && date <= trip_dates?.end
      );
    }

    if (filteredDates.length === 0) {
      return <p className="text-center text-gray-500 italic py-4">No forecast data for trip dates</p>;
    }

    return (
      <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
        <h4 className="text-lg font-bold mb-3 text-blue-700 border-b pb-2">{cityName}</h4>

        {/* Display note for historical data */}
        {weatherType === 'historical' && (
          <div className="mb-3 p-3 bg-amber-50 text-amber-800 rounded-md border border-amber-200">
            <p className="flex items-center text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Historical weather data from the same time last year (for reference).
              Actual conditions may vary.
            </p>
          </div>
        )}

        {/* Display custom note if provided */}
        {note && (
          <div className="mb-3 p-3 bg-blue-50 text-blue-800 rounded-md border border-blue-200">
            <p className="text-sm">{note}</p>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filteredDates.map(([date, details]) => {
            // For historical data, adjust the display date to show current year
            let displayDate = date;
            if (weatherType === 'historical') {
              const originalDate = new Date(date);
              const currentYear = new Date().getFullYear();
              const adjustedDate = new Date(originalDate);
              adjustedDate.setFullYear(currentYear);
              displayDate = adjustedDate.toISOString().split('T')[0];
            }

            return (
              <div key={date} className={`bg-gradient-to-b ${weatherType === 'historical' ? 'from-amber-50' : 'from-blue-50'} to-white rounded-lg p-3 text-center shadow-sm border border-gray-100`}>
                <h5 className="text-sm font-bold text-gray-700 mb-1">{displayDate}</h5>
                <img
                  src={getWeatherIcon(details?.condition)}
                  alt={details?.condition || 'Weather condition'}
                  className="w-12 h-12 mx-auto mb-2"
                />
                <p className="text-sm font-medium text-gray-700">{details?.condition || 'No data'}</p>
                <p className="text-sm font-bold mt-1">
                  {details?.avg_temp_c !== null && details?.avg_temp_c !== undefined ? (
                    <span className={`${weatherType === 'historical' ? 'text-amber-600' : 'text-blue-600'}`}>
                      {details.avg_temp_c}°C
                    </span>
                  ) : (
                    <span className="text-gray-500">--°C</span>
                  )}
                </p>
                {details?.humidity && (
                  <p className="text-xs text-gray-500 mt-1">
                    Humidity: {details.humidity}%
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="weather-card h-full w-full">
      <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
        <span className="inline-block border-b-2 border-blue-500 pb-1">Weather Forecast</span>
      </h3>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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

      {!loading && !error && weatherData && (
        <div className="space-y-6 overflow-y-auto">
          {weatherData.origin_weather && renderWeatherRow(
            weatherData.origin_weather.forecast,
            weatherData.origin_weather.city,
            weatherData.trip_dates,
            weatherData.origin_weather.type,
            weatherData.origin_weather.note
          )}

          {weatherData.destination_weather && renderWeatherRow(
            weatherData.destination_weather.forecast,
            weatherData.destination_weather.city,
            weatherData.trip_dates,
            weatherData.destination_weather.type,
            weatherData.destination_weather.note
          )}
        </div>
      )}
    </div>
  );
};

export default WeatherCard;