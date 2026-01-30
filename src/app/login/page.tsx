import { Suspense } from 'react';
import LoginForm from '@/components/LoginForm';

export const metadata = {
  title: 'Login - Carbon Footprint Portal',
  description: 'Secure login to access the Unilink Transportation Carbon Footprint Portal',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Carbon Footprint Portal
          </h1>
          <p className="text-gray-300 text-sm">
            Unilink Transportation
          </p>
        </div>

        {/* Login Card */}
        <div className="card p-8">
          <Suspense fallback={<LoginFormSkeleton />}>
            <LoginForm />
          </Suspense>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 text-xs mt-6">
          For authorized Unilink Transportation partners only.
          <br />
          Contact IT support if you need assistance.
        </p>
      </div>
    </div>
  );
}

function LoginFormSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-10 bg-gray-200 rounded" />
      <div className="h-10 bg-gray-200 rounded" />
      <div className="h-12 bg-gray-200 rounded" />
    </div>
  );
}
