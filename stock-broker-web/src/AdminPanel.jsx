import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addStock, getAllCustomers, deleteCustomerAdmin, getAdminStocks } from './api';
import { Plus, Users, X, ShieldAlert, ArrowLeft, RefreshCw, Layers } from 'lucide-react';

function AdminPanel() {
  const [stockName, setStockName] = useState('');
  const [stockSymbol, setStockSymbol] = useState('');
  const [availableQuantity, setAvailableQuantity] = useState('');
  const [totalQuantity, setTotalQuantity] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  
  // State lists
  const [stocks, setStocks] = useState([]);
  const [customers, setCustomers] = useState([]);
  
  // Status states
  const [loadingStocks, setLoadingStocks] = useState(true);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activeSubTab, setActiveSubTab] = useState('ipo'); // 'ipo' | 'customers' | 'stocks'

  const navigate = useNavigate();

  const fetchStocks = async () => {
    try {
      setLoadingStocks(true);
      const response = await getAdminStocks();
      setStocks(response.data);
    } catch {
      setError('Failed to fetch stock listings.');
    } finally {
      setLoadingStocks(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      setLoadingCustomers(true);
      const response = await getAllCustomers();
      setCustomers(response.data);
    } catch {
      setError('Failed to fetch registered customers.');
    } finally {
      setLoadingCustomers(false);
    }
  };

  const fetchAdminData = () => {
    fetchStocks();
    fetchCustomers();
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleAddStock = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    const avail = parseInt(availableQuantity);
    const tot = parseInt(totalQuantity);
    const price = parseFloat(currentPrice);

    if (avail > tot) {
      setError('Available quantity cannot be greater than total quantity.');
      return;
    }

    try {
      const stockData = {
        stockName,
        stockSymbol: stockSymbol.toUpperCase(),
        availableQuantity: avail,
        totalQuantity: tot,
        currentPrice: price
      };
      await addStock(stockData);
      setMessage(`Successfully listed IPO: ${stockName}`);
      setStockName('');
      setStockSymbol('');
      setAvailableQuantity('');
      setTotalQuantity('');
      setCurrentPrice('');
      fetchStocks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add stock listing.');
    }
  };

  const handleForceDeleteCustomer = async (customerId) => {
    if (!window.confirm("WARNING: Forcing deletion will liquidate all user holdings and delete their account immediately. Proceed?")) {
      return;
    }
    try {
      await deleteCustomerAdmin(customerId);
      setMessage(`Successfully liquidated and deleted customer ID #${customerId}`);
      fetchCustomers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete customer.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '2.5rem 3rem' }}>
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {/* Header bar */}
      <div className="flex-row-between" style={{ marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }} className="text-gradient">Governance Command Console</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>IPO listings, auditing directories, and regulatory actions.</p>
        </div>
        <button className="btn-modern btn-secondary-modern" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
      </div>

      {/* Status Banners */}
      {message && (
        <div className="glass-card" style={{ padding: '1rem', borderLeft: '4px solid var(--success)', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <span style={{ fontWeight: 600 }}>Action Success:</span> {message}
          <button style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#10b981', cursor: 'pointer' }} onClick={() => setMessage('')}><X size={16} /></button>
        </div>
      )}
      {error && (
        <div className="glass-card" style={{ padding: '1rem', borderLeft: '4px solid var(--danger)', background: 'rgba(244, 63, 94, 0.1)', color: '#fb7185', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <span style={{ fontWeight: 600 }}>Alert:</span> {error}
          <button style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#fb7185', cursor: 'pointer' }} onClick={() => setError('')}><X size={16} /></button>
        </div>
      )}

      {/* Sub Tabs Navigation */}
      <div className="flex gap-4" style={{ marginBottom: '2.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
        <button 
          className={`btn-modern ${activeSubTab === 'ipo' ? 'btn-primary-glow' : 'btn-secondary-modern'}`}
          style={{ padding: '0.55rem 1.25rem', borderRadius: '10px', fontSize: '0.85rem' }}
          onClick={() => setActiveSubTab('ipo')}
        >
          <Plus size={16} /> List New IPO
        </button>
        <button 
          className={`btn-modern ${activeSubTab === 'stocks' ? 'btn-primary-glow' : 'btn-secondary-modern'}`}
          style={{ padding: '0.55rem 1.25rem', borderRadius: '10px', fontSize: '0.85rem' }}
          onClick={() => setActiveSubTab('stocks')}
        >
          <Layers size={16} /> Market Inventory
        </button>
        <button 
          className={`btn-modern ${activeSubTab === 'customers' ? 'btn-primary-glow' : 'btn-secondary-modern'}`}
          style={{ padding: '0.55rem 1.25rem', borderRadius: '10px', fontSize: '0.85rem' }}
          onClick={() => setActiveSubTab('customers')}
        >
          <Users size={16} /> Client Directory
        </button>
        <button 
          className="btn-modern btn-secondary-modern"
          style={{ padding: '0.55rem 1rem', borderRadius: '10px', fontSize: '0.85rem', marginLeft: 'auto' }}
          onClick={fetchAdminData}
        >
          <RefreshCw size={14} /> Refresh Data
        </button>
      </div>

      {/* TAB CONTENTS */}

      {/* LIST NEW IPO */}
      {activeSubTab === 'ipo' && (
        <div className="glass-card" style={{ maxWidth: '560px', margin: '0 auto', padding: '2.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>Introduce New IPO</h3>
          
          <form onSubmit={handleAddStock}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Stock Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={stockName}
                  onChange={(e) => setStockName(e.target.value)}
                  placeholder="e.g. Tesla Motors"
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Stock Symbol</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={stockSymbol}
                  onChange={(e) => setStockSymbol(e.target.value)}
                  placeholder="e.g. TSLA"
                  maxLength={5}
                  required 
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Total Quantity Pool</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={totalQuantity}
                  onChange={(e) => setTotalQuantity(e.target.value)}
                  placeholder="e.g. 50000"
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Available Quantity</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={availableQuantity}
                  onChange={(e) => setAvailableQuantity(e.target.value)}
                  placeholder="e.g. 50000"
                  required 
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label className="form-label">IPO Starting Price ($)</label>
              <input 
                type="number" 
                step="0.01"
                className="form-input" 
                value={currentPrice}
                onChange={(e) => setCurrentPrice(e.target.value)}
                placeholder="10.00"
                required 
              />
            </div>

            <button type="submit" className="btn-modern btn-primary-glow" style={{ width: '100%' }}>
              List IPO to Live Index
            </button>
          </form>
        </div>
      )}

      {/* MARKET INVENTORY */}
      {activeSubTab === 'stocks' && (
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>Active Index Listings</h3>

          {loadingStocks ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
              Loading active stock listings...
            </div>
          ) : stocks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
              No active listings. Go to the List New IPO tab to add one!
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Stock ID</th>
                    <th>Stock Name</th>
                    <th>Symbol</th>
                    <th>Current Value</th>
                    <th>Total Supply</th>
                    <th>Available Pools</th>
                    <th>Distributed Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {stocks.map(stock => {
                    const distributed = stock.totalQuantity - stock.availableQuantity;
                    return (
                      <tr key={stock.id}>
                        <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>#{stock.id}</td>
                        <td style={{ fontWeight: 700 }}>{stock.stockName}</td>
                        <td><span className="badge badge-info">{stock.stockSymbol || 'STK'}</span></td>
                        <td style={{ fontWeight: 600 }}>${stock.currentPrice?.toFixed(2)}</td>
                        <td>{stock.totalQuantity?.toLocaleString()}</td>
                        <td>{stock.availableQuantity?.toLocaleString()}</td>
                        <td style={{ fontWeight: 600, color: 'var(--primary)' }}>
                          {distributed.toLocaleString()} shares
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* CLIENT DIRECTORY */}
      {activeSubTab === 'customers' && (
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>Auditable Customer Registries</h3>

          {loadingCustomers ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
              Loading customer profiles...
            </div>
          ) : customers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
              No registered customers found.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Client Name</th>
                    <th>Mobile</th>
                    <th>Email Address</th>
                    <th>Wallet Balance</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map(cust => (
                    <tr key={cust.customerId}>
                      <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>#{cust.customerId}</td>
                      <td style={{ fontWeight: 700 }}>{cust.customerName}</td>
                      <td>{cust.mobileNumber}</td>
                      <td>{cust.email}</td>
                      <td style={{ fontWeight: 700 }}>
                        ${cust.wallet?.balance != null ? cust.wallet.balance.toFixed(2) : '0.00'}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button 
                          className="btn-modern btn-danger-glow"
                          style={{ padding: '0.4rem 0.85rem', borderRadius: '8px', fontSize: '0.75rem', gap: '0.35rem' }}
                          onClick={() => handleForceDeleteCustomer(cust.customerId)}
                        >
                          <ShieldAlert size={14} /> Liquidate & Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

export default AdminPanel;
