import React from 'react';
import { Hammer } from 'lucide-react';

const Header = () => {
  return (
    <div className="flex items-center justify-center py-6 bg-gray-900 border-b border-gray-700">
      <div className="flex items-center">
        <Hammer className="h-8 w-8 text-blue-400 mr-3" />
        <h1 className="text-3xl font-bold text-white">AI DIY Pro</h1>
      </div>
    </div>
  );
};

export default Header;