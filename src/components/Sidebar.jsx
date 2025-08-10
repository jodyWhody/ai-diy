import React from 'react';
import { FolderOpen, Plus, User, Settings, ArrowLeft, ArrowRight } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, savedProjects, isLoggedIn, isCollapsed, setIsCollapsed }) => {
  const menuItems = [
    {
      id: 'new-project',
      label: 'New Project', 
      icon: Plus,
      count: null,
      requiresAuth: false
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: FolderOpen,
      count: savedProjects.length,
      requiresAuth: false
    },
    {
      id: 'account',
      label: 'Account',
      icon: User,
      count: null,
      requiresAuth: true
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      count: null,
      requiresAuth: false
    }
  ];

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-gray-800 border-r border-gray-700 min-h-screen transition-all duration-300`}>
      <div className="p-4">
        {/* Toggle Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            {isCollapsed ? (
              <ArrowRight className="h-4 w-4" />
            ) : (
              <ArrowLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isDisabled = item.requiresAuth && !isLoggedIn;
            
            return (
              <button
                key={item.id}
                onClick={() => !isDisabled && setActiveTab(item.id)}
                disabled={isDisabled}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-3 rounded-lg transition-colors ${
                  isDisabled 
                    ? 'text-gray-500 cursor-not-allowed'
                    : activeTab === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                title={isCollapsed ? item.label : ''}
              >
                <div className="flex items-center">
                  <Icon className="h-5 w-5" />
                  {!isCollapsed && (
                    <>
                      <span className="font-medium ml-3">{item.label}</span>
                      {isDisabled && <span className="text-xs ml-2">(Login)</span>}
                    </>
                  )}
                </div>
                {!isCollapsed && item.count !== null && (
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