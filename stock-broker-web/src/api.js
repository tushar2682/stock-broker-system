import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const loginCustomer = (mobileNumber, password) => {
  return api.post('/login', { mobileNumber, password });
};

export const registerCustomer = (customerData) => {
  return api.post('/customers', customerData);
};

export const getStocks = (key) => {
  return api.get('/stocks', { params: { key } });
};

export const buyStock = (customerId, stockName, shares) => {
  return api.post(`/customers/${customerId}/stocks/buy`, null, {
    params: { stockName, shares }
  });
};

export const sellStock = (customerId, stockName, shares) => {
  return api.post(`/customers/${customerId}/stocks/sell`, null, {
    params: { stockName, shares }
  });
};

export const getTransactions = (customerId) => {
  return api.get(`/customers/${customerId}/transactions`);
};

export const addStock = (stockData) => {
  return api.post('/stockman/stocks', stockData);
};

export const getCustomer = (customerId) => {
  return api.get(`/customers/${customerId}`);
};

export const depositFunds = (customerId, amount) => {
  return api.post(`/customers/${customerId}/wallet/deposit`, null, {
    params: { amount }
  });
};

export const withdrawFunds = (customerId, amount) => {
  return api.post(`/customers/${customerId}/wallet/withdraw`, null, {
    params: { amount }
  });
};

export const deleteAccount = (customerId) => {
  return api.delete(`/customers/${customerId}`);
};

export const logoutCustomer = (key) => {
  return api.post('/logout', null, {
    params: { key }
  });
};

export const getAllCustomers = () => {
  return api.get('/stockman/customers');
};

export const deleteCustomerAdmin = (customerId) => {
  return api.delete(`/stockman/customers/${customerId}`);
};

export const getAdminStocks = () => {
  return api.get('/stockman/allStocks');
};

export default api;
