package com.stock.broker.system.Service;
import java.util.List;
import java.util.Optional;

import org.springframework.transaction.TransactionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.stock.broker.system.Exception.CustomerException;
import com.stock.broker.system.Exception.ResourceNotFoundException;
import com.stock.broker.system.Model.Transaction;
import com.stock.broker.system.Model.Customer;
import com.stock.broker.system.Repository.TransactionRepository;

@Service
public class TransactionServiceImpl implements TransactionService{
	@Autowired
	private TransactionRepository transactionRepository;
	
	
	@Override
	public Integer getTotalSoldQuantityByStockId(Integer stockId) throws ResourceNotFoundException {
		Integer numInteger=transactionRepository.getTotalSoldQuantityByStockId(stockId);
		if (numInteger==null) {
			return 0;
		}
		return transactionRepository.getTotalSoldQuantityByStockId(stockId).intValue();
	}


	@Override
	public List<Transaction> findByCustomer(Customer customer) throws CustomerException, ResourceNotFoundException {
		List<Transaction> transactions=transactionRepository.findByCustomer(customer);
		if (transactions.size()==0) {
			throw new ResourceNotFoundException("No transactions found");
		}
		return transactions;
	}


	@Override
	public void deleteAll(List<Transaction> transactions) throws TransactionException {
		
		transactionRepository.deleteAll(transactions);
		
	}

}