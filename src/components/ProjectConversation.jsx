import React, { useState } from 'react';
import { Hammer, ArrowLeft, Send, BookOpen } from 'lucide-react';
import AIResponseRenderer from './AIResponseRenderer';

const ProjectConversation = ({ conversation, onFollowUp, onPublish, onBack, isGenerating }) => {
  const [followUpInput, setFollowUpInput] = useState('');

  const handleFollowUpSubmit = async () => {
    if (!followUpInput.trim()) return;
    
    await onFollowUp(followUpInput);
    setFollowUpInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleFollowUpSubmit();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Back Navigation */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          New Project
        </button>
      </div>

      {/* Conversation History */}
      <div className="space-y-4 mb-8">
        {conversation.map((message, index) => (
          <div key={index}>
            {message.type === 'user' ? (
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 ml-12">
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-2">
                    <span className="text-white text-xs font-semibold">You</span>
                  </div>
                  <span className="text-gray-400 text-sm">
                    {index === 0 ? 'Project Request' : 'Follow-up'}
                  </span>
                </div>
                <p className="text-white pl-8">{message.content}</p>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mr-12">
                <div className="flex items-center mb-4">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-2">
                    <Hammer className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-gray-400 text-sm">AI Assistant</span>
                </div>
                <div className="pl-8">
                  <AIResponseRenderer response={message.content} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Follow-up Input */}
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 mb-8 border border-gray-700">
        <div className="relative">
          <textarea
            value={followUpInput}
            onChange={(e) => setFollowUpInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Need changes? Add details? Ask questions..."
            className="w-full h-20 p-4 pr-12 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-white placeholder-gray-400"
            disabled={isGenerating}
          />
          <button
            onClick={handleFollowUpSubmit}
            disabled={!followUpInput.trim() || isGenerating}
            className="absolute bottom-3 right-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed transition-all"
          >
            {isGenerating ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-700 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-600 transition-colors border border-gray-600"
        >
          Start New Project
        </button>
        <button
          onClick={onPublish}
          className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all flex items-center justify-center"
        >
          <BookOpen className="h-5 w-5 mr-2" />
          Publish Project
        </button>
      </div>
    </div>
  );
};

export default ProjectConversation;