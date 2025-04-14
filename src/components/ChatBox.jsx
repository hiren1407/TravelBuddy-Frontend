import React, { useState, useRef, useEffect } from 'react';

const ChatBox = ({ onAiResponse }) => {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Hi! I'm Travel Agent. Tell me about your trip and I'll build your itinerary!" },
  ]); // Initialize with the first AI message
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // State to track errors

  const chatContainerRef = useRef(null); // Reference to the chat container
  const dummyRef = useRef(null); // Reference to a dummy element for scrolling

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const tripId = sessionStorage.getItem('user_id'); // Retrieve trip ID (user ID) from session storage
    if (!tripId) {
      console.error('Trip ID not found in session storage.');
      setError('Trip ID not found in session storage.');
      return;
    }

    const userMessage = {
      trip_id: tripId, // Use the user ID as the trip ID
      prompt: newMessage, // User's input message
    };

    // Add the user's message to the chat
    setMessages((prev) => [...prev, { sender: 'user', text: newMessage }]);
    setNewMessage('');
    setLoading(true);
    setError(null); // Reset error state before making the API call

    try {
      const response = await fetch('https://travelbuddy-backend-3o9d.onrender.com/api/v1/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userMessage),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();

      // Add the AI's response to the chat
      setMessages((prev) => [...prev, { sender: 'ai', text: data.follow_up }]);

      // Check if the conversation is complete
      if (data.is_complete) {
        onAiResponse('confirmed'); // Notify the parent component
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Something went wrong while sending your message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Scroll to the bottom of the chat container whenever messages change
  useEffect(() => {
    if (dummyRef.current) {
      dummyRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="m-5 w-full max-w-2xl mx-auto p-5 flex flex-col bg-white shadow-lg rounded-lg">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}
      <div
        ref={chatContainerRef} // Attach the ref to the chat container
        className="flex flex-col gap-4 overflow-y-auto h-96 p-4 bg-gray-100 rounded-lg"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender === 'ai' && (
              <div className="chat-image avatar mr-2">
                <div className="w-10 rounded-full">
                  <img
                    alt="AI Assistant"
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9_TS_juGOZ1RR7tlKL1upTUJR0u6mwby1EA&s"
                  />
                </div>
              </div>
            )}
            <div
              className={`chat-bubble p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-gray-300 text-black rounded-bl-none'
              }`}
            >
              {message.text}
            </div>
            {message.sender === 'user' && (
              <div className="chat-image avatar ml-2">
                <div className="w-10 rounded-full">
                  <img
                    alt="User"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
        {/* Dummy element for scrolling */}
        <div ref={dummyRef}></div>
      </div>

      <div className="p-4 flex gap-2 items-center bg-gray-50 rounded-b-lg">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          className={`btn px-4 py-2 rounded-lg text-white ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default ChatBox;