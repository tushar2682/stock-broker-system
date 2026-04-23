package com.stock.broker.system.Service;

import java.util.List;

import javax.transaction.TransactionalException;

import org.springframework.transaction.TransactionException;

import com.stock.broker.system.Exception.CustomerException;
import com.stock.broker.system.Exception.ResourceNotFoundException;

import jakarta.transaction.Transaction;


public interface TransactionService {
	
	public Integer getTotalSoldQuantityByStockId(Integer stockId)throws ResourceNotFoundException;

	public List<Transaction> findByCustomer(Customer customer)
	throws CustomerException,ResourceNotFoundException;

	public void deleteAll(List<Transaction> transactions)throws TransactionException;
}