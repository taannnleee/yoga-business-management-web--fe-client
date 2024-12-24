import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaSpinner } from 'react-icons/fa';
import { setSelectedCategory, setSelectedSubCategory } from '@/redux/category/categorySlice';
import { RootState } from "@/redux/store";
import { API_URL } from "@/config/url";

interface SubCategory {
    id: number;
    name: string;
}

interface Category {
    id: number;
    name: string;
    subCategories: SubCategory[];
}

interface CategoryView {
    id: number;
    name: string;
}

export const LeftSideGetAllProduct: React.FC = (props) => {
    const selectedCategory = useSelector((state: RootState) => state.category.selectedCategory);
    const selectedSubCategory = useSelector((state: RootState) => state.category.selectedSubCategory);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const dispatch = useDispatch();
    // const { setPage, setTotalItems } = props;

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const response = await fetch(`${API_URL}/api/category/with-sub-categories`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                const data = await response.json();
                if (data.status === 200) {
                    setCategories(data.data);
                } else {
                    console.error('Failed to fetch categories');
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleCategoryClick = (category: CategoryView) => {
        // const categoryData = { id: category.id, name: category.name };
        // dispatch(setSelectedCategory(categoryData)); // Passing both id and name for the category
        // dispatch(setSelectedSubCategory(null)); // Clear selected subcategory when category is clicked
        // setPage(1); // Reset page to 1 when category is clicked
        // setTotalItems(1);
    };

    const handleSubCategoryClick = (category: CategoryView, subCategory: SubCategory) => {
        const categoryData = { id: category.id, name: category.name };
        const subCategoryData = { id: subCategory.id, name: subCategory.name }; // Passing both id and name for the subcategory
        dispatch(setSelectedCategory(categoryData)); // Ensure the parent category is selected
        dispatch(setSelectedSubCategory(subCategoryData)); // Set selected subcategory
        // setPage(1); 
        // setTotalItems(1); 
    };

    return (
        <div className="w-64 bg-white shadow-lg p-4 space-y-4">
            <div>
                {[...categories, { id: 0, name: 'Tất cả sản phẩm', subCategories: [] }].map((category) => (
                    <div key={category.id} className="space-y-2">
                        <div
                            onClick={() => handleCategoryClick(category)}  // Pass category name
                            className={`px-4 py-2 transition-all duration-300 ease-in-out cursor-pointer ${category.id === selectedCategory?.id ? 'text-red-500 font-bold' : 'hover:bg-gray-200 hover:text-orange-600'
                                }`}
                        >
                            <span className="text-black font-bold uppercase text-sm">{category.name}</span>
                        </div>
                        <ul className="mt-2 space-y-1 ml-4">
                            {category.subCategories.map((subCategory) => (
                                <li
                                    key={subCategory.id}  // Added missing key prop
                                    onClick={() => handleSubCategoryClick(category, subCategory)}  // Pass both category and subcategory names
                                    className={`w-full text-sm py-1 transition-all duration-300 ease-in-out cursor-pointer ${subCategory.id === selectedSubCategory?.id && category.id === selectedCategory?.id
                                        ? 'text-red-500 font-bold' // Highlight subcategory only if its parent category is selected
                                        : 'hover:bg-gray-100 hover:text-orange-600'
                                        }`}
                                >
                                    {subCategory.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};
