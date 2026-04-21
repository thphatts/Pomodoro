package com.thphatts.promodo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/player")
@CrossOrigin(origins = "*")
public class PlayerController {
    // API "Kính lúp" dùng nội bộ để soi Database
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/all")
    public ResponseEntity<?> getAllData() {
        // Lấy sạch sành sanh mọi thứ trong bảng User ra
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
}