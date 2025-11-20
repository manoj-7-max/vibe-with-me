import React from 'react';
import { Plus, LayoutTemplate, Image, LayoutDashboard, Calculator, Clock, ArrowRight, Search, BookOpen, ShoppingBag, Calendar, CheckSquare, Camera } from 'lucide-react';
import { Project, Template } from '../types';
import { SAMPLE_TEMPLATES } from '../constants';

interface DashboardProps {
  projects: Project[];
  onCreateNew: (template?: Template) => void;
  onOpenProject: (project: Project) => void;
  onNavigateToMarket: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ projects, onCreateNew, onOpenProject, onNavigateToMarket }) => {
  return (
    <div className="h-full overflow-y-auto p-6 lg:p-10 bg-dark-bg">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
                <h1 className="text-3xl font-bold mb-2 text-white">Good morning, Creator.</h1>
                <p className="text-zinc-400">Ready to vibe with something new?</p>
            </div>
            <div className="flex gap-3">
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input 
                        type="text" 
                        placeholder="Search projects..." 
                        className="bg-dark-surface border border-dark-border rounded-full pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-vibe-500 transition-colors w-64"
                    />
                </div>
                <button 
                    onClick={() => onCreateNew()}
                    className="flex items-center gap-2 bg-vibe-600 hover:bg-vibe-500 text-white px-5 py-2 rounded-full font-medium shadow-lg shadow-vibe-900/20 transition-all transform hover:scale-105 active:scale-95"
                >
                    <Plus size={18} />
                    <span>New Project</span>
                </button>
            </div>
        </div>

        {/* Templates Section */}
        <section>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Start with a Vibe</h2>
                <button onClick={onNavigateToMarket} className="text-sm text-vibe-400 hover:text-vibe-300 flex items-center gap-1">
                    Visit Marketplace <ArrowRight size={14} />
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {SAMPLE_TEMPLATES.map((template) => (
                    <div 
                        key={template.id}
                        onClick={() => onCreateNew(template)}
                        className="group p-5 bg-dark-surface border border-dark-border hover:border-vibe-500/50 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-vibe-900/10 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-vibe-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10">
                            <div className="w-10 h-10 rounded-lg bg-zinc-800 group-hover:bg-vibe-500/20 text-zinc-400 group-hover:text-vibe-400 flex items-center justify-center mb-4 transition-colors">
                                {getIcon(template.icon)}
                            </div>
                            <h3 className="font-semibold text-white mb-1">{template.name}</h3>
                            <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">{template.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* Projects List */}
        <section>
            <h2 className="text-lg font-semibold text-white mb-6">Your Projects</h2>
            {projects.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-dark-border rounded-2xl">
                    <div className="inline-flex p-4 rounded-full bg-dark-surface text-zinc-500 mb-4">
                        <LayoutDashboard size={24} />
                    </div>
                    <h3 className="text-white font-medium mb-1">No projects yet</h3>
                    <p className="text-zinc-500 text-sm mb-4">Create your first app to see it here.</p>
                    <button 
                        onClick={() => onCreateNew()}
                        className="text-vibe-400 hover:text-vibe-300 text-sm font-medium"
                    >
                        Create New Project
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {projects.map((project) => (
                        <div 
                            key={project.id} 
                            onClick={() => onOpenProject(project)}
                            className="bg-dark-surface group rounded-xl overflow-hidden border border-dark-border hover:border-zinc-600 cursor-pointer transition-all hover:shadow-lg"
                        >
                            <div className="aspect-video bg-zinc-900 relative overflow-hidden flex items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <iframe 
                                    className="w-[200%] h-[200%] origin-top-left transform scale-50 pointer-events-none opacity-50 group-hover:opacity-80 transition-opacity"
                                    srcDoc={project.currentHtml}
                                    title="thumbnail"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="font-medium text-white truncate">{project.name}</h3>
                                <div className="flex items-center gap-2 mt-2 text-xs text-zinc-500">
                                    <Clock size={12} />
                                    <span>{new Date(project.lastModified).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
      </div>
    </div>
  );
};

// Helper for dynamic icons
const getIcon = (name: string) => {
    switch(name) {
        case 'BookOpen': return <BookOpen size={20} />;
        case 'ShoppingBag': return <ShoppingBag size={20} />;
        case 'Calendar': return <Calendar size={20} />;
        case 'Camera': return <Camera size={20} />;
        case 'CheckSquare': return <CheckSquare size={20} />;
        default: return <LayoutTemplate size={20} />;
    }
};