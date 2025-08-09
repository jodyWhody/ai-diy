import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';  
import ProjectInput from './components/ProjectInput';
import ProjectConversation from './components/ProjectConversation';
import SavedProjectsList from './components/SavedProjectsList';

const App = () => {
  const [activeTab, setActiveTab] = useState('new-project');
  const [currentConversation, setCurrentConversation] = useState([]);
  const [savedProjects, setSavedProjects] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateProjectPlan = async (input, isFollowUp = false) => {
    try {
      const response = await fetch('https://aidiy-backend-f5de524e1808.herokuapp.com/todos/ai-diy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: input,
          context: isFollowUp ? currentConversation : []
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Error calling backend API:', error);
      return {
        response: "I'd be happy to help you with that project! However, I'm having trouble connecting to the AI service right now."
      };
    }
  };

  const handleNewProject = async (input) => {
    setIsGenerating(true);
    try {
      const response = await generateProjectPlan(input);
      const newConversation = [
        { type: 'user', content: input },
        { type: 'ai', content: response }
      ];
      setCurrentConversation(newConversation);
      setActiveTab('conversation');
    } catch (error) {
      console.error('Error generating project plan:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFollowUp = async (input) => {
    setIsGenerating(true);
    try {
      const response = await generateProjectPlan(input, true);
      const newConversation = [
        ...currentConversation,
        { type: 'user', content: input },
        { type: 'ai', content: response }
      ];
      setCurrentConversation(newConversation);
    } catch (error) {
      console.error('Error generating follow-up response:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublishProject = () => {
    const newProject = {
      id: Date.now(),
      conversation: currentConversation,
      timestamp: new Date().toISOString()
    };
    
    setSavedProjects(prev => [newProject, ...prev]);
    setActiveTab('projects');
    setCurrentConversation([]);
  };

  const handleBackToNewProject = () => {
    setCurrentConversation([]);
    setActiveTab('new-project');
  };

  const handleDeleteProject = (projectId) => {
    setSavedProjects(prev => prev.filter(project => project.id !== projectId));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'new-project':
        return <ProjectInput onSubmit={handleNewProject} />;
      case 'conversation':
        return (
          <ProjectConversation
            conversation={currentConversation}
            onFollowUp={handleFollowUp}
            onPublish={handlePublishProject}
            onBack={handleBackToNewProject}
            isGenerating={isGenerating}
          />
        );
      case 'projects':
        return (
          <SavedProjectsList
            savedProjects={savedProjects}
            onDeleteProject={handleDeleteProject}
            onActiveTab={setActiveTab}
          />
        );
      default:
        return <ProjectInput onSubmit={handleNewProject} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        savedProjects={savedProjects}
      />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;