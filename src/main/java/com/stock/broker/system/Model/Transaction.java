package com.stock.broker.system.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    private TransactionType transactionType;
    private double amount;
    private java.time.LocalDateTime transactionTime;
    
    private Integer quantity;
    private double transactionPrice;
    private java.time.LocalDate transactionDate;

    @ManyToOne
    @JoinColumn(name = "stock_id")
    private Stock stock;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public TransactionType getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(TransactionType transactionType) {
        this.transactionType = transactionType;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public java.time.LocalDateTime getTransactionTime() {
        return transactionTime;
    }

    public void setTransactionTime(java.time.LocalDateTime transactionTime) {
        this.transactionTime = transactionTime;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public double getTransactionPrice() {
        return transactionPrice;
    }

    public void setTransactionPrice(double transactionPrice) {
        this.transactionPrice = transactionPrice;
    }

    public java.time.LocalDate getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(java.time.LocalDate transactionDate) {
        this.transactionDate = transactionDate;
    }

    public Stock getStock() {
        return stock;
    }

    public void setStock(Stock stock) {
        this.stock = stock;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }
}
