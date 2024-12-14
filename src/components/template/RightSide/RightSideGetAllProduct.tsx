import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import {FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, TextField} from '@mui/material';
import {ProductCard} from '@/components/molecules/ProductCard'; // Import ProductCard
import BottomContent from "@/components/molecules/BottomContent";
import {ProductCardSkeleton} from "@/components/molecules/ProductCard/skeleton"; // Import BottomContent
import { API_URL } from "@/config/url";
import {MagnifyingGlassCircleIcon} from "@heroicons/react/24/solid";
import {Clear} from "@mui/icons-material";
export const RightSideGetAllProduct: React.FC = (props) => {
    const selectedCategory = useSelector((state: RootState) => state.category.selectedCategory);
    const selectedSubCategory = useSelector((state: RootState) => state.category.selectedSubCategory);
    const [selectedSort, setSelectedSort] = useState('');
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { page, setPage, itemsPerPage, setItemsPerPage, totalItems, setTotalItems,searchTerm, setSearchTerm } = props;
    // Pagination state
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const accessToken = localStorage.getItem('accessToken');
            let url = `${API_URL}/api/product/filter?page=${page}&pageSize=${itemsPerPage}&sortBy=title&sortDir=${selectedSort || 'asc'}`;

            if (selectedSubCategory?.id) {
                url += `&subCategoryId=${selectedSubCategory.id}`;
            }
            if (selectedCategory?.id) {
                url += `&categoryId=${selectedCategory.id}`;
            }
            if (searchTerm) {
                url += `&keyword=${encodeURIComponent(searchTerm)}`;
            }
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setProducts(data.data.content);
            setTotalItems(data.data.totalElements); // Update total items for pagination
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    // Call API on dependency changes
    useEffect(() => {
        fetchProducts();
    }, [selectedSubCategory, selectedSort, page, itemsPerPage,searchTerm]);

    const handleSortChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedSort(event.target.value as string);
    };

    const onRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(e.target.value));
        setPage(1); // Reset to first page when changing items per page
    };

    return (
        <div>
            <div className="flex flex-row justify-between m-4">
                <h1 className="text-2xl font-bold text-center ml-[46px] pt-[8px]">
                    {selectedSubCategory?.name || selectedCategory?.name || 'Tất cả sản phẩm'}
                </h1>
                <div className="w-64 flex items-center gap-x-2">
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
                        InputProps={{
                            endAdornment: searchTerm && (
                                <InputAdornment position="end">
                                    <IconButton
                                        size="small"
                                        onClick={() => setSearchTerm("")}
                                        aria-label="clear search term"
                                        className={"hover:text-red-500"}
                                    >
                                        <Clear fontSize="small" />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </div>
                <div className="flex justify-end items-center mt-[-24px]">
                    <FormControl className="w-48 h-4">
                        <InputLabel id="sort-select-label text-center">Sắp xếp</InputLabel>
                        <Select
                            labelId="sort-select-label"
                            id="sort-select"
                            value={selectedSort}
                            label="Sắp xếp"
                            onChange={handleSortChange}
                            variant="filled"
                        >
                            <MenuItem className="text-xs" value="">Mặc định</MenuItem>
                            <MenuItem className="text-xs" value="asc">A -{'>'} Z</MenuItem>
                            <MenuItem className="text-xs" value="desc">Z -{'>'} A</MenuItem>
                            <MenuItem className="text-xs" value="priceAsc">Giá tăng dần</MenuItem>
                            <MenuItem className="text-xs" value="priceDesc">Giá giảm dần</MenuItem>
                            <MenuItem className="text-xs" value="newest">Hàng mới nhất</MenuItem>
                            <MenuItem className="text-xs" value="oldest">Hàng cũ nhất</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-screen-lg mt-8 mx-auto">
                {loading ? (
                    <ProductCardSkeleton/>
                ) : products.length === 0 ? (
                    <div className="col-span-full text-center text-xl text-gray-500">
                        Shop chưa nhập loại sản phẩm này 😢 , vui lòng chọn loại sản phẩm khác
                    </div>
                ) : (
                    products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            loading={loading}
                            renderStars={(rating) => (
                                <div>{'⭐'.repeat(rating)}</div>
                            )}
                            handleOpenModal={() => {
                            }}
                        />
                    ))
                )}
            </div>

            {/* Add BottomContent for Pagination */}
            <BottomContent
                totalItems={totalItems}
                page={page}
                pageSize={Math.ceil(totalItems / itemsPerPage)}
                onRowsPerPageChange={onRowsPerPageChange}
                onNextPage={() => setPage((prev) => Math.min(prev + 1, Math.ceil(totalItems / itemsPerPage)))}
                onPreviousPage={() => setPage((prev) => Math.max(prev - 1, 1))}
                setPage={setPage}
            />
        </div>
    );
};
