import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button, IconButton, CircularProgress, Typography, Dialog } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/navigation";
import ProductDetailModal from "@/components/organisms/ProductDetailModal";
import { incrementTotalItems } from "@/redux/cart/cartSlice";
import axios from "axios";
import { useToast } from "@/hooks/useToast";
import { useDispatch } from "react-redux";
import { API_URL } from "@/config/url";

// Định nghĩa kiểu cho variant và product
interface Variant {
    id: string;
    name: string;
    price: number;
    // Các thuộc tính khác của variant (nếu có)
}

interface Product {
    id: string;
    title: string;
    imagePath: string;
    price: number;
    averageRating: number;
    // Các thuộc tính khác của product
}

// Component ProductCard nhận các props: product, loading, handleAddToCart, và renderStars
export const ProductCard = ({ product, loading, renderStars }: { product: Product; loading: boolean; renderStars: (rating: number) => JSX.Element }) => {
    const [open, setOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [currentVariant, setCurrentVariant] = useState<Variant | null>(null);
    const router = useRouter();
    const toast = useToast();
    const dispatch = useDispatch();

    const handleOpenModal = async (product: Product) => {
        setOpen(true);
        try {
            const token = localStorage.getItem("accessToken"); // Lấy accessToken từ localStorage
            if (!token) {
                console.error("Access token is missing.");
                return;
            }

            const response = await axios.get(`${API_URL}/api/product/${product.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setSelectedProduct(response.data.data);
            } else {
                console.error("Failed to fetch product details");
            }
        } catch (error) {
            console.error("Error fetching product details:", error);
        }
    };

    const handleCloseModal = () => {
        setOpen(false);
        setSelectedProduct(null);
    };

    const handleVariantChange = (variant: Variant) => {
        setCurrentVariant(variant);
        console.log("Current Variant:", variant);
    };

    const handleAddToCart = async () => {
        if (!selectedProduct || !currentVariant) {
            toast.sendToast("Lỗi", "Vui lòng chọn variant và sản phẩm");
            return;
        }

        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                toast.sendToast("Lỗi", "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
                return;
            }

            const response = await fetch(`${API_URL}/api/cart/add-to-cart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    productId: selectedProduct?.id.toString(),
                    quantity: quantity,
                    currentVariant: currentVariant,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to add product to cart");
            }

            const data = await response.json();
            console.log("Product added to cart:", data);
            toast.sendToast("Thành công", "Đã thêm sản phẩm vào giỏ hàng");
            setOpen(false);
            dispatch(incrementTotalItems());
        } catch (err: any) {
            console.error("Error adding product to cart:", err.message);
        }
    };

    return (
        <div key={product.id} className="relative flex flex-col items-center cursor-pointer overflow-hidden rounded-md shadow-lg hover:shadow-xl">
            <Image
                src={product.imagePath}
                alt={product.title}
                width={218}
                height={218}
                className="rounded-md"
            />
            <div className="product-hover absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300">
                <IconButton
                    className="absolute right-0"
                    color="secondary"
                    onClick={() => handleOpenModal(product)}
                    sx={{
                        backgroundColor: "white",
                        borderRadius: "50%",
                        padding: "8px",
                        "& svg": {
                            color: "black",
                        },
                        top: "-50px",
                        "&:hover": {
                            backgroundColor: "#ff3048",
                            "& svg": {
                                color: "white",
                            },
                        },
                    }}
                    disabled={loading}
                >
                    {loading ? (
                        <CircularProgress
                            size={40}
                            sx={{
                                border: "3px solid #ff3048",
                                backgroundColor: "rgba(0, 0, 0, 0.1)",
                                padding: "6px",
                                boxSizing: "border-box",
                            }}
                        />
                    ) : (
                        <SearchIcon fontSize="large" />
                    )}
                </IconButton>
                <Button
                    sx={{
                        backgroundColor: "#f44336",
                        color: "white",
                        padding: "8px 16px",
                        width: "100%",
                        "&:hover": {
                            backgroundColor: "#a22622",
                        },
                    }}
                    onClick={() => router.push(`/product-detail/${product.id}`)}
                >
                    Xem chi tiết
                </Button>
            </div>
            <div className="text-center mt-2 px-4">
                <Typography
                    variant="subtitle1"
                    style={{
                        color: "black",
                        transition: "color 0.3s",
                        maxWidth: "192px",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                    className="hover:text-red-500"
                >
                    {product.title}
                </Typography>
                <div className="mt-1">{renderStars(product.averageRating)}</div>
                <Typography variant="body2" className="text-gray-500 mt-1">
                    {product.price.toLocaleString()}₫
                </Typography>
            </div>
            <Dialog open={open} onClose={handleCloseModal} maxWidth={"lg"}>
                <ProductDetailModal
                    selectedProduct={selectedProduct}
                    quantity={quantity}
                    setQuantity={setQuantity}
                    handleAddToCart={handleAddToCart}
                    handleVariantChange={handleVariantChange}
                />
            </Dialog>
        </div>
    );
};
