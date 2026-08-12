import React, { useState } from 'react';
import { X, LogIn, UserPlus, Sparkles, AlertCircle, Mail, CheckCircle2, ArrowRight, ExternalLink, Copy, Check, Inbox } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export const AuthModal = ({ onClose }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Email confirmation state
  const [confirmMailSent, setConfirmMailSent] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [copied, setCopied] = useState(false);

  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await register(email, password, name);
        setRegisteredEmail(email);
        setConfirmMailSent(true);
      } else {
        await login(email, password);
        onClose();
      }
    } catch (err) {
      if (err.message?.toLowerCase().includes('email not confirmed')) {
        setError('Your email is not confirmed yet. Please check your Gmail or email inbox for the confirmation link.');
      } else {
        setError(err.message || 'Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopyEmail = () => {
    if (registeredEmail) {
      navigator.clipboard.writeText(registeredEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenGmail = () => {
    window.open('https://mail.google.com', '_blank');
  };

  const handleBackToLogin = () => {
    setConfirmMailSent(false);
    setIsRegister(false);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel rounded-3xl w-full max-w-md p-8 border border-slate-700/80 shadow-2xl relative overflow-hidden">
        
        {/* Glow Header */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/30 rounded-full blur-3xl" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative z-10">
          {confirmMailSent ? (
            /* Custom Gmail Confirmation Popup Screen */
            <div className="text-center py-1 animate-in fade-in zoom-in-95 duration-200">
              
              {/* Icon Badge */}
              <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-rose-500 via-purple-500 to-indigo-500 mx-auto flex items-center justify-center shadow-xl shadow-purple-500/25 mb-4 group">
                <div className="absolute inset-0 rounded-3xl bg-rose-500/20 animate-ping" />
                <Mail className="w-10 h-10 text-white relative z-10" />
                <div className="absolute -bottom-1 -right-1 bg-slate-900 rounded-full p-1 border border-slate-700 z-20">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                </div>
              </div>

              <h3 className="text-2xl font-extrabold text-white mb-1">
                Registration Complete! 🎉
              </h3>
              
              <p className="text-xs text-slate-300 mb-4">
                Please confirm your email address to activate your account.
              </p>

              {/* Email Tag with Copy button */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 mb-5 flex items-center justify-between gap-2 shadow-inner">
                <div className="flex items-center gap-2 overflow-hidden text-left pl-1">
                  <Inbox className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <span className="text-xs font-semibold text-indigo-200 truncate">
                    {registeredEmail}
                  </span>
                </div>
                <button
                  onClick={handleCopyEmail}
                  title="Copy Email"
                  className="flex items-center gap-1 text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg transition-colors flex-shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-400" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Step Checklist */}
              <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800/80 mb-6 text-xs text-slate-300 text-left space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5 border border-indigo-500/30">
                    1
                  </div>
                  <span>Go to <strong>Gmail</strong> (or your email app) and check your inbox.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5 border border-indigo-500/30">
                    2
                  </div>
                  <span>Click the <strong>Confirm Email</strong> verification link.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5 border border-indigo-500/30">
                    3
                  </div>
                  <span>Return here to sign in & enjoy personalized mood music!</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <button
                  onClick={handleOpenGmail}
                  className="w-full bg-gradient-to-r from-red-600 via-rose-600 to-indigo-600 hover:from-red-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-rose-500/25 transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>Go to Gmail Now</span>
                  <ExternalLink className="w-4 h-4" />
                </button>

                <button
                  onClick={handleBackToLogin}
                  className="w-full bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-semibold py-2.5 rounded-xl transition-colors text-xs flex items-center justify-center gap-1.5"
                >
                  <span>Okey, Back to Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-[11px] text-slate-500 mt-4">
                Didn't get the email? Check your Spam or Promotions folder.
              </p>
            </div>
          ) : (
            /* Normal Sign In / Register Form */
            <>
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-3">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-extrabold text-white">
                  {isRegister ? 'Create Account' : 'Welcome Back'}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {isRegister
                    ? 'Sign up to create custom playlists and save your favorite music'
                    : 'Sign in to access your library, playlists, and listening history'}
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {isRegister && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-500/25 transition-all transform hover:scale-[1.01] mt-2 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="text-xs">Processing...</span>
                  ) : isRegister ? (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Register Account</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Sign In</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center text-xs text-slate-400">
                {isRegister ? 'Already have an account?' : "Don't have an account yet?"}{' '}
                <button
                  onClick={() => { setIsRegister(!isRegister); setError(''); }}
                  className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2 ml-1"
                >
                  {isRegister ? 'Sign In' : 'Sign Up'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
