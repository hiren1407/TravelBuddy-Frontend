import React from 'react';

const About = () => {
  const teamMembers = [
    {
      name: 'Hiren Khanchandani',
      
      image: 'https://media.licdn.com/dms/image/v2/D4E03AQFAjqvGYuLt6w/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1719015431922?e=1750291200&v=beta&t=_oLm4OREeS4h6oyXISKZJlRWFFRsOR3IYZfkM6Cqfsw',
      linkedin: 'https://www.linkedin.com/in/johndoe',
    },
    {
      name: 'Pradyumna Upadhyay',
      
      image: 'https://media.licdn.com/dms/image/v2/D4E35AQEQ3R-wt2y2Sg/profile-framedphoto-shrink_400_400/B4EZYL.AxTHgAc-/0/1743957527937?e=1745280000&v=beta&t=Knl823F3IP-UY5TgXxQo9bL1vT-Pe_3QDQiSTeKur9o',
      linkedin: 'https://www.linkedin.com/in/pradyumnaupadhyay28/',
    },
    {
      name: 'Jayesh Pamnani',
      
      image: 'https://media.licdn.com/dms/image/v2/D4D35AQGoP6uXyhopcA/profile-framedphoto-shrink_400_400/profile-framedphoto-shrink_400_400/0/1729619260879?e=1745280000&v=beta&t=AF4LK1Om6vKPpWIiUA5v53V2SHRxziWtG--7cZ_ZBho',
      linkedin: 'https://www.linkedin.com/in/jayeshpamnani/',
    },
    {
      name: 'Eshaan Bajpai',
      
      image: 'https://media.licdn.com/dms/image/v2/D5635AQG1or-g3AYnGw/profile-framedphoto-shrink_400_400/profile-framedphoto-shrink_400_400/0/1727571109274?e=1745280000&v=beta&t=t8HxN-uissJ8r_l-CoZMBlooG5NT0FE9Ss0cF_Wk_so',
      linkedin: 'https://www.linkedin.com/in/ishaanbajpai/',
    },
  ];

  return (
    <div className="m-5 p-5 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6">About TravelBuddy</h1>
      <p className="text-lg text-gray-700 mb-8">
        TravelBuddy is your ultimate travel companion, designed to help you plan and organize your trips effortlessly. 
        Whether you're exploring new destinations or revisiting your favorite spots, TravelBuddy provides personalized 
        itineraries, recommendations, and seamless communication with our AI-powered travel assistant. Let us make your 
        travel experience unforgettable!
      </p>

      <h2 className="text-2xl font-semibold text-center mb-4">Meet the Team</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* 2x2 grid for medium screens and above */}
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-col items-center text-center"
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-24 h-24 rounded-full mb-4"
            />
            <h3 className="text-lg font-semibold">{member.name}</h3>
           
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-blue-500 hover:underline"
            >
              LinkedIn Profile
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;