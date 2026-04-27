package com.thphatts.promodo.service;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thphatts.promodo.models.User;
import com.thphatts.promodo.repository.UserRepository;

@Service
public class PlayerService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @PostConstruct
    // Tạo user test để có thể login ngay khi server mới khởi động
    public void initData() {
        if (userRepository.count() == 0) {
            User testUser = new User();
            testUser.setUsername("admin");                                    // ← có username
            testUser.setPassword(passwordEncoder.encode("admin123"));         // ← có password đã mã hóa
            testUser.setCoins(100);
            testUser.setPetFullness(50);
            testUser.setPetHappiness(50);
            userRepository.save(testUser);
            System.out.println("✅ Đã tạo user test: username=admin | password=admin123 | coins=100");
        }
    }

    // Lấy thông tin User
    public User getUserInfo(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    // Logic cộng tiền khi hết giờ (1 phút = 2 xu)
    public User addReward(Long id, int minutes) {
        User user = userRepository.findById(id).orElse(null);
        if (user != null && minutes > 0) {
            int earnedCoins = minutes * 2;
            user.setCoins(user.getCoins() + earnedCoins);
            return userRepository.save(user);
        }
        return null;
    }
}