import React, {useEffect, useState} from "react";
import { MagnifyingGlassCircleIcon } from "@heroicons/react/24/solid";
import { Popover, TextField } from "@mui/material";
import {API_URL} from "@/config/url";
import Image from "next/image";
import {useRouter} from "next/navigation";

const FulfillmentManagement: React.FC = () => {
    const [openPopup, setOpenPopup] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        setOpenPopup(true);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setOpenPopup(false);
    };
    const handleNavigateProductPage = () => {
        router.push(`/product?keyword=${searchTerm}`);
        setOpenPopup(false);
    };
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const accessToken = localStorage.getItem("accessToken");
            const url = `${API_URL}/api/product/filter?page=1&pageSize=4&keyword=${searchTerm}`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            setProducts(data.data.content);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (searchTerm.trim()) {
            fetchProducts();
        } else {
            setProducts([]);
        }
    }, [searchTerm]);
    const navigateToProductDetail = (id: string) => {
        router.push(`/product-detail/${id}`);
        setOpenPopup(false);
    }
    return (
        <>
            <button onClick={handleClick}>
                <MagnifyingGlassCircleIcon className="w-10 h-10 text-gray-600 mr-1" />
            </button>

            <Popover
                open={openPopup}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: "var(--border-radius-large, 16px)",
                            overflow: "visible",
                            maxWidth: 327,
                            maxHeight: 300,
                            boxShadow: "0px 8px 28px 0px rgba(0, 0, 0, 0.28)",
                            "&:before": {
                                content: '""',
                                display: "block",
                                position: "absolute",
                                top: 5,
                                right: "50%",
                                left: "47%",
                                width: 20,
                                height: 20,
                                backgroundColor: "rgb(249 250 251)",
                                transform: "translateY(-50%) rotate(45deg)",
                                boxShadow: "-3px -3px 5px -2px rgba(0,0,0,0.1)",
                            },
                        },
                    },
                }}
            >
                <div className="w-[400px] bg-gray-50 px-4 py-2 rounded-lg flex flex-col gap-y-4 max-h-[550px]">
                    <div className="w-full flex items-center gap-x-2">
                        <TextField
                            fullWidth
                            placeholder="Tìm kiếm..."
                            variant="outlined"
                            size="small"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "8px",
                                },
                                "& .MuiInputBase-input": {
                                    padding: "8px",
                                },
                            }}
                        />
                        <MagnifyingGlassCircleIcon className="w-12 h-12 text-gray-600 cursor-pointer hover:text-red-500" onClick={handleNavigateProductPage} />
                    </div>
                    {searchTerm && (
                        <>
                            <div>Sản phẩm</div>
                            <div className="mt-2 flex flex-col gap-y-2">
                                {products.map((product) => (
                                    <div
                                        key={product.id}
                                        className="max-h-[90px] text-sm cursor-pointer flex items-center gap-2 p-2 bg-white rounded-lg hover:bg-blue-500 hover:text-white transition-colors duration-300 shadow-md"
                                        onClick={() => navigateToProductDetail(product.id)}
                                    >
                                        <Image
                                            src={product.imagePath}
                                            alt={product.title}
                                            width={12}
                                            height={12}
                                            className="w-10 h-10 object-cover rounded-md"
                                        />
                                        <div className="flex-1">
                                            <h4 className="text-sm font-medium leading-tight line-clamp-1">{product.title}</h4>
                                            <p
                                                className="text-xs mt-1 overflow-hidden text-ellipsis line-clamp-3"
                                                dangerouslySetInnerHTML={{__html: product.description}}
                                            ></p>

                                            {product.price && (
                                                <p className="text-xs font-semibold mt-1">{product.price}đ</p>
                                            )}
                                        </div>
                                    </div>

                                ))}
                            </div>
                            <div className={"cursor-pointer text-center underline text-sm"} onClick={handleNavigateProductPage}>
                                Hiển thị tất cả kết quả cho {searchTerm}
                            </div>
                        </>
                    )}
                </div>
            </Popover>
        </>
    );
};

export default FulfillmentManagement;
