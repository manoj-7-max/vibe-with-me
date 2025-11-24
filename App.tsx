
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Editor } from './components/Editor';
import { Marketplace } from './components/Marketplace';
import { Profile } from './components/Profile';
import { Settings } from './components/Settings';
import { Snippets } from './components/Snippets';
import { Auth } from './components/Auth';
import { Project, AppView, Template, MarketplaceItem, User } from './types';
import { generateAppCode } from './services/gemini';
import { StorageService } from './services/storage';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  
  const [view, setView] = useState<AppView>(AppView.DASHBOARD);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // Check for session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const user = await StorageService.getCurrentUser();
        if (user) {
          setCurrentUser(user);
          await loadProjects(user.id);
        }
      } catch (e) {
        console.error("Session check failed", e);
      } finally {
        setIsAuthLoading(false);
      }
    };
    checkSession();
  }, []);

  const loadProjects = async (userId: string) => {
    try {
      const userProjects = await StorageService.getProjects(userId);
      setProjects(userProjects);
    } catch (e) {
      console.error("Failed to load projects", e);
    }
  };

  const handleLogin = async (user: User) => {
    setCurrentUser(user);
    await loadProjects(user.id);
  };

  const handleLogout = async () => {
    await StorageService.signOut();
    setCurrentUser(null);
    setProjects([]);
    setActiveProject(null);
    setView(AppView.DASHBOARD);
  };

  const handleCreateProject = async (template?: Template) => {
    if (!currentUser) return;

    try {
      const newProject = await StorageService.createProject(currentUser.id, template);
      
      // Optimistic update
      setProjects(prev => [newProject, ...prev]);
      
      // If using a template, pre-fill history and generate
      if (template) {
         initializeProjectWithPrompt(newProject, template.prompt);
      } else {
         setActiveProject(newProject);
         setView(AppView.EDITOR);
      }
    } catch (e) {
      console.error("Failed to create project", e);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
      if (window.confirm("Are you sure you want to delete this project? This cannot be undone.")) {
          try {
              await StorageService.deleteProject(projectId);
              setProjects(prev => prev.filter(p => p.id !== projectId));
              if (activeProject?.id === projectId) {
                  setActiveProject(null);
                  setView(AppView.DASHBOARD);
              }
          } catch (e) {
              console.error("Failed to delete project", e);
          }
      }
  };

  const initializeProjectWithPrompt = async (project: Project, prompt: string) => {
    // Set initial state for immediate UI feedback
    setActiveProject(project);
    setView(AppView.EDITOR);
    
    // Add system message locally first
    const initialMsg = {
        id: Date.now().toString(),
        role: 'user' as const,
        content: prompt,
        timestamp: new Date()
    };
    
    const projectWithMsg = { ...project, history: [initialMsg] };
    
    // Update local state
    handleUpdateProject(projectWithMsg);

    // Trigger AI
    try {
        const result = await generateAppCode(prompt);
        const updatedProject = {
            ...projectWithMsg,
            name: result.title || projectWithMsg.name,
            currentHtml: result.html,
            history: [...projectWithMsg.history, {
                id: (Date.now() + 1).toString(),
                role: 'assistant' as const,
                content: result.explanation,
                timestamp: new Date()
            }]
        };
        handleUpdateProject(updatedProject);
    } catch (e) {
        console.error("Generation failed", e);
        const errorProject = {
           ...projectWithMsg,
           history: [...projectWithMsg.history, {
                id: (Date.now() + 1).toString(),
                role: 'system' as const,
                content: "Failed to generate initial code. Please try describing your idea again.",
                timestamp: new Date()
           }]
        };
        handleUpdateProject(errorProject);
    }
  };

  const handleInstallFromMarketplace = async (item: MarketplaceItem) => {
    if (!currentUser) return;
    
    const newProject = await StorageService.createProject(currentUser.id, {
      name: item.name,
      description: `Remixed from ${item.name} by ${item.author}`
    });
    
    initializeProjectWithPrompt(newProject, item.prompt);
  };

  const handleUpdateProject = async (updated: Project) => {
    // Update local state immediately for responsiveness
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
    setActiveProject(updated);
    
    // Sync to DB
    try {
        await StorageService.updateProject(updated);
    } catch (e) {
        console.error("Failed to save project", e);
    }
  };

  const handleOpenProject = (project: Project) => {
    setActiveProject(project);
    setView(AppView.EDITOR);
  };

  const handleNavigate = (targetView: AppView) => {
    setView(targetView);
    if (targetView !== AppView.EDITOR) {
        setActiveProject(null);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="h-screen w-full bg-[#09090b] flex items-center justify-center text-white">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/10"></div>
          <div className="text-sm text-zinc-500">Loading Vibe...</div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <Layout 
      currentView={view} 
      onNavigate={handleNavigate} 
      currentUser={currentUser}
      onLogout={handleLogout}
    >
      {view === AppView.DASHBOARD && (
        <Dashboard 
          projects={projects} 
          onCreateNew={handleCreateProject}
          onOpenProject={handleOpenProject}
          onNavigateToMarket={() => handleNavigate(AppView.MARKETPLACE)}
          onDeleteProject={handleDeleteProject}
        />
      )}
      {view === AppView.MARKETPLACE && (
        <Marketplace 
          onInstall={handleInstallFromMarketplace}
        />
      )}
      {view === AppView.PROFILE && (
        <Profile user={currentUser} />
      )}
      {view === AppView.SETTINGS && (
        <Settings />
      )}
       {view === AppView.SNIPPETS && (
        <Snippets />
      )}
      {view === AppView.EDITOR && activeProject && (
        <Editor 
          project={activeProject} 
          onUpdateProject={handleUpdateProject}
          onBack={() => handleNavigate(AppView.DASHBOARD)}
        />
      )}
    </Layout>
  );
};

export default App;
