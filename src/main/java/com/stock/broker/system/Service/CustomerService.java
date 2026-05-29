package com.stock.broker.system.Service;

import java.util.List;

import com.stock.broker.system.Exception.CustomerException;
import com.stock.broker.system.Exception.ResourceNotFoundException;
import com.stock.broker.system.Exception.StockException;
import com.stock.broker.system.Model.Customer;
import com.stock.broker.system.Model.Stock;
import com.stock.broker.system.Model.Transaction;

public interface CustomerService {
	
	
	public Customer createCustomer(Customer customer)throws CustomerException;
	
	public Customer updateCustomer(Customer customer,String key)throws CustomerException;

	public List<Customer> getAllCustomers()throws CustomerException;

	public Customer findCustomerById(Integer id)throws CustomerException;

	public List<Stock> getAllStocks(String key)throws CustomerException;

	public Transaction buyStockByName(Integer customerId, String stockName, Integer shares)
	throws CustomerException,StockException,ResourceNotFoundException;

	public Transaction sellStockByName(Integer customerId, String stockName, Integer shares)
			throws CustomerException,StockException,ResourceNotFoundException;

	public Customer save(Customer customer)throws CustomerException;

	public void delete(Customer customer)throws CustomerException;

	public Customer depositFunds(Integer customerId, double amount) throws CustomerException, ResourceNotFoundException;

	public Customer withdrawFunds(Integer customerId, double amount) throws CustomerException, ResourceNotFoundException;

	
}