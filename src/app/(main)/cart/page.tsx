'use client'
import React, { useEffect, useState } from "react";
import { Typography, Container, Grid, CssBaseline, Button } from "@mui/material";
import ShoppingCartItem from "../../../../src/components/atom/ShoppingCartItem";
import { useRouter } from "next/navigation";
import axiosInstance from "@/components/checkToken";
import { API_URL } from "@/config/url";

interface IProduct {
    id: string;
    title: string;
    quantity: number;
    price: number;
    variants: string;
    subCategory: string;
    imagePath: string;
}

interface ICartItem {
    id: string;
    quantity: string;
    totalPrice: number;
    product: IProduct;
    currentVariant: string;
    imagePath: string
}

interface ICart {
    id: string | undefined;
    totalPrice: number;
    totalItem: number;
    cartItem: ICartItem[];
}

interface IShoppingCartPageProps { }

const ShoppingCartPage: React.FC<IShoppingCartPageProps> = () => {
    const [carts, setCarts] = useState<ICart | null>(null); // Lưu giỏ hàng
    const [loading, setLoading] = useState(true); // State để theo dõi trạng thái đang tải
    const [error, setError] = useState<string | null>(null); // Lưu lỗi nếu có
    const router = useRouter();

    // Hàm gọi API để lấy giỏ hàng
    const fetchCart = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await axiosInstance.get(`${API_URL}/api/cart/show-cart`);

            const data = response.data.data;
            const { totalPrice, totalItem, cartItem } = data;

            console.log('Item:', data);

            // Chuyển đổi dữ liệu giỏ hàng vào dạng cần thiết
            const formattedCartItems = cartItem.map((item: any) => ({
                id: item.id,
                quantity: item.quantity,
                totalPrice: item.totalPrice,
                currentVariant: item.currentVariant,
                product: {
                    id: item.product.id,
                    title: item.product.title,
                    imagePath: item.product.imagePath,
                    price: item.product.price,
                    variants: item.product.variants,
                    subCategory: item.product.subCategory.name,
                },
            }));

            setCarts({ id: data.id, totalPrice, totalItem, cartItem: formattedCartItems });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Gọi fetchCart khi component được mount
    useEffect(() => {
        fetchCart();
    }, []);

    // Tính tổng tiền giỏ hàng
    const calculateTotalPrice = () => {
        return carts?.cartItem.reduce((total, item) => total + item.totalPrice, 0) ?? 0;
    };

    return (
        <React.Fragment>
            <CssBaseline />
            <Container fixed>
                <Typography variant="h4" gutterBottom>
                    Giỏ hàng của bạn
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={7} lg={12}>
                        <Grid container spacing={3}>
                            {loading ? (
                                <Typography>Loading...</Typography>
                            ) : error ? (
                                <Typography>Error: {error}</Typography>
                            ) : carts && carts.cartItem.length > 0 ? (
                                carts.cartItem.map((cartItem) => (
                                    <Grid item xs={12} key={cartItem.id}>
                                        <ShoppingCartItem
                                            cartItem={cartItem}

                                            fetchCart={fetchCart} // Truyền hàm load lại giỏ hàng
                                        />
                                    </Grid>
                                ))
                            ) : (
                                <Typography>No products in cart.</Typography>
                            )}
                        </Grid>

                        {/* Tổng tiền */}
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <Grid container spacing={2} alignItems="center" justifyContent="flex-end">
                                <Grid item>
                                    <Typography variant="h6" gutterBottom>
                                        Tổng tiền thanh toán: {carts?.totalPrice}
                                        {/* {calculateTotalPrice().toLocaleString()} đ */}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        style={{ marginLeft: 16 }}
                                        onClick={() => router.replace("/checkout")}
                                    >
                                        Tiến hành thanh toán
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </React.Fragment>
    );
};

export default ShoppingCartPage;
