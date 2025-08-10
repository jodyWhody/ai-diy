import React from 'react';
import { ArrowLeft, Calendar, Trash2, Hammer } from 'lucide-react';
import AIResponseRenderer from './AIResponseRenderer';

const ProjectDetail = ({ project, onBack, onDelete }) => {
  const getProjectTitle = (conversation) => {
    const firstMessage = conversation.find(msg => msg.type === 'user');
    return firstMessage?.content || 'Untitled Project';
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </button>
        <button
          onClick={() => onDelete(project.id)}
          className="flex items-center text-red-400 hover:text-red-300 transition-colors"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Project
        </button>
      </div>

      {/* Project Header */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          {getProjectTitle(project.conversation)}
        </h1>
        <div className="flex items-center text-gray-400 text-sm">
          <Calendar className="h-4 w-4 mr-1" />
          Created {formatDate(project.timestamp)}
          <span className="mx-2">•</span>
          <span>{project.conversation.filter(msg => msg.type === 'ai').length} AI responses</span>
        </div>
      </div>

      {/* Full Conversation */}
      <div className="space-y-6">
        {project.conversation.map((message, index) => (
          <div key={index}>
            {message.type === 'user' ? (
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 ml-12">
                <div className="flex items-center mb-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-2">
                    <span className="text-white text-xs font-semibold">You</span>
                  </div>
                  <span className="text-gray-400 text-sm">
                    {index === 0 ? 'Original Request' : `Follow-up #${Math.floor(index/2)}`}
                  </span>
                </div>
                <p className="text-white text-lg pl-8">{message.content}</p>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mr-12">
                <div className="flex items-center mb-4">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-2">
                    <Hammer className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-gray-400 text-sm">AI Assistant Response</span>
                </div>
                <div className="pl-8">
                  <AIResponseRenderer response={message.content} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectDetail;