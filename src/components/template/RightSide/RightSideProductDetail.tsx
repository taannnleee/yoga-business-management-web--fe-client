import React, { useState } from "react";
import { Typography, Button, CircularProgress } from '@mui/material';
import { CustomNumberInput } from "@/components/atom/CustomNumberInput";
import Image from "next/image";
import { incrementTotalItems } from "@/redux/cart/cartSlice";
import { useToast } from "@/hooks/useToast";
import { useDispatch } from "react-redux";
import { API_URL } from "@/config/url";

interface Variant {
    value: string;
    image: string;
}

interface Product {
    id: string;
    title: string;
    averageRating: number;
    sold: number;
    code: string;
    brand: string;
    price: number;
    variants: Record<string, Record<string, string>>; // Đảm bảo khai báo đúng kiểu cho variants
}

interface RightSideProps {
    product: Product;
    quantity: number;
    setQuantity: (quantity: React.SetStateAction<number>) => void;
    currentVariant: any;
    handleVariantSelect: (variantType: string, value: string, image: string) => void;
}

export const RightSideProductDetail: React.FC<RightSideProps> = ({
    product,
    quantity,
    setQuantity,
    currentVariant,
    handleVariantSelect,
}) => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const toast = useToast();

    const handleAddToCart = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("accessToken");
            const response = await fetch(`${API_URL}/api/cart/add-to-cart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    productId: product.id.toString(),
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
            dispatch(incrementTotalItems());
        } catch (err: any) {
            console.error("Error adding product to cart:", err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBuyNow = async () => {
        await handleAddToCart();
        // Logic để thực hiện hành động "Mua ngay" (ví dụ: chuyển đến trang thanh toán)
    };

    return (
        <div className="space-y-4">
            <Typography variant="h6" className="font-bold text-ellipsis text-black">
                {product?.title}
            </Typography>

            {/* Ratings and Reviews */}
            <div className="flex items-center gap-2">
                <Typography variant="subtitle1" className="text-gray-600 flex justify-between items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <span className="font-bold text-black">
                            {product?.averageRating?.toFixed(1)}
                        </span>
                        <span className="text-yellow-500">
                            {Array.from({ length: 5 }, (_, index) => {
                                if (product?.averageRating > index + 0.5) {
                                    return "⭐"; // Full star
                                } else if (product?.averageRating > index) {
                                    return "✩"; // Half star
                                } else {
                                    return "☆"; // Empty star
                                }
                            })}
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-black font-semibold">100 Đánh giá/Bình luận</span>
                        <span className="text-gray-500">|</span>
                        <span className="text-black font-semibold">{product?.sold} Đã mua</span>
                    </div>
                </Typography>
            </div>

            <Typography variant="subtitle1" className="text-gray-600">
                Mã sản phẩm: <span className="text-red-500">{product?.code}</span>
            </Typography>
            <Typography variant="subtitle1" className="text-gray-600">
                Thương hiệu: <span className="text-red-500">{product?.brand}</span>
            </Typography>
            <Typography variant="h3" color={"red"}>
                {product?.price?.toLocaleString()}₫
            </Typography>

            <div>
                {product?.variants &&
                    Object.entries(product.variants).map(([variantType, variantValues]) => {
                        return (
                            <div key={variantType} className={"my-4"}>
                                <Typography variant="subtitle1" className="text-black font-bold">
                                    {variantType.charAt(0).toUpperCase() + variantType.slice(1)}
                                </Typography>
                                <div className="flex items-center space-x-4">
                                    {Object.entries(variantValues).map(([value, image], index) => (
                                        <div
                                            key={index}
                                            className={"flex items-center justify-evenly mr-4"}
                                            onClick={() => {
                                                const variantImage = image || '/path/to/fallback/image.jpg'; // Fallback for image
                                                handleVariantSelect(variantType, value, variantImage);
                                            }}
                                        >
                                            <Typography className="cursor-pointer">
                                                <div className={"flex items-center justify-start space-x-2"}>
                                                    {variantType === 'color' ? (
                                                        <>
                                                            <Image
                                                                src={image || '/path/to/fallback/image.jpg'}
                                                                alt={`${value} color`}
                                                                width={40}
                                                                height={40}
                                                                className={`rounded-md cursor-pointer ${image === currentVariant.color?.image ? 'border-2 border-red-500' : ''}`}
                                                            />
                                                            <Typography variant="caption" className="text-center mt-1 mr-8">
                                                                {value}
                                                            </Typography>
                                                        </>
                                                    ) : (
                                                        <div
                                                            className={`flex items-center justify-center w-11 h-11 border border-gray-300 rounded-md cursor-pointer ${value === currentVariant[variantType]?.value ? 'border-2 border-red-800' : ''}`}
                                                        >
                                                            <Typography className="text-center">{value}</Typography>
                                                        </div>
                                                    )}
                                                </div>
                                            </Typography>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
            </div>

            <div className="flex items-center space-x-4 mt-4">
                <span>Số lượng:</span>
                <CustomNumberInput
                    aria-label="Quantity"
                    placeholder="Nhập số lượng…"
                    value={quantity}
                //   onChange={(event, val) => setQuantity(val)}
                />
            </div>

            <div className="flex items-center space-x-4 mt-4">
                <Button
                    sx={{
                        width: '230px',
                        height: '40px',
                        backgroundColor: '#f44336',
                        color: 'white',
                        padding: '8px 16px',
                        '&:hover': {
                            backgroundColor: '#a22622',
                        },
                    }}
                    onClick={handleAddToCart}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'THÊM VÀO GIỎ'}
                </Button>

                <Button
                    sx={{
                        width: '230px',
                        height: '40px',
                        backgroundColor: '#d1d1d1',
                        color: 'red',
                        padding: '8px 16px',
                        '&:hover': {
                            backgroundColor: '#78B3CE',
                        },
                    }}
                    onClick={handleBuyNow}
                >
                    MUA NGAY
                </Button>
            </div>
        </div>
    );
};
