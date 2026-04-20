package com.thphatts.promodo;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PlayerService {

    @Autowired
    private UserRepository userRepository;

    @PostConstruct
    // khai báo user = 1 để test data
    public void initData() {
        if (userRepository.count() == 0) {
            User testUser = new User();
            testUser.setCoins(100); // Tặng sẵn 100 xu khởi nghiệp
            testUser.setPetFullness(50); // Mèo hơi đói
            userRepository.save(testUser);
            System.out.println("Đã tạo sẵn User ID=1 với 100 xu!");
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