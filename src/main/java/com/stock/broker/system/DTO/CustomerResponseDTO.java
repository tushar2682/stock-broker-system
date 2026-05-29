package com.stock.broker.system.DTO;

import com.stock.broker.system.Model.Customer;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CustomerResponseDTO {
    
    private Integer customerId;
    private String customerName;
    private String mobileNumber;
    private String email;
    private Double walletBalance;

    public CustomerResponseDTO(Customer customer) {
        this.customerId = customer.getCustomerId();
        this.customerName = customer.getCustomerName();
        this.mobileNumber = customer.getMobileNumber();
        this.email = customer.getEmail();
        if (customer.getWallet() != null) {
            this.walletBalance = customer.getWallet().getBalance();
        } else {
            this.walletBalance = 0.0;
        }
    }
}
