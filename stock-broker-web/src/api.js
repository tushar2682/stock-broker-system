import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
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
  return api.get('/viewAllStocks', { params: { key } });
};

export const buyStock = (customerId, stockName, shares) => {
  return api.post(`/customers/${customerId}/stocks/buy`, null, {
    params: { stockName, shares }
  });
};

export const sellStock = (customerId, stockName, shares) => {
  return api.post(`/sellStockByName`, null, {
    params: { customerId, stockName, shares }
  });
};

export const getTransactions = (customerId) => {
  return api.get(`/customers/${customerId}/transactions`);
};

export const addStock = (stockData) => {
  return api.post('/stockman/stocks', stockData);
};

export default api;
