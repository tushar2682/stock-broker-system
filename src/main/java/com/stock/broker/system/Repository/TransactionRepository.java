package com.stock.broker.system.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.stock.broker.system.Model.Customer;
import com.stock.broker.system.Model.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Integer> {

    @Query("SELECT SUM(t.quantity) FROM Transaction t WHERE t.stock.id = :stockId AND t.transactionType = 'SOLD'")
    Integer getTotalSoldQuantityByStockId(@Param("stockId") Integer stockId);
    
    public List<Transaction> findByCustomer(Customer customer);

}