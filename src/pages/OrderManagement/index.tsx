import React, { useEffect, useState, useRef } from "react";
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    IconButton,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MainLayout from "../../components/SIdeBar";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { toast } from "react-toastify";

interface Order {
    id: number;
    totalPrice: number;
    totalItem: number;
    createdBy: string;
    createdAt: string;
    paymentMethod: string;
    estatusOrder: string;
    epaymentStatus: string;
}

const OrderManagement = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string>('ALL'); // Trạng thái lọc mặc định
    const stompClientRef = useRef<Client | null>(null);
    const [hasNewOrder, setHasNewOrder] = useState<boolean>(false);

    // Gọi API để lấy danh sách đơn hàng
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const accessToken = localStorage.getItem("accessToken");
                const response = await fetch(
                    `http://localhost:8080/api/admin/get-all-order-of-user-by-status/${selectedStatus}?sortBy=createdAt&sortDir=desc`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setOrders(data.data);

                // Thiết lập kết nối WebSocket
                if (!stompClientRef.current) {
                    const socket = new SockJS("http://localhost:8080/ws");
                    const stompClient = new Client({
                        webSocketFactory: () => socket,
                        debug: (str: string) => console.log(str),
                    });

                    stompClient.onConnect = () => {
                        console.log("WebSocket Connected");

                        // Đăng ký lắng nghe kênh /topic/admin
                        stompClient.subscribe("/topic/admin", (message) => {
                            if (message.body) {
                                // const updatedOrder = JSON.parse(message.body);
                                // console.log(updatedOrder);

                                // setOrders((prevOrders) => {
                                //     return [...prevOrders, updatedOrder];
                                // }
                                // );
                                if (!hasNewOrder) {
                                    toast("Bạn có đơn đặt hàng mới");
                                    setHasNewOrder(true); // Đánh dấu đã hiển thị thông báo
                                }
                                fetchOrders()


                            }
                        });
                    };

                    stompClient.activate();
                    stompClientRef.current = stompClient;
                }
            } catch (err: any) {
                setError(err.message || "Failed to fetch orders");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();

        // Cleanup khi component bị unmount
        return () => {
            if (stompClientRef.current) {

                stompClientRef.current.deactivate(); // Hủy kết nối WebSocket khi component unmount
                stompClientRef.current = null;
            }
        };
    }, [selectedStatus]); // Khi selectedStatus thay đổi, gọi lại hàm fetchOrders

    const handleStatusChange = async (orderId: number, newStatus: string) => {
        const accessToken = localStorage.getItem("accessToken");
        try {
            const response = await fetch(
                `http://localhost:8080/api/admin/update-order-status/${orderId}`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status: newStatus }),
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Cập nhật trạng thái trong local state sau khi thay đổi
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === orderId ? { ...order, estatusOrder: newStatus } : order
                )
            );
        } catch (err: any) {
            setError(err.message || "Failed to update order status");
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <MainLayout
            title="Danh sách đơn hàng"
            content={
                <Box p={3}>
                    {/* Dropdown để chọn trạng thái đơn hàng */}
                    <Box display="flex" justifyContent="flex-end" mb={2}>
                        <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value as string)}
                                label="Status"
                            >
                                <MenuItem value="ALL">All</MenuItem>
                                <MenuItem value="PROCESSING">Processing</MenuItem>
                                <MenuItem value="COMPLETED">Completed</MenuItem>
                                <MenuItem value="CANCELLED">Cancelled</MenuItem>
                                <MenuItem value="DELIVERING">Delivering</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    {/* Table */}
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Order ID</TableCell>
                                    <TableCell>Customer Name</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Payment Status</TableCell>
                                    <TableCell>Total</TableCell>
                                    <TableCell>Payment Method</TableCell>
                                    <TableCell>Order Status</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell>{order.id}</TableCell>
                                        <TableCell>{order.createdBy}</TableCell>
                                        <TableCell>{order.createdAt}</TableCell>
                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    backgroundColor: "#ffe7e7",
                                                    color: "#d32f2f",
                                                    display: "inline-block",
                                                    padding: "4px 8px",
                                                    borderRadius: "4px",
                                                }}
                                            >
                                                {order.epaymentStatus}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{order.totalPrice}</TableCell>
                                        <TableCell>{order.paymentMethod}</TableCell>
                                        <TableCell>
                                            {/* Hiển thị trạng thái hiện tại trong dropdown */}
                                            <FormControl
                                                variant="outlined"
                                                size="small"
                                                sx={{ minWidth: 120 }}
                                            >
                                                <InputLabel>Status</InputLabel>
                                                <Select
                                                    value={order.estatusOrder}
                                                    onChange={(e) =>
                                                        handleStatusChange(order.id, e.target.value as string)
                                                    }
                                                    label="Status"
                                                >
                                                    <MenuItem value="PROCESSING">Processing</MenuItem>
                                                    <MenuItem value="COMPLETED">Completed</MenuItem>
                                                    <MenuItem value="CANCELLED">Canceled</MenuItem>
                                                    <MenuItem value="DELIVERING">Delivering</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </TableCell>
                                        <TableCell>
                                            <IconButton color="primary">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton color="error">
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            }
        />
    );
};

export default OrderManagement;
