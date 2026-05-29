package com.stock.broker.system;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import com.stock.broker.system.Repository.AdminRepository;
import com.stock.broker.system.Model.Stock;

@SpringBootApplication(scanBasePackages = {"com.stock.broker.system", "com.stock.broker.systemController"})
public class StockbrokersystemApplication {

	public static void main(String[] args) {
		ApplicationContext ctx = SpringApplication.run(StockbrokersystemApplication.class, args);
		AdminRepository stockRepo = ctx.getBean(AdminRepository.class);
		
		if (stockRepo.count() == 0) {
			stockRepo.save(createStock("Apple Inc.", "AAPL", 180.00, 100000));
			stockRepo.save(createStock("Microsoft Corp.", "MSFT", 420.00, 100000));
			stockRepo.save(createStock("Alphabet Inc.", "GOOGL", 175.00, 100000));
			stockRepo.save(createStock("Amazon.com Inc.", "AMZN", 185.00, 100000));
			stockRepo.save(createStock("Nvidia Corp.", "NVDA", 900.00, 100000));
			stockRepo.save(createStock("Tesla Inc.", "TSLA", 175.00, 100000));
			stockRepo.save(createStock("Meta Platforms", "META", 470.00, 100000));
		}
	}

	private static Stock createStock(String name, String symbol, double price, int qty) {
		Stock stock = new Stock();
		stock.setStockName(name);
		stock.setStockSymbol(symbol);
		stock.setCurrentPrice(price);
		stock.setTotalQuantity(qty);
		stock.setAvailableQuantity(qty);
		return stock;
	}

}
