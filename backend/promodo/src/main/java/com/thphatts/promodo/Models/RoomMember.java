package com.thphatts.promodo.models;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "room_members")
@Data
public class RoomMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Thành viên này đang ở phòng nào?
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    // Thành viên này là ai?
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Trạng thái đã sẵn sàng bấm giờ học chưa?
    @Column(nullable = false)
    private boolean isReady = false;

    private LocalDateTime joinedAt = LocalDateTime.now();
}