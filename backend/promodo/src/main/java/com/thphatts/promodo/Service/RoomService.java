package com.thphatts.promodo.service;

import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thphatts.promodo.models.Room;
import com.thphatts.promodo.models.RoomMember;
import com.thphatts.promodo.models.User;
import com.thphatts.promodo.repository.RoomMemberRepository;
import com.thphatts.promodo.repository.RoomRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoomService {
    @Autowired
    private RoomRepository roomRepository;
    @Autowired
    private RoomMemberRepository roomMemberRepository;

    // hàm sinh ra mã phòng khi tạo và kiểm tra để mã không trùng;
    private String generateRoomCode() {
        Random random = new Random();
        String code;
        do {
            int number = 100000 + random.nextInt(900000);
            code = String.valueOf(number);
        } while (roomRepository.existsByRoomCode(code));
        return code;
    }

    @Transactional // hoàn tác khi gặp lỗi
    public Room createRoom(User host, String roomName, int maxPlayer) {
        // 1. Tạo phòng
        Room room = new Room();
        room.setRoomCode(generateRoomCode());
        room.setRoomName(roomName);
        room.setHost(host);
        room.setMaxPlayers(maxPlayer);

        roomRepository.save(room);

        // 2. Thêm host vào RoomMember
        RoomMember member = new RoomMember();
        member.setRoom(room);
        member.setUser(host);

        roomMemberRepository.save(member);

        return room;
    }

    public Room joinRoom(String roomCode, User user) {
        // 1. tìm phòng
        Room room = roomRepository.findByRoomCode(roomCode).orElseThrow(() -> new RuntimeException("Room not found"));

        // 2. check đã vào hay chưa
        if (roomMemberRepository.findByRoomAndUser(room, user).isPresent()) {
            throw new RuntimeException("User already in room");
        }

        // 3. check full phòng chưa
        long currentPlayer = roomMemberRepository.countByRoom(room);
        if (currentPlayer >= room.getMaxPlayers()) {
            throw new RuntimeException("Room is full");
        }
        // 4. thêm user vào phòng
        RoomMember member = new RoomMember();
        member.setRoom(room);
        member.setUser(user);
        member.setReady(false);

        roomMemberRepository.save(member);

        return room;
    }

    public void leaveRoom(String roomCode, User user) {

        Room room = roomRepository.findByRoomCode(roomCode)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        roomMemberRepository.deleteByRoomAndUser(room, user);

        if (room.getHost().getId().equals(user.getId())) {

            // option 1: xóa phòng luôn
            roomRepository.delete(room);

            // (sau này có thể upgrade: chuyển host)
        }
    }

}
