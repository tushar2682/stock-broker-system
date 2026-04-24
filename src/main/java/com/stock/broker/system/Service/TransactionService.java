package com.stock.broker.system.Service;

import java.util.List;

import org.springframework.transaction.TransactionException;

import com.stock.broker.system.Exception.CustomerException;
import com.stock.broker.system.Exception.ResourceNotFoundException;
import com.stock.broker.system.Model.Transaction;
import com.stock.broker.system.Model.Customer;

public interface TransactionService {
	
	public Integer getTotalSoldQuantityByStockId(Integer stockId)throws ResourceNotFoundException;

	public List<Transaction> findByCustomer(Customer customer)
	throws CustomerException,ResourceNotFoundException;

	public void deleteAll(List<Transaction> transactions)throws TransactionException;
}