package com.thphatts.promodo.controller;

import com.thphatts.promodo.config.JwtUtil;
import com.thphatts.promodo.models.User;
import com.thphatts.promodo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.thphatts.promodo.dto.request.LoginRequest;
import com.thphatts.promodo.dto.request.RegisterRequest;
import com.thphatts.promodo.exception.BusinessException;
import com.thphatts.promodo.exception.ResourceNotFoundException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Operation(summary = "Register a new user", description = "Registers a new user with a unique username and a password. Returns a success message.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Registration successful"),
            @ApiResponse(responseCode = "400", description = "Invalid input or username already taken")
    })
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody RegisterRequest registerRequest) {
        if (userRepository.findByUsername(registerRequest.getUsername()).isPresent()) {
            throw new BusinessException("Username already taken!");
        }

        User newUser = new User();
        newUser.setUsername(registerRequest.getUsername());
        newUser.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        newUser.setCoins(0);
        newUser.setPetFullness(50);
        userRepository.save(newUser);

        return ResponseEntity.ok(Map.of("status", "success", "message", "Registration successful!"));
    }

    @Operation(summary = "Authenticate user and get JWT token", description = "Authenticates a user with username and password, returning a JWT token upon successful login.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Login successful, returns JWT token"),
            @ApiResponse(responseCode = "401", description = "Invalid username or password")
    })
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest loginRequest) {
        // Tìm user trong DB
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid username or password!"));

        // Kiểm tra user có tồn tại và pass có khớp với mã băm trong DB không
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new BusinessException("Invalid username or password!");
        }

        // Nếu đúng cấp Token!
        String token = jwtUtil.generateToken(user.getId(), user.getUsername());

        return ResponseEntity.ok(Map.of(
                "status", "success",
                "token", token,
                "userId", user.getId(),
                "username", user.getUsername()));
    }
}