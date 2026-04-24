package com.stock.broker.system.Exception;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.NoHandlerFoundException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private ResponseEntity<MyErrorDetails> buildError(Exception ex, WebRequest req, HttpStatus status) {
        MyErrorDetails err = new MyErrorDetails();
        err.setTimestamp(LocalDateTime.now());
        err.setMessage(ex.getMessage());
        err.setDetails(req.getDescription(false));
        return new ResponseEntity<>(err, status);
    }

    @ExceptionHandler(CustomerException.class)
    public ResponseEntity<MyErrorDetails> handleCustomer(CustomerException ex, WebRequest req) {
        return buildError(ex, req, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(StockException.class)
    public ResponseEntity<MyErrorDetails> handleStock(StockException ex, WebRequest req) {
        return buildError(ex, req, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<MyErrorDetails> handleResource(ResourceNotFoundException ex, WebRequest req) {
        return buildError(ex, req, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(LoginException.class)
    public ResponseEntity<MyErrorDetails> handleLogin(LoginException ex, WebRequest req) {
        return buildError(ex, req, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<MyErrorDetails> handleOther(Exception ex, WebRequest req) {
        return buildError(ex, req, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}