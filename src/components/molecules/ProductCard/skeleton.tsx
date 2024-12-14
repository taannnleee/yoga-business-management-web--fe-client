import React from "react";
import { Skeleton, Box } from "@mui/material";

export const ProductCardSkeleton = () => {
    return (
        <Box
            className="relative flex flex-col items-center overflow-hidden rounded-md shadow-lg"
            sx={{
                width: 218,
                height: 400, // Điều chỉnh chiều cao phù hợp với nội dung thực
                padding: 2,
            }}
        >
            <Skeleton variant="rectangular" width={218} height={218} className="rounded-md" />
            <Box className="text-center mt-2 px-4" sx={{ width: "100%" }}>
                <Skeleton variant="text" height={32} />
                <Skeleton variant="text" height={24} width="60%" className="mx-auto" />
                <Skeleton variant="text" height={24} width="40%" className="mx-auto mt-1" />
            </Box>
        </Box>
    );
};
