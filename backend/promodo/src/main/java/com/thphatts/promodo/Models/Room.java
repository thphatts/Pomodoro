package com.thphatts.promodo.models;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "rooms")
@Data
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Mã phòng phải là DUY NHẤT để không bị trùng khi tìm kiếm
    @Column(unique = true, nullable = false, length = 10)
    private String roomCode;

    @Column(nullable = false)
    private String roomName;

    // Giới hạn số người
    @Column(nullable = false)
    private int maxPlayers;

    // Khóa ngoại trỏ về User: Ai là chủ phòng (host)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "host_id", nullable = false)
    private User host;

    private LocalDateTime createdAt = LocalDateTime.now();
}