import React from 'react';
import { FolderOpen, Plus, Calendar, Trash2 } from 'lucide-react';
import AIResponseRenderer from './AIResponseRenderer';

const SavedProjectsList = ({ savedProjects, onDeleteProject, onActiveTab }) => {
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
    return content.length > 50 ? content.substring(0, 50) + '...' : content;
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

      <div className="grid gap-6">
        {savedProjects.map((project) => (
          <div key={project.id} className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-gray-600 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {getProjectTitle(project.conversation)}
                </h3>
                <div className="flex items-center text-gray-400 text-sm mb-4">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(project.timestamp)}
                  <span className="mx-2">•</span>
                  <span>{project.conversation.filter(msg => msg.type === 'ai').length} responses</span>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <AIResponseRenderer response={project.conversation.find(msg => msg.type === 'ai')?.content} />
                </div>
              </div>
              <button
                onClick={() => onDeleteProject(project.id)}
                className="ml-4 p-2 text-gray-400 hover:text-red-400 transition-colors"
                title="Delete Project"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedProjectsList;