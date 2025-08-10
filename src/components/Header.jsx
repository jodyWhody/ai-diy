import React from 'react';
import { Hammer, LogIn, UserPlus, User } from 'lucide-react';

const Header = ({ isLoggedIn, onLogin, onSignup, user }) => {
  return (
    <div className="flex items-center justify-between py-4 px-6 bg-gray-900 border-b border-gray-700">
      <div className="flex items-center">
        <Hammer className="h-8 w-8 text-blue-400 mr-3" />
        <h1 className="text-3xl font-bold text-white">AI DIY Pro</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        {isLoggedIn ? (
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="text-white text-sm">{user?.name || 'User'}</span>
            </div>
            <button
              onClick={() => {/* handle logout */}}
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <button
              onClick={onLogin}
              className="flex items-center text-blue-400 hover:text-blue-300 text-sm transition-colors"
            >
              <LogIn className="h-4 w-4 mr-1" />
              Login
            </button>
            <button
              onClick={onSignup}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
            >
              <UserPlus className="h-4 w-4 mr-1" />
              Sign Up
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;