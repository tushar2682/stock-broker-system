import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginCustomer } from './api';
import { TrendingUp, Phone, Lock, Eye, EyeOff } from 'lucide-react';

function Login({ onLogin }) {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await loginCustomer(mobileNumber, password);
      // Backend returns string like "uuid:customerId"
      const [authKey, customerId] = response.data.split(':');
      onLogin(authKey, mobileNumber, customerId);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: '100vh', padding: '1rem' }}>
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <div className="glass-card" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem' }}>
        <div className="flex-center" style={{ flexDirection: 'column', marginBottom: '2rem' }}>
          <div className="flex-center" style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.2)', marginBottom: '1rem' }}>
            <TrendingUp size={28} color="var(--primary)" />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }} className="text-gradient">Stock Trade</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Enter credentials to access your portal</p>
        </div>
        
        {error && (
          <div style={{ 
            color: 'var(--danger)', 
            background: 'rgba(244, 63, 94, 0.08)',
            border: '1px solid rgba(244, 63, 94, 0.15)',
            borderRadius: '10px',
            padding: '0.75rem', 
            marginBottom: '1.25rem', 
            textAlign: 'center', 
            fontSize: '0.85rem',
            fontWeight: 500
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Mobile Number</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                <Phone size={18} />
              </span>
              <input 
                type="text" 
                className="form-input" 
                style={{ width: '100%', paddingLeft: '2.75rem' }}
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="e.g. 9876543210"
                required 
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                <Lock size={18} />
              </span>
              <input 
                type={showPassword ? "text" : "password"} 
                className="form-input" 
                style={{ width: '100%', paddingLeft: '2.75rem', paddingRight: '2.75rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required 
              />
              <button 
                type="button" 
                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-modern btn-primary-glow" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
          
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>New to Stock Trade?</p>
            <button 
              type="button" 
              className="btn-modern btn-secondary-modern" 
              style={{ width: '100%' }} 
              onClick={() => navigate('/register')}
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
