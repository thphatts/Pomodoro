package com.thphatts.promodo.controller;

import com.thphatts.promodo.models.Room;
import com.thphatts.promodo.models.User;
import com.thphatts.promodo.repository.UserRepository;
import com.thphatts.promodo.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin("*")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @Autowired
    private UserRepository userRepository;

    // lấy ID từ Token
    private Long getCurrentUserId(Principal principal) {
        return Long.parseLong(principal.getName());
    }

    // 1. api Tạo phòng
    @PostMapping("/create")
    public ResponseEntity<?> createRoom(@RequestBody Map<String, Object> payload, Principal principal) {
        try {
            Long userId = getCurrentUserId(principal);
            User host = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy User"));

            String roomName = (String) payload.get("roomName");
            // Dùng Integer.parseInt để tránh lỗi khi gửi chuỗi
            int maxPlayers = Integer.parseInt(payload.get("maxPlayers").toString());
            Room newRoom = roomService.createRoom(host, roomName, maxPlayers);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Tạo phòng thành công!",
                    "roomCode", newRoom.getRoomCode(),
                    "roomName", newRoom.getRoomName()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", e.getMessage()));
        }
    }

    // 2. API Vào phòng bằng Mã Code
    @PostMapping("/join")
    public ResponseEntity<?> joinRoom(@RequestBody Map<String, String> payload, Principal principal) {
        try {
            Long userId = getCurrentUserId(principal);
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy User"));

            String roomCode = payload.get("roomCode");
            Room room = roomService.joinRoom(roomCode, user);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Vào phòng thành công!",
                    "roomCode", room.getRoomCode(),
                    "roomName", room.getRoomName()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", e.getMessage()));
        }
    }

    // 3. API Thoát phòng
    @PostMapping("/leave")
    public ResponseEntity<?> leaveRoom(@RequestBody Map<String, String> payload, Principal principal) {
        try {
            Long userId = getCurrentUserId(principal);
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy User"));

            String roomCode = payload.get("roomCode");

            roomService.leaveRoom(roomCode, user);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Đã rời phòng thành công!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", e.getMessage()));
        }
    }
}