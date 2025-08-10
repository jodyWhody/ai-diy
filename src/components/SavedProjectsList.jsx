import React from 'react';
import { FolderOpen, Plus, Calendar, Trash2, Eye } from 'lucide-react';
import AIResponseRenderer from './AIResponseRenderer';

const SavedProjectsList = ({ savedProjects, onDeleteProject, onActiveTab, onViewProject }) => {
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProjectTitle = (conversation) => {
    const firstMessage = conversation.find(msg => msg.type === 'user');
    if (!firstMessage) return 'Untitled Project';
    
    const content = firstMessage.content;
    return content.length > 60 ? content.substring(0, 60) + '...' : content;
  };

  if (savedProjects.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center">
          <FolderOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">No Projects Yet</h2>
          <p className="text-gray-400 mb-6">Start building something amazing and publish your first project!</p>
          <button
            onClick={() => onActiveTab('new-project')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center mx-auto"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create New Project
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white">Your Projects</h2>
        <button
          onClick={() => onActiveTab('new-project')}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </button>
      </div>

      <div className="grid gap-4">
        {savedProjects.map((project) => (
          <div key={project.id} className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-gray-600 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {getProjectTitle(project.conversation)}
                </h3>
                <div className="flex items-center text-gray-400 text-sm mb-3">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(project.timestamp)}
                  <span className="mx-2">•</span>
                  <span>{project.conversation.filter(msg => msg.type === 'ai').length} responses</span>
                </div>
                
                {/* Project Preview */}
                <div className="bg-gray-700 rounded-lg p-3 mb-4">
                  <AIResponseRenderer response={project.conversation.find(msg => msg.type === 'ai')?.content} />
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => onViewProject(project)}
                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </button>
                  <button
                    onClick={() => onDeleteProject(project.id)}
                    className="flex items-center bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedProjectsList;