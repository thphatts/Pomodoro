package com.thphatts.promodo.controller;

import com.thphatts.promodo.models.PetCatalog;
import com.thphatts.promodo.models.User;
import com.thphatts.promodo.models.UserPet;
import com.thphatts.promodo.repository.UserPetRepository;
import com.thphatts.promodo.repository.UserRepository;
import com.thphatts.promodo.service.GachaService;
import org.springframework.beans.factory.annotation.Autowired;
import com.thphatts.promodo.exception.BusinessException;
import com.thphatts.promodo.exception.ResourceNotFoundException;
import org.springframework.http.ResponseEntity;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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

    @Operation(summary = "Roll a gacha egg", description = "Allows an authenticated user to roll a gacha egg for a chance to win a pet. Requires sufficient coins.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully rolled an egg"),
            @ApiResponse(responseCode = "400", description = "Insufficient coins or invalid gacha configuration"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @PostMapping("/roll")
    public ResponseEntity<Map<String, Object>> rollEgg(Principal principal) {
        // 1. Tìm người dùng đang gọi API (Dựa vào Token) và "mở hộp" Optional
        Long userId = Long.parseLong(principal.getName());
        User user = userRepository.findById(userId)
                .orElseThrow(
                        () -> new ResourceNotFoundException("User not found with ID: " + userId));
        // 2. Kiểm tra xem có đủ tiền không?
        if (user.getCoins() < GachaService.GACHA_PRICE) {
            throw new BusinessException("Insufficient coins to roll! Play Pomodoro to earn more!");
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
        response.put("message", "Successfully rolled an egg!");
        response.put("remainingCoins", user.getCoins());
        response.put("petWon", wonPet.getName());
        response.put("rarity", wonPet.getRarity());

        return ResponseEntity.ok(response);
    }
}
