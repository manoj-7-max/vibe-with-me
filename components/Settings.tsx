
import React from 'react';
import { Bell, Moon, Shield, Trash2, LogOut, Monitor, Eye, Database } from 'lucide-react';

export const Settings: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto p-6 lg:p-10 bg-dark-bg">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
            <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
            <p className="text-zinc-400">Manage your preferences and account.</p>
        </div>

        {/* Appearance */}
        <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
            <div className="p-4 border-b border-dark-border bg-white/5">
                <h2 className="font-medium text-white flex items-center gap-2">
                    <Monitor size={18} className="text-zinc-400" />
                    Appearance
                </h2>
            </div>
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-white font-medium">Theme</p>
                        <p className="text-xs text-zinc-500">Customize the interface look.</p>
                    </div>
                    <div className="flex items-center bg-black/30 rounded-lg p-1 border border-dark-border">
                        <button className="px-3 py-1.5 rounded-md bg-zinc-800 text-white text-xs font-medium shadow-sm flex items-center gap-2">
                            <Moon size={12} /> Dark
                        </button>
                        <button className="px-3 py-1.5 rounded-md text-zinc-500 text-xs font-medium hover:text-zinc-300" disabled>
                            Light
                        </button>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm text-white font-medium">Developer Mode</p>
                        <p className="text-xs text-zinc-500">Show raw code in editor by default.</p>
                    </div>
                    <Toggle />
                </div>
            </div>
        </div>

        {/* Privacy & Data */}
        <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
            <div className="p-4 border-b border-dark-border bg-white/5">
                 <h2 className="font-medium text-white flex items-center gap-2">
                    <Shield size={18} className="text-zinc-400" />
                    Privacy & Data
                </h2>
            </div>
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm text-white font-medium">Public Profile</p>
                        <p className="text-xs text-zinc-500">Allow others to see your Vibe Score.</p>
                    </div>
                    <Toggle defaultChecked />
                </div>
                 <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm text-white font-medium">Clear Local Cache</p>
                        <p className="text-xs text-zinc-500">Remove temporary generation files.</p>
                    </div>
                    <button className="text-xs text-zinc-400 hover:text-white border border-dark-border px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-2">
                        <Database size={12} /> Clear
                    </button>
                </div>
            </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-500/5 border border-red-500/10 rounded-xl overflow-hidden">
             <div className="p-4 border-b border-red-500/10 bg-red-500/5">
                 <h2 className="font-medium text-red-400 flex items-center gap-2">
                    <Trash2 size={18} />
                    Danger Zone
                </h2>
            </div>
             <div className="p-4">
                <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm text-white font-medium">Delete All Projects</p>
                        <p className="text-xs text-red-400/70">This action cannot be undone.</p>
                    </div>
                    <button className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-colors font-medium">
                        Delete Everything
                    </button>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

const Toggle = ({ defaultChecked }: { defaultChecked?: boolean }) => (
    <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" defaultChecked={defaultChecked} className="sr-only peer" />
        <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-vibe-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-vibe-600"></div>
    </label>
);
