import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';  
import ProjectInput from './components/ProjectInput';
import ProjectConversation from './components/ProjectConversation';
import SavedProjectsList from './components/SavedProjectsList';
import ProjectDetail from './components/ProjectDetail';
import AccountTab from './components/AccountTab';
import SettingsTab from './components/SettingsTab';

const App = () => {
  const [activeTab, setActiveTab] = useState('new-project');
  const [currentConversation, setCurrentConversation] = useState([]);
  const [savedProjects, setSavedProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only trigger if not typing in an input/textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'n':
            e.preventDefault();
            setActiveTab('new-project');
            break;
          case 'p':
            e.preventDefault();
            setActiveTab('projects');
            break;
          case ',':
            e.preventDefault();
            setActiveTab('settings');
            break;
          default:
            // Do nothing for other keys
            break;
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setIsSidebarCollapsed(!isSidebarCollapsed);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarCollapsed]);

  // Mock login functions (replace with real auth later)
  const handleLogin = () => {
    setIsLoggedIn(true);
    setUser({ name: 'John Doe', email: 'john@example.com' });
  };

  const handleSignup = () => {
    setIsLoggedIn(true);
    setUser({ name: 'New User', email: 'user@example.com' });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setActiveTab('new-project');
  };

  // Your existing API function
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
    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject(null);
      setActiveTab('projects');
    }
  };

  const handleViewProject = (project) => {
    setSelectedProject(project);
    setActiveTab('project-detail');
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
    setActiveTab('projects');
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
            onViewProject={handleViewProject}
          />
        );
      case 'project-detail':
        return selectedProject ? (
          <ProjectDetail
            project={selectedProject}
            onBack={handleBackToProjects}
            onDelete={handleDeleteProject}
          />
        ) : null;
      case 'account':
        return <AccountTab user={user} isLoggedIn={isLoggedIn} savedProjects={savedProjects} />;
      case 'settings':
        return <SettingsTab />;
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
        isLoggedIn={isLoggedIn}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />
      <div className="flex-1 flex flex-col">
        <Header 
          isLoggedIn={isLoggedIn}
          onLogin={handleLogin}
          onSignup={handleSignup}
          onLogout={handleLogout}
          user={user}
        />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;