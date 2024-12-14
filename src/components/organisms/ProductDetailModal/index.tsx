import React, { useEffect, useState } from 'react';
import {DialogContent, Typography, Button, CircularProgress} from '@mui/material';
import Image from 'next/image';
import { CustomNumberInput } from "@/components/atom/CustomNumberInput";
import { useRouter } from 'next/navigation';
import { FaRegHeart, FaHeart, FaSearchPlus } from "react-icons/fa";
import RichTextDisplay from "@/components/organisms/RichTextDisplay";
import {useDispatch} from "react-redux";
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

    console.log("kkkk");
    console.log("currentVariant", currentVariant);

    const handleVariantSelect = (variantType: string, value: string, image: string) => {
        const updatedVariant = {
            ...currentVariant,
            [variantType]: { value, image },
        };
        setCurrentVariant(updatedVariant); // Cập nhật state local currentVariant

        // Gọi hàm handleVariantChange để gửi data về component cha
        handleVariantChange(updatedVariant); // Truyền updated variant về component cha

        if (variantType === 'color') {
            handleImageRightClick(image);
        }
    };

    useEffect(() => {
        // Chọn variant đầu tiên tự động khi Modal được hiển thị
        const defaultVariants: any = {};

        // Duyệt qua các variant và chọn cái đầu tiên
        if (selectedProduct?.variants) {
            Object.entries(selectedProduct.variants).forEach(([variantType, variantValues]) => {
                const firstValue = Object.entries(variantValues)[0];
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
        setSelectedImageLeft(image);
        setSelectedImage(image);
    };
    const handleAddToCartClick = () => {
        setLoading(true);  // Set loading state to true when clicked
        handleAddToCart();  // Your add to cart logic
        setTimeout(() => {
            setLoading(false);  // Set loading state to false after action completes (example with timeout)
        }, 4000);  // Simulate a delay for the action (e.g., network request)
    };
    const handleImageRightClick = (image: unknown) => {
        setSelectedImageRight(image);
        setSelectedImage(image);
    };
    const isFavorited = false;
    return (
        <DialogContent className={"w-[1030px] h-[559px]"}>
            <div className="flex items-center space-x-8">
                <div className="flex-1">
                    <div className="flex items-center space-x-4 relative">
                        {/* Heart icon positioned at the top-right of the container */}
                        <button
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
                                        {Object.entries(variantValues).map(([value, image], index) => (
                                            <div
                                                key={index}
                                                className={"flex items-center justify-evenly mr-4"}
                                                onClick={() => handleVariantSelect(variantType, value, image)}
                                            >
                                                <Typography className="cursor-pointer">
                                                    <div className={"flex items-center justify-start space-x-2"}>
                                                        {/* Kiểm tra nếu là color thì hiển thị ảnh */}
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
