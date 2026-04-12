import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useAuth from '../hooks/useAuth';
import { clearError } from '../store/slices/authSlice';
import { validateEmail, validateRequired } from '../utils/validators';
import '../styles/login.css';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const { error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);

  useEffect(() => { dispatch(clearError()); }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: null }));
  };

  const validate = () => {
    const errs = {};
    const emailErr = validateEmail(form.email);
    const passErr = validateRequired(form.password, 'Password');
    if (emailErr) errs.email = emailErr;
    if (passErr) errs.password = passErr;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try { await login(form.email, form.password); } catch {}
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* ── LEFT: FORM ── */}
        <div className="login-left">
          {/* Logo */}
          <div className="login-logo">
            <div className="login-logo-icon">✦</div>
            <span className="login-logo-text">SPARK</span>
          </div>

          <h1 className="login-heading">Welcome to Spark</h1>
          <p className="login-subheading">Start your experience by signing in or signing up.</p>

          {/* Tab switcher */}
          <div className="login-tabs">
            <button className="login-tab active">Sign In</button>
            <button className="login-tab" onClick={() => navigate('/signup')}>Sign Up</button>
          </div>

          {/* Error */}
          {error && <div className="login-error-alert">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="login-field">
              <label>Email Address <span>*</span></label>
              <div className="login-input-wrap">
                <span className="login-input-icon">✉</span>
                <input
                  className={`login-input${errors.email ? ' error' : ''}`}
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>
              {errors.email && <span className="login-field-error">{errors.email}</span>}
            </div>

            {/* Password */}
            <div className="login-field">
              <label>Password <span>*</span></label>
              <div className="login-input-wrap">
                <span className="login-input-icon">🔒</span>
                <input
                  className={`login-input${errors.password ? ' error' : ''}`}
                  type={showPw ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <button type="button" className="login-input-toggle" onClick={() => setShowPw(!showPw)}>
                  {showPw ? '🙈' : '👁'}
                </button>
              </div>
              {errors.password && <span className="login-field-error">{errors.password}</span>}
            </div>

            <div className="login-forgot">
              <RouterLink to="/forgot-password">Forgot password?</RouterLink>
            </div>

            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            {loading && <p className="login-loading-note">Server may be starting up, please wait...</p>}
          </form>

          <div className="login-footer-text">
            Don't have an account?{' '}
            <RouterLink to="/signup">Create one free</RouterLink>
            <br /><br />
            <span style={{ color: '#ccc' }}>Copyright · Spark AI, All Right Reserved</span>
          </div>
        </div>

        {/* ── RIGHT: VISUAL PANEL ── */}
        <div className="login-right">
          <div className="login-right-grid" />
          <div className="login-right-glow" />

          {/* Floating preview cards */}
          <div className="login-right-cards">
            <div className="preview-card preview-card-1">
              <div className="preview-card-label">AI Conversations</div>
              <div className="preview-card-value">24 Active Chats</div>
              <div className="preview-card-bar">
                <div className="preview-card-bar-fill" style={{ width: '72%' }} />
              </div>
              <div className="preview-card-row">
                <span className="preview-card-tag">+12% this week</span>
                <span className="preview-card-dot" />
              </div>
            </div>

            <div className="preview-card preview-card-2">
              <div className="preview-card-label">Tasks Completed</div>
              <div className="preview-card-value">$17 saved / hr</div>
              <div className="preview-card-bar">
                <div className="preview-card-bar-fill" style={{ width: '58%', background: '#f59e0b' }} />
              </div>
              <div className="preview-card-row">
                <span className="preview-card-tag">8 tasks today</span>
                <span className="preview-card-dot" style={{ background: '#f59e0b' }} />
              </div>
            </div>

            <div className="preview-card preview-card-3">
              <div className="preview-card-label">Smart Notes</div>
              <div className="preview-card-value">142 Notes</div>
              <div className="preview-card-bar">
                <div className="preview-card-bar-fill" style={{ width: '85%', background: '#10b981' }} />
              </div>
              <div className="preview-card-row">
                <span className="preview-card-tag">AI summaries on</span>
                <span className="preview-card-dot" style={{ background: '#10b981' }} />
              </div>
            </div>
          </div>

          {/* Bottom copy */}
          <div className="login-right-bottom">
            <div className="login-right-icon">✦</div>
            <h2 className="login-right-title">
              A Unified Hub for <em>Smarter</em><br />AI-Powered Productivity
            </h2>
            <p className="login-right-desc">
              Spark AI empowers you with a unified productivity command center —
              delivering deep insights and a 360° view of your entire workflow.
            </p>
            <div className="login-right-dots">
              <div className="login-right-dot active" />
              <div className="login-right-dot" />
              <div className="login-right-dot" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
