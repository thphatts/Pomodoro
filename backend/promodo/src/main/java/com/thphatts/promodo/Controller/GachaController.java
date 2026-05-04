package com.thphatts.promodo.controller;

import com.thphatts.promodo.models.PetCatalog;
import com.thphatts.promodo.models.User;
import com.thphatts.promodo.models.UserPet;
import com.thphatts.promodo.repository.UserPetRepository;
import com.thphatts.promodo.repository.UserRepository;
import com.thphatts.promodo.service.GachaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/gacha")
@CrossOrigin(origins = "*")
public class GachaController {

    // Kêu gọi đầy đủ cả 3 anh lính này vào thì mới chạy được
    @Autowired
    private GachaService gachaService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserPetRepository userPetRepository;

    @PostMapping("/roll")
    public ResponseEntity<?> rollEgg(Principal principal) {
        // 1. Tìm người dùng đang gọi API (Dựa vào Token) và "mở hộp" Optional
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng này!"));
        // 2. Kiểm tra xem có đủ tiền không?
        if (user.getCoins() < GachaService.GACHA_PRICE) {
            return ResponseEntity.badRequest().body("Bạn không đủ xu để mở trứng! Đi học Pomodoro đi!");
        }

        // 3. Trừ tiền
        user.setCoins(user.getCoins() - GachaService.GACHA_PRICE);
        userRepository.save(user);

        // 4. Gọi thuật toán quay trứng
        PetCatalog wonPet = gachaService.rollGacha();

        // 5. Thêm Pet vào túi đồ của người dùng
        UserPet newUserPet = new UserPet();
        newUserPet.setUser(user);
        newUserPet.setPetCatalog(wonPet);
        userPetRepository.save(newUserPet); // Đã sửa tên biến ở đây!

        // 6. Trả kết quả về cho Frontend để làm hiệu ứng
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Quay trứng thành công!");
        response.put("remainingCoins", user.getCoins());
        response.put("petWon", wonPet.getName());
        response.put("rarity", wonPet.getRarity());

        return ResponseEntity.ok(response);
    }
}