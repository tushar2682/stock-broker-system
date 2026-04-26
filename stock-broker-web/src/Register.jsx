import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerCustomer } from './api';

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
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }} className="text-gradient">Register Account</h2>
        
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Name</label>
            <input 
              type="text" 
              className="input-field" 
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required 
            />
          </div>
          <div className="input-group">
            <label>Mobile Number</label>
            <input 
              type="text" 
              className="input-field" 
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required 
            />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              className="input-field" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              className="input-field" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
          
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
             <button type="button" className="btn btn-secondary" style={{ width: '100%' }} onClick={() => navigate('/')}>
               Back to Login
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
