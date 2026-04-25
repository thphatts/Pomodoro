package com.thphatts.promodo.controller; // Hoặc thư mục ông chọn

import com.thphatts.promodo.dto.request.ChatMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class WebSocketEventListener {

    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    // Hàm này sẽ TỰ ĐỘNG CHẠY khi có một ai đó bị đứt kết nối WebSocket
    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());

        // Móc cái thẻ tên trong túi (Session) ra xem là ai vừa rớt mạng
        String username = (String) headerAccessor.getSessionAttributes().get("username");
        String roomCode = (String) headerAccessor.getSessionAttributes().get("roomCode");

        if (username != null && roomCode != null) {
            System.out.println("CẢNH BÁO: " + username + " vừa rớt mạng khỏi phòng " + roomCode);

            // Báo cho những người còn lại trong phòng biết
            ChatMessage chatMessage = new ChatMessage();
            chatMessage.setType(ChatMessage.MessageType.LEAVE);
            chatMessage.setSenderName(username);
            chatMessage.setContent("Đã mất kết nối hoặc rời phòng!");

            messagingTemplate.convertAndSend("/topic/room/" + roomCode, chatMessage);

            // 💡 TECH LEAD TIP: Ở đây ông có thể gọi RoomService để tự động
            // xóa Linh khỏi Database (bảng room_members) nếu muốn dự án hoàn hảo 100%.\

        }
    }
}