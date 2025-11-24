
import React, { useState, useEffect, useRef } from 'react';
import { Zap, ArrowLeft, CheckCircle2, AlertCircle, Mail, Loader2, Database, Cloud, ChevronDown, ChevronUp, ExternalLink, HelpCircle } from 'lucide-react';
import { StorageService } from '../services/storage';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

type AuthStep = 'INPUT' | 'OTP';
type Mode = 'WELCOME' | 'LOGIN' | 'SETUP';

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  // Initial check: If cloud is enabled, go to LOGIN, else go to WELCOME (to force setup)
  const [isCloud, setIsCloud] = useState(StorageService.isCloudEnabled());
  const [mode, setMode] = useState<Mode>(isCloud ? 'LOGIN' : 'WELCOME');
  
  const [step, setStep] = useState<AuthStep>('INPUT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  // Cooldown state
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Supabase Config State
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [showGuide, setShowGuide] = useState(false);
  const [showTroubleshoot, setShowTroubleshoot] = useState(false);

  useEffect(() => {
      if (StorageService.isCloudEnabled()) {
          setMode('LOGIN');
          setIsCloud(true);
      }
  }, []);

  // Handle Cooldown Timer
  useEffect(() => {
    if (cooldown > 0) {
        timerRef.current = setTimeout(() => setCooldown(cooldown - 1), 1000);
    } else {
        if (timerRef.current) clearTimeout(timerRef.current);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [cooldown]);

  const handleConnectCloud = (e: React.FormEvent) => {
      e.preventDefault();
      const url = supabaseUrl.trim();
      const key = supabaseKey.trim();

      if(!url || !key) {
          setError("Please fill in both Supabase URL and Anon Key.");
          return;
      }

      try {
          new URL(url);
      } catch(err) {
          setError("Invalid Supabase URL format. It should start with https://");
          return;
      }

      StorageService.saveSupabaseConfig({ url: url, anonKey: key });
      setIsCloud(true);
      setMode('LOGIN');
      setError('');
  };

  const handleUseSandbox = () => {
      setIsCloud(false);
      setMode('LOGIN');
  };

  const handleDisconnectCloud = () => {
      StorageService.clearSupabaseConfig();
      setIsCloud(false);
      setMode('WELCOME');
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldown > 0) return;
    if (!email) return;
    
    // Basic validation
    if (!email.includes('@')) {
        setError("Please enter a valid email address.");
        return;
    }

    setLoading(true);
    setError('');
    setShowTroubleshoot(false);

    try {
        await StorageService.sendOtp(email);
        setStep('OTP');
        setCooldown(60); // Start 60s cooldown
    } catch (e: any) {
        console.error(e);
        // If rate limit error, also set a cooldown to prevent spam
        if (e.message.includes("wait") || e.message.includes("requests") || e.message.includes("429")) {
            setCooldown(60);
        }
        setError(e.message || `Failed to send code.`);
        
        // Auto-show troubleshoot for specific email errors
        if (isCloud && (e.message.includes("confirmation email") || e.message.includes("limit"))) {
            setShowTroubleshoot(true);
        }
    } finally {
        setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) return;

    setLoading(true);
    setError('');
    try {
        const user = await StorageService.verifyOtp(email, otp);
        onLogin(user);
    } catch (e: any) {
        setError(e.message || "Invalid code. Please try again.");
        setLoading(false);
    }
  };

  const reset = () => {
    setStep('INPUT');
    setOtp('');
    setError('');
    setShowTroubleshoot(false);
  };

  // --- 1. WELCOME SCREEN (Force Setup) ---
  if (mode === 'WELCOME') {
      return (
        <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center p-4 relative overflow-hidden">
             {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px]" />
            </div>

            <div className="w-full max-w-md bg-[#18181b] border border-white/10 rounded-2xl p-8 z-10 shadow-2xl text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 text-white mb-6 shadow-lg shadow-purple-500/25">
                    <Zap size={32} fill="currentColor" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Welcome to Vibe</h1>
                <p className="text-zinc-400 mb-8 text-sm">
                    Connect your database to start building securely.
                </p>

                <button 
                    onClick={() => setMode('SETUP')}
                    className="w-full bg-white text-black font-bold py-3.5 rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2 mb-4"
                >
                    <Database size={18} />
                    Connect Supabase Project
                </button>

                <button 
                    onClick={handleUseSandbox}
                    className="w-full bg-zinc-800 text-zinc-400 hover:text-white font-medium py-3.5 rounded-xl hover:bg-zinc-700 transition-all flex items-center justify-center gap-2 border border-white/5"
                >
                    <Cloud size={18} />
                    Try Sandbox Demo
                </button>
            </div>
        </div>
      );
  }

  // --- 2. SETUP SCREEN ---
  if (mode === 'SETUP') {
      return (
        <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#18181b] border border-white/10 rounded-2xl p-8 shadow-2xl my-8">
                <button onClick={() => setMode('WELCOME')} className="text-zinc-500 hover:text-white mb-6 flex items-center gap-2 text-sm">
                    <ArrowLeft size={16}/> Back
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-lg bg-green-500/10 text-green-400"><Database size={24}/></div>
                    <div>
                        <h2 className="text-xl font-bold">Connect Backend</h2>
                        <p className="text-xs text-zinc-500">Enter your Supabase credentials</p>
                    </div>
                </div>

                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-sm text-red-400">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}
                
                <form onSubmit={handleConnectCloud} className="space-y-4">
                    <div>
                        <label className="text-xs font-medium text-zinc-400">Supabase URL</label>
                        <input type="text" value={supabaseUrl} onChange={e=>setSupabaseUrl(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-sm text-white mt-1" placeholder="https://your-project.supabase.co" required />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-zinc-400">Anon Key</label>
                        <input type="password" value={supabaseKey} onChange={e=>setSupabaseKey(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-sm text-white mt-1" placeholder="eyJ..." required />
                    </div>
                    
                    {/* Collapsible Guide */}
                    <div className="border border-white/10 rounded-lg overflow-hidden">
                        <button 
                            type="button"
                            onClick={() => setShowGuide(!showGuide)}
                            className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 transition-colors text-xs text-zinc-300 font-medium"
                        >
                            <span>Where do I find these?</span>
                            {showGuide ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                        </button>
                        
                        {showGuide && (
                            <div className="p-3 bg-black/20 text-[11px] text-zinc-400 space-y-2 border-t border-white/5">
                                <p className="flex gap-2">
                                    <span className="bg-white/10 w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[9px]">1</span>
                                    <span>Go to <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline inline-flex items-center">Supabase Dashboard <ExternalLink size={8} className="ml-0.5"/></a> and create a project.</span>
                                </p>
                                <p className="flex gap-2">
                                    <span className="bg-white/10 w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[9px]">2</span>
                                    <span>Go to <strong>Project Settings</strong> (cog icon) &rarr; <strong>API</strong>.</span>
                                </p>
                                <p className="flex gap-2">
                                    <span className="bg-white/10 w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[9px]">3</span>
                                    <span>Copy <strong>Project URL</strong> and <strong>anon public</strong> key.</span>
                                </p>
                                <p className="flex gap-2">
                                    <span className="bg-white/10 w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[9px]">4</span>
                                    <span>Run the SQL Schema found in App Settings.</span>
                                </p>
                            </div>
                        )}
                    </div>

                    <button type="submit" className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl font-medium transition-colors">Connect & Restart</button>
                </form>
            </div>
        </div>
      );
  }

  // --- 3. LOGIN SCREEN (Email Only) ---
  return (
    <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[100px]" />
      </div>

      <div className="w-full max-w-md bg-[#18181b] border border-white/10 rounded-2xl p-8 z-10 shadow-2xl">
        <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 text-white mb-4 shadow-lg shadow-purple-500/25">
                <Zap size={24} fill="currentColor" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight mb-2">Sign in to Vibe</h1>
            
            <div className="flex items-center justify-center gap-2">
                {isCloud ? (
                    <>
                        <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
                        <span className="text-zinc-400 text-sm">Connected to Database</span>
                    </>
                ) : (
                    <>
                        <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                        <span className="text-zinc-400 text-sm">Sandbox Demo</span>
                    </>
                )}
            </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/20 overflow-hidden">
             <div className="p-3 flex items-start gap-2 text-sm text-red-400">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span className="break-words">{error}</span>
             </div>
             
             {isCloud && (
                 <div className="bg-red-500/5 p-3 border-t border-red-500/10">
                     <button 
                        type="button" 
                        onClick={() => setShowTroubleshoot(!showTroubleshoot)}
                        className="flex items-center justify-between w-full text-xs font-semibold text-red-300 hover:text-red-200"
                     >
                         <span>Fix "Error sending confirmation email"</span>
                         {showTroubleshoot ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                     </button>
                     
                     {showTroubleshoot && (
                         <div className="mt-2 text-[11px] text-zinc-400 space-y-2 pl-1">
                             <div className="p-2 bg-red-900/20 rounded border border-red-500/20 mb-2">
                                <p className="text-red-300 font-bold mb-1">Option 1: Use Resend (Recommended)</p>
                                <p>This fixes the error permanently by using a real email service.</p>
                             </div>
                             <div className="space-y-3">
                                 <div>
                                     <span className="text-zinc-300 font-semibold block mb-0.5">1. Get API Key</span>
                                     <p className="pl-4">Sign up at <a href="https://resend.com" target="_blank" className="text-blue-400 underline">Resend.com</a> and get an API Key.</p>
                                 </div>
                                 <div>
                                     <span className="text-zinc-300 font-semibold block mb-0.5">2. Configure Supabase</span>
                                     <ul className="list-disc pl-4 space-y-0.5 marker:text-zinc-500">
                                         <li>Go to <b>Settings &gt; Authentication &gt; SMTP</b>.</li>
                                         <li>Enable <b>Custom SMTP</b>.</li>
                                         <li>Host: <code>smtp.resend.com</code> | Port: <code>465</code>.</li>
                                         <li>Username: <code>resend</code>.</li>
                                         <li>Password: <b>[Your Resend API Key]</b>.</li>
                                         <li>Sender Email: <code>onboarding@resend.dev</code>.</li>
                                     </ul>
                                 </div>
                             </div>
                         </div>
                     )}
                 </div>
             )}
          </div>
        )}

        {step === 'INPUT' && (
            <div className="space-y-6">
                <form onSubmit={handleSendOtp} className="space-y-6">
                    <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
                            <input 
                                type="email"
                                required autoFocus
                                className="w-full bg-black/30 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-vibe-500 focus:ring-1 focus:ring-vibe-500 transition-all"
                                placeholder="you@example.com"
                                value={email} onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading || cooldown > 0} 
                        className={`w-full font-medium py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg
                            ${cooldown > 0 
                                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-purple-900/20'
                            }
                        `}
                    >
                        {loading ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : cooldown > 0 ? (
                            <span>Wait {cooldown}s</span>
                        ) : (
                            <span>Send Verification Code</span>
                        )}
                    </button>
                </form>
            </div>
        )}

        {step === 'OTP' && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 text-green-400 mb-3"><CheckCircle2 size={24} /></div>
                    <h3 className="text-lg font-medium text-white">Enter Code</h3>
                    <p className="text-sm text-zinc-400 mt-1">
                        We sent a code to <span className="text-white">{email}</span>
                    </p>
                </div>
                <div className="space-y-2">
                    <input type="text" required autoFocus maxLength={6} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-4 text-center text-2xl tracking-[0.5em] font-mono text-white focus:outline-none focus:border-vibe-500 focus:ring-1 focus:ring-vibe-500 transition-all" placeholder="000000" value={otp} onChange={e => setOtp(e.target.value.replace(/[^0-9]/g, ''))} />
                    {!isCloud && <div className="text-center"><p className="text-xs text-emerald-400/80 py-2 px-3 bg-emerald-500/10 rounded-full inline-block mt-2 border border-emerald-500/20">Sandbox Code: <b>123456</b></p></div>}
                </div>
                <button type="submit" disabled={loading || otp.length < 6} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium py-3.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-70">{loading ? <Loader2 size={20} className="animate-spin" /> : 'Verify & Continue'}</button>
                <button type="button" onClick={reset} className="w-full text-zinc-500 hover:text-white text-sm py-2 transition-colors flex items-center justify-center gap-2"><ArrowLeft size={14} /><span>Change email</span></button>
            </form>
        )}

        <div className="mt-8 pt-6 border-t border-white/5">
             {isCloud ? (
                 <button onClick={handleDisconnectCloud} className="w-full text-xs text-red-400 hover:text-red-300 py-2 opacity-60 hover:opacity-100">Disconnect Database</button>
             ) : (
                 <button onClick={() => setMode('SETUP')} className="w-full text-xs text-zinc-500 hover:text-white py-2">Connect Real Backend</button>
             )}
        </div>
      </div>
    </div>
  );
};
