
import React, { useState } from 'react';
import { Bell, Moon, Shield, Trash2, LogOut, Monitor, Eye, Database, Terminal, Check, Copy } from 'lucide-react';
import { StorageService } from '../services/storage';
import { SUPABASE_SCHEMA_SQL } from '../constants';

export const Settings: React.FC = () => {
  const [isCloud] = useState(StorageService.isCloudEnabled());
  const [showSchema, setShowSchema] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopySchema = () => {
      navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full overflow-y-auto p-6 lg:p-10 bg-dark-bg">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
            <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
            <p className="text-zinc-400">Manage your preferences and account.</p>
        </div>

        {/* Database Connection */}
        <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
            <div className="p-4 border-b border-dark-border bg-white/5">
                <h2 className="font-medium text-white flex items-center gap-2">
                    <Database size={18} className="text-zinc-400" />
                    Database Connection
                </h2>
            </div>
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-white font-medium">Status</p>
                        <p className="text-xs text-zinc-500">
                            {isCloud ? "Connected to Supabase" : "Using Local Browser Storage (Sandbox)"}
                        </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${isCloud ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-orange-500/10 border-orange-500/20 text-orange-400'}`}>
                        {isCloud ? "Live" : "Sandbox"}
                    </div>
                </div>
                
                {isCloud && (
                    <div className="mt-4 pt-4 border-t border-white/5">
                        <button onClick={() => setShowSchema(!showSchema)} className="text-xs text-vibe-400 hover:text-vibe-300 flex items-center gap-1 mb-2">
                            <Terminal size={12} />
                            {showSchema ? "Hide Setup Guide" : "Show Database Setup Guide"}
                        </button>
                        
                        {showSchema && (
                            <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-zinc-400 font-medium">SQL Editor Script</span>
                                    <button onClick={handleCopySchema} className="text-zinc-500 hover:text-white">
                                        {copied ? <Check size={14} className="text-green-400"/> : <Copy size={14}/>}
                                    </button>
                                </div>
                                <pre className="text-[10px] text-zinc-300 font-mono overflow-x-auto whitespace-pre-wrap max-h-40 overflow-y-auto">
                                    {SUPABASE_SCHEMA_SQL}
                                </pre>
                                <p className="text-[10px] text-zinc-500 mt-2">
                                    Run this in your Supabase SQL Editor to create the required tables.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
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