import React, { useEffect, useState } from 'react';
import { DialogContent, Typography, Button, CircularProgress } from '@mui/material';
import Image from 'next/image';
import { CustomNumberInput } from "@/components/atom/CustomNumberInput";
import { useRouter } from 'next/navigation';
import { FaRegHeart, FaHeart, FaSearchPlus, FaSpinner } from "react-icons/fa";
import RichTextDisplay from "@/components/organisms/RichTextDisplay";
import { useDispatch } from "react-redux";
import { API_URL } from "@/config/url";
interface Props {
    selectedProduct: any;
    quantity: number;
    setQuantity: (quantity: React.SetStateAction<any> | null) => void;
    handleAddToCart: () => void;
    handleVariantChange: (variant: any) => void;
}

const ProductDetailModal = ({ selectedProduct, quantity, setQuantity, handleAddToCart, handleVariantChange }: Props) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const [selectedImageLeft, setSelectedImageLeft] = useState(selectedProduct?.imagePath || "");
    const [selectedImageRight, setSelectedImageRight] = useState("");
    const [selectedImage, setSelectedImage] = useState(selectedImageLeft || selectedImageRight);
    const [currentVariant, setCurrentVariant] = useState<any>({});
    const [isFavorited, setIsFavorited] = useState(false);
    const accessToken = localStorage.getItem("accessToken");

    console.log("kkkk");
    console.log("currentVariant", currentVariant);

    const handleVariantSelect = (variantType: string, value: string, image: string) => {
        const updatedVariant = {
            ...currentVariant,
            [variantType]: { value, image: image as string },
        };
        setCurrentVariant(updatedVariant); // Cập nhật state local currentVariant

        // Gọi hàm handleVariantChange để gửi data về component cha
        handleVariantChange(updatedVariant); // Truyền updated variant về component cha

        if (variantType === 'color') {
            handleImageRightClick(image);
        }
    };

    const handleFavoriteToggle = async () => {
        setLoading(true); // Start loading
        try {
            if (isFavorited) {
                // Call API to remove from wishlist
                const response = await fetch(`${API_URL}/api/wishlist/delete-wishlist-by-product-id/${selectedProduct.id}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                    },
                });

                if (response.ok) {
                    setIsFavorited(false);
                } else {
                    console.error("Failed to remove from wishlist");
                }
            } else {
                // Call API to add to wishlist
                const response = await fetch(`${API_URL}/api/wishlist/add-wishlist`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({ productId: selectedProduct.id }),
                });

                if (response.ok) {
                    setIsFavorited(true);
                } else {
                    console.error("Failed to add to wishlist");
                }
            }
        } catch (error) {
            console.error("Error toggling wishlist status:", error);
        } finally {
            setLoading(false); // Stop loading after API call
        }
    };

    useEffect(() => {
        const checkWishlistStatus = async () => {
            try {
                const response = await fetch(`${API_URL}/api/wishlist/get-wishlist-exists`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({ productId: selectedProduct.id }),
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.status === 200) {
                        setIsFavorited(true); // Set favorite status if the status is 200
                    }
                } else {
                    console.error("Failed to check wishlist status");
                }
            } catch (error) {
                console.error("Error checking wishlist status:", error);
            }
        };

        if (selectedProduct.id) {
            checkWishlistStatus();
        }


        // Chọn variant đầu tiên tự động khi Modal được hiển thị
        const defaultVariants: any = {};

        // Duyệt qua các variant và chọn cái đầu tiên
        if (selectedProduct?.variants) {
            Object.entries(selectedProduct.variants).forEach(([variantType, variantValues]) => {
                const firstValue = Object.entries(variantValues as string)[0];
                if (firstValue) {
                    const [value, image] = firstValue;
                    defaultVariants[variantType] = { value, image };
                    if (variantType === 'color') {
                        setSelectedImageLeft(image);  // Set ảnh màu đầu tiên
                        setSelectedImage(image);      // Chọn ảnh đầu tiên làm ảnh hiện tại
                    }
                }
            });
        }
        setCurrentVariant(defaultVariants);
        handleVariantChange(defaultVariants);
    }, [selectedProduct]);
    const handleImageLeftClick = (image: unknown) => {
        setSelectedImageLeft(image as string);
        setSelectedImage(image as string);
    };
    const handleAddToCartClick = () => {
        setLoading(true);  // Set loading state to true when clicked
        handleAddToCart();  // Your add to cart logic
        setTimeout(() => {
            setLoading(false);  // Set loading state to false after action completes (example with timeout)
        }, 4000);  // Simulate a delay for the action (e.g., network request)
    };
    const handleImageRightClick = (image: unknown) => {
        setSelectedImageRight(image as string);
        setSelectedImage(image as string);
    };
    return (
        <DialogContent className={"w-[1030px] h-[559px]"}>
            <div className="flex items-center space-x-8">
                <div className="flex-1">
                    <div className="flex items-center space-x-4 relative">
                        {/* Heart icon positioned at the top-right of the container */}
                        <button
                            onClick={handleFavoriteToggle}
                            className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transform transition-transform duration-200 hover:scale-110"
                        >
                            {!isFavorited ? (
                                <FaRegHeart className="text-black w-6 h-6" />
                            ) : (
                                <FaHeart className="text-red-500 w-6 h-6" />
                            )}
                        </button>

                        {/* Hiển thị ảnh lớn */}
                        <Image
                            src={selectedImage}
                            alt={selectedProduct?.title || ""}
                            width={390}
                            height={390}
                            className="rounded-md"
                        />
                    </div>


                    {/* Các ảnh nhỏ bên dưới ảnh lớn */}
                    <div className="mt-4 flex space-x-4 overflow-x-auto">
                        {selectedProduct?.variants?.color &&
                            Object.entries(selectedProduct.variants.color).map(([color, image], index) => {
                                return image ? (
                                    <div key={index} className="flex flex-col items-center"
                                        onClick={() => handleImageLeftClick(image)}>
                                        <Image
                                            src={typeof image === 'string' && image !== '' ? image : '/path/to/fallback/image.jpg'}
                                            alt={`${color} image`}
                                            width={84}
                                            height={84}
                                            className={`rounded-md cursor-pointer ${image === selectedImageLeft ? "border-2 border-red-500" : ""}`}
                                        />
                                    </div>
                                ) : null;
                            })}
                    </div>
                </div>

                <div className="flex-2 space-y-4">
                    <Typography variant="h6" className="font-bold text-ellipsis text-black">
                        {selectedProduct?.title}
                    </Typography>

                    <Typography variant="subtitle1" className="text-gray-600">
                        Thương hiệu: <span className="text-red-500">{selectedProduct?.brand}</span>
                    </Typography>
                    <Typography variant="h5" className="text-red-500">
                        {selectedProduct?.price?.toLocaleString()}₫
                    </Typography>
                    <Typography variant="body2" className="text-black max-w-xl overflow-hidden line-clamp-5">
                        <RichTextDisplay className="my-4" content={selectedProduct?.description || ""} />
                    </Typography>

                    <span
                        className={"text-red-600 hover:cursor-pointer"}
                        onClick={() => router.push(`/product-detail/${selectedProduct.id}`)}
                    >
                        Xem chi tiết
                    </span>

                    {/* Chọn variant */}
                    <div>
                        {selectedProduct?.variants &&
                            Object.entries(selectedProduct.variants).map(([variantType, variantValues]) => (
                                <div key={variantType} className={"my-4"}>
                                    <Typography variant="subtitle1" className="text-black font-bold">
                                        {variantType.charAt(0).toUpperCase() + variantType.slice(1)} {/* Hiển thị tên variant như 'Color', 'Size',... */}
                                    </Typography>
                                    <div className="flex items-center space-x-4">
                                        {Object.entries(variantValues as string).map(([value, image], index) => (
                                            <div
                                                key={index}
                                                className={"flex items-center justify-evenly mr-4"}
                                                onClick={() => handleVariantSelect(variantType, value, image as string)}
                                            >
                                                <Typography className="cursor-pointer">
                                                    <div className={"flex items-center justify-start space-x-2"}>
                                                        {/* Kiểm tra nếu là color thì hiển thị ảnh */}
                                                        {variantType === 'color' ? (
                                                            <>
                                                                <Image
                                                                    src={image as string}
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
                                                        {/* Hiển thị tên value cho tất cả các variants */}

                                                    </div>
                                                </Typography>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                    </div>

                    <div className="flex items-center space-x-4 mt-4">
                        <CustomNumberInput
                            aria-label="Quantity"
                            placeholder="Nhập số lượng…"
                            value={quantity}
                            onChange={(event, val) => setQuantity(val)}
                        />
                        <Button
                            sx={{
                                backgroundColor: '#f44336',
                                color: 'white',
                                padding: '8px 16px',
                                '&:hover': {
                                    backgroundColor: '#a22622',
                                },
                            }}
                            disabled={loading}
                            onClick={handleAddToCartClick}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Thêm vào giỏ'} {/* Show spinner if loading */}
                        </Button>
                    </div>
                </div>
            </div>
        </DialogContent>
    );
};

export default ProductDetailModal;
