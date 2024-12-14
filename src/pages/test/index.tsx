
import { useEffect } from "react";
import SockJS from "sockjs-client";
import { Client, StompSubscription } from "@stomp/stompjs";

const WebSocketDemo: React.FC = () => {
    useEffect(() => {
        // Tạo kết nối SockJS
        const socket = new SockJS("http://localhost:8080/ws");
        const stompClient = new Client({
            webSocketFactory: () => socket,
            debug: (str: string) => console.log(str),
        });

        // Khi kết nối thành công
        stompClient.onConnect = () => {
            console.log("Connected");

            // Đăng ký lắng nghe kênh /topic/admin
            const subscription: StompSubscription = stompClient.subscribe(
                "/topic/admin",
                (message) => {
                    if (message.body) {
                        alert(message.body); // Hiển thị thông báo
                    }
                }
            );
        };

        // Kích hoạt WebSocket
        stompClient.activate();

        // Cleanup khi component bị unmount
        return () => {
            stompClient.deactivate();
        };
    }, []);

    return <div>WebSocket Connected</div>;
};

export default WebSocketDemo;
