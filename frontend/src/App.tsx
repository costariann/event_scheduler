import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import EventDashboard from './components/EventDashboard';
import { useAuth } from './context/AuthContext';

const App: React.FC = () => {
  const [isNewUser, setIsNewUser] = useState(false);
  const { token } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      {!token ? (
        <div className="max-w-md w-full">
          {isNewUser ? <Register /> : <Login />}
          <p className="mt-4 text-center text-gray-600">
            {isNewUser ? 'Already have an account?' : 'New user?'}
            <button
              onClick={() => setIsNewUser(!isNewUser)}
              className="ml-2 text-blue-600 hover:underline"
            >
              {isNewUser ? 'Login' : 'Register'}
            </button>
          </p>
        </div>
      ) : (
        <EventDashboard />
      )}
    </div>
  );
};

export default App;
