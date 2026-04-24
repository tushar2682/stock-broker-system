package com.stock.broker.system.Model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class MutualFund {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer mutualFundId;
}
