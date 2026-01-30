'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type Step = 'credentials' | 'verification';

export default function LoginForm() {
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

  if (step === 'verification') {
    return (
      <form onSubmit={handleVerificationSubmit} className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="heading-2 text-gray-900 mb-2">Enter Verification Code</h2>
          <p className="text-gray-600 text-sm">
            We sent an 8-digit code to <span className="font-medium">{email}</span>
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
          className="btn-green w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Verifying...
            </span>
          ) : (
            'Verify & Login'
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
    );
  }

  return (
    <form onSubmit={handleCredentialsSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="heading-2 text-gray-900 mb-2">Welcome</h2>
        <p className="text-gray-600 text-sm">
          Enter your credentials to access the portal
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
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
        className="btn-green w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Sending Code...
          </span>
        ) : (
          'Continue'
        )}
      </button>
    </form>
  );
}
