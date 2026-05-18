import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import '../../styles/Auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email || !password) throw new Error('Please fill in all fields');
      await login(email, password);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.message || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="ocean-bg-elements">
        {[...Array(6)].map((_, i) => (
          <motion.div key={i} className="ocean-bubble" initial={{ y: '110vh', x: `${Math.random() * 100}vw` }} animate={{ y: '-10vh' }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} />
        ))}
      </div>

      <motion.div className="auth-card" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
        <AnimatePresence mode="wait">
          {!success ? (
            <motion.div key="form">
              <h1>Traveloop</h1>
              <p className="subtitle">Login to your adventure</p>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
                </div>
                {error && <div className="error-message">{error}</div>}
                <button type="submit" className="auth-btn" disabled={loading}>{loading ? 'Authenticating...' : 'Login'}</button>
              </form>
              <div className="auth-links">
                <Link to="/register" className="link">Create an Account</Link>
                <span> • </span>
                <Link to="/forgot-password" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Forgot Password?</Link>
              </div>
            </motion.div>
          ) : (
            <motion.div key="success" className="success-animation">
              <div className="check-icon">✓</div>
              <h2>Welcome back!</h2>
              <p>Diving into your travels...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default Login;
