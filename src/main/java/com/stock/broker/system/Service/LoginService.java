package com.stock.broker.system.Service;

import com.stock.broker.system.Exception.LoginException;
import com.stock.broker.system.Model.LoginDto;

public interface LoginService {
    String logIntoAccount(LoginDto dto) throws LoginException;
    String logOutFromAccount(String key) throws LoginException;
    String logIntoAccountAdmin(LoginDto dto) throws LoginException;
    String logOutFromAccountAdmin(String key) throws LoginException;
}
