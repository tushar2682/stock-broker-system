package com.stock.broker.systemController;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoginController {

	@Autowired
	private LoginService customerLogin;

	@PostMapping("/login")
	public ResponseEntity<String> logInCustomer(@RequestBody LoginDTO dto) throws LoginException {

		String result = customerLogin.logIntoAccount(dto);

		return new ResponseEntity<String>(result, HttpStatus.OK);

	}

	@PostMapping("/logout")
	public String logoutCustomer(@RequestParam String key) throws LoginException {
		return customerLogin.logOutFromAccount(key);

	}

	@PostMapping("/login/admin")
	public ResponseEntity<String> logInAdmin(@RequestBody LoginDTO dto) throws LoginException {

		String result = customerLogin.logIntoAccountAdmin(dto);

		return new ResponseEntity<String>(result, HttpStatus.OK);

	}

	@PostMapping("/logout/admin")
	public String logoutAdmin(@RequestParam String key) throws LoginException {
		return customerLogin.logOutFromAccountAdmin(key);
	}

}