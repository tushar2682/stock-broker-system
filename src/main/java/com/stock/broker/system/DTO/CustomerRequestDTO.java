package com.stock.broker.system.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CustomerRequestDTO {
    
    @NotBlank(message = "Name cannot be blank")
    private String customerName;
    
    @NotBlank(message = "Mobile number cannot be blank")
    @Size(min = 10, max = 15, message = "Mobile number must be between 10 and 15 digits")
    private String mobileNumber;
    
    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Email format is invalid")
    private String email;
    
    @NotBlank(message = "Password cannot be blank")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
}
