import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStocks, buyStock } from './api';
import axios from 'axios';

function Dashboard({ authKey, customerId, onLogout }) {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (!authKey) {
      navigate('/');
      return;
    }
    fetchStocks();
  }, [authKey, navigate]);

  const fetchStocks = async () => {
    try {
      setLoading(true);
      const response = await getStocks(authKey);
      setStocks(response.data);
    } catch (err) {
      setError('Failed to fetch stocks. Session may have expired.');
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (stockName) => {
    if (!customerId) {
      alert("Please enter your Customer ID first!");
      return;
    }
    try {
      await buyStock(customerId, stockName, 1);
      alert(`Successfully bought 1 share of ${stockName}`);
      fetchStocks();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to buy stock.');
    }
  };

  return (
    <div className="app-container">
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
        <h2>Market Dashboard</h2>
        <div className="flex items-center gap-4">
          <span style={{ color: 'var(--text-secondary)' }}>
            Customer ID: <strong style={{ color: 'var(--accent-primary)' }}>{customerId}</strong>
          </span>
          <button className="btn btn-secondary" onClick={() => navigate('/admin')}>
            Admin Panel
          </button>
          <button className="btn btn-secondary" onClick={() => { onLogout(); navigate('/'); }}>
            Logout
          </button>
        </div>
      </div>

      {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}

      <div className="grid-cols-3">
        {loading ? (
          <div>Loading market data...</div>
        ) : (
          stocks.map(stock => (
            <div key={stock.stockId || stock.id} className="glass-panel">
              <h3 className="text-gradient" style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                {stock.stockName}
              </h3>
              <div style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                <p>Price: <strong style={{ color: 'var(--text-primary)' }}>${stock.currentPrice?.toFixed(2)}</strong></p>
                <p>Available: {stock.availableQuantity}</p>
              </div>
              <button 
                className="btn btn-primary" 
                style={{ width: '100%' }}
                onClick={() => handleBuy(stock.stockName)}
              >
                Buy 1 Share
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;
