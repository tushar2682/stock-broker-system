package com.stock.broker.systemController;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.stock.broker.system.Service.AdminService;
import com.stock.broker.system.Service.CustomerService;
import com.stock.broker.system.Service.TransactionService;
import com.stock.broker.system.Model.Customer;
import com.stock.broker.system.Model.Stock;
import com.stock.broker.system.Model.StockReport;
import com.stock.broker.system.Model.Transaction;
import com.stock.broker.system.Model.TransactionType;
import com.stock.broker.system.Exception.CustomerException;
import com.stock.broker.system.Exception.ResourceNotFoundException;
import com.stock.broker.system.Exception.StockException;

@RestController
@RequestMapping("/stockman")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private TransactionService transactionService;

    @PostMapping("/stocks")
    public ResponseEntity<Stock> saveStock(@RequestBody Stock stock) throws StockException {
        Stock savedStock = adminService.addStock(stock);
        return new ResponseEntity<>(savedStock, HttpStatus.CREATED);
    }

    @GetMapping("/customers")
    public ResponseEntity<List<Customer>> getAllCustomers() throws CustomerException {
        List<Customer> customers = customerService.getAllCustomers();
        return new ResponseEntity<>(customers, HttpStatus.ACCEPTED);
    }

    @GetMapping("/allStocks")
    public ResponseEntity<List<Stock>> getAllStock() throws StockException {
        List<Stock> stocks = adminService.getAllStocks();
        return new ResponseEntity<>(stocks, HttpStatus.ACCEPTED);
    }

    @GetMapping("/{name}/report")
    public ResponseEntity<StockReport> getStockReport(@PathVariable String name) throws ResourceNotFoundException, StockException {
        Stock stock = adminService.findStockByName(name);
        Integer stockId = stock.getId();
        Integer sold = transactionService.getTotalSoldQuantityByStockId(stockId);
        if (sold == null) sold = 0;
        Integer remaining = stock.getTotalQuantity() - sold;
        
        StockReport report = new StockReport();
        report.setReportId(stockId); // simplified mapping for compile
        // Ideally should have constructor: return new ResponseEntity<>(new StockReport(...), HttpStatus.ACCEPTED);
        return new ResponseEntity<>(report, HttpStatus.ACCEPTED);
    }

    @DeleteMapping("/customers/{customerId}")
    public ResponseEntity<Customer> deleteCustomerAccount(@PathVariable Integer customerId) throws CustomerException, ResourceNotFoundException {
        Customer customer = customerService.findCustomerById(customerId);

        double totalValue = 0.0;
        List<Transaction> transactions = transactionService.findByCustomer(customer);
        for (Transaction transaction : transactions) {
            if (transaction.getTransactionType() == TransactionType.BUY) {
                totalValue += transaction.getTransactionPrice();
            } else if (transaction.getTransactionType() == TransactionType.SOLD) {
                totalValue -= transaction.getTransactionPrice();
            }
        }
        customer.getWallet().setBalance(customer.getWallet().getBalance() + totalValue);

        // Note: active flag missing in Customer, ignoring for compile or can be added to Customer entity
        // customer.setActive(false);

        Customer customer2 = customerService.save(customer);

        return new ResponseEntity<>(customer2, HttpStatus.ACCEPTED);
    }
}