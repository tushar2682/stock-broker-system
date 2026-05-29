package com.stock.broker.system.Repository;

import com.stock.broker.system.Model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerDao extends JpaRepository<Customer, Integer> {
    Customer findByMobileNumber(String mobileNumber);
    Customer findByEmail(String email);
}
