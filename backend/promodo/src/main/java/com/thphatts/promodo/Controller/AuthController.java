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
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@Tag(name = "Authentication", description = "APIs quản lý Đăng ký và Đăng nhập")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Operation(summary = "Đăng ký tài khoản mới", description = "Tạo user mới trong hệ thống. Mật khẩu sẽ được băm (Bcrypt) trước khi lưu.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Đăng ký thành công"),
            @ApiResponse(responseCode = "400", description = "Đăng ký thành công")
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

    @Operation(summary = "Xác thực người dùng và lấy token", description = "Xác thực username/password. Trả về đối tượng chứa JWT Token.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Đăng nhập thành công, returns JWT token"),
            @ApiResponse(responseCode = "401", description = "Sai tài khoản hoặc mật khẩu")
    })
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest loginRequest) {
        // Tìm user trong DB
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Sai tài khoản hoặc mật khẩu"));

        // Kiểm tra user có tồn tại và pass có khớp với mã băm trong DB không
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new BusinessException("Sai tài khoản hoặc mật khẩu");
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