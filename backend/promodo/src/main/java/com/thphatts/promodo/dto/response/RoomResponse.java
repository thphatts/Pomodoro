package com.thphatts.promodo.dto.response;

import lombok.Data;

@Data
public class RoomResponse {

    private String roomCode;
    private String roomName;
    private int maxPlayers;

    private String hostName;

    private int currentPlayers;
}