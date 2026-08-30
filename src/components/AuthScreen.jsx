import React, { useState } from 'react';

export default function AuthScreen({ authMode, setAuthMode, onSubmit }) {
  const isLogin = authMode === 'login';
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password || (!isLogin && !form.username)) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const payload = isLogin
        ? { email: form.email, password: form.password }
        : { username: form.username, email: form.email, password: form.password };
      await onSubmit(payload, isLogin);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#09090d] px-5 py-10">
      {/* ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/4 h-72 w-72 rounded-full bg-[#7C6FF0]/20 blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-[#22D3C8]/10 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-[400px] rounded-3xl border border-white/[0.06] bg-[#121218] p-8 shadow-2xl shadow-black/50 sm:p-10">
        <div className="mb-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7C6FF0] to-[#22D3C8] text-xl shadow-lg shadow-[#7C6FF0]/20">
            💬
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="mt-1 text-sm text-[#999]">
            {isLogin ? 'Sign in to keep the conversation going' : 'Join and start chatting in seconds'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              value={form.username}
              onChange={update('username')}
              autoComplete="username"
              className="w-full rounded-xl border border-white/[0.08] bg-[#0f0f13] px-4 py-3 text-sm text-white placeholder-[#666] outline-none transition-colors focus:border-[#7C6FF0]/50"
            />
          )}
          <input
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={update('email')}
            autoComplete="email"
            className="w-full rounded-xl border border-white/[0.08] bg-[#0f0f13] px-4 py-3 text-sm text-white placeholder-[#666] outline-none transition-colors focus:border-[#7C6FF0]/50"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={update('password')}
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            className="w-full rounded-xl border border-white/[0.08] bg-[#0f0f13] px-4 py-3 text-sm text-white placeholder-[#666] outline-none transition-colors focus:border-[#7C6FF0]/50"
          />

          <div className="min-h-[18px] text-xs text-[#f87171]">{error}</div>

          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full rounded-xl bg-gradient-to-r from-[#7C6FF0] to-[#6355D6] py-3 text-sm font-semibold text-white shadow-lg shadow-[#7C6FF0]/20 transition-all hover:shadow-[#7C6FF0]/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Please wait…' : isLogin ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[#999]">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span
            className="cursor-pointer font-medium text-[#a29bfe] hover:underline"
            onClick={() => {
              setError('');
              setAuthMode(isLogin ? 'register' : 'login');
            }}
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </span>
        </div>
      </div>
    </div>
  );
}
