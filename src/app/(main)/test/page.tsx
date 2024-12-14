'use client'
import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { Client, Stomp } from '@stomp/stompjs'; // Import Stomp từ @stomp/stompjs
import SockJS from 'sockjs-client';  // Import SockJS
import { API_URL } from "@/config/url";
// Định nghĩa kiểu cho ChatMessage
interface ChatMessage {
    sender: string;
    content: string;
}

const Chat = () => {
    const [stompClient, setStompClient] = useState<Client | null>(null);  // Đảm bảo stompClient là kiểu Client
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [message, setMessage] = useState<string>("");
    const [username, setUsername] = useState<string>("");

    // Kết nối với WebSocket và thiết lập các handler
    useEffect(() => {
        const socket = new SockJS(`${API_URL}/ws`); // URL WebSocket endpoint
        const client = new Client({
            webSocketFactory: () => socket,  // Chỉ định SockJS factory cho STOMP client
            debug: (str) => console.log(str),
            onConnect: () => {
                console.log("Connected to WebSocket server");

                // Đăng ký nhận tin nhắn từ server
                client.subscribe("/topic/public", (messageOutput) => {
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        JSON.parse(messageOutput.body),
                    ]);
                });
            },
            onStompError: (frame) => {
                console.error("STOMP error: ", frame);
            },
        });

        // Kết nối STOMP client
        client.activate();

        // Lưu stompClient vào state để sử dụng sau
        setStompClient(client);

        // Cleanup khi component bị unmount
        return () => {
            if (client) {
                client.deactivate();  // Deactivate khi component bị unmount
            }
        };
    }, []);

    // Gửi tin nhắn
    const sendMessage = (event: FormEvent) => {
        event.preventDefault();

        if (stompClient && message && username) {
            const chatMessage: ChatMessage = {
                sender: username,
                content: message,
            };

            // Kiểm tra stompClient đã được kết nối trước khi gọi send
            if (stompClient && stompClient.connected) {
                // Sử dụng client.send() thay vì stompClient.send()
                stompClient.publish({
                    destination: "/app/chat.sendMessage",
                    body: JSON.stringify(chatMessage),
                });
                setMessage(""); // Reset input message
            } else {
                console.error("STOMP client is not connected.");
            }
        }
    };

    // Thêm người dùng vào chat
    const addUser = (event: FormEvent) => {
        event.preventDefault();

        if (stompClient && username) {
            const chatMessage: ChatMessage = {
                sender: username,
                content: `${username} joined the chat`,
            };

            if (stompClient && stompClient.connected) {
                stompClient.publish({
                    destination: "/app/chat.addUser",
                    body: JSON.stringify(chatMessage),
                });
            } else {
                console.error("STOMP client is not connected.");
            }
        }
    };

    // Hàm xử lý thay đổi tên người dùng
    const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    // Hàm xử lý thay đổi tin nhắn
    const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    };

    return (
        <div>
            <div>
                <h1>React WebSocket Chat</h1>
                {!username ? (
                    <div>
                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={handleUsernameChange}
                        />
                        <button onClick={addUser}>Join Chat</button>
                    </div>
                ) : (
                    <div>
                        <div>
                            <ul>
                                {messages.map((msg, index) => (
                                    <li key={index}>
                                        <strong>{msg.sender}: </strong>
                                        {msg.content}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <form onSubmit={sendMessage}>  {/* Thay đổi từ button -> form */}
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    value={message}
                                    onChange={handleMessageChange}
                                />
                                <button type="submit">Send</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
