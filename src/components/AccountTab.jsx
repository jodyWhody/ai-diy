import React from 'react';
import { User, LogIn } from 'lucide-react';

const AccountTab = ({ user, isLoggedIn, savedProjects = [] }) => {
  if (!isLoggedIn) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center">
          <User className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Account Access</h2>
          <p className="text-gray-400 mb-6">Please log in to view your account details</p>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center mx-auto">
            <LogIn className="h-5 w-5 mr-2" />
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-3xl font-bold text-white mb-8">Account Settings</h2>
      
      <div className="grid gap-6">
        {/* Profile Info */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Profile Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1">Name</label>
              <input 
                type="text" 
                value={user?.name || 'John Doe'} 
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white" 
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Email</label>
              <input 
                type="email" 
                value={user?.email || 'john@example.com'} 
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white" 
              />
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              Save Changes
            </button>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Usage Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {savedProjects ? savedProjects.length : 0}
              </div>
              <div className="text-gray-400 text-sm">Projects Created</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {savedProjects ? savedProjects.reduce((total, project) => {
                  if (project && project.conversation && Array.isArray(project.conversation)) {
                    return total + project.conversation.filter(msg => msg && msg.type === 'ai').length;
                  }
                  return total;
                }, 0) : 0}
              </div>
              <div className="text-gray-400 text-sm">AI Responses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">Free</div>
              <div className="text-gray-400 text-sm">Current Plan</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {savedProjects ? savedProjects.filter(project => {
                  if (project && project.timestamp) {
                    const today = new Date().toDateString();
                    const projectDate = new Date(project.timestamp).toDateString();
                    return today === projectDate;
                  }
                  return false;
                }).length : 0}
              </div>
              <div className="text-gray-400 text-sm">Projects Today</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountTab;