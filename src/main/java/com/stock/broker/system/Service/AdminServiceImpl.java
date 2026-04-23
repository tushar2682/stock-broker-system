package com.stock.broker.system.Service;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.stock.broker.system.Exception.StockException;

@Service
public class AdminServiceImpl implements AdminService{
	
	@Autowired
	private AdminRepository adminRepository;

	@Autowired
	private SessionDao sessionDao;

	@Override
	public Stock addStock(Stock stock) throws StockException {
		Stock existingStock = adminRepository.findByStockName(stock.getStockName());

		if (existingStock != null)
			throw new StockException("Stock Already Registered with this Name");

		return adminRepository.save(stock);
	}

	@Override
	public List<Stock> getAllStocks() throws StockException {
		List<Stock> stocks=adminRepository.findAll();
		if (stocks.size()==0) {
			throw new StockException("No Stock Found");
		}
		return stocks;
	}

	@Override
	public Stock findStockByName(String name) throws StockException {
		Stock existingStock = adminRepository.findByStockName(name);

		if (existingStock == null)
			throw new StockException("No Stock Found With this Name");

		return existingStock;
	}

	@Override
	public List<Stock> findByCustomers_Id(Integer id) throws StockException {
		// TODO Auto-generated method stub
		return null;
	}

}