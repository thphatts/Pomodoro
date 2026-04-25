package com.thphatts.promodo.controller;

import com.thphatts.promodo.dto.request.ChatMessage;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import org.springframework.stereotype.Controller;

@Controller
public class RoomWebSocketController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/room.chat")
    public void sendMessage(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        // Nếu là tin nhắn JOIN, lưu thông tin vào thẻ tên (Session) của ống nước này
        if (chatMessage.getType() == ChatMessage.MessageType.JOIN) {
            headerAccessor.getSessionAttributes().put("username", chatMessage.getSenderName());
            headerAccessor.getSessionAttributes().put("roomCode", chatMessage.getRoomCode());
        }

        // Phát tin nhắn cho cả phòng như cũ
        messagingTemplate.convertAndSend("/topic/room/" + chatMessage.getRoomCode(), chatMessage);
    }
}