

import { Project, User, SupabaseConfig } from "../types";
import { DEFAULT_HTML } from "../constants";
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Keys for Local Storage
const USERS_KEY = 'vibecoder_db_users';
const PROJECTS_KEY = 'vibecoder_db_projects';
const SESSION_KEY = 'vibecoder_session_user';
const SUPABASE_CONFIG_KEY = 'vibecoder_supabase_config';

let supabase: SupabaseClient | null = null;

const isValidUrl = (urlString: string) => {
    try { 
        return Boolean(new URL(urlString)); 
    }
    catch(e){ 
        return false; 
    }
}

// --- Helper: Initialize Supabase if config exists ---
const initSupabase = () => {
    const configStr = localStorage.getItem(SUPABASE_CONFIG_KEY);
    if (configStr) {
        try {
            const config: SupabaseConfig = JSON.parse(configStr);
            if (config.url && config.anonKey) {
                if (isValidUrl(config.url)) {
                    supabase = createClient(config.url, config.anonKey);
                    console.log("Vibe With Me: Supabase Connected");
                } else {
                    console.warn("Vibe With Me: Invalid Supabase URL stored, skipping connection.");
                }
            }
        } catch (e) {
            console.error("Failed to init Supabase:", e);
        }
    }
};

// Initialize on load
initSupabase();

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const StorageService = {

  // Check if connected to real backend
  isCloudEnabled(): boolean {
    return !!supabase;
  },

  // Save connection details
  saveSupabaseConfig(config: SupabaseConfig) {
    localStorage.setItem(SUPABASE_CONFIG_KEY, JSON.stringify(config));
    initSupabase();
    // Clear local session to force re-login with Supabase
    localStorage.removeItem(SESSION_KEY);
  },

  clearSupabaseConfig() {
    localStorage.removeItem(SUPABASE_CONFIG_KEY);
    supabase = null;
    localStorage.removeItem(SESSION_KEY);
  },

  // --- AUTHENTICATION ---

  async sendOtp(email: string): Promise<void> {
    if (supabase) {
        // We do NOT use emailRedirectTo. This avoids the "URL not whitelisted" error.
        // If emails still fail, it is likely the Supabase SMTP rate limit.
        const result = await supabase.auth.signInWithOtp({ 
            email: email,
            options: {
                shouldCreateUser: true
            }
        });
        const error = result.error;

        if (error) {
            console.error("Supabase Auth Error:", error);
            throw error; 
        }
    } else {
        // Sandbox Mode
        await delay(1000);
        console.log(`[Sandbox] OTP sent to ${email}: 123456`);
    }
  },

  async verifyOtp(email: string, code: string): Promise<User> {
    if (supabase) {
        const result = await supabase.auth.verifyOtp({
            email: email,
            token: code,
            type: 'email',
        });
        const data = result.data;
        const error = result.error;

        if (error) throw error;
        if (!data.user) throw new Error("Verification failed");

        const user: User = {
            id: data.user.id,
            name: data.user.user_metadata?.full_name || email.split('@')[0] || 'Creator',
            email: data.user.email,
            avatar: data.user.user_metadata?.avatar_url,
            createdAt: new Date(data.user.created_at),
            provider: 'email'
        };
        return user;
    } else {
        // Sandbox Mode
        await delay(800);
        if (code !== '123456') throw new Error("Invalid verification code (Try 123456).");

        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        let user = users.find((u: any) => u.email === email);

        if (!user) {
            user = {
                id: 'user_' + Date.now(),
                name: email.split('@')[0],
                email: email,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
                createdAt: new Date(),
                provider: 'email'
            };
            users.push(user);
            localStorage.setItem(USERS_KEY, JSON.stringify(users));
        }
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
        return user;
    }
  },

  async signOut(): Promise<void> {
    if (supabase) {
        await supabase.auth.signOut();
    } else {
        await delay(200);
    }
    localStorage.removeItem(SESSION_KEY);
  },

  async getCurrentUser(): Promise<User | null> {
    if (supabase) {
        // Check Supabase session
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
             const u = data.session.user;
             return {
                 id: u.id,
                 name: u.user_metadata?.full_name || u.email?.split('@')[0] || 'Creator',
                 email: u.email,
                 phoneNumber: u.phone,
                 avatar: u.user_metadata?.avatar_url,
                 createdAt: new Date(u.created_at),
                 provider: u.app_metadata?.provider || 'email' as any
             };
        }
        return null;
    } else {
        // Sandbox
        const session = localStorage.getItem(SESSION_KEY);
        if (!session) return null;
        return JSON.parse(session);
    }
  },

  // --- DATABASE (PROJECTS) ---

  async getProjects(userId: string): Promise<Project[]> {
    if (supabase) {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('last_modified', { ascending: false });
        
        if (error) {
            console.error("DB Error:", error);
            return [];
        }

        return data.map((p: any) => ({
            id: p.id,
            userId: p.user_id,
            name: p.name,
            description: p.description,
            lastModified: new Date(p.last_modified),
            currentHtml: p.current_html,
            thumbnail: p.thumbnail,
            history: p.history || [],
            snapshots: p.snapshots || []
        }));

    } else {
        await delay(300);
        const allProjects = JSON.parse(localStorage.getItem(PROJECTS_KEY) || '[]');
        const userProjects = allProjects.filter((p: any) => p.userId === userId);
        return userProjects.map((p: any) => ({
            ...p,
            lastModified: new Date(p.lastModified),
            history: p.history.map((h: any) => ({...h, timestamp: new Date(h.timestamp)}))
        }));
    }
  },

  async createProject(userId: string, template?: { name: string, description: string }): Promise<Project> {
    const newProjectBase = {
        name: template ? template.name : 'Untitled Project',
        description: template ? template.description : 'A new vibe.',
        current_html: DEFAULT_HTML,
        history: [],
        snapshots: [],
        last_modified: new Date().toISOString()
    };

    if (supabase) {
        const { data, error } = await supabase
            .from('projects')
            .insert([{ ...newProjectBase, user_id: userId }])
            .select()
            .single();
        
        if (error) throw error;

        return {
            id: data.id,
            userId: data.user_id,
            name: data.name,
            description: data.description,
            lastModified: new Date(data.last_modified),
            currentHtml: data.current_html,
            thumbnail: data.thumbnail,
            history: data.history || [],
            snapshots: data.snapshots || []
        };

    } else {
        await delay(400);
        const newProject: Project = {
            id: 'proj_' + Date.now(),
            userId,
            name: newProjectBase.name,
            description: newProjectBase.description,
            lastModified: new Date(),
            currentHtml: newProjectBase.current_html,
            history: []
        };
        const allProjects = JSON.parse(localStorage.getItem(PROJECTS_KEY) || '[]');
        allProjects.unshift(newProject);
        localStorage.setItem(PROJECTS_KEY, JSON.stringify(allProjects));
        return newProject;
    }
  },

  async updateProject(project: Project): Promise<void> {
    if (supabase) {
        const { error } = await supabase
            .from('projects')
            .update({
                name: project.name,
                description: project.description,
                current_html: project.currentHtml,
                thumbnail: project.thumbnail,
                history: project.history,
                snapshots: project.snapshots,
                last_modified: new Date().toISOString()
            })
            .eq('id', project.id);
        
        if (error) console.error("Failed to save project:", error);
    } else {
        const allProjects = JSON.parse(localStorage.getItem(PROJECTS_KEY) || '[]');
        const index = allProjects.findIndex((p: any) => p.id === project.id);
        if (index !== -1) {
            allProjects[index] = project;
            localStorage.setItem(PROJECTS_KEY, JSON.stringify(allProjects));
        }
    }
  },

  async deleteProject(projectId: string): Promise<void> {
    if (supabase) {
        await supabase.from('projects').delete().eq('id', projectId);
    } else {
        await delay(300);
        const allProjects = JSON.parse(localStorage.getItem(PROJECTS_KEY) || '[]');
        const filtered = allProjects.filter((p: any) => p.id !== projectId);
        localStorage.setItem(PROJECTS_KEY, JSON.stringify(filtered));
    }
  }
};
