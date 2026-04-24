package com.thphatts.promodo.dto.request;

import lombok.Data;

@Data
public class CreateRoomRequest {
    private String roomName;
    private int maxPlayers;
}