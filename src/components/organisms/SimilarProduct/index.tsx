import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Button,
    IconButton,
    Dialog,
    CircularProgress,
    Skeleton
} from "@mui/material";
import Image from "next/image";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { useToast } from "@/hooks/useToast";
import ProductDetailModal from "@/components/organisms/ProductDetailModal"; // Import axios
import { API_URL } from "@/config/url";
interface ProductByCategoryCardProps {}

const SimilarProduct: React.FC<ProductByCategoryCardProps> = ({}) => {
    const toast = useToast();
    const [quantity, setQuantity] = useState(1);
    const [currentVariant, setCurrentVariant] = useState<any>({});
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [open, setOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]); // State to store products
    const [loading, setLoading] = useState(false); // Loading state for product fetch
    const itemsPerPage = 8;

    // Fetch products on mount
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("accessToken"); // Get token from localStorage
                if (!token) {
                    console.error("Access token is missing.");
                    return;
                }

                const response = await axios.get(`${API_URL}/api/product/all`, {
                    params: {
                        page: 1,
                        size: 4,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    setProducts(response.data.data.content); // Set products data
                } else {
                    console.error("Failed to fetch products.");
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleVariantChange = (variant: any) => {
        setCurrentVariant(variant);
        console.log("Current Variant:", variant);
    };

    const handleAddToCart = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await fetch(`${API_URL}/api/cart/add-to-cart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    productId: selectedProduct.id,
                    quantity: quantity,
                    currentVariant: currentVariant,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to add product to cart");
            }

            const data = await response.json();
            console.log("Product added to cart:", data);
            toast.sendToast("Success", "Product added to cart");
            setOpen(false);
        } catch (err: any) {
            console.error("Error adding product to cart:", err.message);
        }
    };

    const handleOpenModal = async (product: any) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                console.error("Access token is missing.");
                setLoading(false);
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
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setOpen(false);
    };

    const renderStars = (averageRating: number) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <span key={i} className={i < Math.round(averageRating) ? "text-yellow-500" : "text-gray-300"}>
          ★
        </span>
            );
        }
        return stars;
    };

    return (
        <div className="mt-4 p-4 mx-4">
            <div className="flex items-center justify-between mb-4">
                <div className="bg-red-500 w-1.5 h-8" />
                <Box flex={1}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 ">
                        {loading ? (
                            <div className="col-span-4 text-center">
                                <CircularProgress />
                            </div>
                        ) : (
                            products.slice(currentIndex, currentIndex + itemsPerPage).map((product) => (
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
                                            View Details
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
                                </div>
                            ))
                        )}
                    </div>
                </Box>
            </div>

            {/* Modal for Product Details */}
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

export default SimilarProduct;
