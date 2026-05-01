package com.thphatts.promodo.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
    // sinh mã hóa token
    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    // token tồn tại trong 24h
    private final long EXPIRE_DURATION = 24 * 60 * 60 * 1000;

    // Hàm phát Token
    public String generateToken(Long userId, String username) {
        return Jwts.builder()
                .setSubject(userId.toString()) // Lưu ID user vào trong vé
                .claim("username", username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRE_DURATION))
                .signWith(key)
                .compact();
    }

    // Hàm đọc và kiểm tra token
    public Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody(); // Nếu token giả hoặc hết hạn, dòng này sẽ tự động báo lỗi văng ra ngoài
    }
}