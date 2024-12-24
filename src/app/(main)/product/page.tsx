"use client";
import React, { useState, useEffect } from "react";
import { LeftSideGetAllProduct } from "@/components/template/LeftSide/LeftSideGetAllProduct";
import { LeftSideGetAllProductSkeleton } from "@/components/template/LeftSide/LeftSideGetAllProductSkeleton";
import { useParams } from 'next/navigation'
const ProductPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(4); // Default items per page
    const [totalItems, setTotalItems] = useState(1); // Total number of items
    const [searchTerm, setSearchTerm] = useState(useParams().keyword || '');
    // Simulating data fetching and setting initial states
    useEffect(() => {
        const fetchData = async () => {
            // Simulate a loading delay
            setTimeout(() => {
                setLoading(false);
            }, 2000); // Simulated delay
        };

        fetchData();
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex flex-row space-x-8 flex-grow">
                {/* Left Side - Show Skeleton or Product Component */}
                <div className="flex-none w-1/6">
                    {loading ? (
                        <LeftSideGetAllProductSkeleton />
                    ) : (
                        <LeftSideGetAllProduct />
                    )}
                </div>

                {/* Right Side - Show Product Component */}
                <div className="flex-grow">
                    {/* <RightSideGetAllProduct
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        setItemsPerPage={setItemsPerPage}
                        page={page}
                        itemsPerPage={itemsPerPage}
                        totalItems={totalItems}
                        setTotalItems={setTotalItems}
                        setPage={setPage}
                    /> */}
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
