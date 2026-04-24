package com.stock.broker.system.Service;

import org.springframework.stereotype.Service;
import com.stock.broker.system.Exception.LoginException;
import com.stock.broker.system.Model.LoginDto;

@Service
public class LoginServiceImpl implements LoginService {
    @Override
    public String logIntoAccount(LoginDto dto) throws LoginException {
        return "Logged in successfully"; // Placeholder implementation
    }
    
    @Override
    public String logOutFromAccount(String key) throws LoginException {
        return "Logged out successfully";
    }
    
    @Override
    public String logIntoAccountAdmin(LoginDto dto) throws LoginException {
        return "Admin logged in successfully";
    }
    
    @Override
    public String logOutFromAccountAdmin(String key) throws LoginException {
        return "Admin logged out successfully";
    }
}
