
import React, { useState, useEffect } from 'react';
import { User, Project } from '../types';
import { StorageService } from '../services/storage';
import { Edit3, Mail, Phone, Calendar, Shield, Trophy, Layout, Code2 } from 'lucide-react';

interface ProfileProps {
  user: User;
}

export const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [projectsCount, setProjectsCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);

  useEffect(() => {
    const loadStats = async () => {
      const projects = await StorageService.getProjects(user.id);
      setProjectsCount(projects.length);
    };
    loadStats();
  }, [user.id]);

  const handleSave = async () => {
    // In a real app, this would call an API
    // For now, we just toggle edit mode off as a simulation
    setIsEditing(false);
  };

  return (
    <div className="h-full overflow-y-auto p-6 lg:p-10 bg-dark-bg">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header Card */}
        <div className="bg-dark-surface border border-dark-border rounded-2xl p-8 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
           
           <div className="relative flex flex-col md:flex-row items-end md:items-center gap-6 pt-12">
              <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-dark-surface bg-zinc-800 overflow-hidden shadow-xl">
                     {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-zinc-500">
                            {user.name.charAt(0)}
                        </div>
                     )}
                  </div>
                  <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-4 border-dark-surface" title="Online"></div>
              </div>
              
              <div className="flex-1 mb-2">
                {isEditing ? (
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        className="bg-black/30 border border-white/10 rounded-lg px-3 py-1 text-2xl font-bold text-white focus:outline-none focus:border-vibe-500 mb-1 w-full md:w-auto"
                    />
                ) : (
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        {name}
                        {user.provider === 'google' && <span className="bg-blue-500/10 text-blue-400 text-xs px-2 py-1 rounded-full border border-blue-500/20 font-medium flex items-center gap-1">Google</span>}
                    </h1>
                )}
                <div className="flex flex-col md:flex-row gap-2 md:gap-6 text-zinc-400 text-sm mt-2">
                    <div className="flex items-center gap-2">
                        {user.email ? <Mail size={14} /> : <Phone size={14} />}
                        <span>{user.email || user.phoneNumber}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        <span>Joined {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
                    </div>
                </div>
              </div>

              <button 
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border flex items-center gap-2
                    ${isEditing 
                        ? 'bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20' 
                        : 'bg-dark-bg border-dark-border text-zinc-300 hover:text-white hover:border-zinc-500'
                    }`}
              >
                {isEditing ? 'Save Changes' : (
                    <>
                        <Edit3 size={14} />
                        <span>Edit Profile</span>
                    </>
                )}
              </button>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-dark-surface border border-dark-border rounded-xl p-6 hover:border-vibe-500/30 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
                    <Layout size={20} />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{projectsCount}</div>
                <div className="text-sm text-zinc-500">Total Projects</div>
            </div>

            <div className="bg-dark-surface border border-dark-border rounded-xl p-6 hover:border-vibe-500/30 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center mb-4">
                    <Trophy size={20} />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{projectsCount * 150}</div>
                <div className="text-sm text-zinc-500">Vibe Score</div>
            </div>

            <div className="bg-dark-surface border border-dark-border rounded-xl p-6 hover:border-vibe-500/30 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
                    <Shield size={20} />
                </div>
                <div className="text-3xl font-bold text-white mb-1">Pro</div>
                <div className="text-sm text-zinc-500">Plan Status</div>
            </div>
        </div>

        {/* Badges/Achievements Mock */}
        <div>
            <h2 className="text-lg font-semibold text-white mb-4">Achievements</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Badge icon={<Code2 />} label="Early Adopter" color="text-yellow-400" bg="bg-yellow-500/10" />
                <Badge icon={<Layout />} label="First App" color="text-purple-400" bg="bg-purple-500/10" />
                <Badge icon={<Shield />} label="Verified" color="text-green-400" bg="bg-green-500/10" />
                <div className="border border-dashed border-dark-border rounded-xl p-4 flex flex-col items-center justify-center text-zinc-600 gap-2 min-h-[100px]">
                    <span className="text-xs font-medium">More coming soon</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const Badge = ({ icon, label, color, bg }: any) => (
    <div className={`rounded-xl p-4 flex flex-col items-center justify-center gap-3 border border-white/5 ${bg}`}>
        <div className={`${color}`}>{React.cloneElement(icon, { size: 24 })}</div>
        <span className={`text-xs font-medium ${color}`}>{label}</span>
    </div>
);
