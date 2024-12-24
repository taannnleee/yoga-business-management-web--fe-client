import React, { useState, useEffect } from "react";
import { API_URL } from "@/config/url";
import {
    Box,
    Typography,
    Button,
    IconButton,
    Divider,
    Dialog,
    DialogContent,
    Skeleton,
    CircularProgress
} from "@mui/material";
import Image from "next/image";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/navigation";
import axios from "axios";
import { CustomNumberInput } from "@/components/atom/CustomNumberInput";
import { toast } from "react-toastify";
import { useToast } from "@/hooks/useToast";
import ProductDetailModal from "@/components/organisms/ProductDetailModal";
import { useDispatch } from "react-redux";
import { incrementTotalItems, setTotalItems } from "@/redux/cart/cartSlice";
import { setSelectedCategory } from "@/redux/category/categorySlice"; // Import axios

interface ProductByCategoryCardProps {
    category: any;
    products: any[];
    subCategories: any[];
    image: string;
}

export const ProductByCategoryCard: React.FC<ProductByCategoryCardProps> = ({ image, category, subCategories, products }: ProductByCategoryCardProps) => {
    const toast = useToast();
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(1);
    const [currentVariant, setCurrentVariant] = useState<any>({});
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [open, setOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [loading, setLoading] = useState(false); // Add loading state
    const [loadingDetail, setloadingDetail] = useState(false); // Add loading state
    const handleQuantityChange = (e: { target: { value: React.SetStateAction<number>; }; }) => {
        setQuantity(e.target.value); // Cập nhật giá trị khi người dùng thay đổi
    };
    const itemsPerPage = 8;


    const handleVariantChange = (variant: any) => {
        setCurrentVariant(variant); // Cập nhật variant hiện tại
        console.log("hehehe");
        console.log("Current Variant:", variant);
    };
    const handleViewAllProduct = (category: any) => {
        dispatch(setSelectedCategory(category)); // Passing both id and name for the category
        router.push(`/product`);
    };

    const handleAddToCart = async () => {
        try {
            const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage
            const response = await fetch(`${API_URL}/api/cart/add-to-cart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`, // Gửi token để xác thực
                },
                body: JSON.stringify({
                    productId: selectedProduct.id, // Truyền product.id vào API
                    quantity: quantity,
                    currentVariant: currentVariant
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to add product to cart");
            }

            const data = await response.json();
            console.log("Product added to cart:", data); // Log kết quả
            toast.sendToast("Thành công", "Đã thêm sản phẩm vào giỏ hàng");
            setOpen(false);
            dispatch(incrementTotalItems());
        } catch (err: any) {
            console.error("Error adding product to cart:", err.message); // Xử lý lỗi nếu có
        }
    };
    const handleOpenModal = async (product: any) => {
        setLoading(true); // Bắt đầu loading khi click vào icon
        try {
            const token = localStorage.getItem("accessToken"); // Lấy accessToken từ localStorage
            if (!token) {
                console.error("Access token is missing.");
                setLoading(false); // Dừng loading nếu không có token
                return;
            }

            const response = await axios.get(`${API_URL}/api/product/${product.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setSelectedProduct(response.data.data);

                setOpen(true);
            } else {
                console.error("Failed to fetch product details");
            }
        } catch (error) {
            console.error("Error fetching product details:", error);
        } finally {
            setLoading(false); // Dừng loading sau khi hoàn tất hoặc gặp lỗi
        }
    };

    const handleCloseModal = () => {
        setOpen(false);
    };

    const renderStars = (averageRating: number) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <span key={i} className={i < Math.round(averageRating) ? "text-yellow-500" : "text-gray-300"}>★</span>
            );
        }
        return stars;
    };

    return (
        <div className="mt-4 p-4 mx-4">
            <div className="flex items-center mb-4">
                <div className="bg-red-500 w-1.5 h-8 mr-4" />
                <Box flex={1}>
                    <Box display="flex" alignItems="center" mb={2}>
                        <Box
                            sx={{
                                backgroundColor: "red",
                                width: "6px",
                                height: "30px",
                                mr: 2,
                            }}
                        />
                        <Typography
                            variant="h4"
                            fontWeight="bold"
                            color="red"
                            mr={2}
                            sx={{ textTransform: 'uppercase' }}  // Sử dụng sx để áp dụng style
                        >
                            {category.name}
                        </Typography>


                        <Box display="flex" alignItems="center" className="mx-auto justify-between gap-8">
                            {subCategories.map((subCategory: any) => (
                                <Typography
                                    key={subCategory.id} // Thêm key để tránh lỗi
                                    variant="body1"
                                    component="a"
                                    href="#"
                                    className="cursor-pointer"
                                >
                                    {subCategory.name} {/* Hiển thị tên của subCategory */}
                                </Typography>
                            ))}


                        </Box>
                        {/* <Button variant="contained" color="primary" className="ml-auto" onClick={() => handleViewAllProduct(category)}>
                            Xem tất cả
                        </Button> */}
                    </Box>

                    <Divider className="my-2" />
                    <div className="flex justify-start items-start space-x-4">
                        <Box className="w-[240px] h-[634px] mt-[-2px]">
                            <Image
                                src={image}
                                alt="Category Image"
                                width={240}
                                height={634}
                                layout="fixed"
                            />
                        </Box>

                        {/* Skeleton loading */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-screen-lg">
                            {products.slice(currentIndex, currentIndex + itemsPerPage).map((product) => (
                                <div
                                    key={product.id}
                                    className="relative flex flex-col items-center cursor-pointer overflow-hidden rounded-md shadow-lg hover:shadow-xl"
                                >
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
                                                backgroundColor: 'white',
                                                borderRadius: '50%',
                                                padding: '8px',
                                                '& svg': {
                                                    color: 'black',
                                                },
                                                top: '-50px',
                                                '&:hover': {
                                                    backgroundColor: '#ff3048',
                                                    '& svg': {
                                                        color: 'white',
                                                    },
                                                },
                                            }}
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <CircularProgress
                                                    size={40} // Kích thước spinner
                                                    sx={{
                                                        border: '3px solid #ff3048', // Thêm viền đỏ cho spinner
                                                        backgroundColor: 'rgba(0, 0, 0, 0.1)', // Nền mờ phía sau spinner
                                                        padding: '6px', // Padding để làm tăng kích thước spinner một chút
                                                        boxSizing: 'border-box', // Đảm bảo các đường viền không làm thay đổi kích thước
                                                    }}
                                                />// Hiển thị spinner khi đang loading
                                            ) : (
                                                <SearchIcon fontSize="large" />
                                            )}
                                        </IconButton>
                                        <Button
                                            sx={{
                                                backgroundColor: '#f44336',
                                                color: 'white',
                                                padding: '8px 16px',
                                                width: '100%',
                                                '&:hover': {
                                                    backgroundColor: '#a22622',
                                                },
                                            }}
                                            onClick={() => {
                                                setloadingDetail(true); // Set loading to true when button is clicked
                                                router.push(`/product-detail/${product.id}`);
                                            }}

                                        >
                                            {loadingDetail ? (
                                                <CircularProgress
                                                    size={24} // Adjust the size as per your design preference
                                                    sx={{
                                                        color: 'white',
                                                        marginRight: '8px', // Add space between spinner and text
                                                    }}
                                                />
                                            ) : (
                                                "Xem chi tiết"
                                            )}
                                        </Button>
                                    </div>
                                    <div className="text-center mt-2 px-4">
                                        <Typography
                                            variant="subtitle1"
                                            style={{
                                                color: 'black',
                                                transition: 'color 0.3s',
                                                maxWidth: '192px',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
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
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Modal for Product Details */}
                    <Dialog open={open} onClose={handleCloseModal} maxWidth={"lg"} >
                        <ProductDetailModal
                            selectedProduct={selectedProduct}
                            quantity={quantity}
                            setQuantity={setQuantity}
                            handleAddToCart={handleAddToCart}
                            handleVariantChange={handleVariantChange}
                        />
                    </Dialog>
                </Box>
            </div>
        </div>
    );
};
