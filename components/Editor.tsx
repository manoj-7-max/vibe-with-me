import React, { useState, useRef, useEffect } from 'react';
import { Send, Play, Code, Monitor, Smartphone, Tablet, Download, ChevronLeft, Loader2 } from 'lucide-react';
import { Project, ChatMessage } from '../types';
import { generateAppCode } from '../services/gemini';

interface EditorProps {
  project: Project;
  onUpdateProject: (updatedProject: Project) => void;
  onBack: () => void;
}

export const Editor: React.FC<EditorProps> = ({ project, onUpdateProject, onBack }) => {
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showCode, setShowCode] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [project.history]);

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    const updatedHistory = [...project.history, userMessage];
    // Optimistic update
    onUpdateProject({ ...project, history: updatedHistory });
    setInput('');
    setIsGenerating(true);

    try {
      const response = await generateAppCode(userMessage.content, project.currentHtml);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.explanation,
        timestamp: new Date(),
      };

      const updatedProject: Project = {
        ...project,
        name: project.name === 'Untitled Project' && response.title ? response.title : project.name,
        currentHtml: response.html,
        lastModified: new Date(),
        history: [...updatedHistory, assistantMessage]
      };

      onUpdateProject(updatedProject);
    } catch (error) {
      console.error("Generation failed", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'system',
        content: "Sorry, I encountered an error generating the code. Please check your API key or try again.",
        timestamp: new Date(),
      };
      onUpdateProject({ ...project, history: [...updatedHistory, errorMessage] });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([project.currentHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.replace(/\s+/g, '-').toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-full flex-col md:flex-row">
      
      {/* Left Panel: Chat Interface */}
      <div className="w-full md:w-[400px] lg:w-[450px] flex flex-col border-r border-dark-border bg-dark-surface z-10 shadow-2xl">
        <div className="h-14 border-b border-dark-border flex items-center px-4 gap-3 bg-dark-bg/50 backdrop-blur-md sticky top-0">
            <button onClick={onBack} className="text-zinc-400 hover:text-white transition-colors">
                <ChevronLeft size={20} />
            </button>
            <h2 className="font-semibold text-sm text-white truncate flex-1">{project.name}</h2>
            <span className="text-xs px-2 py-1 rounded-full bg-vibe-900/30 text-vibe-400 border border-vibe-500/20">
                Live
            </span>
        </div>

        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
            {project.history.length === 0 && (
                <div className="mt-10 text-center space-y-4 px-4">
                    <div className="w-16 h-16 mx-auto bg-vibe-500/10 rounded-2xl flex items-center justify-center text-vibe-400 mb-4">
                        <Code size={32} />
                    </div>
                    <h3 className="text-white font-medium">Start Building</h3>
                    <p className="text-sm text-zinc-400">Describe what you want to see. For example:</p>
                    <div className="text-left text-xs space-y-2">
                         <button onClick={() => setInput("A minimal personal website with a dark theme and a contact form.")} className="block w-full p-3 rounded-lg bg-dark-bg border border-dark-border hover:border-vibe-500/50 transition-colors text-zinc-300">
                            "A minimal personal website..."
                        </button>
                        <button onClick={() => setInput("A dashboard for a crypto exchange with a live chart placeholder.")} className="block w-full p-3 rounded-lg bg-dark-bg border border-dark-border hover:border-vibe-500/50 transition-colors text-zinc-300">
                            "Crypto dashboard with charts..."
                        </button>
                    </div>
                </div>
            )}
            {project.history.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`
                        max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm
                        ${msg.role === 'user' 
                            ? 'bg-vibe-600 text-white rounded-tr-none' 
                            : msg.role === 'system'
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : 'bg-dark-bg border border-dark-border text-zinc-200 rounded-tl-none'}
                    `}>
                        {msg.content}
                    </div>
                </div>
            ))}
            {isGenerating && (
                 <div className="flex justify-start">
                    <div className="bg-dark-bg border border-dark-border px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-3">
                        <Loader2 className="w-4 h-4 text-vibe-400 animate-spin" />
                        <span className="text-xs text-zinc-400 animate-pulse">Generating code...</span>
                    </div>
                </div>
            )}
        </div>

        <div className="p-4 border-t border-dark-border bg-dark-surface">
            <div className="relative">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    placeholder="Describe changes or new features..."
                    className="w-full bg-dark-bg border border-dark-border rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-vibe-500 focus:ring-1 focus:ring-vibe-500 resize-none h-24 transition-all"
                />
                <button 
                    onClick={handleSend}
                    disabled={!input.trim() || isGenerating}
                    className="absolute right-3 bottom-3 p-2 bg-vibe-600 hover:bg-vibe-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Send size={16} />
                </button>
            </div>
        </div>
      </div>

      {/* Right Panel: Preview */}
      <div className="flex-1 flex flex-col bg-zinc-900/50 relative overflow-hidden">
        {/* Preview Toolbar */}
        <div className="h-14 border-b border-dark-border bg-dark-surface flex items-center justify-between px-4">
            <div className="flex items-center bg-dark-bg rounded-lg p-1 border border-dark-border">
                <button 
                    onClick={() => setViewport('desktop')}
                    className={`p-2 rounded-md transition-all ${viewport === 'desktop' ? 'bg-dark-surface shadow-sm text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                    title="Desktop View"
                >
                    <Monitor size={16} />
                </button>
                <button 
                    onClick={() => setViewport('tablet')}
                    className={`p-2 rounded-md transition-all ${viewport === 'tablet' ? 'bg-dark-surface shadow-sm text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                    title="Tablet View"
                >
                    <Tablet size={16} />
                </button>
                <button 
                    onClick={() => setViewport('mobile')}
                    className={`p-2 rounded-md transition-all ${viewport === 'mobile' ? 'bg-dark-surface shadow-sm text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                    title="Mobile View"
                >
                    <Smartphone size={16} />
                </button>
            </div>

            <div className="flex items-center gap-2">
                 <button 
                    onClick={() => setShowCode(!showCode)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors
                        ${showCode ? 'bg-vibe-500/10 border-vibe-500/30 text-vibe-400' : 'bg-dark-bg border-dark-border text-zinc-400 hover:text-white'}
                    `}
                >
                    <Code size={14} />
                    <span>Code</span>
                </button>
                <button 
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-dark-bg border border-dark-border text-zinc-400 hover:text-white transition-colors"
                >
                    <Download size={14} />
                    <span>Export</span>
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 transition-colors">
                    <Play size={14} fill="currentColor" />
                    <span>Publish</span>
                </button>
            </div>
        </div>

        {/* Render Area */}
        <div className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-hidden relative">
             {/* Background Grid Pattern */}
             <div className="absolute inset-0 opacity-20 pointer-events-none" 
                style={{ 
                    backgroundImage: 'radial-gradient(#3f3f46 1px, transparent 1px)', 
                    backgroundSize: '24px 24px' 
                }} 
            />

            {showCode ? (
                <div className="w-full h-full bg-[#1e1e1e] rounded-lg shadow-2xl overflow-auto border border-dark-border p-4 text-sm font-mono">
                    <pre className="text-zinc-300">
                        <code>{project.currentHtml}</code>
                    </pre>
                </div>
            ) : (
                <div 
                    className={`
                        transition-all duration-500 ease-in-out bg-white shadow-2xl overflow-hidden border border-zinc-800
                        ${viewport === 'desktop' ? 'w-full h-full rounded-lg' : ''}
                        ${viewport === 'tablet' ? 'w-[768px] h-[1024px] rounded-xl my-auto' : ''}
                        ${viewport === 'mobile' ? 'w-[375px] h-[812px] rounded-[3rem] border-[8px] border-zinc-800' : ''}
                    `}
                >
                    <iframe 
                        srcDoc={project.currentHtml}
                        className="w-full h-full bg-white"
                        title="Live Preview"
                        sandbox="allow-scripts allow-modals allow-forms allow-popups allow-same-origin"
                    />
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
