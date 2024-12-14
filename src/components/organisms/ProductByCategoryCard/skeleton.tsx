import React from "react";
import { Box, Skeleton, Typography, Divider, Button } from "@mui/material";

export const ProductByCategoryCardSkeleton: React.FC = () => {
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
                            sx={{ textTransform: 'uppercase' }} // Sử dụng sx để áp dụng style
                        >
                            <Skeleton width="120px" />
                        </Typography>

                        <Box display="flex" alignItems="center" className="mx-auto justify-between gap-8">
                            <Skeleton width="80px" />
                            <Skeleton width="80px" />
                            <Skeleton width="80px" />
                        </Box>

                        <Button variant="contained" color="primary" className="ml-auto" disabled>
                            <Skeleton width="80px" />
                        </Button>
                    </Box>

                    <Divider className="my-2" />
                    <div className="flex justify-start items-start space-x-4">
                        <Box className="w-[240px] h-[634px] mt-[-2px]">
                            <Skeleton variant="rectangular" width={240} height={634} />
                        </Box>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-screen-lg">
                            {Array.from({ length: 8 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="relative flex flex-col items-center cursor-pointer overflow-hidden rounded-md shadow-lg"
                                >
                                    <Skeleton variant="rectangular" width={218} height={218} />
                                    <div className="product-hover absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300">
                                        <Skeleton variant="circular" width={40} height={40} />
                                        <Skeleton width="80%" height={30} />
                                    </div>
                                    <div className="text-center mt-2 px-4">
                                        <Skeleton width="80%" height={24} />
                                        <div className="mt-1">
                                            <Skeleton width="100px" />
                                        </div>
                                        <Skeleton width="50%" height={20} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Box>
            </div>
        </div>
    );
};

