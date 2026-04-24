package com.stock.broker.system.Service;

import com.stock.broker.system.Exception.ResourceNotFoundException;
import com.stock.broker.system.Model.Wallet;

public interface WalletService {

	public void delete(Wallet wallet)throws ResourceNotFoundException;
	
}