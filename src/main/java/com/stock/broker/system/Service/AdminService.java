package com.stock.broker.system.Service;

import java.util.List;

import com.stock.broker.system.Exception.StockException;

public interface AdminService {
	public Stock addStock(Stock stock)throws StockException;

	public List<Stock> getAllStocks()throws StockException;

	public Stock findStockByName(String name)throws StockException;

	public List<Stock> findByCustomers_Id(Integer id)throws StockException;
}