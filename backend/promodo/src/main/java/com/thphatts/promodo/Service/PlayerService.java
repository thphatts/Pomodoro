package com.thphatts.promodo.service;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.thphatts.promodo.models.User;
import com.thphatts.promodo.repository.UserRepository;

@Service
public class PlayerService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

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