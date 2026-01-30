'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Leaf,
  Shield,
  TrendingDown,
  Truck,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle,
  Award,
  KeyRound,
  RefreshCw,
} from 'lucide-react';

type Step = 'credentials' | 'verification';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/';

  const [step, setStep] = useState<Step>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // Timer for code expiry
  useEffect(() => {
    if (!expiresAt) return;

    const updateTimer = () => {
      const now = new Date();
      const diff = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000));
      setTimeLeft(diff);

      if (diff === 0) {
        setError('Verification code has expired. Please request a new code.');
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, email }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Authentication failed');
        setLoading(false);
        return;
      }

      setExpiresAt(new Date(data.expiresAt));
      setStep('verification');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Verification failed');
        setLoading(false);
        return;
      }

      // Redirect to original page
      router.push(returnUrl);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = useCallback(async () => {
    setError('');
    setCode('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, email }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Failed to resend code');
        setLoading(false);
        return;
      }

      setExpiresAt(new Date(data.expiresAt));
      setError('');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [password, email]);

  const handleBack = () => {
    setStep('credentials');
    setCode('');
    setError('');
    setExpiresAt(null);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-eco min-h-screen flex items-center pt-24 pb-16 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content - Info */}
            <div className="text-white space-y-8">
              <div className="inline-flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-full">
                <Leaf size={18} className="text-green-400" />
                <span className="text-green-300 text-sm font-medium">Authorized Access Portal</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Carbon Footprint <span className="text-green-400">Portal</span>
              </h1>

              <p className="text-xl text-gray-300 leading-relaxed">
                Access real-time sustainability metrics, emissions tracking, and environmental impact data
                for Unilink Transportation&apos;s green logistics operations.
              </p>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <TrendingDown size={20} className="text-green-400" />
                  </div>
                  <span className="text-gray-300">~27% CO2 Reduction</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Truck size={20} className="text-green-400" />
                  </div>
                  <span className="text-gray-300">100% Carrier Compliance</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Award size={20} className="text-green-400" />
                  </div>
                  <span className="text-gray-300">EcoVadis Certified</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Shield size={20} className="text-green-400" />
                  </div>
                  <span className="text-gray-300">SmartWay Partner</span>
                </div>
              </div>
            </div>

            {/* Right content - Login Form */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                  {step === 'verification' ? (
                    /* Verification Step */
                    <form onSubmit={handleVerificationSubmit} className="space-y-6">
                      <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                          <Mail size={32} className="text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
                        <p className="text-gray-600 text-sm">
                          We sent an 8-digit code to<br />
                          <span className="font-medium text-gray-900">{email}</span>
                        </p>
                      </div>

                      {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                          {error}
                        </div>
                      )}

                      <div>
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                          Verification Code
                        </label>
                        <input
                          id="code"
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={8}
                          value={code}
                          onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-center text-2xl tracking-widest font-mono"
                          placeholder="12345678"
                          required
                          autoFocus
                        />
                      </div>

                      {timeLeft > 0 && (
                        <div className="text-center">
                          <span className="text-sm text-gray-500">
                            Code expires in{' '}
                            <span className={`font-medium ${timeLeft < 60 ? 'text-red-600' : 'text-green-600'}`}>
                              {formatTime(timeLeft)}
                            </span>
                          </span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={loading || code.length !== 8 || timeLeft === 0}
                        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Verifying...
                          </>
                        ) : (
                          <>
                            <CheckCircle size={20} />
                            Verify & Access Portal
                          </>
                        )}
                      </button>

                      <div className="flex items-center justify-between text-sm">
                        <button
                          type="button"
                          onClick={handleBack}
                          className="text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          ← Back
                        </button>
                        <button
                          type="button"
                          onClick={handleResendCode}
                          disabled={loading}
                          className="text-green-600 hover:text-green-700 font-medium transition-colors disabled:opacity-50"
                        >
                          Resend Code
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* Credentials Step */
                    <form onSubmit={handleCredentialsSubmit} className="space-y-6">
                      <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                          <KeyRound size={32} className="text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome</h2>
                        <p className="text-gray-600 text-sm">
                          Enter your credentials to access the sustainability portal
                        </p>
                      </div>

                      {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                          {error}
                        </div>
                      )}

                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                          <Lock size={16} className="inline mr-1" />
                          Access Password
                        </label>
                        <input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="Enter site password"
                          required
                          autoFocus
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          <Mail size={16} className="inline mr-1" />
                          Corporate Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value.toLowerCase())}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="you@company.com"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Personal email addresses (Gmail, Yahoo, etc.) are not allowed
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={loading || !password || !email}
                        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Sending Code...
                          </>
                        ) : (
                          <>
                            Continue
                            <ArrowRight size={20} />
                          </>
                        )}
                      </button>

                      <div className="pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500 text-center">
                          For authorized Unilink Transportation partners only.
                          <br />
                          Contact IT support if you need assistance.
                        </p>
                      </div>
                    </form>
                  )}
                </div>

                {/* Trust badges below card */}
                <div className="mt-6 flex items-center justify-center gap-6 text-gray-400">
                  <div className="flex items-center gap-2">
                    <Shield size={18} />
                    <span className="text-sm">Secure Login</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock size={18} />
                    <span className="text-sm">Encrypted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function LoginPageLoading() {
  return (
    <div className="min-h-screen bg-gradient-eco flex items-center justify-center">
      <div className="text-center text-white">
        <RefreshCw size={48} className="animate-spin mx-auto mb-4" />
        <p className="text-xl">Loading...</p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageLoading />}>
      <LoginForm />
    </Suspense>
  );
}
