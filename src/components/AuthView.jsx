import React, { useState } from 'react';
import { login, signup } from '../storage.js';

export default function AuthView({ onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Password rules validation
  const hasMinLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isPasswordValid = hasMinLength && hasLetter && hasNumber;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isSignUp && !isPasswordValid) {
      setError('Password must satisfy all requirements (at least 8 characters, 1 letter, and 1 number).');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      let res;
      if (isSignUp) {
        res = signup({ username, password, name });
      } else {
        res = login({ username, password });
      }

      setLoading(false);
      if (res.success) {
        onAuthSuccess(res.user);
      } else {
        setError(res.error || 'Authentication failed. Please check credentials.');
      }
    }, 200);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <span className="logo-flame">⚡</span>
          </div>
          <h1 className="auth-title">Streak Tracker</h1>
          <p className="auth-subtitle">
            {isSignUp ? 'Create your DSA practice account' : 'Sign in to track your daily practice'}
          </p>
        </div>

        {error && (
          <div className="auth-error-alert" role="alert">
            <span className="alert-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {isSignUp && (
            <div className="form-group">
              <label htmlFor="auth-name" className="form-label">Full Name</label>
              <input
                id="auth-name"
                type="text"
                className="form-input"
                placeholder="e.g. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="auth-username" className="form-label">Username</label>
            <input
              id="auth-username"
              type="text"
              className="form-input"
              placeholder="e.g. johndoe@gmail.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group">
            <div className="password-label-row">
              <label htmlFor="auth-password" className="form-label">Password</label>
              <button
                type="button"
                className="btn-toggle-show-pass"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈 Hide' : '👁️ Show'}
              </button>
            </div>

            <div className="password-input-wrapper">
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                className="form-input password-input"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                required
              />
            </div>

            {/* Password Rules Checklist */}
            {isSignUp && (
              <div className="password-rules-box" aria-label="Password Requirements">
                <span className="rules-heading">Password Rules:</span>
                <ul className="rules-list">
                  <li className={`rule-item ${hasMinLength ? 'rule-met' : 'rule-unmet'}`}>
                    <span className="rule-bullet">{hasMinLength ? '✓' : '○'}</span>
                    <span>At least 8 characters</span>
                  </li>
                  <li className={`rule-item ${hasLetter ? 'rule-met' : 'rule-unmet'}`}>
                    <span className="rule-bullet">{hasLetter ? '✓' : '○'}</span>
                    <span>At least one letter (a-z, A-Z)</span>
                  </li>
                  <li className={`rule-item ${hasNumber ? 'rule-met' : 'rule-unmet'}`}>
                    <span className="rule-bullet">{hasNumber ? '✓' : '○'}</span>
                    <span>At least one number (0-9)</span>
                  </li>
                </ul>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn-auth-submit"
            disabled={loading || (isSignUp && !isPasswordValid)}
          >
            {loading ? 'Authenticating...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer-toggle">
          {isSignUp ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                className="btn-link"
                onClick={() => {
                  setIsSignUp(false);
                  setError('');
                  setShowPassword(false);
                }}
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              New to Streak Tracker?{' '}
              <button
                type="button"
                className="btn-link"
                onClick={() => {
                  setIsSignUp(true);
                  setError('');
                  setShowPassword(false);
                }}
              >
                Create Account
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
