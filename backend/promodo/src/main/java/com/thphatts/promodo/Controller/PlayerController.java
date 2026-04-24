package com.thphatts.promodo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.thphatts.promodo.models.StudySession;
import com.thphatts.promodo.models.User;
import com.thphatts.promodo.repository.StudySessionRepository;
import com.thphatts.promodo.repository.UserRepository;
import com.thphatts.promodo.service.PlayerService;

import java.security.Principal; // Nhớ dòng import cực kỳ quan trọng này
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class PlayerController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudySessionRepository sessionRepository;

    @Autowired
    private PlayerService playerService;

    // Lấy ID từ Token của người dùng
    private Long getCurrentUserId(Principal principal) {
        return Long.parseLong(principal.getName());
    }

    // api lấy thông tin lúc load web
    @GetMapping("/status")
    public ResponseEntity<User> getStatus(Principal principal) {
        Long userId = getCurrentUserId(principal);
        User user = playerService.getUserInfo(userId);
        return ResponseEntity.ok(user);
    }

    // api học xong nhận xu
    @PostMapping("/reward")
    public ResponseEntity<User> getReward(@RequestParam int minutes, Principal principal) {
        Long userId = getCurrentUserId(principal);
        User updatedUser = playerService.addReward(userId, minutes);
        return ResponseEntity.ok(updatedUser);
    }

    // api cộng tiền & lưu phiên học
    @PostMapping("/session/save")
    public Map<String, Object> saveSession(@RequestBody Map<String, Integer> payload, Principal principal) {
        Long userId = getCurrentUserId(principal); // Lấy ID chuẩn từ vé
        int minutes = payload.get("minutes");

        // Tìm User, cộng tiền (Sửa orElse thành orElseThrow cho chuẩn chỉnh)
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Không tìm thấy User"));
        user.setCoins(user.getCoins() + (minutes * 2));
        userRepository.save(user);

        // Lưu lịch sử
        StudySession session = new StudySession();
        session.setUser(user);
        session.setDurationMinutes(minutes);
        sessionRepository.save(session);

        return Map.of("status", "success", "coinsEarned", minutes * 2, "totalCoins", user.getCoins(), "petHappiness",
                user.getPetHappiness());
    }

    // api mua đồ
    @PostMapping("/player/buy")
    public Map<String, Object> buyItem(@RequestParam int price, @RequestParam int nutrition, Principal principal) {
        Long userId = getCurrentUserId(principal); // Lấy ID chuẩn từ vé
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Không tìm thấy User"));

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
    public Map<String, Object> getStats(Principal principal) {
        Long userId = getCurrentUserId(principal); // Lấy ID chuẩn từ vé
        return sessionRepository.getStatsByUserId(userId);
    }
}