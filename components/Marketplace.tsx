import React, { useState } from 'react';
import { Search, Star, Download, Zap, Filter } from 'lucide-react';
import { MOCK_MARKETPLACE_ITEMS } from '../constants';
import { MarketplaceItem } from '../types';

interface MarketplaceProps {
  onInstall: (item: MarketplaceItem) => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({ onInstall }) => {
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState('');

  const categories = ['All', 'Productivity', 'E-commerce', 'Lifestyle', 'Content'];

  const filteredItems = MOCK_MARKETPLACE_ITEMS.filter(item => {
    const matchesCategory = filter === 'All' || item.category === filter;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="h-full overflow-y-auto bg-dark-bg p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Hero Section */}
        <div className="relative rounded-2xl overflow-hidden border border-dark-border bg-gradient-to-r from-indigo-900/40 to-purple-900/40 p-8 md:p-12">
            <div className="relative z-10 max-w-2xl">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                    Explore the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Vibe Market</span>
                </h1>
                <p className="text-lg text-zinc-300 mb-8">
                    Discover, clone, and remix apps created by the community. From productivity tools to immersive games, find your next vibe here.
                </p>
                <div className="relative max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                    <input 
                        type="text"
                        placeholder="Search for apps, templates, or creators..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-black/30 border border-white/10 rounded-full pl-12 pr-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 backdrop-blur-sm transition-all"
                    />
                </div>
            </div>
            <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-purple-500/10 to-transparent pointer-events-none hidden lg:block" />
        </div>

        {/* Filters */}
        <div className="flex overflow-x-auto pb-2 gap-2 custom-scrollbar">
            {categories.map(cat => (
                <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border
                        ${filter === cat 
                            ? 'bg-white text-black border-white' 
                            : 'bg-dark-surface text-zinc-400 border-dark-border hover:border-zinc-600 hover:text-white'
                        }`}
                >
                    {cat}
                </button>
            ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => (
                <div key={item.id} className="group bg-dark-surface border border-dark-border rounded-xl overflow-hidden hover:border-purple-500/50 transition-all hover:shadow-2xl hover:shadow-purple-900/10 flex flex-col">
                    {/* Thumbnail */}
                    <div className={`h-40 bg-gradient-to-br ${item.previewColor} relative p-6 flex items-center justify-center`}>
                        <div className="w-16 h-16 bg-black/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white/90 shadow-lg">
                            <Zap size={32} fill="currentColor" />
                        </div>
                        <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1 text-xs text-white font-medium">
                            <Star size={12} className="text-yellow-400 fill-current" />
                            {item.rating}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-bold text-white text-lg group-hover:text-purple-400 transition-colors">{item.name}</h3>
                                <p className="text-xs text-zinc-500">by {item.author}</p>
                            </div>
                        </div>
                        
                        <p className="text-zinc-400 text-sm mb-6 line-clamp-2 flex-1">
                            {item.description}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-dark-border/50">
                             <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
                                <Download size={14} />
                                <span>{item.downloads.toLocaleString()} installs</span>
                            </div>
                            <button 
                                onClick={() => onInstall(item)}
                                className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-purple-50 transition-colors"
                            >
                                <span>Remix</span>
                                <Zap size={14} className="fill-current" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {filteredItems.length === 0 && (
            <div className="text-center py-20">
                <Filter className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                <h3 className="text-white font-medium mb-2">No vibes found</h3>
                <p className="text-zinc-500">Try adjusting your search or category filter.</p>
            </div>
        )}
      </div>
    </div>
  );
};