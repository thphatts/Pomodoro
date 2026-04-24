package com.thphatts.promodo.dto.respon;

import lombok.Data;

@Data
public class RoomResponse {

    private String roomCode;
    private String roomName;
    private int maxPlayers;

    private String hostName;

    private int currentPlayers;
}