package com.thphatts.promodo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Đây là "Cổng chính" để Frontend kết nối vào đường ống
        // setAllowedOriginPatterns("*") để tránh lỗi CORS khi React/Vue gọi vào
        // withSockJS() giúp tương thích với các trình duyệt cũ không hỗ trợ chuẩn
        // WebSocket
        registry.addEndpoint("/ws").setAllowedOriginPatterns("*").withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // "/topic": Kênh phát thanh. Ví dụ BE muốn gửi tin nhắn cho phòng 123456
        // thì BE sẽ phát vào loa: /topic/room/123456
        registry.enableSimpleBroker("/topic");

        // "/app": Kênh nhận thư. Frontend muốn gửi lệnh gì lên BE thì phải
        // gắn tiền tố này. Ví dụ: /app/chat
        registry.setApplicationDestinationPrefixes("/app");
    }
}