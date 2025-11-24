
import React from 'react';
import { Plus, LayoutTemplate, LayoutDashboard, ArrowRight, ShoppingBag, Trash2, Clock } from 'lucide-react';
import { Project, Template } from '../types';
import { SAMPLE_TEMPLATES } from '../constants';

interface DashboardProps {
  projects: Project[];
  onCreateNew: (template?: Template) => void;
  onOpenProject: (project: Project) => void;
  onNavigateToMarket: () => void;
  onDeleteProject: (projectId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ projects, onCreateNew, onOpenProject, onNavigateToMarket, onDeleteProject }) => {
  
  const handleDelete = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation(); // Prevent opening the project
    onDeleteProject(projectId);
  };

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
                 <button 
                    onClick={onNavigateToMarket}
                    className="px-5 py-2.5 rounded-xl border border-dark-border text-white hover:bg-white/5 transition-colors flex items-center gap-2 font-medium"
                >
                    <ShoppingBag size={18} />
                    <span>Marketplace</span>
                </button>
                <button 
                    onClick={() => onCreateNew()}
                    className="px-5 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 transition-colors flex items-center gap-2 font-bold shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                >
                    <Plus size={18} />
                    <span>New Project</span>
                </button>
            </div>
        </div>

        {/* Templates */}
        <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <LayoutTemplate size={18} className="text-vibe-400" />
                    Start from a Template
                </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {SAMPLE_TEMPLATES.map((template) => (
                    <button 
                        key={template.id}
                        onClick={() => onCreateNew(template)}
                        className="group flex flex-col text-left p-5 rounded-2xl bg-dark-surface border border-dark-border hover:border-vibe-500/50 hover:bg-dark-surface/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-vibe-500/10 relative overflow-hidden"
                    >
                        <div className="mb-4 p-3 rounded-xl bg-dark-bg border border-dark-border w-fit text-vibe-400 group-hover:text-vibe-300 group-hover:scale-110 transition-transform duration-300">
                             {/* We render icons dynamically based on the constant, but strictly typing Lucide icons in constants is tricky without JSX. 
                                 For now, simplified to a generic icon or mapping if needed. Using LayoutTemplate as generic fallback. */}
                            <LayoutTemplate size={24} />
                        </div>
                        <h3 className="font-semibold text-white mb-1">{template.name}</h3>
                        <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">{template.description}</p>
                        
                        <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowRight size={16} className="text-vibe-400 -rotate-45" />
                        </div>
                    </button>
                ))}
            </div>
        </div>

        {/* Recent Projects */}
        <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <LayoutDashboard size={18} className="text-vibe-400" />
                    Recent Projects
                </h2>
            </div>

            {projects.length === 0 ? (
                <div className="border border-dashed border-dark-border rounded-2xl p-12 text-center bg-dark-surface/30">
                    <div className="w-16 h-16 bg-dark-surface rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-500">
                        <Plus size={24} />
                    </div>
                    <h3 className="text-white font-medium mb-1">No projects yet</h3>
                    <p className="text-zinc-500 text-sm mb-6">Create your first app to get started.</p>
                    <button onClick={() => onCreateNew()} className="text-vibe-400 hover:text-vibe-300 text-sm font-medium">
                        Create New Project &rarr;
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div 
                            key={project.id}
                            onClick={() => onOpenProject(project)}
                            className="group bg-dark-surface border border-dark-border rounded-2xl overflow-hidden hover:border-vibe-500/50 transition-all duration-300 hover:shadow-2xl cursor-pointer relative"
                        >
                            {/* Thumbnail Area */}
                            <div className="h-48 bg-[#09090b] relative overflow-hidden group-hover:opacity-90 transition-opacity border-b border-white/5">
                                {project.thumbnail ? (
                                    <img src={project.thumbnail} alt={project.name} className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center relative">
                                        <div className="absolute inset-0 bg-[radial-gradient(#3f3f46_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
                                        <div className="text-4xl font-bold text-white/10 select-none tracking-tighter">VIBE</div>
                                    </div>
                                )}
                                
                                <div className="absolute inset-0 bg-gradient-to-t from-dark-surface to-transparent opacity-20"></div>

                                {/* Delete Button - Visible on Hover */}
                                <button
                                    onClick={(e) => handleDelete(e, project.id)}
                                    className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-red-500/20 text-white/70 hover:text-red-400 backdrop-blur-md rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0"
                                    title="Delete Project"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-white text-lg truncate pr-4">{project.name}</h3>
                                </div>
                                <p className="text-sm text-zinc-400 line-clamp-2 mb-4 h-10 leading-relaxed">{project.description}</p>
                                
                                <div className="flex items-center justify-between text-xs text-zinc-500 pt-4 border-t border-dark-border/50">
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={12} />
                                        <span>{new Date(project.lastModified).toLocaleDateString()}</span>
                                    </div>
                                    <span className="group-hover:text-vibe-400 transition-colors">Open Editor &rarr;</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
