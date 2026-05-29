import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerCustomer } from './api';
import { TrendingUp, User, Phone, Mail, Lock } from 'lucide-react';

function Register() {
  const [customerName, setCustomerName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await registerCustomer({ customerName, mobileNumber, email, password });
      alert("Registration successful! You can now log in.");
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: '100vh', padding: '1.5rem' }}>
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem' }}>
        <div className="flex-center" style={{ flexDirection: 'column', marginBottom: '1.75rem' }}>
          <div className="flex-center" style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.2)', marginBottom: '0.75rem' }}>
            <TrendingUp size={24} color="var(--primary)" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }} className="text-gradient">Create Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Sign up to start trading stocks instantly</p>
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
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                <User size={18} />
              </span>
              <input 
                type="text" 
                className="form-input" 
                style={{ width: '100%', paddingLeft: '2.75rem' }}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="John Doe"
                required 
              />
            </div>
          </div>

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

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                <Mail size={18} />
              </span>
              <input 
                type="email" 
                className="form-input" 
                style={{ width: '100%', paddingLeft: '2.75rem' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
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
                type="password" 
                className="form-input" 
                style={{ width: '100%', paddingLeft: '2.75rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required 
              />
            </div>
          </div>

          <button type="submit" className="btn-modern btn-primary-glow" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creating Profile...' : 'Sign Up'}
          </button>
          
          <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
            <button 
              type="button" 
              className="btn-modern btn-secondary-modern" 
              style={{ width: '100%' }} 
              onClick={() => navigate('/')}
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
