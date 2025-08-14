import React, { useState, useEffect, useCallback } from 'react';
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
  const [authToken, setAuthToken] = useState(null);

  // API base URL - your backend
  const API_BASE = 'https://aidiy-backend.herokuapp.com';

  // API helper function
  const apiCall = useCallback(async (endpoint, options = {}) => {
    const url = `${API_BASE}${endpoint}`;
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (authToken) {
      defaultOptions.headers.Authorization = `Bearer ${authToken}`;
    }

    const response = await fetch(url, { ...defaultOptions, ...options });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  }, [authToken, API_BASE]);

  // Load user's projects from backend
  const loadUserProjects = useCallback(async () => {
    try {
      const data = await apiCall('/projects');
      setSavedProjects(data.projects || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  }, [apiCall]);

  // Check for existing token on app load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
      fetchCurrentUser(token);
    }
  }, []);

  // Load user's projects when logged in
  useEffect(() => {
    if (isLoggedIn && authToken) {
      loadUserProjects();
    }
  }, [isLoggedIn, authToken, loadUserProjects]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
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

  // Fetch current user info
  const fetchCurrentUser = async (token) => {
    try {
      const response = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsLoggedIn(true);
      } else {
        // Token is invalid, clear it
        localStorage.removeItem('authToken');
        setAuthToken(null);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      localStorage.removeItem('authToken');
      setAuthToken(null);
    }
  };

  // Real authentication functions
  const handleLogin = async (email, password) => {
    try {
      const data = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      setAuthToken(data.token);
      setUser(data.user);
      setIsLoggedIn(true);
      localStorage.setItem('authToken', data.token);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const handleSignup = async (name, email, password) => {
    try {
      const data = await apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });

      setAuthToken(data.token);
      setUser(data.user);
      setIsLoggedIn(true);
      localStorage.setItem('authToken', data.token);
      
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
    }
  };

  const handleLogout = async () => {
    try {
      if (authToken) {
        await apiCall('/auth/logout', { method: 'POST' });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggedIn(false);
      setUser(null);
      setAuthToken(null);
      setSavedProjects([]);
      setActiveTab('new-project');
      localStorage.removeItem('authToken');
    }
  };

  // AI project generation (updated to use new backend structure)
  const generateProjectPlan = async (input, isFollowUp = false) => {
    try {
      const response = await fetch(`${API_BASE}/todos/ai-diy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
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
        aiResponse: "I'd be happy to help you with that project! However, I'm having trouble connecting to the AI service right now."
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

  // Save project to backend (if logged in)
  const handlePublishProject = async () => {
    if (!isLoggedIn) {
      alert('Please log in to save projects');
      return;
    }

    try {
      await apiCall('/projects', {
        method: 'POST',
        body: JSON.stringify({
          conversation: currentConversation,
        }),
      });

      // Reload projects list
      await loadUserProjects();
      setActiveTab('projects');
      setCurrentConversation([]);
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Error saving project. Please try again.');
    }
  };

  const handleBackToNewProject = () => {
    setCurrentConversation([]);
    setActiveTab('new-project');
  };

  // Delete project from backend
  const handleDeleteProject = async (projectId) => {
    if (!isLoggedIn) return;

    try {
      await apiCall(`/projects/${projectId}`, {
        method: 'DELETE',
      });

      // Remove from local state
      setSavedProjects(prev => prev.filter(project => project.id !== projectId));
      
      if (selectedProject && selectedProject.id === projectId) {
        setSelectedProject(null);
        setActiveTab('projects');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project. Please try again.');
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