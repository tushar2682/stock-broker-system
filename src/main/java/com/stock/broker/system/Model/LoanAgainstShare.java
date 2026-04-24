package com.stock.broker.system.Model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class LoanAgainstShare {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer loanId;
}
