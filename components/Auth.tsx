
import React, { useState } from 'react';
import { Zap, ArrowRight, Loader2, AlertCircle, Mail, Phone, Smartphone, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { StorageService } from '../services/storage';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

type AuthMethod = 'SELECT' | 'EMAIL' | 'PHONE';
type AuthStep = 'INPUT' | 'OTP';

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [method, setMethod] = useState<AuthMethod>('SELECT');
  const [step, setStep] = useState<AuthStep>('INPUT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [inputValue, setInputValue] = useState(''); // Email or Phone
  const [otp, setOtp] = useState('');

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
        // This calls the storage service which simulates a popup delay and returns a user
        // In a real app, this would be: await signInWithPopup(auth, googleProvider);
        const user = await StorageService.socialLogin('google');
        onLogin(user);
    } catch (e) {
        setError("Google sign in failed. Please try again.");
        setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue) return;
    
    setLoading(true);
    setError('');
    try {
        const type = method === 'EMAIL' ? 'email' : 'phone';
        await StorageService.sendOtp(inputValue, type);
        setStep('OTP');
    } catch (e) {
        setError("Failed to send verification code.");
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
        const type = method === 'EMAIL' ? 'email' : 'phone';
        const user = await StorageService.verifyOtp(inputValue, otp, type);
        onLogin(user);
    } catch (e: any) {
        setError(e.message || "Invalid code. Please try again.");
        setLoading(false);
    }
  };

  const reset = () => {
    setMethod('SELECT');
    setStep('INPUT');
    setInputValue('');
    setOtp('');
    setError('');
  };

  // --- Render Helpers ---

  const renderLogo = () => (
    <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 text-white mb-4 shadow-lg shadow-purple-500/25">
            <Zap size={24} fill="currentColor" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">Vibe With Me</h1>
        <p className="text-zinc-400 text-sm">Join the community of creators.</p>
    </div>
  );

  const renderSelection = () => (
    <div className="space-y-4">
        <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white text-black font-medium py-3 rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center gap-3 disabled:opacity-70 shadow-sm"
        >
            {loading ? <Loader2 size={20} className="animate-spin text-gray-600" /> : (
                <>
                    <div className="w-5 h-5">
                        <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                    </div>
                    <span className="text-[#1f1f1f] font-roboto">Sign in with Google</span>
                </>
            )}
        </button>

        <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center">
                <span className="bg-[#18181b] px-4 text-xs text-zinc-500">OR</span>
            </div>
        </div>

        <button 
            onClick={() => setMethod('EMAIL')}
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-3 border border-white/5"
        >
            <Mail size={18} />
            <span>Continue with Email</span>
        </button>

        <button 
            onClick={() => setMethod('PHONE')}
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-3 border border-white/5"
        >
            <Smartphone size={18} />
            <span>Continue with Phone</span>
        </button>
    </div>
  );

  const renderInputStep = () => (
    <form onSubmit={handleSendOtp} className="space-y-6">
        <div>
            <label className="block text-xs font-medium text-zinc-400 mb-2">
                {method === 'EMAIL' ? 'Email Address' : 'Phone Number'}
            </label>
            <div className="relative">
                {method === 'EMAIL' ? (
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
                ) : (
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
                )}
                <input 
                    type={method === 'EMAIL' ? 'email' : 'tel'}
                    required 
                    autoFocus
                    className="w-full bg-black/30 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-vibe-500 focus:ring-1 focus:ring-vibe-500 transition-all placeholder:text-zinc-600"
                    placeholder={method === 'EMAIL' ? 'creator@example.com' : '+1 (555) 000-0000'}
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                />
            </div>
            <p className="mt-2 text-xs text-zinc-500">
                We'll send you a verification code to {method === 'EMAIL' ? 'login or sign up' : 'verify your number'}.
            </p>
        </div>

        <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium py-3.5 rounded-xl shadow-lg shadow-purple-900/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
        >
            {loading ? <Loader2 size={20} className="animate-spin" /> : (
                <>
                    <span>Send Code</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
            )}
        </button>

        <button 
            type="button"
            onClick={reset}
            className="w-full text-zinc-500 hover:text-white text-sm py-2 transition-colors"
        >
            Back to options
        </button>
    </form>
  );

  const renderOtpStep = () => (
    <form onSubmit={handleVerifyOtp} className="space-y-6">
        <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 text-green-400 mb-3">
                <CheckCircle2 size={24} />
            </div>
            <h3 className="text-lg font-medium text-white">Check your {method === 'EMAIL' ? 'Inbox' : 'SMS'}</h3>
            <p className="text-sm text-zinc-400 mt-1">
                We sent a code to <span className="text-white">{inputValue}</span>
            </p>
        </div>

        <div className="space-y-2">
            <label className="block text-xs font-medium text-zinc-400 text-center">
                Enter Verification Code
            </label>
            <input 
                type="text" 
                required 
                autoFocus
                maxLength={6}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-4 text-center text-2xl tracking-[0.5em] font-mono text-white focus:outline-none focus:border-vibe-500 focus:ring-1 focus:ring-vibe-500 transition-all placeholder:text-zinc-700"
                placeholder="000000"
                value={otp}
                onChange={e => {
                    // Only allow numbers
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setOtp(val);
                }}
            />
            <div className="text-center">
                <p className="text-xs text-emerald-400/80 py-2 px-3 bg-emerald-500/10 rounded-full inline-block mt-2 border border-emerald-500/20">
                    Tip: Use code <b>123456</b> for demo
                </p>
            </div>
        </div>

        <button 
            type="submit" 
            disabled={loading || otp.length < 6}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium py-3.5 rounded-xl shadow-lg shadow-purple-900/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
        >
            {loading ? <Loader2 size={20} className="animate-spin" /> : 'Verify & Continue'}
        </button>

        <button 
            type="button"
            onClick={() => setStep('INPUT')}
            className="w-full text-zinc-500 hover:text-white text-sm py-2 transition-colors flex items-center justify-center gap-2"
        >
            <ArrowLeft size={14} />
            <span>Change {method === 'EMAIL' ? 'email' : 'number'}</span>
        </button>
    </form>
  );

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[100px]" />
      </div>

      <div className="w-full max-w-md bg-[#18181b] border border-white/10 rounded-2xl p-8 z-10 shadow-2xl">
        {renderLogo()}

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-sm text-red-400">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {method === 'SELECT' && renderSelection()}
        {method !== 'SELECT' && step === 'INPUT' && renderInputStep()}
        {method !== 'SELECT' && step === 'OTP' && renderOtpStep()}

        <div className="mt-8 text-center text-xs text-zinc-600">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </div>
      </div>
    </div>
  );
};
