
export interface User {
  id: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  avatar?: string;
  createdAt: Date;
  provider: 'email' | 'google' | 'phone';
}

export interface UserStats {
  projectCount: number;
  totalEdits: number;
  lastActive: Date;
}

export interface Project {
  id: string;
  userId: string; // Foreign key to User
  name: string;
  description: string;
  lastModified: Date;
  thumbnail?: string;
  currentHtml: string;
  history: ChatMessage[];
  snapshots?: Snapshot[];
}

export interface Snapshot {
  id: string;
  name: string;
  html: string;
  timestamp: Date;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  codeSnippet?: string; // For displaying code blocks in chat
}

export interface GeminiResponse {
  explanation: string;
  html: string;
  title?: string;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  EDITOR = 'EDITOR',
  MARKETPLACE = 'MARKETPLACE',
  PROFILE = 'PROFILE',
  SETTINGS = 'SETTINGS',
  SNIPPETS = 'SNIPPETS',
}

export interface Template {
  id: string;
  name: string;
  description: string;
  prompt: string;
  icon: string;
}

export interface MarketplaceItem {
  id: string;
  name: string;
  author: string;
  description: string;
  category: 'Productivity' | 'E-commerce' | 'Lifestyle' | 'Content' | 'Other';
  rating: number;
  downloads: number;
  prompt: string; // The prompt used to generate it, allowing users to "remix"
  previewColor: string;
}

export interface SupabaseConfig {
    url: string;
    anonKey: string;
}