package com.thphatts.promodo.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateRoomRequest {
    @NotBlank(message = "Room name cannot be empty")
    @Size(min = 3, max = 50, message = "Room name must be between 3 and 50 characters")
    private String roomName;

    @Min(value = 1, message = "Maximum players must be at least 1")
    private int maxPlayers;
}
