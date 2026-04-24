package com.stock.broker.system.Repository;

import com.stock.broker.system.Model.Stock;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Stock, Integer> {
    Stock findByStockName(String stockName);
}
