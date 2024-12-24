"use client";
import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText } from "@mui/material";
import { API_URL } from "@/config/url";
import { useToast } from "@/hooks/useToast";

interface IPromotion {
    id: string;
    code: string;
    discount: number;
    discountType: string;
    startDate: string;
    expiryDate: string;
}

interface PromotionSelectionProps {
    totalPrice: number; // Total price of the order
    setTotalPricePromotion: React.Dispatch<React.SetStateAction<number>>;
    setSelectedPromotion: React.Dispatch<React.SetStateAction<IPromotion | null>>; // Set selected promotion from parent
}

let token: string | null = null; // Khai báo rõ kiểu dữ liệu là string hoặc null



const PromotionSelection: React.FC<PromotionSelectionProps> = ({ totalPrice, setTotalPricePromotion, setSelectedPromotion }) => {
    const [promotions, setPromotions] = useState<IPromotion[]>([]);
    const [loadingPromotions, setLoadingPromotions] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false); // Track the dialog open state
    const toast = useToast();

    // Fetch promotions from the API
    const fetchPromotions = async () => {
        if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
            token = localStorage.getItem("accessToken");
            try {
                const response = await fetch(`${API_URL}/api/promotion/get-four-big-promotion`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                });

                if (!response.ok) throw new Error("Failed to fetch promotions");

                const data = await response.json();
                setPromotions(data.data);

                // Set the first promotion as default when the component loads
                setSelectedPromotion(data.data[0]);
                handleSelectPromotion(data.data[0]);
            } catch (err: any) {
                console.error("Error fetching promotions:", err.message);
                setError(err.message);
                toast.sendToast("Error", "Error fetching promotions", "error");
            } finally {
                setLoadingPromotions(false);
            }
        }

    };

    // Call fetch promotions once when the component mounts
    useEffect(() => {
        fetchPromotions();
    }, []);

    // Handle promotion selection and apply the discount
    const handleSelectPromotion = (promo: IPromotion) => {
        const discountedPrice = totalPrice - (totalPrice * promo.discount) / 100;
        setTotalPricePromotion(discountedPrice);
        setSelectedPromotion(promo); // Return the selected promotion to the parent component
        setIsDialogOpen(false); // Close the dialog after selection
    };

    // Open the promotions dialog
    const handleOpenDialog = () => {
        setIsDialogOpen(true);
    };

    // Close the promotions dialog
    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

    return (
        <Box sx={{ padding: "20px", marginBottom: "20px" }}>
            {/* Display loading or error states */}
            {loadingPromotions ? (
                <CircularProgress size={24} color="inherit" />
            ) : error ? (
                <Typography>Error: {error}</Typography>
            ) : promotions.length > 0 ? (
                <Button onClick={handleOpenDialog} variant="contained" color="primary">
                    Xem mã giảm giá
                </Button>
            ) : (
                <Typography>No promotions available</Typography>
            )}

            {/* Dialog to show the list of promotions */}
            <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
                <DialogContent>
                    <DialogContentText>Select a promotion to apply to your order:</DialogContentText>
                    <Box>
                        {promotions.map((promo) => (
                            <Paper key={promo.code} sx={{ padding: "10px", marginBottom: "10px", cursor: "pointer" }} onClick={() => handleSelectPromotion(promo)}>
                                <Typography variant="body1">{promo.code}</Typography>
                                <Typography variant="body2">Discount: {promo.discount}%</Typography>
                                <Typography variant="body2">Valid: {promo.startDate} - {promo.expiryDate}</Typography>
                            </Paper>
                        ))}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PromotionSelection;
