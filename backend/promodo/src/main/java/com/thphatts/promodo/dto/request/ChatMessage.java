package com.thphatts.promodo.dto.request;

import lombok.Data;

@Data
public class ChatMessage {

    private String roomCode;

    private String senderName;

    private String content;

    private MessageType type;

    public enum MessageType {

        CHAT,
        JOIN,
        LEAVE,
        START_TIMER

    }
}