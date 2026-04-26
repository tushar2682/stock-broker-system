import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addStock } from './api';

function AdminPanel() {
  const [stockName, setStockName] = useState('');
  const [availableQuantity, setAvailableQuantity] = useState('');
  const [totalQuantity, setTotalQuantity] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleAddStock = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const stockData = {
        stockName,
        availableQuantity: parseInt(availableQuantity),
        totalQuantity: parseInt(totalQuantity),
        currentPrice: parseFloat(currentPrice)
      };
      await addStock(stockData);
      setMessage(`Successfully added stock: ${stockName}`);
      setStockName('');
      setAvailableQuantity('');
      setTotalQuantity('');
      setCurrentPrice('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add stock.');
    }
  };

  return (
    <div className="app-container">
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
        <h2>Admin Panel - Add Stocks</h2>
        <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>

      <div className="glass-panel" style={{ maxWidth: '500px', margin: '0 auto' }}>
        {message && <div style={{ color: 'var(--success)', marginBottom: '1rem', textAlign: 'center' }}>{message}</div>}
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        
        <form onSubmit={handleAddStock}>
          <div className="input-group">
            <label>Stock Name</label>
            <input 
              type="text" 
              className="input-field" 
              value={stockName}
              onChange={(e) => setStockName(e.target.value)}
              required 
            />
          </div>
          <div className="input-group">
            <label>Available Quantity</label>
            <input 
              type="number" 
              className="input-field" 
              value={availableQuantity}
              onChange={(e) => setAvailableQuantity(e.target.value)}
              required 
            />
          </div>
          <div className="input-group">
            <label>Total Quantity</label>
            <input 
              type="number" 
              className="input-field" 
              value={totalQuantity}
              onChange={(e) => setTotalQuantity(e.target.value)}
              required 
            />
          </div>
          <div className="input-group">
            <label>Current Price ($)</label>
            <input 
              type="number" 
              step="0.01"
              className="input-field" 
              value={currentPrice}
              onChange={(e) => setCurrentPrice(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Add Stock to Database
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminPanel;
