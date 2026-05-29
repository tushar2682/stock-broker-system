import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getStocks, 
  buyStock, 
  sellStock, 
  getCustomer, 
  getTransactions, 
  depositFunds, 
  withdrawFunds, 
  deleteAccount,
  logoutCustomer 
} from './api';
import { 
  TrendingUp, 
  Wallet, 
  History, 
  Settings as SettingsIcon, 
  LogOut, 
  Search, 
  Plus, 
  Minus, 
  ArrowUpRight, 
  ArrowDownRight, 
  X, 
  Trash2, 
  ShieldAlert, 
  DollarSign,
  Briefcase
} from 'lucide-react';

function Dashboard({ authKey, customerId, onLogout }) {
  const [activeTab, setActiveTab] = useState('market'); // 'market' | 'portfolio' | 'transactions' | 'settings'
  const [customer, setCustomer] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  
  // Loading & Error states
  const [loadingStocks, setLoadingStocks] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingTx, setLoadingTx] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Modal states
  const [walletModal, setWalletModal] = useState({ isOpen: false, type: 'deposit' }); // 'deposit' | 'withdraw'
  const [walletAmount, setWalletAmount] = useState('');
  const [tradeModal, setTradeModal] = useState({ isOpen: false, type: 'buy', stock: null });
  const [tradeQuantity, setTradeQuantity] = useState('1');
  const [tradeMode, setTradeMode] = useState('shares'); // 'shares' | 'cash'
  const [tradeCashAmount, setTradeCashAmount] = useState('');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      setLoadingProfile(true);
      const response = await getCustomer(customerId);
      setCustomer(response.data);
    } catch {
      showError('Failed to load profile details.');
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchStocks = async () => {
    try {
      setLoadingStocks(true);
      const response = await getStocks(authKey);
      setStocks(response.data);
    } catch {
      showError('Failed to fetch live stock listings.');
    } finally {
      setLoadingStocks(false);
    }
  };

  const fetchTransactions = async () => {
    if (!customerId) return;
    try {
      setLoadingTx(true);
      const response = await getTransactions(customerId);
      // Sort transactions descending by date/id
      const sorted = response.data.sort((a, b) => b.id - a.id);
      setTransactions(sorted);
    } catch {
      showError('Failed to retrieve transaction log.');
    } finally {
      setLoadingTx(false);
    }
  };

  // Load profile and stocks on load
  useEffect(() => {
    if (!authKey || !customerId) {
      navigate('/');
      return;
    }
    fetchProfile();
    fetchStocks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load transactions when transactions or portfolio tab is active
  useEffect(() => {
    if (activeTab === 'transactions' || activeTab === 'portfolio') {
      fetchTransactions();
    }
  }, [activeTab]);

  function showError(msg) {
    setErrorMessage(msg);
    setSuccessMessage('');
    setTimeout(() => setErrorMessage(''), 5000);
  }

  function showSuccess(msg) {
    setSuccessMessage(msg);
    setErrorMessage('');
    setTimeout(() => setSuccessMessage(''), 5000);
  }

  // Wallet operations
  const handleWalletAction = async (e) => {
    e.preventDefault();
    const amount = parseFloat(walletAmount);
    if (isNaN(amount) || amount <= 0) {
      showError('Please enter a valid amount greater than 0.');
      return;
    }

    try {
      let response;
      if (walletModal.type === 'deposit') {
        response = await depositFunds(customerId, amount);
        showSuccess(`Successfully deposited $${amount.toFixed(2)} to wallet!`);
      } else {
        response = await withdrawFunds(customerId, amount);
        showSuccess(`Successfully withdrew $${amount.toFixed(2)} from wallet!`);
      }
      setCustomer(response.data);
      setWalletModal({ isOpen: false, type: 'deposit' });
      setWalletAmount('');
    } catch (err) {
      showError(err.response?.data?.message || `Wallet operation failed.`);
    }
  };

  // Trading actions
  const handleTradeAction = async (e) => {
    e.preventDefault();
    const { stock, type } = tradeModal;
    if (!stock) return;

    const qty = tradeMode === 'shares'
      ? parseInt(tradeQuantity)
      : Math.floor(parseFloat(tradeCashAmount || '0') / stock.currentPrice);

    if (isNaN(qty) || qty <= 0) {
      showError('Please specify a valid quantity of shares or investment amount.');
      return;
    }

    const subtotal = qty * stock.currentPrice;
    const fee = subtotal * 0.005; // 0.50% brokerage fee

    try {
      if (type === 'buy') {
        const totalCost = subtotal + fee;
        if (totalCost > customer.walletBalance) {
          showError('Insufficient funds in wallet (includes 0.50% brokerage fee).');
          return;
        }
        await buyStock(customerId, stock.stockName, qty);
        if (fee > 0) {
          await withdrawFunds(customerId, fee);
        }
        showSuccess(`Successfully bought ${qty} share(s) of ${stock.stockName}! Charged $${fee.toFixed(2)} brokerage fee.`);
      } else {
        await sellStock(customerId, stock.stockName, qty);
        if (fee > 0) {
          await withdrawFunds(customerId, fee);
        }
        showSuccess(`Successfully sold ${qty} share(s) of ${stock.stockName}! Charged $${fee.toFixed(2)} brokerage fee.`);
      }
      setTradeModal({ isOpen: false, type: 'buy', stock: null });
      setTradeQuantity('1');
      setTradeCashAmount('');
      setTradeMode('shares');
      fetchProfile();
      fetchStocks();
      if (activeTab === 'portfolio' || activeTab === 'transactions') {
        fetchTransactions();
      }
    } catch (err) {
      showError(err.response?.data?.message || `Trade execution failed.`);
    }
  };

  // Account Liquidation and Deletion
  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you absolutely sure you want to permanently delete your trading account? This action is irreversible.")) {
      return;
    }
    try {
      await deleteAccount(customerId);
      alert("Your account has been deleted successfully.");
      onLogout();
      navigate('/');
    } catch (err) {
      showError(err.response?.data?.message || "Failed to delete account. Make sure your wallet balance is exactly $0.00.");
    }
  };

  // Logout handler
  const handleLogoutClick = async () => {
    try {
      await logoutCustomer(authKey);
    } catch {
      // Ignored: logging out locally anyway
    }
    onLogout();
    navigate('/');
  };

  // Portfolio calculations
  const calculatePortfolio = () => {
    const holdingsMap = {};
    
    // Process transactions sequentially (chronological order by id)
    const chronoTx = [...transactions].reverse();

    chronoTx.forEach(tx => {
      const stockName = tx.stock?.stockName;
      const stockSymbol = tx.stock?.stockSymbol || 'STK';
      if (!stockName) return;

      if (!holdingsMap[stockName]) {
        holdingsMap[stockName] = {
          stockName,
          stockSymbol,
          quantity: 0,
          totalCost: 0.0,
          averageBuyPrice: 0.0
        };
      }

      const hold = holdingsMap[stockName];
      const txCost = tx.transactionPrice; // total transaction price
      const qty = tx.quantity;

      if (tx.transactionType === 'BUY') {
        hold.quantity += qty;
        hold.totalCost += txCost;
        hold.averageBuyPrice = hold.totalCost / hold.quantity;
      } else if (tx.transactionType === 'SOLD') {
        hold.quantity -= qty;
        // If shares are sold, reduce cost proportionally based on average buy price
        hold.totalCost = hold.quantity * hold.averageBuyPrice;
        if (hold.quantity <= 0) {
          delete holdingsMap[stockName];
        }
      }
    });

    // Map holdings to current live prices
    return Object.values(holdingsMap).map(hold => {
      const liveStock = stocks.find(s => s.stockName === hold.stockName);
      const currentPrice = liveStock ? liveStock.currentPrice : hold.averageBuyPrice;
      const currentValuation = hold.quantity * currentPrice;
      const profitLoss = currentValuation - (hold.quantity * hold.averageBuyPrice);
      const profitLossPercent = hold.averageBuyPrice > 0 ? (profitLoss / (hold.quantity * hold.averageBuyPrice)) * 100 : 0;

      return {
        ...hold,
        currentPrice,
        currentValuation,
        profitLoss,
        profitLossPercent
      };
    });
  };

  const portfolio = calculatePortfolio();
  
  const totalValuation = portfolio.reduce((acc, h) => acc + h.currentValuation, 0);
  const totalCostBasis = portfolio.reduce((acc, h) => acc + (h.quantity * h.averageBuyPrice), 0);
  const netGainLoss = totalValuation - totalCostBasis;
  const netGainLossPercent = totalCostBasis > 0 ? (netGainLoss / totalCostBasis) * 100 : 0;

  // Filter live stocks based on search query
  const filteredStocks = stocks.filter(stock => 
    stock.stockName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.stockSymbol?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app-container">
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div>
          <div className="flex-row-between" style={{ padding: '0 0.5rem 2rem 0.5rem' }}>
            <div className="flex items-center gap-4">
              <div className="flex-center" style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--primary)', boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)' }}>
                <TrendingUp size={20} color="white" />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800 }} className="text-gradient">Stock</span>
            </div>
          </div>

          <nav>
            <button 
              className={`nav-link btn-modern ${activeTab === 'market' ? 'active' : ''}`}
              style={{ width: '100%', border: 'none', cursor: 'pointer', background: 'none' }}
              onClick={() => setActiveTab('market')}
            >
              <TrendingUp size={18} />
              Live Market
            </button>
            <button 
              className={`nav-link btn-modern ${activeTab === 'portfolio' ? 'active' : ''}`}
              style={{ width: '100%', border: 'none', cursor: 'pointer', background: 'none' }}
              onClick={() => setActiveTab('portfolio')}
            >
              <Briefcase size={18} />
              My Portfolio
            </button>
            <button 
              className={`nav-link btn-modern ${activeTab === 'transactions' ? 'active' : ''}`}
              style={{ width: '100%', border: 'none', cursor: 'pointer', background: 'none' }}
              onClick={() => setActiveTab('transactions')}
            >
              <History size={18} />
              Transactions
            </button>
            <button 
              className={`nav-link btn-modern ${activeTab === 'settings' ? 'active' : ''}`}
              style={{ width: '100%', border: 'none', cursor: 'pointer', background: 'none' }}
              onClick={() => setActiveTab('settings')}
            >
              <SettingsIcon size={18} />
              Settings
            </button>
          </nav>
        </div>

        <div>
          <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>LOGGED IN AS</p>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {customer?.customerName || 'Trading Account'}
            </h4>
            <p style={{ fontSize: '0.7rem', color: 'var(--primary)' }}>ID: {customerId}</p>
          </div>
          <button 
            className="nav-link btn-modern" 
            style={{ width: '100%', border: 'none', cursor: 'pointer', background: 'none', color: 'var(--danger)' }}
            onClick={handleLogoutClick}
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        
        {/* Banner Messages */}
        {successMessage && (
          <div className="glass-card" style={{ padding: '1rem', borderLeft: '4px solid var(--success)', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', animation: 'fadeIn 0.2s ease' }}>
            <span style={{ fontWeight: 600 }}>Success:</span> {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="glass-card" style={{ padding: '1rem', borderLeft: '4px solid var(--danger)', background: 'rgba(244, 63, 94, 0.1)', color: '#fb7185', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', animation: 'fadeIn 0.2s ease' }}>
            <span style={{ fontWeight: 600 }}>Error:</span> {errorMessage}
          </div>
        )}

        {/* Dashboard Header stats */}
        <section className="flex-row-between" style={{ marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>
              {activeTab === 'market' && 'Live Market Feed'}
              {activeTab === 'portfolio' && 'Asset Portfolio'}
              {activeTab === 'transactions' && 'Transaction History'}
              {activeTab === 'settings' && 'Account Settings'}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {activeTab === 'market' && 'Monitor index pricing and execute trades instantly.'}
              {activeTab === 'portfolio' && 'Analyze capital allocation and financial performance.'}
              {activeTab === 'transactions' && 'Inspect ledger transactions audit log.'}
              {activeTab === 'settings' && 'Manage profile parameters and governance.'}
            </p>
          </div>

          {/* Balance card */}
          <div className="glass-card flex-row-between" style={{ minWidth: '360px', padding: '1.25rem 1.5rem', gap: '2rem' }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Wallet size={14} color="var(--primary)" /> Wallet Balance
              </p>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.25rem' }}>
                ${loadingProfile ? '...' : (customer?.walletBalance != null ? customer.walletBalance.toFixed(2) : '0.00')}
              </h2>
            </div>
            <div className="flex gap-4">
              <button 
                className="btn-modern btn-success-glow" 
                style={{ padding: '0.55rem 1rem', borderRadius: '10px', fontSize: '0.85rem' }}
                onClick={() => setWalletModal({ isOpen: true, type: 'deposit' })}
              >
                <Plus size={16} /> Deposit
              </button>
              <button 
                className="btn-modern btn-secondary-modern" 
                style={{ padding: '0.55rem 1rem', borderRadius: '10px', fontSize: '0.85rem' }}
                onClick={() => setWalletModal({ isOpen: true, type: 'withdraw' })}
              >
                <Minus size={16} /> Withdraw
              </button>
            </div>
          </div>
        </section>

        {/* Tab contents */}
        
        {/* MARKET TAB */}
        {activeTab === 'market' && (
          <section className="glass-card" style={{ padding: '2rem' }}>
            <div className="flex-row-between" style={{ marginBottom: '1.5rem', gap: '1.5rem', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Live Watchlist</h3>
              
              <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
                <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex' }}>
                  <Search size={16} />
                </span>
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ width: '100%', paddingLeft: '2.5rem', paddingRight: '1rem', borderRadius: '10px', fontSize: '0.85rem' }}
                  placeholder="Search stock name or symbol..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {loadingStocks ? (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                Fetching live market feed...
              </div>
            ) : filteredStocks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                No matching stocks found.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Stock Name</th>
                      <th>Symbol</th>
                      <th>Market Price</th>
                      <th>Total Supply</th>
                      <th>Available Pool</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStocks.map(stock => (
                      <tr key={stock.id} style={{ transition: 'background 0.2s' }}>
                        <td style={{ fontWeight: 700 }}>{stock.stockName}</td>
                        <td>
                          <span className="badge badge-info">{stock.stockSymbol || 'STK'}</span>
                        </td>
                        <td style={{ fontWeight: 600 }}>${stock.currentPrice?.toFixed(2)}</td>
                        <td>{stock.totalQuantity?.toLocaleString()}</td>
                        <td>
                          <span style={{ 
                            color: stock.availableQuantity < stock.totalQuantity * 0.1 ? 'var(--danger)' : 'var(--text-main)',
                            fontWeight: 600
                          }}>
                            {stock.availableQuantity?.toLocaleString()}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div className="flex gap-4" style={{ justifyContent: 'flex-end' }}>
                            <button 
                              className="btn-modern btn-primary-glow" 
                              style={{ padding: '0.45rem 1rem', borderRadius: '8px', fontSize: '0.8rem' }}
                              onClick={() => setTradeModal({ isOpen: true, type: 'buy', stock })}
                            >
                              Buy
                            </button>
                            <button 
                              className="btn-modern btn-danger-glow" 
                              style={{ padding: '0.45rem 1rem', borderRadius: '8px', fontSize: '0.8rem' }}
                              onClick={() => setTradeModal({ isOpen: true, type: 'sell', stock })}
                            >
                              Sell
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* PORTFOLIO TAB */}
        {activeTab === 'portfolio' && (
          <section style={{ animation: 'fadeIn 0.2s' }}>
            
            {/* Summary Row */}
            <div className="grid-3" style={{ marginBottom: '2rem' }}>
              <div className="glass-card">
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Portfolio Value
                </p>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.25rem' }}>
                  ${totalValuation.toFixed(2)}
                </h3>
              </div>
              <div className="glass-card">
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Invested Capital
                </p>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.25rem' }}>
                  ${totalCostBasis.toFixed(2)}
                </h3>
              </div>
              <div className="glass-card">
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Total Gain / Loss
                </p>
                <div className="flex items-center gap-2" style={{ marginTop: '0.25rem' }}>
                  <h3 style={{ 
                    fontSize: '1.75rem', 
                    fontWeight: 800,
                    color: netGainLoss >= 0 ? 'var(--success)' : 'var(--danger)'
                  }}>
                    {netGainLoss >= 0 ? '+' : ''}${netGainLoss.toFixed(2)}
                  </h3>
                  <span style={{ 
                    fontSize: '0.85rem', 
                    fontWeight: 700, 
                    color: netGainLoss >= 0 ? 'var(--success)' : 'var(--danger)',
                    background: netGainLoss >= 0 ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem'
                  }}>
                    {netGainLoss >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {netGainLossPercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Asset Table */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Asset Allocation</h3>

              {loadingTx ? (
                <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                  Calculating portfolio holdings...
                </div>
              ) : portfolio.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                  No active asset holdings. Go to the Market tab to execute your first trade!
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Asset Name</th>
                        <th>Shares Held</th>
                        <th>Avg. Buy Price</th>
                        <th>Market Price</th>
                        <th>Valuation</th>
                        <th style={{ textAlign: 'right' }}>Gain / Loss</th>
                      </tr>
                    </thead>
                    <tbody>
                      {portfolio.map(hold => (
                        <tr key={hold.stockName}>
                          <td style={{ fontWeight: 700 }}>
                            {hold.stockName} <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500 }}>{hold.stockSymbol}</span>
                          </td>
                          <td style={{ fontWeight: 600 }}>{hold.quantity}</td>
                          <td>${hold.averageBuyPrice.toFixed(2)}</td>
                          <td>${hold.currentPrice.toFixed(2)}</td>
                          <td style={{ fontWeight: 600 }}>${hold.currentValuation.toFixed(2)}</td>
                          <td style={{ textAlign: 'right', fontWeight: 700, color: hold.profitLoss >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                            <span className="flex" style={{ justifyContent: 'flex-end', alignItems: 'center', gap: '0.25rem' }}>
                              {hold.profitLoss >= 0 ? '+' : ''}${hold.profitLoss.toFixed(2)}
                              <span style={{ fontSize: '0.75rem', fontWeight: 600, opacity: 0.8 }}>
                                ({hold.profitLossPercent.toFixed(1)}%)
                              </span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        )}

        {/* TRANSACTIONS TAB */}
        {activeTab === 'transactions' && (
          <section className="glass-card" style={{ padding: '2rem' }}>
            <div className="flex-row-between" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Audit Ledger</h3>
              <button className="btn-modern btn-secondary-modern" style={{ padding: '0.45rem 1rem', borderRadius: '8px', fontSize: '0.8rem' }} onClick={fetchTransactions}>
                Refresh log
              </button>
            </div>

            {loadingTx ? (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                Loading ledger records...
              </div>
            ) : transactions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                No transactions recorded yet.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Transaction ID</th>
                      <th>Date / Time</th>
                      <th>Stock Name</th>
                      <th>Action</th>
                      <th>Quantity</th>
                      <th>Avg Share Price</th>
                      <th style={{ textAlign: 'right' }}>Total Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map(tx => (
                      <tr key={tx.id}>
                        <td style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>#{tx.id}</td>
                        <td>
                          {tx.transactionDate ? tx.transactionDate : 'N/A'}
                          {tx.transactionTime && (
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.4rem' }}>
                              {new Date(tx.transactionTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </td>
                        <td style={{ fontWeight: 700 }}>{tx.stock?.stockName || 'Unknown Stock'}</td>
                        <td>
                          <span className={`badge ${tx.transactionType === 'BUY' ? 'badge-success' : 'badge-danger'}`}>
                            {tx.transactionType}
                          </span>
                        </td>
                        <td>{tx.quantity}</td>
                        <td>${(tx.transactionPrice / tx.quantity).toFixed(2)}</td>
                        <td style={{ textAlign: 'right', fontWeight: 700 }}>
                          ${tx.transactionPrice.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <section className="grid-2">
            {/* Profile Info */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Profile Specifications</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>CUSTOMER ID</p>
                  <p style={{ fontSize: '1rem', fontWeight: 700, marginTop: '0.15rem' }}>{customer?.customerId}</p>
                </div>
                <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>FULL NAME</p>
                  <p style={{ fontSize: '1rem', fontWeight: 700, marginTop: '0.15rem' }}>{customer?.customerName}</p>
                </div>
                <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>MOBILE NUMBER</p>
                  <p style={{ fontSize: '1rem', fontWeight: 700, marginTop: '0.15rem' }}>{customer?.mobileNumber}</p>
                </div>
                <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>EMAIL ADDRESS</p>
                  <p style={{ fontSize: '1rem', fontWeight: 700, marginTop: '0.15rem' }}>{customer?.email}</p>
                </div>
              </div>

              <div style={{ marginTop: '2rem' }}>
                <button className="btn-modern btn-secondary-modern" style={{ width: '100%' }} onClick={() => navigate('/admin')}>
                  Governance Admin Panel
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="glass-card" style={{ padding: '2rem', border: '1px solid rgba(244, 63, 94, 0.25)', background: 'rgba(244, 63, 94, 0.02)' }}>
              <div className="flex items-center gap-4" style={{ marginBottom: '1rem' }}>
                <div className="flex-center" style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(244, 63, 94, 0.15)' }}>
                  <ShieldAlert size={20} color="var(--danger)" />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--danger)' }}>Danger Zone</h3>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                Deleting your account will purge all transaction logs, delete your digital wallet, and remove your profile from the ledger. Before doing so, you must withdraw your entire wallet balance so it is exactly **$0.00**.
              </p>
              
              <div style={{ border: '1px solid rgba(255,255,255,0.06)', padding: '1rem', borderRadius: '12px', background: 'rgba(0,0,0,0.15)', marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CURRENT BALANCING CHECK</p>
                <p style={{ fontSize: '1.15rem', fontWeight: 800, color: customer?.walletBalance === 0 ? 'var(--success)' : 'var(--danger)', marginTop: '0.25rem' }}>
                  ${customer?.walletBalance != null ? customer.walletBalance.toFixed(2) : '0.00'}
                  {customer?.walletBalance > 0 && <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '0.5rem' }}>(must be $0.00)</span>}
                </p>
              </div>

              <button 
                className="btn-modern btn-danger-glow" 
                style={{ width: '100%', gap: '0.5rem' }}
                disabled={customer?.walletBalance > 0}
                onClick={handleDeleteAccount}
              >
                <Trash2 size={18} />
                Delete Account
              </button>
            </div>
          </section>
        )}

      </main>

      {/* WALLET DEPOSIT/WITHDRAW MODAL */}
      {walletModal.isOpen && (
        <div className="modal-overlay" onClick={() => setWalletModal({ isOpen: false, type: 'deposit' })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="flex-center" style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => setWalletModal({ isOpen: false, type: 'deposit' })}>
              <X size={20} />
            </button>
            
            <div className="flex items-center gap-4" style={{ marginBottom: '1.5rem' }}>
              <div className="flex-center" style={{ width: '42px', height: '42px', borderRadius: '10px', background: walletModal.type === 'deposit' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)' }}>
                <Wallet size={20} color={walletModal.type === 'deposit' ? 'var(--success)' : 'var(--primary)'} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                {walletModal.type === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds'}
              </h3>
            </div>

            <form onSubmit={handleWalletAction}>
              <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                <label className="form-label">Amount (USD)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                    <DollarSign size={18} />
                  </span>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0.01"
                    className="form-input" 
                    style={{ width: '100%', paddingLeft: '2.5rem' }}
                    value={walletAmount}
                    onChange={(e) => setWalletAmount(e.target.value)}
                    placeholder="0.00"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button type="button" className="btn-modern btn-secondary-modern" style={{ flex: 1 }} onClick={() => setWalletModal({ isOpen: false, type: 'deposit' })}>
                  Cancel
                </button>
                <button type="submit" className={`btn-modern ${walletModal.type === 'deposit' ? 'btn-success-glow' : 'btn-primary-glow'}`} style={{ flex: 1 }}>
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BUY/SELL STOCK MODAL */}
      {tradeModal.isOpen && tradeModal.stock && (() => {
        const qty = tradeMode === 'shares' 
          ? parseInt(tradeQuantity || '0') 
          : Math.floor(parseFloat(tradeCashAmount || '0') / tradeModal.stock.currentPrice);
        const subtotal = qty * tradeModal.stock.currentPrice;
        const fee = subtotal * 0.005;
        const total = tradeModal.type === 'buy' ? subtotal + fee : subtotal - fee;

        return (
          <div className="modal-overlay" onClick={() => setTradeModal({ isOpen: false, type: 'buy', stock: null })}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="flex-center" style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => setTradeModal({ isOpen: false, type: 'buy', stock: null })}>
                <X size={20} />
              </button>
              
              <div className="flex items-center gap-4" style={{ marginBottom: '1.25rem' }}>
                <div className="flex-center" style={{ width: '42px', height: '42px', borderRadius: '10px', background: tradeModal.type === 'buy' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(244, 63, 94, 0.15)' }}>
                  <TrendingUp size={20} color={tradeModal.type === 'buy' ? 'var(--primary)' : 'var(--danger)'} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                    {tradeModal.type === 'buy' ? 'Buy Shares' : 'Sell Shares'}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{tradeModal.stock.stockName} ({tradeModal.stock.stockSymbol || 'STK'})</p>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1rem', marginBottom: '1.25rem' }}>
                <div className="flex-row-between" style={{ marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Share Market Price:</span>
                  <span style={{ fontWeight: 700 }}>${tradeModal.stock.currentPrice?.toFixed(2)}</span>
                </div>
                <div className="flex-row-between">
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Available Market Pool:</span>
                  <span style={{ fontWeight: 700 }}>{tradeModal.stock.availableQuantity?.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-4" style={{ marginBottom: '1.25rem' }}>
                <button 
                  type="button"
                  className={`btn-modern ${tradeMode === 'shares' ? 'btn-primary-glow' : 'btn-secondary-modern'}`}
                  style={{ flex: 1, padding: '0.45rem', borderRadius: '8px', fontSize: '0.8rem' }}
                  onClick={() => {
                    setTradeMode('shares');
                    const cashVal = parseFloat(tradeCashAmount || '0');
                    if (cashVal > 0) {
                      setTradeQuantity(Math.floor(cashVal / tradeModal.stock.currentPrice).toString());
                    }
                  }}
                >
                  By Shares
                </button>
                <button 
                  type="button"
                  className={`btn-modern ${tradeMode === 'cash' ? 'btn-primary-glow' : 'btn-secondary-modern'}`}
                  style={{ flex: 1, padding: '0.45rem', borderRadius: '8px', fontSize: '0.8rem' }}
                  onClick={() => {
                    setTradeMode('cash');
                    const sharesVal = parseInt(tradeQuantity || '0');
                    if (sharesVal > 0) {
                      setTradeCashAmount((sharesVal * tradeModal.stock.currentPrice).toFixed(2));
                    }
                  }}
                >
                  By Cash ($)
                </button>
              </div>

              <form onSubmit={handleTradeAction}>
                {tradeMode === 'shares' ? (
                  <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                    <label className="form-label">Number of Shares (Qty)</label>
                    <input 
                      type="number" 
                      min="1"
                      max={tradeModal.type === 'buy' ? tradeModal.stock.availableQuantity : undefined}
                      className="form-input" 
                      style={{ width: '100%' }}
                      value={tradeQuantity}
                      onChange={(e) => setTradeQuantity(e.target.value)}
                      placeholder="1"
                      required
                      autoFocus
                    />
                  </div>
                ) : (
                  <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                    <label className="form-label">Investment Amount (USD)</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                        <DollarSign size={16} />
                      </span>
                      <input 
                        type="number" 
                        step="0.01"
                        min={tradeModal.stock.currentPrice}
                        className="form-input" 
                        style={{ width: '100%', paddingLeft: '2.25rem' }}
                        value={tradeCashAmount}
                        onChange={(e) => setTradeCashAmount(e.target.value)}
                        placeholder={`Min: $${tradeModal.stock.currentPrice.toFixed(2)}`}
                        required
                        autoFocus
                      />
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0 0.25rem 1.25rem 0.25rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                  <div className="flex-row-between">
                    <span style={{ color: 'var(--text-muted)' }}>Estimated Shares:</span>
                    <span style={{ fontWeight: 600 }}>{qty} shares</span>
                  </div>
                  <div className="flex-row-between">
                    <span style={{ color: 'var(--text-muted)' }}>Subtotal:</span>
                    <span style={{ fontWeight: 600 }}>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex-row-between">
                    <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      Brokerage Charge <span style={{ fontSize: '0.7rem', color: 'var(--primary)', background: 'rgba(59, 130, 246, 0.1)', padding: '0.05rem 0.35rem', borderRadius: '4px' }}>0.50%</span>:
                    </span>
                    <span style={{ fontWeight: 600 }}>${fee.toFixed(2)}</span>
                  </div>
                  <div className="flex-row-between" style={{ fontSize: '1rem', fontWeight: 800, marginTop: '0.25rem', borderTop: '1px dashed var(--border-color)', paddingTop: '0.5rem' }}>
                    <span style={{ color: 'white' }}>{tradeModal.type === 'buy' ? 'Total Cost:' : 'Net Proceeds:'}</span>
                    <span style={{ color: tradeModal.type === 'buy' ? 'var(--primary)' : 'var(--success)' }}>
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button type="button" className="btn-modern btn-secondary-modern" style={{ flex: 1 }} onClick={() => setTradeModal({ isOpen: false, type: 'buy', stock: null })}>
                    Cancel
                  </button>
                  <button type="submit" className={`btn-modern ${tradeModal.type === 'buy' ? 'btn-primary-glow' : 'btn-danger-glow'}`} style={{ flex: 1 }}>
                    Confirm Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}

    </div>
  );
}

export default Dashboard;
