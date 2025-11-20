import { Project, User } from "../types";
import { DEFAULT_HTML } from "../constants";

// Simulation of a backend database using LocalStorage
// In a production app, this would be replaced by API calls to Postgres/Firebase/Supabase

const USERS_KEY = 'vibecoder_db_users';
const PROJECTS_KEY = 'vibecoder_db_projects';
const SESSION_KEY = 'vibecoder_session_user';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const StorageService = {
  
  // --- AUTHENTICATION ---

  // Simulate sending an OTP
  async sendOtp(contact: string, type: 'email' | 'phone'): Promise<void> {
    await delay(1000); // Network delay
    // In a real app, this would call an API to send Email or SMS via Twilio/SendGrid
    console.log(`[Simulated Backend] OTP sent to ${type} ${contact}: 123456`);
    return;
  },

  // Verify OTP and Login/Signup
  async verifyOtp(contact: string, code: string, type: 'email' | 'phone'): Promise<User> {
    await delay(800);
    
    if (code !== '123456') {
        throw new Error("Invalid verification code.");
    }

    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    
    // Find existing user by email or phone
    let user = users.find((u: any) => 
        (type === 'email' && u.email === contact) || 
        (type === 'phone' && u.phoneNumber === contact)
    );

    if (!user) {
        // Create new user
        user = {
            id: 'user_' + Date.now(),
            name: type === 'email' ? contact.split('@')[0] : `User ${contact.slice(-4)}`,
            email: type === 'email' ? contact : undefined,
            phoneNumber: type === 'phone' ? contact : undefined,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${contact}`,
            createdAt: new Date(),
            provider: type
        };
        users.push(user);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  },

  async socialLogin(provider: 'google'): Promise<User> {
    await delay(1500); // Simulate popup and redirect
    
    // Mock Google User
    const mockGoogleUser = {
        email: 'demo.user@gmail.com',
        name: 'Demo User',
        avatar: 'https://lh3.googleusercontent.com/a/ACg8ocIu1_3_8_3_8_3_8=s96-c' // Generic Google-like avatar url placeholder or use dicebear
    };

    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    let user = users.find((u: any) => u.email === mockGoogleUser.email);

    if (!user) {
        user = {
            id: 'user_google_' + Date.now(),
            name: mockGoogleUser.name,
            email: mockGoogleUser.email,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=google${Date.now()}`, // Using dicebear for consistency
            createdAt: new Date(),
            provider: 'google'
        };
        users.push(user);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  },

  async signOut(): Promise<void> {
    await delay(200);
    localStorage.removeItem(SESSION_KEY);
  },

  async getCurrentUser(): Promise<User | null> {
    const session = localStorage.getItem(SESSION_KEY);
    if (!session) return null;
    return JSON.parse(session);
  },

  // --- DATABASE (PROJECTS) ---

  async getProjects(userId: string): Promise<Project[]> {
    await delay(300);
    const allProjects = JSON.parse(localStorage.getItem(PROJECTS_KEY) || '[]');
    
    // Filter projects belonging to this user
    const userProjects = allProjects.filter((p: any) => p.userId === userId);
    
    // Hydrate dates
    return userProjects.map((p: any) => ({
        ...p,
        lastModified: new Date(p.lastModified),
        history: p.history.map((h: any) => ({...h, timestamp: new Date(h.timestamp)}))
    }));
  },

  async createProject(userId: string, template?: { name: string, description: string }): Promise<Project> {
    await delay(400);
    const newProject: Project = {
        id: 'proj_' + Date.now(),
        userId,
        name: template ? template.name : 'Untitled Project',
        description: template ? template.description : 'A new vibe.',
        lastModified: new Date(),
        currentHtml: DEFAULT_HTML,
        history: []
    };

    const allProjects = JSON.parse(localStorage.getItem(PROJECTS_KEY) || '[]');
    allProjects.unshift(newProject); // Add to top
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(allProjects));

    return newProject;
  },

  async updateProject(project: Project): Promise<void> {
    // No artificial delay for typing/updates to feel snappy
    const allProjects = JSON.parse(localStorage.getItem(PROJECTS_KEY) || '[]');
    const index = allProjects.findIndex((p: any) => p.id === project.id);
    
    if (index !== -1) {
        allProjects[index] = project;
        localStorage.setItem(PROJECTS_KEY, JSON.stringify(allProjects));
    }
  },

  async deleteProject(projectId: string): Promise<void> {
    await delay(300);
    const allProjects = JSON.parse(localStorage.getItem(PROJECTS_KEY) || '[]');
    const filtered = allProjects.filter((p: any) => p.id !== projectId);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(filtered));
  }
};