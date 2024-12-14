// ViewDescription.tsx
import React from "react";
import { Typography } from "@mui/material";

interface IViewDescriptionProps {
    product: {
        productDetail: {
            fullDescription: string;
        };
    };
}

const ViewDescription: React.FC<IViewDescriptionProps> = ({ product }) => {
    return (
        <div className="w-full mt-10 bg-white p-6 rounded-md shadow-md">
            <Typography variant="h5" className="font-bold text-black mb-4">
                Product Description
            </Typography>
            <Typography variant="body1" className="text-gray-700">
                {product?.productDetail?.fullDescription || "No description available."}
            </Typography>
        </div>
    );
};

export default ViewDescription;
