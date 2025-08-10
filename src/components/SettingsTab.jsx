import React from 'react';

const SettingsTab = () => {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-3xl font-bold text-white mb-8">Settings</h2>
      
      <div className="grid gap-6">
        {/* General Settings */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-white mb-4">General Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Email Notifications</div>
                <div className="text-gray-400 text-sm">Receive updates about your projects</div>
              </div>
              <input type="checkbox" className="w-4 h-4" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Auto-save Projects</div>
                <div className="text-gray-400 text-sm">Automatically save projects as drafts</div>
              </div>
              <input type="checkbox" className="w-4 h-4" defaultChecked />
            </div>
          </div>
        </div>

        {/* AI Settings */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-white mb-4">AI Assistant Preferences</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1">Response Detail Level</label>
              <select className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white">
                <option>Detailed (Recommended)</option>
                <option>Concise</option>
                <option>Very Detailed</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Default Project Type</label>
              <select className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white">
                <option>Home Improvement</option>
                <option>Furniture Building</option>
                <option>Outdoor Projects</option>
                <option>Repairs & Maintenance</option>
              </select>
            </div>
          </div>
        </div>

        {/* Keyboard Shortcuts Info */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Keyboard Shortcuts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">New Project</span>
              <span className="text-white font-mono">Ctrl + N</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Projects</span>
              <span className="text-white font-mono">Ctrl + P</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Settings</span>
              <span className="text-white font-mono">Ctrl + ,</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Toggle Sidebar</span>
              <span className="text-white font-mono">Esc</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;