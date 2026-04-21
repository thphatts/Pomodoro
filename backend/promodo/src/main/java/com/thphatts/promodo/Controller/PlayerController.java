package com.thphatts.promodo.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.thphatts.promodo.Models.StudySession;
import com.thphatts.promodo.Models.User;
import com.thphatts.promodo.Repository.StudySessionRepository;
import com.thphatts.promodo.Repository.UserRepository;
import com.thphatts.promodo.Service.PlayerService;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class PlayerController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudySessionRepository sessionRepository;

    // 1.api xem tất cả dữ liệu
    @GetMapping("/all")
    public ResponseEntity<?> getAllData() {
        // Lấy sạch mọi thứ trong bảng User ra
        return ResponseEntity.ok(userRepository.findAll());
    }

    @Autowired
    private PlayerService playerService;

    // api lấy thông tin lúc load web
    @GetMapping("/status")
    public ResponseEntity<User> getStatus() {
        User user = playerService.getUserInfo(1L); // Fix cứng lấy user ID = 1
        return ResponseEntity.ok(user);
    }

    // api học xong nhận xu
    @PostMapping("/reward")
    public ResponseEntity<User> getReward(@RequestParam int minutes) {
        User updatedUser = playerService.addReward(1L, minutes);
        return ResponseEntity.ok(updatedUser);
    }

    // api cộng tiền
    @PostMapping("/session/save")
    public Map<String, Object> saveSession(@RequestBody Map<String, Integer> payload) {
        Long userId = payload.getOrDefault("userId", 1).longValue();
        int minutes = payload.get("minutes");

        // Tìm User, cộng tiền
        User user = userRepository.findById(userId).orElse(new User());
        user.setCoins(user.getCoins() + (minutes * 2));
        userRepository.save(user);

        // Lưu lịch sử
        StudySession session = new StudySession();
        session.setUserId(userId);
        session.setDurationMinutes(minutes);
        sessionRepository.save(session);

        return Map.of("status", "success", "coinsEarned", minutes * 2, "totalCoins", user.getCoins(), "petHappiness",
                user.getPetHappiness());
    }

    // api mua đồ
    @PostMapping("/player/buy")
    public Map<String, Object> buyItem(@RequestParam int price, @RequestParam int nutrition,
            @RequestParam(defaultValue = "1") Long userId) {
        User user = userRepository.findById(userId).orElseThrow();

        if (user.getCoins() < price) {
            return Map.of("status", "error", "message", "Không đủ xu");
        }

        user.setCoins(user.getCoins() - price);
        user.setPetFullness(user.getPetFullness() + nutrition);
        userRepository.save(user);

        return Map.of("status", "success", "coins", user.getCoins(), "petFullness", user.getPetFullness(),
                "petHappiness", user.getPetHappiness());
    }

    // api thống kê
    @GetMapping("/session/stats")
    public Map<String, Object> getStats(@RequestParam(defaultValue = "1") Long userId) {
        return sessionRepository.getStatsByUserId(userId);
    }
}