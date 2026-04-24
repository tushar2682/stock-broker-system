package com.stock.broker.system.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer transactionId;
    
    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;
    
    @ManyToOne
    @JoinColumn(name = "stock_id")
    private Stock stock;
    
    @Enumerated(EnumType.STRING)
    private TransactionType transactionType;
    
    private Integer quantity;
    private Double transactionPrice;
    private LocalDate transactionDate;
}
