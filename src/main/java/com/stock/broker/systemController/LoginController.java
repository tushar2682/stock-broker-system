package com.stock.broker.systemController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.stock.broker.system.Model.Customer;
import com.stock.broker.system.Model.LoginDto;
import com.stock.broker.system.Exception.LoginException;
import com.stock.broker.system.Service.LoginService;

@RestController
public class LoginController {

	@Autowired
	private LoginService customerLogin;

	@Autowired
	private com.stock.broker.system.Repository.CustomerDao customerDao;

	private static final java.util.Map<String, String> otpStore = new java.util.concurrent.ConcurrentHashMap<>();

	@PostMapping("/forgot-password")
	public ResponseEntity<String> forgotPassword(@RequestParam String email) throws LoginException {
		Customer customer = customerDao.findByEmail(email);
		if (customer == null) {
			throw new LoginException("No account registered with this email address: " + email);
		}

		// Generate random 6-digit OTP
		String otp = String.format("%06d", new java.util.Random().nextInt(1000000));
		otpStore.put(email, otp);

		// Log OTP to server console so the user can retrieve it
		System.out.println("\n========================================");
		System.out.println("[OTP VERIFICATION] Reset code for " + email + " is: " + otp);
		System.out.println("========================================\n");

		return new ResponseEntity<>("Verification OTP code generated. Please check the backend server console.", org.springframework.http.HttpStatus.OK);
	}

	@PostMapping("/reset-password")
	public ResponseEntity<String> resetPassword(@RequestParam String email, @RequestParam String otp, @RequestParam String newPassword) throws LoginException {
		String storedOtp = otpStore.get(email);
		if (storedOtp == null || !storedOtp.equals(otp)) {
			throw new LoginException("Invalid or expired OTP verification code.");
		}

		Customer customer = customerDao.findByEmail(email);
		if (customer == null) {
			throw new LoginException("Customer not found.");
		}

		customer.setPassword(newPassword);
		customerDao.save(customer);
		otpStore.remove(email);

		return new ResponseEntity<>("Password reset successful.", org.springframework.http.HttpStatus.OK);
	}

	@PostMapping("/login")
	public ResponseEntity<String> logInCustomer(@RequestBody LoginDto dto) throws LoginException {

		String result = customerLogin.logIntoAccount(dto);

		return new ResponseEntity<String>(result, HttpStatus.OK);

	}

	@PostMapping("/logout")
	public String logoutCustomer(@RequestParam String key) throws LoginException {
		return customerLogin.logOutFromAccount(key);

	}

	@PostMapping("/login/admin")
	public ResponseEntity<String> logInAdmin(@RequestBody LoginDto dto) throws LoginException {

		String result = customerLogin.logIntoAccountAdmin(dto);

		return new ResponseEntity<String>(result, HttpStatus.OK);

	}

	@PostMapping("/logout/admin")
	public String logoutAdmin(@RequestParam String key) throws LoginException {
		return customerLogin.logOutFromAccountAdmin(key);
	}

}