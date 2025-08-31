'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { requestOtp, verifyOtp } from '../lib/api';
import { toast } from '../lib/toast';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [cooldown, setCooldown] = useState(0); // seconds until resend is allowed
  const [expiresAt, setExpiresAt] = useState<number | null>(null); // ms timestamp for OTP expiry

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setMessage('');
      // Basic email validation
      const emailOk = /.+@.+\..+/.test(email);
      if (!emailOk) {
        const msg = 'Please enter a valid email address.';
        setError(msg);
        toast.error(msg);
        return;
      }
      await requestOtp(email);
      setMessage('OTP sent to your email. Please check your inbox/spam.');
      toast.success('OTP sent to your email.');
      setStep('code');
      setCooldown(30);
      setExpiresAt(Date.now() + 10 * 60 * 1000); // 10 minutes
    } catch (err: any) {
      const serverMsg = err?.response?.data?.message;
      const retryAfter = Number(err?.response?.headers?.['retry-after']);
      if (!Number.isNaN(retryAfter) && retryAfter > 0) {
        setCooldown(retryAfter);
      }
      const msg = serverMsg || 'Failed to send OTP. Please check your email and try again.';
      setError(msg);
      toast.error(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setMessage('');
      if (!code || code.length !== 6) {
        const msg = 'Enter the 6-digit code we emailed you.';
        setError(msg);
        toast.error(msg);
        return;
      }
      await verifyOtp(email, code, name || undefined);
      toast.success('Logged in successfully');
      router.replace('/');
    } catch (err) {
      setError('Invalid or expired code. Please try again.');
      toast.error('Invalid or expired code.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || !email) return;
    try {
      setLoading(true);
      setError('');
      setMessage('');
      await requestOtp(email);
      setMessage('A new OTP has been sent to your email.');
      toast.info('New OTP sent');
      setCooldown(30);
      setExpiresAt(Date.now() + 10 * 60 * 1000); // reset expiry
    } catch (err: any) {
      const serverMsg = err?.response?.data?.message;
      const retryAfter = Number(err?.response?.headers?.['retry-after']);
      if (!Number.isNaN(retryAfter) && retryAfter > 0) {
        setCooldown(retryAfter);
      }
      const msg = serverMsg || 'Could not resend OTP. Please try again shortly.';
      setError(msg);
      toast.error(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Cooldown ticker
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const secondsLeft = expiresAt ? Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000)) : 0;
  const formatMMSS = (total: number) => {
    const m = Math.floor(total / 60)
      .toString()
      .padStart(2, '0');
    const s = (total % 60)
      .toString()
      .padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Sign in to Budget Tracker</h1>
          <p className="text-gray-500 mt-1">Secure login with one-time code</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded bg-red-50 text-red-700 border border-red-100">{error}</div>
        )}
        {message && (
          <div className="mb-4 p-3 rounded bg-green-50 text-green-700 border border-green-100">{message}</div>
        )}

        {step === 'email' ? (
          <form onSubmit={handleRequestOtp} noValidate className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Name (optional)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your name"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white rounded-lg py-2.5 hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} noValidate className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Enter 6-digit code</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                className="mt-1 tracking-widest text-center text-lg w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••"
              />
              {expiresAt && (
                <div className="mt-2 text-xs text-gray-500">
                  Code expires in <span className="font-medium text-gray-700">{formatMMSS(secondsLeft)}</span>
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={loading || (expiresAt !== null && Date.now() > expiresAt)}
              className="w-full bg-blue-600 text-white rounded-lg py-2.5 hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Verifying...' : (expiresAt !== null && Date.now() > expiresAt) ? 'Code expired' : 'Verify & Continue'}
            </button>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                {cooldown > 0 ? `Resend available in ${cooldown}s` : "Didn't get the code?"}
              </span>
              <button
                type="button"
                onClick={handleResend}
                disabled={cooldown > 0 || loading}
                className="text-blue-600 disabled:text-gray-400 hover:underline"
              >
                Resend code
              </button>
            </div>
            <button
              type="button"
              onClick={() => setStep('email')}
              className="w-full text-sm text-gray-600 hover:text-gray-800"
            >
              Change email
            </button>
          </form>
        )}

        <p className="text-xs text-gray-500 text-center mt-6">
          By continuing you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
