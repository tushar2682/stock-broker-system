package com.stock.broker.system.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.stock.broker.system.Exception.LoginException;
import com.stock.broker.system.Model.LoginDto;
import com.stock.broker.system.Model.Customer;
import com.stock.broker.system.Model.CurrentUserSession;
import com.stock.broker.system.Repository.CustomerDao;
import com.stock.broker.system.Repository.SessionDao;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class LoginServiceImpl implements LoginService {

    @Autowired
    private CustomerDao customerDao;

    @Autowired
    private SessionDao sessionDao;

    @Override
    public String logIntoAccount(LoginDto dto) throws LoginException {
        Customer existingCustomer = customerDao.findByMobileNumber(dto.getMobileNumber());
        if (existingCustomer == null) {
            throw new LoginException("Please enter a valid mobile number!");
        }

        if (!existingCustomer.getPassword().equals(dto.getPassword())) {
            throw new LoginException("Incorrect password!");
        }

        CurrentUserSession existingSession = sessionDao.findByUserId(existingCustomer.getCustomerId());
        if (existingSession != null) {
            throw new LoginException("User already logged in with this number");
        }

        String key = UUID.randomUUID().toString();
        CurrentUserSession currentUserSession = new CurrentUserSession();
        currentUserSession.setUserId(existingCustomer.getCustomerId());
        currentUserSession.setUuid(key);
        currentUserSession.setLocalDateTime(LocalDateTime.now());
        
        sessionDao.save(currentUserSession);

        return key + ":" + existingCustomer.getCustomerId();
    }
    
    @Override
    public String logOutFromAccount(String key) throws LoginException {
        CurrentUserSession validCustomerSession = sessionDao.findByUuid(key);
        if(validCustomerSession == null) {
            throw new LoginException("User Not Logged In with this number");
        }
        sessionDao.delete(validCustomerSession);
        return "Logged Out!";
    }
    
    @Override
    public String logIntoAccountAdmin(LoginDto dto) throws LoginException {
        // Admin login logic placeholder
        return "Admin logged in successfully";
    }
    
    @Override
    public String logOutFromAccountAdmin(String key) throws LoginException {
        return "Admin logged out successfully";
    }
}
