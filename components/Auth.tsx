
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole, VerificationStatus } from '../types';
import { Mail, Lock, User as UserIcon, Phone, MapPin, FileText, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

interface AuthProps {
  users: User[];
  onLogin: (user: User) => void;
  onSignup: (user: User) => void;
}

type AuthMode = 'login' | 'signup' | 'forgot';

const Auth: React.FC<AuthProps> = ({ users, onLogin, onSignup }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [idType, setIdType] = useState('AADHAR');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      onLogin(user);
      navigate('/');
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (users.find(u => u.email === email)) {
      setError('Email already exists. Use another email or login.');
      return;
    }

    const newUser: User = {
      id: `u${Date.now()}`,
      name,
      email,
      mobile,
      address,
      password,
      idType,
      idProofUrl: 'https://picsum.photos/seed/newid/400/250',
      verificationStatus: VerificationStatus.PENDING,
      role: UserRole.USER,
      createdAt: new Date().toISOString().split('T')[0]
    };

    onSignup(newUser);
    setSuccess('Signup successful! Your account is pending verification. Redirecting to home...');
    setTimeout(() => {
      onLogin(newUser);
      navigate('/');
    }, 2000);
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess('Password reset link has been sent to your email.');
    setTimeout(() => {
      setMode('login');
      setSuccess(null);
    }, 3000);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 bg-gray-50">
      <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="bg-indigo-600 p-8 text-white text-center">
          <div className="bg-white/20 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
            {mode === 'signup' ? <ShieldCheck size={32} /> : <UserIcon size={32} />}
          </div>
          <h2 className="text-3xl font-black mb-2">
            {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Join ElectroHub' : 'Reset Password'}
          </h2>
          <p className="text-indigo-100 text-sm font-medium">
            {mode === 'login' ? 'The future of gadget shopping awaits.' : mode === 'signup' ? 'Create a verified account to start bidding.' : 'Enter your email to receive a reset link.'}
          </p>
        </div>

        <div className="p-8">
          {error && (
            <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-start gap-3 mb-6 text-red-600 text-sm animate-in slide-in-from-top-2">
              <AlertCircle size={18} className="shrink-0" />
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-100 p-4 rounded-2xl flex items-start gap-3 mb-6 text-green-700 text-sm animate-in slide-in-from-top-2">
              <ShieldCheck size={18} className="shrink-0" />
              {success}
            </div>
          )}

          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase px-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    required type="email" value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="name@example.com"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase px-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    required type="password" value={password} onChange={e => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button type="button" onClick={() => setMode('forgot')} className="text-xs font-bold text-indigo-600 hover:underline">Forgot password?</button>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2">
                Login <ArrowRight size={20} />
              </button>
              <p className="text-center text-sm text-gray-500 mt-6">
                Don't have an account? <button type="button" onClick={() => setMode('signup')} className="text-indigo-600 font-bold hover:underline">Sign up</button>
              </p>
            </form>
          )}

          {mode === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase px-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      required type="text" value={name} onChange={e => setName(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase px-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      required type="email" value={email} onChange={e => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase px-1">Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      required type="tel" value={mobile} onChange={e => setMobile(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      placeholder="9876543210"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase px-1">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      required type="text" value={address} onChange={e => setAddress(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      placeholder="123 Tech St, City"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase px-1">Verification Document Type</label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <select 
                      value={idType} onChange={e => setIdType(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                    >
                      <option value="AADHAR">Aadhar Card</option>
                      <option value="PAN">PAN Card</option>
                      <option value="VOTER_ID">Voter ID</option>
                      <option value="DRIVING_LICENSE">Driving Licence</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase px-1">Set Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      required type="password" value={password} onChange={e => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-4 mt-4 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
                Create Account
              </button>
              <p className="text-center text-sm text-gray-500 mt-6 pb-4">
                Already have an account? <button type="button" onClick={() => setMode('login')} className="text-indigo-600 font-bold hover:underline">Login</button>
              </p>
            </form>
          )}

          {mode === 'forgot' && (
            <form onSubmit={handleForgot} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase px-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    required type="email" value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="name@example.com"
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
                Send Reset Link
              </button>
              <p className="text-center text-sm text-gray-500 mt-6">
                Back to <button type="button" onClick={() => setMode('login')} className="text-indigo-600 font-bold hover:underline">Login</button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
