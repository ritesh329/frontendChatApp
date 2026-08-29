import React, { useRef, useState } from 'react';

export default function AuthScreen({ authMode, setAuthMode, onSubmit }) {
  const isLogin = authMode === 'login';
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    try {
      const payload = isLogin
        ? { email: emailRef.current.value, password: passwordRef.current.value }
        : {
            username: usernameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
          };
      await onSubmit(payload, isLogin);
    } catch (e) {
      setError(e.response?.data?.message || e.message || 'Something went wrong');
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-box">
        <h2>{isLogin ? 'Login' : 'Create account'}</h2>

        {!isLogin && <input type="text" placeholder="Username" ref={usernameRef} />}
        <input type="email" placeholder="Email" ref={emailRef} />
        <input type="password" placeholder="Password" ref={passwordRef} />

        <button onClick={handleSubmit}>{isLogin ? 'Login' : 'Register'}</button>
        <div className="auth-error">{error}</div>

        <div
          className="auth-toggle"
          onClick={() => setAuthMode(isLogin ? 'register' : 'login')}
        >
          {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
        </div>
      </div>
    </div>
  );
}
