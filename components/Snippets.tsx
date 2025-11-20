
import React from 'react';
import { Copy, Layout, Menu, Box, Image, Check } from 'lucide-react';

export const Snippets: React.FC = () => {
  const snippets = [
    {
        id: 'hero1',
        name: 'Modern Hero Section',
        category: 'Layout',
        description: 'Centered hero with gradient text and dual buttons.',
        code: `<section class="bg-zinc-900 text-white py-20 px-4 text-center">
  <h1 class="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">Build something amazing</h1>
  <p class="text-zinc-400 text-xl max-w-2xl mx-auto mb-8">Launch your next big idea with speed and style.</p>
  <div class="flex gap-4 justify-center">
    <button class="px-8 py-3 rounded-full bg-white text-black font-medium hover:bg-zinc-200">Get Started</button>
    <button class="px-8 py-3 rounded-full border border-zinc-700 hover:border-white">Learn More</button>
  </div>
</section>`
    },
    {
        id: 'card1',
        name: 'Glassmorphism Card',
        category: 'Component',
        description: 'Frosted glass effect card with border glow.',
        code: `<div class="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-white/20 transition-all">
  <div class="w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center mb-4">
    <svg class="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
  </div>
  <h3 class="text-lg font-semibold text-white mb-2">Lightning Fast</h3>
  <p class="text-zinc-400 text-sm">Optimized for performance and user experience.</p>
</div>`
    },
    {
        id: 'nav1',
        name: 'Sticky Navbar',
        category: 'Navigation',
        description: 'Top navigation bar with logo and links.',
        code: `<nav class="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur-md px-6 h-16 flex items-center justify-between">
  <div class="font-bold text-xl text-white">Brand</div>
  <div class="hidden md:flex gap-6 text-sm font-medium text-zinc-400">
    <a href="#" class="hover:text-white transition-colors">Features</a>
    <a href="#" class="hover:text-white transition-colors">Pricing</a>
    <a href="#" class="hover:text-white transition-colors">About</a>
  </div>
  <button class="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-500">Login</button>
</nav>`
    }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // In a real app, would show a toast
  };

  return (
    <div className="h-full overflow-y-auto p-6 lg:p-10 bg-dark-bg">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
            <h1 className="text-3xl font-bold text-white mb-2">Snippets Library</h1>
            <p className="text-zinc-400">Copy-paste ready components for your projects.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {snippets.map((snippet) => (
                <div key={snippet.id} className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-dark-border bg-black/20 flex items-center justify-between">
                        <div>
                            <h3 className="font-medium text-white">{snippet.name}</h3>
                            <span className="text-xs text-zinc-500 bg-white/5 px-2 py-0.5 rounded mt-1 inline-block">{snippet.category}</span>
                        </div>
                        <button 
                            onClick={() => copyToClipboard(snippet.code)}
                            className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors group relative"
                            title="Copy HTML"
                        >
                            <Copy size={18} />
                        </button>
                    </div>
                    <div className="p-4 bg-[#0d0d10] text-xs font-mono text-zinc-300 overflow-x-auto relative group">
                        <pre><code>{snippet.code}</code></pre>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d10] to-transparent opacity-50 pointer-events-none"></div>
                    </div>
                    <div className="p-3 bg-white/5 border-t border-dark-border text-xs text-zinc-500">
                        {snippet.description}
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
