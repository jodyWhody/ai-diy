import React from 'react';
import { FolderOpen, Plus } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, savedProjects }) => {
  const menuItems = [
    {
      id: 'new-project',
      label: 'New Project', 
      icon: Plus,
      count: null
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: FolderOpen,
      count: savedProjects.length
    }
  ];

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 min-h-screen">
      <div className="p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <div className="flex items-center">
                  <Icon className="h-5 w-5 mr-3" />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.count !== null && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    activeTab === item.id ? 'bg-blue-500' : 'bg-gray-600'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;