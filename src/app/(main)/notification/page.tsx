'use client'
import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Modal, Button, Container } from '@mui/material';
import { useRouter } from "next/navigation";
import { API_URL } from "@/config/url";
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useToast } from "@/hooks/useToast";

// Define data types
interface User {
    id: number;
    username: string;
    email: string;
    fullname: string;
    phone: string;
}

interface Notification {
    id: number;
    title: string;
    message: string;
    createdAt: string;
    read: boolean;
    user: User;
}

const NotificationPage: React.FC = () => {
    const toast = useToast();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
    const [hasNewOrder, setHasNewOrder] = useState<boolean>(false);

    useEffect(() => {
        // Create a WebSocket client
        const stompClient = new Client({
            webSocketFactory: () => new SockJS(`${API_URL}/ws`), // WebSocket server endpoint
            debug: (msg) => console.log('STOMP Debug: ', msg),
            reconnectDelay: 5000, // Reconnect automatically after 5 seconds
        });

        stompClient.onConnect = () => {
            console.log('WebSocket connected!');
            stompClient.subscribe('/topic/notification', async (message) => {
                console.log('Received message:', message.body);
                if (!hasNewOrder) {
                    toast.sendToast("Thành công", "Có thông báo về sản phẩm mới");
                    setHasNewOrder(true); // Đánh dấu đã hiển thị thông báo
                }
                fetchNotifications();
            });
        };

        stompClient.onStompError = (frame) => {
            console.error('Broker error:', frame.headers['message']);
        };

        stompClient.activate();

        return () => {
            if (stompClient.active) {
                stompClient.deactivate();
            }
            console.log('WebSocket connection closed on unmount');
        };
    }, []);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await fetch(`${API_URL}/api/notification/get-all-of-user`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch notifications');
            }

            const data = await response.json();
            console.log('Fetched notifications:', data.data);
            setNotifications(data.data);
        } catch (err) {
            console.error('Error fetching notifications:', err);
            setError('Cannot load notifications. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleNotificationPress = async (notification: Notification) => {
        setSelectedNotification(notification);
        setIsModalVisible(true);

        try {
            const token = localStorage.getItem("accessToken");
            const response = await fetch(
                `${API_URL}/api/notification/change-status/${notification.id}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to change notification status');
            }

            setNotifications((prevNotifications) =>
                prevNotifications.map((item) =>
                    item.id === notification.id ? { ...item, read: true } : item
                )
            );
        } catch (error) {
            setError('Cannot update notification status. Please try again.');
        }
    };

    const closeModal = () => {
        setIsModalVisible(false);
        setSelectedNotification(null);
    };

    return (
        <Container>
            {loading ? (
                <CircularProgress size={50} />
            ) : error ? (
                <Typography variant="h6" color="error" align="center">
                    {error}
                </Typography>
            ) : (
                <Box>
                    {notifications.map((notification) => (
                        <Box
                            key={notification.id}
                            sx={{
                                backgroundColor: '#fff',
                                borderRadius: '10px',
                                padding: '15px',
                                marginBottom: '15px',
                                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            <Typography variant="h6">{notification.title}</Typography>
                            <Typography variant="body1" color="textSecondary">
                                {notification.message}
                            </Typography>
                            <Box sx={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="textSecondary">
                                    Date: {new Date(notification.createdAt).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body2" color={notification.read ? 'green' : 'blue'}>
                                    Status: {notification.read ? 'Read' : 'Unread'}
                                </Typography>
                            </Box>
                            <Button
                                onClick={() => handleNotificationPress(notification)}
                                sx={{ marginTop: '10px' }}
                                variant="outlined"
                            >
                                View Details
                            </Button>
                        </Box>
                    ))}
                </Box>
            )}

            {/* Modal to show detailed notification */}
            <Modal open={isModalVisible} onClose={closeModal}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: '#fff',
                        padding: '20px',
                        borderRadius: '10px',
                        width: '80%',
                        maxWidth: '600px',
                    }}
                >
                    <Button
                        onClick={closeModal}
                        sx={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            fontSize: '24px',
                            color: '#333',
                        }}
                    >
                        ×
                    </Button>

                    {selectedNotification && (
                        <Box>
                            <Typography variant="h5" gutterBottom>
                                {selectedNotification.title}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                {selectedNotification.message}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                Date: {new Date(selectedNotification.createdAt).toLocaleDateString()}
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Modal>
        </Container>
    );
};

export default NotificationPage;
