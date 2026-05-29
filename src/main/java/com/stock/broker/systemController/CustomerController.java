package com.stock.broker.systemController;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.stock.broker.system.Service.AdminService;
import com.stock.broker.system.Service.CustomerService;
import com.stock.broker.system.Service.TransactionService;
import com.stock.broker.system.Service.WalletService;
import com.stock.broker.system.Model.Customer;
import com.stock.broker.system.Model.Stock;
import com.stock.broker.system.Model.Transaction;
import com.stock.broker.system.Model.Wallet;
import com.stock.broker.system.Exception.CustomerException;
import com.stock.broker.system.Exception.ResourceNotFoundException;
import com.stock.broker.system.Exception.StockException;
import com.stock.broker.system.DTO.CustomerRequestDTO;
import com.stock.broker.system.DTO.CustomerResponseDTO;

@RestController
@RequestMapping
public class CustomerController {

	@Autowired
	private CustomerService cService;
	
	@Autowired
	private AdminService adminService;
	
	@Autowired
	private TransactionService transactionService;
	
	@Autowired
	private WalletService walletService;
	
	
	@PostMapping("/customers")
	public ResponseEntity<CustomerResponseDTO> saveCustomer(@Valid @RequestBody CustomerRequestDTO dto) throws CustomerException {
		
		Customer customer = new Customer();
		customer.setCustomerName(dto.getCustomerName());
		customer.setEmail(dto.getEmail());
		customer.setMobileNumber(dto.getMobileNumber());
		customer.setPassword(dto.getPassword());
		
		Wallet wallet = new Wallet();
		wallet.setBalance(0.0);
		wallet.setCustomer(customer);
		customer.setWallet(wallet);
		
		Customer savedCustomer = cService.createCustomer(customer);
		
		return new ResponseEntity<>(new CustomerResponseDTO(savedCustomer), HttpStatus.CREATED);
	}
	
	@GetMapping("/customers/{customerId}")
	public ResponseEntity<CustomerResponseDTO> getCustomerById(@PathVariable Integer customerId) throws CustomerException {
		Customer customer = cService.findCustomerById(customerId);
		return new ResponseEntity<>(new CustomerResponseDTO(customer), HttpStatus.OK);
	}
	
	@PutMapping("/customers")
	public ResponseEntity<CustomerResponseDTO> updateCustomer(@RequestBody Customer customer, @RequestParam String key) throws CustomerException {
		Customer updatedCustomer = cService.updateCustomer(customer, key);
		return new ResponseEntity<>(new CustomerResponseDTO(updatedCustomer), HttpStatus.OK);
	}
	
	@GetMapping("/stocks")
	public ResponseEntity<List<Stock>> viewAllStocks(@RequestParam String key) throws StockException, CustomerException {
		List<Stock> stocks = cService.getAllStocks(key);
		return new ResponseEntity<>(stocks, HttpStatus.OK);
	}
	
	@PostMapping("/customers/{customerId}/stocks/buy")
    public ResponseEntity<Transaction> buyStockByName(
            @PathVariable Integer customerId, 
            @RequestParam String stockName,
            @RequestParam Integer shares) throws CustomerException, StockException, ResourceNotFoundException {
        
        Transaction transaction = cService.buyStockByName(customerId, stockName, shares);
        return new ResponseEntity<>(transaction, HttpStatus.CREATED);
    }
	
	@PostMapping("/customers/{customerId}/stocks/sell")
    public ResponseEntity<Transaction> sellStockByName(
    		@PathVariable Integer customerId, 
    		@RequestParam String stockName, 
    		@RequestParam Integer shares) throws CustomerException, StockException, ResourceNotFoundException {
        
        Transaction transaction = cService.sellStockByName(customerId, stockName, shares);
        return new ResponseEntity<>(transaction, HttpStatus.CREATED);
    }
	
	@GetMapping("/customers/{customerId}/transactions")
	public ResponseEntity<List<Transaction>> getCustomerTransactions(@PathVariable Integer customerId) throws CustomerException, ResourceNotFoundException {
	    Customer customer = cService.findCustomerById(customerId);
	    List<Transaction> transactions = transactionService.findByCustomer(customer);
	    return new ResponseEntity<>(transactions, HttpStatus.OK);
	}
	
	@PostMapping("/customers/{customerId}/wallet/deposit")
	public ResponseEntity<CustomerResponseDTO> addFunds(@PathVariable Integer customerId, @RequestParam double amount) throws CustomerException, ResourceNotFoundException {
	    Customer updatedCustomer = cService.depositFunds(customerId, amount);
	    return new ResponseEntity<>(new CustomerResponseDTO(updatedCustomer), HttpStatus.OK);
	}
	
	@PostMapping("/customers/{customerId}/wallet/withdraw")
	public ResponseEntity<CustomerResponseDTO> withdrawFunds(@PathVariable Integer customerId, @RequestParam double amount) throws CustomerException, ResourceNotFoundException {
	    Customer updatedCustomer = cService.withdrawFunds(customerId, amount);
	    return new ResponseEntity<>(new CustomerResponseDTO(updatedCustomer), HttpStatus.OK);
	}
	
	@DeleteMapping("/customers/{customerId}")
	public ResponseEntity<Void> deleteAccount(@PathVariable Integer customerId) throws CustomerException, ResourceNotFoundException {
		Customer customer = cService.findCustomerById(customerId);
		
		if (customer.getWallet().getBalance() > 0) {
			throw new ResourceNotFoundException("Before deleting your account please withdraw your money first.");
		}
		
	    // CascadeType.ALL handles the deletion of Wallet and Transactions automatically
	    cService.delete(customer);
	    
	    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}
}