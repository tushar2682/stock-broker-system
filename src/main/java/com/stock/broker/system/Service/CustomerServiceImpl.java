package com.stock.broker.system.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.stock.broker.system.Exception.CustomerException;
import com.stock.broker.system.Exception.ResourceNotFoundException;
import com.stock.broker.system.Exception.StockException;
import com.stock.broker.system.Model.Customer;
import com.stock.broker.system.Model.Stock;
import com.stock.broker.system.Model.Transaction;
import com.stock.broker.system.Model.TransactionType;
import com.stock.broker.system.Model.CurrentUserSession;
import com.stock.broker.system.Repository.CustomerDao;
import com.stock.broker.system.Repository.AdminRepository;
import com.stock.broker.system.Repository.SessionDao;
import com.stock.broker.system.Repository.TransactionRepository;

@Service
public class CustomerServiceImpl implements CustomerService {

	@Autowired
	private CustomerDao cDao;
	
	@Autowired
	private AdminRepository adminRepository;

	@Autowired
	private SessionDao sDao;
	
    @Autowired
    private TransactionRepository transactionRepository;

	@Override
	public Customer createCustomer(Customer customer) throws CustomerException {

		Customer existingCustomer = cDao.findByMobileNumber(customer.getMobileNumber());

		if (existingCustomer != null)
			throw new CustomerException("Customer Already Registered with Mobile number");

		return cDao.save(customer);

	}

	@Override
	public Customer updateCustomer(Customer customer, String key) throws CustomerException {

		CurrentUserSession loggedInUser = sDao.findByUuid(key);

		if (loggedInUser == null) {
			throw new CustomerException("Please provide a valid key to update a customer");
		}

		if (customer.getCustomerId() == loggedInUser.getUserId()) {
			// If LoggedInUser id is same as the id of supplied Customer which we want to
			// update
			return cDao.save(customer);
		} else
			throw new CustomerException("Invalid Customer Details, please login first");

	}

	@Override
	public List<Customer> getAllCustomers() throws CustomerException {
		List<Customer> customers=cDao.findAll();
		if (customers.size()==0) {
			throw new CustomerException("No Customer Found");
		}
		return customers;
	}

	@Override
	public Customer findCustomerById(Integer id) throws CustomerException {
		Optional<Customer> existingCustomer = cDao.findById(id);

		if (existingCustomer == null)
			throw new CustomerException("No Customer Found With this Id");

		return existingCustomer.get();
	}

	@Override
	public List<Stock> getAllStocks(String key) throws CustomerException {
		
		
		
		CurrentUserSession loggedInUser = sDao.findByUuid(key);
		
		if (loggedInUser == null) {
			throw new CustomerException("Please provide a valid key to See all stocks");
		}
		
		return adminRepository.findAll();
	}

	@Override
	@Transactional
	public Transaction buyStockByName(Integer customerId, String stockName, Integer shares)
			throws CustomerException, StockException, ResourceNotFoundException {
		Customer customer = cDao.findById(customerId)
                .orElseThrow(() -> new CustomerException("Invalid customer ID"));

        Stock stock = adminRepository.findByStockName(stockName);
        
        if (stock==null) {
			throw new StockException("Invalid stock name");
		}

        Integer availableShares = stock.getAvailableQuantity();
        if (shares > availableShares) {
            throw new ResourceNotFoundException("Not enough shares available to buy");
        }

        double totalPrice = shares * stock.getCurrentPrice();

        if (totalPrice > customer.getWallet().getBalance()) {
            throw new ResourceNotFoundException("Not enough funds in wallet to buy");
        }

        Transaction transaction = new Transaction();
        transaction.setCustomer(customer);
        transaction.setStock(stock);
        transaction.setTransactionType(TransactionType.BUY);
        transaction.setQuantity(shares);
        transaction.setTransactionPrice(totalPrice);
        transaction.setTransactionDate(LocalDate.now());

        customer.getWallet().setBalance(customer.getWallet().getBalance() - totalPrice);
        stock.setAvailableQuantity(stock.getAvailableQuantity() - shares);

        
        transactionRepository.save(transaction);

        return transaction;
		
	}

	@Override
	@Transactional
	public Transaction sellStockByName(Integer customerId, String stockName, Integer shares)
			throws CustomerException, StockException, ResourceNotFoundException {
		Customer customer = cDao.findById(customerId).orElseThrow(() -> new CustomerException("Customer not found with id: " + customerId));
		
        Stock stock = adminRepository.findByStockName(stockName);
        
        if (stock==null) {
			throw new StockException("Invalid stock name");
		}
        double totalPrice = shares * stock.getCurrentPrice();
        
        List<Transaction> transactions=customer.getTransactions();
        
        Integer quantityAvailableToSell=0;
        
        for (Transaction transaction : transactions) {
			if (transaction.getStock().getStockName().equals(stockName)) {
				if (transaction.getTransactionType() == TransactionType.BUY) {
					quantityAvailableToSell += transaction.getQuantity();
				} else if (transaction.getTransactionType() == TransactionType.SOLD) {
					quantityAvailableToSell -= transaction.getQuantity();
				}
			}
		}
        
        
        if (quantityAvailableToSell < shares) {
            throw new ResourceNotFoundException("The given number of shares are not available to sell.");
        }
        
        Transaction transaction = new Transaction();
        transaction.setCustomer(customer);
        transaction.setStock(stock);
        transaction.setTransactionType(TransactionType.SOLD);
        transaction.setQuantity(shares);
        transaction.setTransactionPrice(totalPrice);
        transaction.setTransactionDate(LocalDate.now());
        
        customer.getWallet().setBalance(customer.getWallet().getBalance() + totalPrice);
        stock.setAvailableQuantity(stock.getAvailableQuantity() + shares);
        
        transactionRepository.save(transaction);

        return transaction;
	}

	@Override
	public Customer save(Customer customer) throws CustomerException {
		Customer cust=cDao.save(customer);
		if (cust==null) {
			throw new CustomerException("No customer saved");
		}
		
		return cust;
	}

	@Override
	@Transactional
	public void delete(Customer customer) throws CustomerException {
		cDao.delete(customer);
	}

	@Override
	@Transactional
	public Customer depositFunds(Integer customerId, double amount) throws CustomerException, ResourceNotFoundException {
		Customer customer = findCustomerById(customerId);
		if (amount <= 0) {
			throw new IllegalArgumentException("Amount must be greater than 0");
		}
		Double prevBal = customer.getWallet().getBalance();
		customer.getWallet().setBalance(prevBal + amount);
		return cDao.save(customer);
	}

	@Override
	@Transactional
	public Customer withdrawFunds(Integer customerId, double amount) throws CustomerException, ResourceNotFoundException {
		Customer customer = findCustomerById(customerId);
		if (customer.getWallet().getBalance() < amount) {
			throw new ResourceNotFoundException("Customer has insufficient balance to withdraw the given amount.");
		}
		customer.getWallet().setBalance(customer.getWallet().getBalance() - amount);
		return cDao.save(customer);
	}

	

}