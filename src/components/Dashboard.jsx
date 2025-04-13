import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatBox from './ChatBox';
import RouteCard from './RouteCard';
import WeatherCard from './WeatherCard';
import PlacesToVisitCard from './PlacesToVisitCard';
import FlightOptionsCard from './FlightOptionsCard';
import RestaurantCard from './RestaurantCard';
import ItineraryCard from './ItineraryCard';
import HotelCard from './HotelCard';

const Dashboard = () => {
  const [aiConfirmed, setAiConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const userIdKey = 'user_id';
        const userIdTTLKey = 'user_id_ttl';

        const existingUserId = sessionStorage.getItem(userIdKey);
        const existingTTL = sessionStorage.getItem(userIdTTLKey);

        const now = Date.now();

        if (!existingUserId || !existingTTL || now > parseInt(existingTTL, 10)) {
          // Generate a new UUID and set TTL
          const newUserId = uuidv4();
          const ttl = now + 300 * 1000; // 300 seconds TTL

          sessionStorage.setItem(userIdKey, newUserId);
          sessionStorage.setItem(userIdTTLKey, ttl.toString());

          console.log('Generated new user ID:', newUserId);
        } else {
          console.log('Using existing user ID:', existingUserId);
        }
      } catch (err) {
        console.error('Error initializing user:', err.message);
        setError('Something went wrong while initializing the user.');
      }
    };

    initializeUser();
  }, []);

  // Handle transition when AI confirms
  useEffect(() => {
    if (aiConfirmed) {
      setIsLoading(true);

      // Set a 5-second timeout for the loading animation
      const timer = setTimeout(() => {
        setIsLoading(false);
        setShowDashboard(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [aiConfirmed]);

  const handleAiResponse = (response) => {
    if (response === 'confirmed') {
      setAiConfirmed(true);
    }
  };

  const startNewConversation = () => {
    try {
      sessionStorage.removeItem('user_id');
      sessionStorage.removeItem('user_id_ttl');
      window.location.reload();
    } catch (err) {
      console.error('Error starting a new conversation:', err.message);
      setError('Something went wrong while starting a new conversation.');
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold text-red-500 mb-4">Something went wrong</h1>
        <p className="text-lg text-gray-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12 min-h-screen flex flex-col">
      {showDashboard && (
        <button
          onClick={startNewConversation}
          className="fixed top-20 right-4 sm:right-8 z-10 px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 shadow-md"
        >
          Start New Conversation
        </button>
      )}

      {!aiConfirmed ? (
        <div className="flex flex-col items-center py-12 flex-grow">
          <h1 className="text-4xl sm:text-5xl font-bold text-center text-gray-800 mb-6">Welcome to Travel Buddy AI-Agent</h1>
          <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-600 mb-8">Plan your trip with ease!</h2>
          <div className="w-full max-w-3xl">
            <ChatBox onAiResponse={handleAiResponse} />
          </div>
        </div>
      ) : isLoading ? (
        <div className="flex flex-col items-center justify-center flex-grow min-h-screen">
          <div className="w-24 h-24 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin mb-8"></div>
          <h2 className="text-3xl font-bold text-gray-700 mb-3">Building Your Trip...</h2>
          <p className="text-gray-500 text-lg">Preparing your personalized travel experience</p>
          <div className="mt-8 w-64 bg-gray-200 rounded-full h-3">
            <div className="bg-blue-500 h-3 rounded-full animate-pulse"></div>
          </div>
        </div>
      ) : (
        <div className="mt-8 space-y-12 flex-grow">
          {/* Trip Summary Section - Complete container style */}
          <div className="w-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b border-gray-200 pb-2">Trip Summary</h2>
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 w-full overflow-hidden">
              <RouteCard />
            </div>
          </div>

          {/* Trip Planning Section - Equal height cards with shared container */}
          <div className="w-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b border-gray-200 pb-2">Trip Planning</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-1 w-full bg-white rounded-xl shadow-md border border-gray-200 h-[600px] flex flex-col overflow-hidden">
                <div className="flex-grow overflow-auto p-6 w-full h-full">
                  <ItineraryCard />
                </div>
              </div>
              <div className="lg:col-span-1 w-full bg-white rounded-xl shadow-md border border-gray-200 h-[600px] flex flex-col overflow-hidden">
                <div className="flex-grow overflow-auto p-6 w-full h-full">
                  <WeatherCard />
                </div>
              </div>
            </div>
          </div>

          {/* Transportation Section */}
          <div className="w-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b border-gray-200 pb-2">Transportation</h2>
            <FlightOptionsCard />
          </div>

          {/* Accommodation Section */}
          <div className="w-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b border-gray-200 pb-2">Accommodation</h2>
            <HotelCard />
          </div>

          {/* Attractions & Dining Section */}
          <div className="w-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b border-gray-200 pb-2">Attractions & Dining</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-1 w-full">
                <PlacesToVisitCard />
              </div>
              <div className="lg:col-span-1 w-full">
                <RestaurantCard />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;