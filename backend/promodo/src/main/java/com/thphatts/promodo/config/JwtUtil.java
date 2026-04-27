package com.thphatts.promodo.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
    // Đọc secret key cố định từ application.properties (không random nữa)
    @Value("${jwt.secret}")
    private String secretString;

    // Tạo key từ chuỗi secret cố định (chỉ tạo 1 lần khi cần)
    private Key getKey() {
        return Keys.hmacShaKeyFor(secretString.getBytes(StandardCharsets.UTF_8));
    }

    // token tồn tại trong 24h
    private final long EXPIRE_DURATION = 24 * 60 * 60 * 1000;

    // Hàm phát Token
    public String generateToken(Long userId, String username) {
        return Jwts.builder()
                .setSubject(userId.toString()) // Lưu ID user vào trong vé
                .claim("username", username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRE_DURATION))
                .signWith(getKey()) // Dùng key cố định
                .compact();
    }

    // Hàm đọc và kiểm tra token
    public Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getKey()) // Dùng cùng key cố định
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}