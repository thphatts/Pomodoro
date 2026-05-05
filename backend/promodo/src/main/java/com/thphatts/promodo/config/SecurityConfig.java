package com.thphatts.promodo.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

        // băm mật khẩu ra thành chuỗi dài
        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Autowired
        private JwtFilter jwtFilter; // gọi filter để check token hợp lệ

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
                http.csrf(csrf -> csrf.disable()) // Tắt CSRF
                                .authorizeHttpRequests(auth -> auth
                                                // 1.Ai cũng vào được (Đăng ký, Đăng nhập)
                                                .requestMatchers("/api/auth/**", "/ws/**", "/v3/api-docs/**",
                                                                "/v3/api-docs",
                                                                "/swagger-ui/**",
                                                                "/swagger-ui.html",
                                                                "/swagger-resources/**",
                                                                "/webjars/**")
                                                .permitAll()

                                                // 2.Phải có token mới được vào
                                                .requestMatchers("/api/player/**", "/api/session/**",
                                                                "/api/rooms/**"/* , /new api */,
                                                                "/api/gacha/**")
                                                .authenticated()

                                                // Các đường dẫn khác thì đóng cửa hết nếu thêm api thì thêm ở 2.
                                                .anyRequest().denyAll())
                                // 3. Bố trí lính canh đứng TRƯỚC cửa chính
                                .addFilterBefore(jwtFilter,
                                                org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }
}