
import React from 'react';
import { Code2, Home, Settings, Zap, ShoppingBag, LogOut, User as UserIcon } from 'lucide-react';
import { User, AppView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  currentUser: User;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate, currentUser, onLogout }) => {
  return (
    <div className="flex h-screen bg-dark-bg text-white overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-16 md:w-20 lg:w-64 flex-shrink-0 border-r border-dark-border flex flex-col justify-between bg-dark-surface z-20">
        <div>
          <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-dark-border">
            <div className="flex items-center gap-2 text-vibe-400 cursor-pointer" onClick={() => onNavigate(AppView.DASHBOARD)}>
              <Zap className="w-6 h-6 fill-current text-purple-500" />
              <span className="hidden lg:block font-bold text-lg tracking-tight text-white">Vibe With Me</span>
            </div>
          </div>
          
          <nav className="p-2 lg:p-4 space-y-2">
            <SidebarItem 
              icon={<Home size={20} />} 
              label="Dashboard" 
              active={currentView === AppView.DASHBOARD} 
              onClick={() => onNavigate(AppView.DASHBOARD)}
            />
            <SidebarItem 
              icon={<ShoppingBag size={20} />} 
              label="Marketplace" 
              active={currentView === AppView.MARKETPLACE} 
              onClick={() => onNavigate(AppView.MARKETPLACE)}
            />
            <SidebarItem 
              icon={<Code2 size={20} />} 
              label="Snippets" 
              active={currentView === AppView.SNIPPETS} 
              onClick={() => onNavigate(AppView.SNIPPETS)}
            />
            <SidebarItem 
              icon={<Settings size={20} />} 
              label="Settings" 
              active={currentView === AppView.SETTINGS} 
              onClick={() => onNavigate(AppView.SETTINGS)}
            />
          </nav>
        </div>

        <div className="p-4 border-t border-dark-border">
            <div 
                onClick={() => onNavigate(AppView.PROFILE)}
                className={`flex items-center gap-3 p-2 rounded-xl border transition-colors cursor-pointer group ${
                    currentView === AppView.PROFILE 
                    ? 'bg-vibe-500/10 border-vibe-500/30' 
                    : 'bg-white/5 border-white/5 hover:bg-white/10'
                }`}
            >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center overflow-hidden shrink-0">
                   {currentUser.avatar ? (
                       <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                   ) : (
                       <span className="font-bold text-xs">{currentUser.name.charAt(0)}</span>
                   )}
                </div>
                <div className="hidden lg:block flex-1 overflow-hidden">
                    <p className={`text-sm font-medium truncate ${currentView === AppView.PROFILE ? 'text-vibe-400' : 'text-white'}`}>{currentUser.name}</p>
                    <p className="text-xs text-zinc-500 truncate">{currentUser.email || currentUser.phoneNumber}</p>
                </div>
                <button 
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent navigating to profile
                        onLogout();
                    }}
                    className="hidden lg:block text-zinc-500 hover:text-red-400 transition-colors p-1" 
                    title="Sign Out"
                >
                    <LogOut size={16} />
                </button>
            </div>
            <div className="lg:hidden flex justify-center mt-2">
                <button onClick={onLogout} className="text-zinc-500 hover:text-red-400">
                    <LogOut size={20} />
                </button>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        {children}
      </main>
    </div>
  );
};

const SidebarItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
      ${active 
        ? 'bg-vibe-500/10 text-vibe-400 shadow-[0_0_15px_rgba(14,165,233,0.15)]' 
        : 'text-zinc-400 hover:text-white hover:bg-white/5'
      }`}
  >
    <span className={`${active ? 'text-vibe-400' : 'text-zinc-500 group-hover:text-white'}`}>{icon}</span>
    <span className="hidden lg:block font-medium text-sm">{label}</span>
  </button>
);
