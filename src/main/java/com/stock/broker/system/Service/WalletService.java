package com.stock.broker.system.Service;

import com.stock.broker.system.Exception.ResourceNotFoundException;

public interface WalletService {

	public void delete(Wallet wallet)throws ResourceNotFoundException;
	
}