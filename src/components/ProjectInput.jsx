import React, { useState } from 'react';
import { Hammer, ArrowRight } from 'lucide-react';

const ProjectInput = ({ onSubmit }) => {
  const [projectInput, setProjectInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async () => {
    if (!projectInput.trim()) return;
    
    setIsGenerating(true);
    await onSubmit(projectInput);
    setIsGenerating(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-4">Let's create something amazing together</h2>
      </div>

      <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
        <div className="space-y-6">
          <div>
            <textarea
              value={projectInput}
              onChange={(e) => setProjectInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your project... 'I want to renovate my bathroom with a new vanity and modern fixtures' or 'Help me build a custom deck for entertaining'"
              className="w-full h-32 p-4 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-white placeholder-gray-400"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!projectInput.trim() || isGenerating}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed transition-all transform hover:scale-105"
          >
            {isGenerating ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                AI is crafting your plan...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Hammer className="h-5 w-5 mr-2" />
                Let's Build
                <ArrowRight className="h-5 w-5 ml-2" />
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectInput;