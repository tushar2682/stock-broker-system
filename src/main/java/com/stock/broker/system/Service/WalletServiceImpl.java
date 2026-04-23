package com.stock.broker.system.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.stock.broker.system.Exception.ResourceNotFoundException;


@Service
public class WalletServiceImpl implements WalletService{
	@Autowired
	private WalletRepository walletRepository;
	@Override
	public void delete(Wallet wallet) throws ResourceNotFoundException {
	 	walletRepository.deleteById(wallet.getWalletId());
	}

}