package com.thphatts.promodo.config;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        // 1. Lục soát Header xem có thư mục "Authorization" không
        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            // 2. Cắt bỏ chữ "Bearer " (7 ký tự đầu) để lấy đúng cái lõi Token
            String token = header.substring(7);
            try {
                // 3. Nhờ JwtUtil kiểm tra vé
                Claims claims = jwtUtil.extractClaims(token);
                String userId = claims.getSubject(); // Lấy ID của user ra

                // 4. Vé chuẩn -> Đóng mộc "Đã xác thực" cho đi tiếp
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(userId, null, null);
                SecurityContextHolder.getContext().setAuthentication(auth);
            } catch (Exception e) {
                System.out.println("Cảnh báo: Có người dùng vé giả hoặc vé hết hạn!");
            }
        }

        // 5. Mời đi tiếp vào Controller
        filterChain.doFilter(request, response);
    }
}