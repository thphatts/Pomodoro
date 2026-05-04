package com.thphatts.promodo.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class JoinRoomRequest {
    @NotBlank(message = "Room code cannot be empty")
    @Size(min = 6, max = 6, message = "Room code must be 6 characters long")
    private String roomCode;
}
