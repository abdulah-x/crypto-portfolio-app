'use client';

import { useState } from 'react';
import { X, Mail, Key } from 'lucide-react';

interface GoogleOAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (token: string, user: any) => void;
  context?: 'signup' | 'login'; // Whether this is signup or login flow
}

export default function GoogleOAuthModal({ isOpen, onClose, onSuccess, context = 'signup' }: GoogleOAuthModalProps) {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(0);

  if (!isOpen) return null;

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/auth/google/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, context }),
      });

      const data = await response.json();

      if (data.success) {
        setStep('otp');
        setTimer(600); // 10 minutes = 600 seconds
        const countdown = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) {
              clearInterval(countdown);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch (err: any) {
      setError('Failed to connect to server. Please try again.');
      console.error('OTP send error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/auth/google/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, context }),
      });

      const data = await response.json();

      if (data.success) {
        // Save token
        localStorage.setItem('vaultx_token', data.data.access_token);
        
        // Call success callback
        onSuccess(data.data.access_token, data.data.user);
        
        // Close modal
        onClose();
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch (err: any) {
      setError('Failed to verify OTP. Please try again.');
      console.error('OTP verify error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/auth/google/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setTimer(600);
        setError('');
      } else {
        setError(data.message || 'Failed to resend OTP');
      }
    } catch (err: any) {
      setError('Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Google Logo */}
        <div className="flex justify-center mb-4">
          <svg className="w-12 h-12" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-center text-white mb-2">
          Sign in with Google
        </h2>
        <p className="text-sm text-slate-400 text-center mb-6">
          {step === 'email' ? 'Enter your Gmail address' : 'Enter the 6-digit code sent to your email'}
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Email Step */}
        {step === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Gmail Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@gmail.com"
                required
                className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Verification Code'}
            </button>
          </form>
        )}

        {/* OTP Step */}
        {step === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div className="text-center mb-4">
              <p className="text-sm text-slate-400">
                Code sent to: <span className="text-white font-medium">{email}</span>
              </p>
              <button
                type="button"
                onClick={() => setStep('email')}
                className="text-xs text-purple-400 hover:text-purple-300 underline mt-1"
              >
                Change email
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <Key className="w-4 h-4 inline mr-2" />
                Verification Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                required
                className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-3 text-white text-center text-2xl font-mono tracking-widest placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {timer > 0 && (
              <p className="text-xs text-center text-slate-400">
                Code expires in <span className="text-white font-medium">{formatTime(timer)}</span>
              </p>
            )}

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>

            <button
              type="button"
              onClick={handleResendOtp}
              disabled={loading || timer > 540}
              className="w-full text-sm text-purple-400 hover:text-purple-300 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors"
            >
              {timer > 540 ? 'Wait before resending' : 'Resend Code'}
            </button>
          </form>
        )}

        {/* Info */}
        <p className="mt-6 text-xs text-center text-slate-500">
          By continuing, you agree to VaultX's Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
