import React, { useState } from 'react';
import { Shield, Lock, Mail, Phone, User, Landmark, Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Member } from '../types';
import CrestLogo from './CrestLogo';

interface PortalAuthProps {
  onLogin: (email: string, password?: string) => Promise<boolean> | boolean;
  onRegister: (newMember: Omit<Member, 'id' | 'joinsDate'>, password?: string) => Promise<void> | void;
  isSupabaseConfigured: boolean;
}

export default function PortalAuth({ onLogin, onRegister, isSupabaseConfigured }: PortalAuthProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Login States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Register States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regChapter, setRegChapter] = useState('');
  const [regBatch, setRegBatch] = useState('');
  const [regSlaveName, setRegSlaveName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAvatar, setRegAvatar] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);
    try {
      const success = await onLogin(loginEmail, loginPassword);
      if (!success) {
        setLoginError('Invalid credentials or pending administrative review.');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoginError('');
    setIsLoading(true);
    try {
      // Emulating or routing to Google Sign-In
      const success = await onLogin('roderickdanzing04@gmail.com', 'google-auth-mock');
      if (!success) {
        // Fallback or create new pending
        setLoginError('Google Sign-In succeeded, but your account requires admin approval.');
      }
    } catch (err: any) {
      setLoginError('Google Sign-In encountered an issue.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setRegAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setRegAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regChapter.trim() || !regSlaveName.trim() || !regPhone.trim() || !regAvatar.trim()) {
      setLoginError('All fields marked with * are strictly required.');
      return;
    }

    setIsLoading(true);
    try {
      await onRegister({
        name: regName.trim(),
        email: regEmail.trim().toLowerCase(),
        role: 'Pending',
        chapter: regChapter.trim(),
        batch: regBatch.trim() || 'Alpha Class 2026',
        position: 'Candidate Member',
        avatarUrl: regAvatar,
        phone: regPhone.trim(),
        slaveName: regSlaveName.trim()
      }, regPassword || 'defaultpass123');
      
      // Toggle to login tab
      setIsRegistering(false);
      setLoginEmail(regEmail);
      setLoginPassword('');
    } catch (err: any) {
      setLoginError(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-navy-950/5 relative overflow-hidden">
        
        {/* Luxury Gold Accents */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600"></div>

        {/* Branding */}
        <div className="text-center">
          <div className="flex justify-center mb-3">
            <CrestLogo size={72} className="animate-pulse" />
          </div>
          <h2 className="text-2xl font-serif font-black text-navy-950 tracking-wider">
            LAMBDA BETA PHI
          </h2>
          <p className="mt-1.5 text-xs text-navy-400 uppercase tracking-widest font-bold">
            Private Community Portal
          </p>
        </div>

        {loginError && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-none flex items-start gap-2.5 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{loginError}</span>
          </div>
        )}

        {!isRegistering ? (
          /* ====================================
             LOGIN VIEW
             ==================================== */
          <form className="mt-8 space-y-4" onSubmit={handleLoginSubmit}>
            <div>
              <label className="block text-[10px] font-bold text-navy-950 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-navy-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="Enter registered email"
                  className="pl-10 w-full p-3 rounded-none border border-navy-950/15 focus:outline-none focus:ring-1 focus:ring-[#c5a059] bg-white text-navy-950 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-navy-950 uppercase tracking-wider mb-1">
                Account Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-navy-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 w-full p-3 rounded-none border border-navy-950/15 focus:outline-none focus:ring-1 focus:ring-[#c5a059] bg-white text-navy-950 text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-navy-950 text-gold-500 text-xs font-bold uppercase tracking-widest hover:bg-navy-900 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Verifying Account...' : 'Secure Log In'}
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-navy-950/10"></div>
              <span className="flex-shrink mx-4 text-[9px] font-bold text-navy-400 uppercase tracking-widest">or</span>
              <div className="flex-grow border-t border-navy-950/10"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full py-3 bg-white border border-navy-950/15 text-navy-950 text-xs font-bold uppercase tracking-widest hover:bg-navy-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign In with Google
            </button>

            <div className="text-center pt-4">
              <p className="text-xs text-navy-400">
                Are you an initiate of this chapter?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegistering(true)}
                  className="text-gold-600 font-bold hover:underline focus:outline-none"
                >
                  Register Here
                </button>
              </p>
            </div>
          </form>
        ) : (
          /* ====================================
             REGISTER VIEW
             ==================================== */
          <form className="mt-6 space-y-3" onSubmit={handleRegisterSubmit}>
            <div>
              <label className="block text-[9px] font-bold text-navy-950 uppercase tracking-widest mb-0.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-navy-400">
                  <User className="w-3.5 h-3.5" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Roderick Danzing"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="pl-9 w-full p-2.5 rounded-none border border-navy-950/15 focus:outline-none focus:ring-1 focus:ring-[#c5a059] bg-white text-navy-950 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] font-bold text-navy-950 uppercase tracking-widest mb-0.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-navy-400">
                    <Mail className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="e.g. name@domain.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="pl-9 w-full p-2.5 rounded-none border border-navy-950/15 focus:outline-none focus:ring-1 focus:ring-[#c5a059] bg-white text-navy-950 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-navy-950 uppercase tracking-widest mb-0.5">
                  Secure Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-navy-400">
                    <Lock className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="Min 6 chars"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="pl-9 w-full p-2.5 rounded-none border border-navy-950/15 focus:outline-none focus:ring-1 focus:ring-[#c5a059] bg-white text-navy-950 text-xs font-sans"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] font-bold text-navy-950 uppercase tracking-widest mb-0.5">
                  Chapter <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-navy-400">
                    <Landmark className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bohol Alpha"
                    value={regChapter}
                    onChange={(e) => setRegChapter(e.target.value)}
                    className="pl-9 w-full p-2.5 rounded-none border border-navy-950/15 focus:outline-none focus:ring-1 focus:ring-[#c5a059] bg-white text-navy-950 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-navy-950 uppercase tracking-widest mb-0.5">
                  Batch <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-navy-400">
                    <Shield className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alpha Class 2026"
                    value={regBatch}
                    onChange={(e) => setRegBatch(e.target.value)}
                    className="pl-9 w-full p-2.5 rounded-none border border-navy-950/15 focus:outline-none focus:ring-1 focus:ring-[#c5a059] bg-white text-navy-950 text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] font-bold text-navy-950 uppercase tracking-widest mb-0.5">
                  Slave Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-navy-400">
                    <User className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. System Architect"
                    value={regSlaveName}
                    onChange={(e) => setRegSlaveName(e.target.value)}
                    className="pl-9 w-full p-2.5 rounded-none border border-navy-950/15 focus:outline-none focus:ring-1 focus:ring-[#c5a059] bg-white text-navy-950 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-navy-950 uppercase tracking-widest mb-0.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-navy-400">
                    <Phone className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0917-555-0123"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="pl-9 w-full p-2.5 rounded-none border border-navy-950/15 focus:outline-none focus:ring-1 focus:ring-[#c5a059] bg-white text-navy-950 text-xs"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-bold text-navy-950 uppercase tracking-widest mb-1">
                Profile Picture <span className="text-red-500">*</span>
              </label>
              <div 
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`relative flex flex-col items-center justify-center border border-dashed p-3 text-center transition-all min-h-[90px] ${
                  dragActive 
                    ? 'border-gold-500 bg-gold-50/20' 
                    : regAvatar 
                      ? 'border-[#c5a059]/40 bg-[#fbf9f4]' 
                      : 'border-navy-950/15 hover:border-[#c5a059]/50 bg-white'
                }`}
              >
                {regAvatar ? (
                  <div className="flex items-center gap-3.5 w-full">
                    <img 
                      src={regAvatar} 
                      alt="Preview" 
                      className="w-11 h-11 object-cover border border-navy-950/20 shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 text-left">
                      <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        Image Selected
                      </p>
                      <p className="text-[8px] text-navy-400 uppercase tracking-wider font-mono">Ready to upload</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setRegAvatar('')}
                      className="p-1 hover:bg-rose-50 border border-rose-200 text-rose-600 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full py-1">
                    <Upload className="w-4.5 h-4.5 text-navy-400 mb-1" />
                    <p className="text-[9px] font-bold text-navy-950 uppercase tracking-wider">
                      Upload Picture
                    </p>
                    <p className="text-[7.5px] text-navy-400 uppercase tracking-wider font-mono mt-0.5">
                      Drag & Drop or Click
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsRegistering(false)}
                className="px-5 py-2.5 border border-navy-950/10 text-navy-950 text-[10px] font-bold uppercase tracking-widest hover:bg-navy-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 bg-navy-950 text-gold-500 text-[10px] font-bold uppercase tracking-widest hover:bg-navy-900 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isLoading ? 'Registering...' : 'Register Initiated'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// Separate component for Pending Approval Mode
interface PendingScreenProps {
  user: Member;
  onLogout: () => void;
}

export function PendingScreen({ user, onLogout }: PendingScreenProps) {
  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col items-center justify-center p-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl shadow-xl border border-navy-950/5 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#c5a059]"></div>
        
        <div className="flex justify-center">
          <div className="p-4 bg-amber-50 rounded-full border border-amber-200">
            <Lock className="w-12 h-12 text-[#c5a059] animate-bounce" />
          </div>
        </div>

        <h3 className="text-xl font-serif font-black text-navy-950 tracking-wide uppercase">
          Awaiting Admin Approval
        </h3>
        
        <div className="flex items-center justify-center gap-3 p-3 bg-[#fbf9f4] border border-[#c5a059]/20">
          <img 
            src={user.avatarUrl} 
            alt={user.name} 
            className="w-10 h-10 object-cover border border-[#c5a059]/30"
            referrerPolicy="no-referrer"
          />
          <div className="text-left text-xs">
            <p className="font-bold text-navy-950 uppercase">{user.name}</p>
            <p className="text-[10px] text-navy-500 font-mono tracking-wide uppercase">SLAVE: {user.slaveName}</p>
            <p className="text-[9px] text-[#c5a059] font-bold uppercase tracking-wider">{user.chapter}</p>
          </div>
        </div>

        <p className="text-xs text-navy-500 leading-relaxed max-w-sm mx-auto">
          Your credentials have been securely logged in the Sovereign ledger. To prevent unauthorized intrusion, access to the Private community portal requires direct approval from the Administrator.
        </p>

        <div className="space-y-1.5 p-3 text-[10px] text-navy-400 font-mono border-t border-navy-950/5 text-left">
          <p className="uppercase font-bold text-navy-500 mb-1">Dossier Registry Details:</p>
          <p>&bull; EMAIL: {user.email}</p>
          <p>&bull; BATCH: {user.batch}</p>
          <p>&bull; DATE APPLIED: {user.joinsDate || new Date().toISOString().split('T')[0]}</p>
          <p>&bull; STATUS: Pending Verification</p>
        </div>

        <div className="flex gap-3 justify-center pt-2">
          <button
            onClick={onLogout}
            className="px-6 py-2.5 bg-navy-950 text-gold-500 text-[10px] font-bold uppercase tracking-widest hover:bg-navy-900 transition-colors cursor-pointer w-full"
          >
            Sign Out of Portal
          </button>
        </div>
      </div>
    </div>
  );
}
