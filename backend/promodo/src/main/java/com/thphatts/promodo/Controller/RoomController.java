package com.thphatts.promodo.controller;

import com.thphatts.promodo.models.Room;
import com.thphatts.promodo.models.User;
import com.thphatts.promodo.repository.UserRepository;
import com.thphatts.promodo.dto.request.CreateRoomRequest;
import com.thphatts.promodo.dto.request.JoinRoomRequest;
import com.thphatts.promodo.exception.BusinessException;
import com.thphatts.promodo.exception.ResourceNotFoundException;
import com.thphatts.promodo.service.RoomService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin("*")
@Tag(name = "Room", description = "APIs quản lí phòng học")
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
        @Operation(summary = "Tạo phòng mới", description = "Host tạo một phòng học")
        @ApiResponse(responseCode = "200", description = "Tạo thành công")
        public ResponseEntity<Map<String, Object>> createRoom(@Valid @RequestBody CreateRoomRequest createRoomRequest,
                        Principal principal) {
                Long userId = getCurrentUserId(principal);
                User host = userRepository.findById(userId)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

                Room newRoom = roomService.createRoom(host, createRoomRequest.getRoomName(),
                                createRoomRequest.getMaxPlayers());

                return ResponseEntity.ok(Map.of(
                                "status", "success",
                                "message", "Room created successfully!",
                                "roomCode", newRoom.getRoomCode(),
                                "roomName", newRoom.getRoomName()));
        }

        // 2. API Vào phòng bằng Mã Code
        @PostMapping("/join")
        public ResponseEntity<Map<String, Object>> joinRoom(@Valid @RequestBody JoinRoomRequest joinRoomRequest,
                        Principal principal) {
                Long userId = getCurrentUserId(principal);
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

                Room room = roomService.joinRoom(joinRoomRequest.getRoomCode(), user);

                return ResponseEntity.ok(Map.of(
                                "status", "success",
                                "message", "Joined room successfully!",
                                "roomCode", room.getRoomCode(),
                                "roomName", room.getRoomName()));
        }

        // 3. API Thoát phòng
        @PostMapping("/leave")
        public ResponseEntity<Map<String, Object>> leaveRoom(@RequestBody Map<String, String> payload,
                        Principal principal) {
                Long userId = getCurrentUserId(principal);
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

                String roomCode = payload.get("roomCode");

                // The `leaveRoom` method in RoomService already handles `RoomNotFound` via
                // `orElseThrow`.
                // If `user` is not a member of `room`, RoomService should handle it or throw a
                // BusinessException.
                // For now, assuming successful leave will proceed.
                roomService.leaveRoom(roomCode, user);

                return ResponseEntity.ok(Map.of(
                                "status", "success",
                                "message", "Left room successfully!"));
        }
}