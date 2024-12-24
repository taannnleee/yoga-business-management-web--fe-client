"use client";
import React, { useState, useEffect } from "react";
import { API_URL } from "@/config/url";
import {
    AppBar,
    Tabs,
    Tab,
    Box,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Container,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    InputBase, CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import StarRating from "@/components/molecules/StarRating";
import { useToast } from "@/hooks/useToast";
import {useRouter} from "next/navigation";

// Các interface dữ liệu
interface OrderItem {
    id: number;
    name: string;
    image: string;
    quantity: number;
    totalPrice: string;
    product: Product;
    currentVariant: any;
    comment?: any;
}

interface Order {
    id: number;
    totalPrice: number;
    totalItem: number;
    createdBy: string;
    status: string;
    payment: Payment;
    orderItems: OrderItem[];
    estatusOrder: string;
}

interface Product {
    id: number;
    imagePath: string;
}

interface Payment {
    nameMethod: string;
}

const OrderPage: React.FC = () => {
    const router = useRouter();
    const [spinner, setSpinner] = useState(false);
    const toast = useToast();
    const [selectedTab, setSelectedTab] = useState(0); // Trạng thái tab hiện tại
    const [orderData, setOrderData] = useState<Order[]>([]); // Trạng thái chứa danh sách đơn hàng
    const [loading, setLoading] = useState(false); // Trạng thái tải dữ liệu
    const [review, setReview] = useState(""); // Trạng thái cho nội dung đánh giá
    const [rating, setRating] = useState(0); // Trạng thái cho xếp hạng sao

    // Hàm thay đổi tab
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    };

    const getStatusByTabIndex = (index: number) => {
        switch (index) {
            case 1:
                return "DELIVERING";
            case 2:
                return "PROCESSING";
            case 3:
                return "COMPLETED";
            case 4:
                return "CANCELLED";
            default:
                return "ALL";
        }
    };

    // Lấy dữ liệu đơn hàng từ API
    useEffect(() => {
        const fetchOrderData = async (status: string) => {
            setLoading(true); // Bắt đầu tải dữ liệu
            try {
                const token = localStorage.getItem("accessToken"); // Lấy token
                const response = await fetch(`${API_URL}/api/order/get-all-order-by-status/${status}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json(); // Phân tích dữ liệu JSON
                setOrderData(data.data.content); // Lưu dữ liệu vào trạng thái
            } catch (error) {
                console.error("Error fetching order data:", error);
            } finally {
                setLoading(false);
            }
        };

        const status = getStatusByTabIndex(selectedTab);
        fetchOrderData(status);
    }, [selectedTab]);
    const getVariantValues = (variants: any) => {
        if (!variants) {
            console.log('Variants is null or undefined');
            return 'No variants available';
        }

        const values = Object.keys(variants).map((variantType) => {
            const variantDetails = variants[variantType];

            if (!variantDetails) {
                console.log(`Variant type ${variantType} is missing`);
                return `${variantType}: N/A`;
            }

            const value = variantDetails.value || 'N/A'; // Nếu value không tồn tại, trả về 'N/A'
            console.log(`Variant type: ${variantType}, value: ${value}`);

            return `${variantType}: ${value}`;
        });

        return values.join(", ");
    };
    const handleReviewSubmit = async (orderItem: any) => {
        setSpinner(true);
        if (review.trim() === "") {
            alert("Please enter a review before submitting!");
            return;
        }

        if (rating === 0) {
            alert("Please select a star rating before submitting!");
            return;
        }

        try {
            const accessToken = localStorage.getItem("accessToken");

            const commentResponse = await fetch(`${API_URL}/api/comment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    content: review,
                    ratePoint: rating,
                    productId: orderItem.product.id, // Cập nhật theo ID sản phẩm nếu cần
                    currentVariant: orderItem.currentVariant,
                }),
            });

            const commentData = await commentResponse.json();

            if (commentResponse.status !== 200) {
                alert(commentData.message || "Unable to add review!");
                return;
            }

            const newCommentId = commentData.data.id;

            // Cập nhật đánh giá vào đơn hàng
            const updateResponse = await fetch(
                `${API_URL}/api/order/update-comment/${orderItem.id}?commentId=${newCommentId}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            const updateData = await updateResponse.json();

            toast.sendToast("Thành công", "Bạn đã đánh giá sản phẩm");

            // Reset review và rating sau khi gửi thành công
            setReview("");
            setRating(0);
        } catch (error) {
            console.error(error);
            alert("An error occurred while submitting the review!");
        }
        finally {
            setSpinner(false);
        }
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Container>
            {/* Tabs cho các loại đơn hàng */}
            <AppBar position="static" color="default">
                <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    textColor="primary"
                    indicatorColor="primary"
                    variant="fullWidth"
                >
                    <Tab label="Tất cả" />
                    <Tab label="Đang giao" />
                    <Tab label="Đang xử lý" />
                    <Tab label="Thành công" />
                    <Tab label="Đã hủy" />
                </Tabs>
            </AppBar>

            <Box mt={3}>
                {orderData.length > 0 ? (
                    orderData.map((order) => (
                        <Card key={order.id} sx={{ mb: 3 }}>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="subtitle1">
                                        Mã đơn hàng: {order.id} | Người đặt: {order.createdBy}
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ textAlign: "right" }}>
                                        {order.estatusOrder}
                                    </Typography>
                                </Box>
                                <Typography variant="body2">
                                    Thanh toán: {order.payment.nameMethod} | Tổng số lượng: <strong>{order.totalItem}</strong> | Tổng tiền:{" "}
                                    <strong>{order.totalPrice}</strong>
                                </Typography>

                                <Accordion sx={{ mt: 2 }}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography>Chi tiết sản phẩm</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {order.orderItems.map((orderItem) => (
                                            <div key={orderItem.id}>
                                                <Card sx={{ display: "flex", mb: 2 }} className={"hover:cursor-pointer"} onClick={() => router.push(`/product-detail/${orderItem.product.id}`)}>
                                                    <CardMedia
                                                        component="img"
                                                        sx={{ width: 120 }}
                                                        image={orderItem.product.imagePath} // Sửa từ `item` thành `orderItem`
                                                        alt={orderItem.name}
                                                    />
                                                    <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                                                        <CardContent>
                                                            <Typography variant="h6">{orderItem.name}</Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Số lượng: {orderItem.quantity}
                                                            </Typography>
                                                            <Typography variant="body1" color="error">
                                                                Giá: {orderItem.totalPrice}
                                                            </Typography>
                                                            <Typography variant="body2" color="success">
                                                                {getVariantValues(orderItem.currentVariant)}
                                                            </Typography>
                                                        </CardContent>
                                                        <Box display="flex" justifyContent="flex-end" p={1}>
                                                            <Button variant="contained" color="success" size="small">
                                                                Mua lại
                                                            </Button>
                                                        </Box>
                                                    </Box>
                                                </Card>

                                                {/* Xử lý phần đánh giá */}
                                                {selectedTab === 3 && !orderItem?.comment && (
                                                    <>
                                                        <InputBase
                                                            value={review}
                                                            onChange={(e) => setReview(e.target.value)}
                                                            placeholder="Nhập đánh giá..."
                                                            sx={{
                                                                width: "100%",
                                                                mb: 2,
                                                                padding: 1,
                                                                border: "1px solid #ccc",
                                                                borderRadius: 1,
                                                            }}
                                                        />
                                                        {/* Xếp hạng sao */}
                                                        <StarRating rating={rating} onRatingChange={setRating} />
                                                        <Button
                                                            variant="contained"
                                                            onClick={() => handleReviewSubmit(orderItem)}
                                                            sx={{ mt: 2 }}
                                                            disabled={spinner}
                                                        >
                                                            {spinner ? <CircularProgress size={24} color="inherit" /> : 'Xác nhận'}
                                                        </Button>
                                                    </>
                                                )}

                                                {/* {selectedTab === 3 && orderItem?.comment && (
                                                    <>
                                                        <Typography variant="h6" sx={{ mt: 2 }}>
                                                            {orderItem.comment.content}
                                                        </Typography>
                                                        <StarRating rating={orderItem.comment.ratePoint} />
                                                    </>
                                                )} */}
                                            </div>
                                        ))}
                                    </AccordionDetails>
                                </Accordion>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Typography variant="body2">Không có đơn hàng nào.</Typography>
                )}
            </Box>
        </Container>
    );
};

export default OrderPage;
