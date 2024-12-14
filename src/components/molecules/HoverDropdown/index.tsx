import React, { useEffect, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import {FaSpinner} from "react-icons/fa"; // Assuming you're using HeroIcons
import { API_URL } from "@/config/url";
import {setSelectedCategory, setSelectedSubCategory} from "@/redux/category/categorySlice";
import {useDispatch} from "react-redux";
import {useRouter} from "next/navigation";
interface HoverDropdownProps {
    buttonText: string;
}

interface SubCategory {
    id: number;
    name: string;
}

interface Category {
    id: number;
    name: string;
    subCategories: SubCategory[];
}

const HoverDropdown: React.FC<HoverDropdownProps> = ({ buttonText }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const dispatch = useDispatch();
    const router = useRouter();
    // Fetch categories and subcategories from the API
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

    if (loading) return <div><FaSpinner/></div>;

    return (
        <div className="relative group">
            <button className="text-black hover:bg-gray-200 hover:text-orange-600 flex items-center relative transition-all duration-300 ease-in-out">
                <span>{buttonText}</span>
                <ChevronDownIcon className="w-5 h-5 ml-1 text-black" />
                {/* Pseudo bridge */}
                <div className="absolute left-0 top-full w-full h-4 bg-transparent group-hover:block z-10"></div>
            </button>

            <div className="absolute left-[-125%] hidden w-[400px] mt-2 bg-white shadow-lg group-hover:block z-50 overflow-visible">
                <ul className="py-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {categories.map((category) => (
                        <li key={category.id}
                            onClick={() => {
                                dispatch(setSelectedCategory(category));
                                router.push(`/product`);
                            }}
                            className="px-4 py-2 hover:bg-gray-200 hover:text-orange-600 transition-all duration-300 ease-in-out hover:cursor-pointer">
                            <span className="text-black font-bold uppercase text-sm">{category.name}</span>
                            <ul className="mt-2 space-y-1">
                                {category.subCategories.map((subCategory) => (
                                    <li key={subCategory.id}
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent parent click
                                            dispatch(setSelectedSubCategory(subCategory));
                                            router.push(`/product`);
                                        }}
                                        className="hover:cursor-pointer w-full text-sm py-1 text-gray-700 hover:bg-gray-100 hover:text-orange-600 transition-all duration-300 ease-in-out">
                                        {subCategory.name}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default HoverDropdown;
