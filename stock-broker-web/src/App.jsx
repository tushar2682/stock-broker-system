import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import Register from './Register';
import AdminPanel from './AdminPanel';

function App() {
  const [authKey, setAuthKey] = useState(localStorage.getItem('authKey') || '');
  const [mobileNumber, setMobileNumber] = useState('');
  const [customerId, setCustomerId] = useState(localStorage.getItem('customerId') || '');

  const handleLogin = (key, mobile, id) => {
    setAuthKey(key);
    setMobileNumber(mobile);
    setCustomerId(id);
    localStorage.setItem('authKey', key);
    localStorage.setItem('customerId', id);
  };

  const handleLogout = () => {
    setAuthKey('');
    setMobileNumber('');
    setCustomerId('');
    localStorage.removeItem('authKey');
    localStorage.removeItem('customerId');
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={!authKey ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} 
        />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route 
          path="/dashboard" 
          element={authKey ? <Dashboard authKey={authKey} customerId={customerId} onLogout={handleLogout} /> : <Navigate to="/" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
