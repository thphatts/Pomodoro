package com.thphatts.promodo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import com.thphatts.promodo.models.Room;
import com.thphatts.promodo.models.RoomMember;
import com.thphatts.promodo.models.User;

import jakarta.transaction.Transactional;

@Repository
public interface RoomMemberRepository extends JpaRepository<RoomMember, Long> {
    // 1. Lấy toàn bộ danh sách thành viên đang ngồi trong 1 phòng cụ thể
    List<RoomMember> findByRoomId(Long roomId);

    // 2. Tìm xem User này đang ở phòng nào (để chặn không cho
    // vào 2 phòng cùng lúc)
    Optional<RoomMember> findByUserId(Long userId);

    // đếm số lượng user trong phòng
    long countByRoom(Room room);

    // xóa user ra khỏi phòng
    @Transactional
    @Modifying
    void deleteByRoomAndUser(Room room, User user);

    Optional<Room> findByRoomAndUser(Room room, User user);

}
