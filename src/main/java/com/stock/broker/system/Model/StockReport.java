package com.stock.broker.system.Model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class StockReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer reportId;
}
