
import { Template, MarketplaceItem } from './types';

export const INITIAL_SYSTEM_INSTRUCTION = `
You are "Vibe With Me", an expert AI web developer and UI/UX designer. 
Your goal is to generate fully functional, single-file HTML prototypes based on user requests.
You MUST return the response in valid JSON format.

The JSON schema is:
{
  "explanation": "A brief, friendly summary of what you built (max 2 sentences).",
  "html": "The complete, valid HTML5 code string.",
  "title": "A short, catchy title for the app."
}

HTML GUIDELINES:
1. Use Tailwind CSS (via CDN) for ALL styling. Do not write custom CSS unless absolutely necessary for animations.
2. Use font-awesome or lucide-icons (via unpkg/CDN) if icons are needed.
3. The HTML must be self-contained. Scripts should be inside the HTML.
4. Make it LOOK AMAZING. Dark mode by default, modern typography, gradients, rounded corners, nice shadows.
5. It should be responsive and mobile-friendly.
6. If the user asks for interactivity (e.g., a calculator, a to-do list), write the JavaScript logic inside <script> tags within the HTML.
`;

export const SAMPLE_TEMPLATES: Template[] = [
  {
    id: 'blog',
    name: 'Vibe Chronicles',
    description: 'A clean, modern personal blog with featured posts and sidebar.',
    prompt: 'Create a personal blog website ("Vibe Chronicles"). Include a sticky header, a hero section with a featured article, a grid of recent posts with hover effects, a sidebar with an "About Me" widget and categories, and a newsletter subscription footer. Use a sophisticated dark theme.',
    icon: 'BookOpen'
  },
  {
    id: 'ecommerce',
    name: 'Vibe Store',
    description: 'Minimalist e-commerce storefront with cart functionality.',
    prompt: 'Build a chic e-commerce storefront. It should have a product grid displaying clothing items with prices and "Add to Cart" buttons. Include a working shopping cart slide-over or modal that updates the total price. Use elegant typography and a monochrome dark palette.',
    icon: 'ShoppingBag'
  },
  {
    id: 'events',
    name: 'Social Planner',
    description: 'Event calendar and upcoming scheduling app.',
    prompt: 'Design an event calendar dashboard. It needs a visual monthly calendar grid on the left and a scrollable list of "Upcoming Events" on the right. Include a "Create Event" button that opens a modal (UI only). Make it look vibrant and energetic.',
    icon: 'Calendar'
  },
  {
    id: 'portfolio',
    name: 'Creator Folio',
    description: 'Masonry-style portfolio for visual artists.',
    prompt: 'Design a high-end portfolio for a visual artist. Use a masonry grid layout for images (use placeholders). Include a full-screen bio overlay, social links, and a contact form. Use smooth transitions and a "glassmorphism" aesthetic.',
    icon: 'Camera'
  },
  {
    id: 'tasks',
    name: 'Task Master',
    description: 'Productivity tool with Kanban-style task management.',
    prompt: 'Create a task management app with a Kanban board layout. Columns for "To Do", "In Progress", and "Done". Allow users to add new cards to "To Do" via an input field. The cards should be draggable (or have buttons to move them) and deletable. Use specific colors for tags.',
    icon: 'CheckSquare'
  }
];

export const MOCK_MARKETPLACE_ITEMS: MarketplaceItem[] = [
    {
        id: 'm1',
        name: 'Zen Note',
        author: 'Aarav Patel',
        description: 'Distraction-free writing app with local storage autosave.',
        category: 'Productivity',
        rating: 4.8,
        downloads: 1204,
        prompt: 'Create a distraction-free markdown writing app. Minimalist interface, typewriter sounds (optional), word count, and autosave to local storage.',
        previewColor: 'from-green-400 to-emerald-600'
    },
    {
        id: 'm2',
        name: 'CryptoWatch',
        author: 'Vikram Singh',
        description: 'Real-time crypto price tracker dashboard.',
        category: 'Productivity',
        rating: 4.5,
        downloads: 890,
        prompt: 'Build a crypto price dashboard. Mock data for BTC, ETH, SOL. Include a line chart visualization and a scrolling ticker tape.',
        previewColor: 'from-orange-400 to-yellow-600'
    },
    {
        id: 'm3',
        name: 'FitTrack Pro',
        author: 'Priya Sharma',
        description: 'Workout logger and interval timer.',
        category: 'Lifestyle',
        rating: 4.9,
        downloads: 2300,
        prompt: 'Create a workout tracking app with an integrated interval timer (Tabata style). Dark, aggressive sports aesthetic.',
        previewColor: 'from-red-500 to-rose-700'
    },
    {
        id: 'm4',
        name: 'Pixel Art Maker',
        author: 'Rohan Gupta',
        description: 'Browser-based 16x16 pixel art editor.',
        category: 'Content',
        rating: 4.7,
        downloads: 1500,
        prompt: 'Build a 16x16 grid pixel art editor. Palette selection, eraser tool, and ability to download the canvas as PNG.',
        previewColor: 'from-purple-400 to-indigo-600'
    },
    {
        id: 'm5',
        name: 'Retro Synth',
        author: 'Ananya Reddy',
        description: 'Virtual synthesizer keyboard with visualizer.',
        category: 'Content',
        rating: 5.0,
        downloads: 3100,
        prompt: 'Create a browser-based synthesizer. On-screen piano keys that play sounds using Web Audio API. Include a visualizer canvas.',
        previewColor: 'from-pink-400 to-fuchsia-600'
    },
    {
        id: 'm6',
        name: 'Budget Buddy',
        author: 'Isha Verma',
        description: 'Simple expense tracker with pie chart analysis.',
        category: 'Productivity',
        rating: 4.6,
        downloads: 950,
        prompt: 'Design a personal finance expense tracker. List input for expenses, category selection, and a pie chart summary of spending.',
        previewColor: 'from-blue-400 to-cyan-600'
    }
];

export const DEFAULT_HTML = `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vibe With Me</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { background-color: #09090b; color: white; height: 100vh; display: flex; align-items: center; justify-content: center; font-family: sans-serif; }
    .animate-pulse-slow { animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
  </style>
</head>
<body>
  <div class="text-center space-y-4">
    <div class="inline-block p-4 rounded-full bg-purple-500/10 text-purple-400 animate-pulse-slow">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"></path><path d="M8.5 8.5v.01"></path><path d="M16 12v.01"></path><path d="M12 16v.01"></path></svg>
    </div>
    <h1 class="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
      Vibe With Me
    </h1>
    <p class="text-zinc-400 max-w-md mx-auto">
      Select a template, browse the marketplace, or describe your dream app to start vibing.
    </p>
  </div>
</body>
</html>`;
