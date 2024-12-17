'use client'
import React, { useState, useEffect } from "react";
import { Grid, Card, CardContent, CardMedia, Typography, Button } from "@mui/material";

let token: string | null = null; // Khai báo rõ kiểu dữ liệu là string hoặc null

if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
    token = localStorage.getItem("accessToken");
}
// Define interfaces for the response data
import { API_URL } from "@/config/url";
interface Address {
    id: number;
    houseNumber: string;
    street: string;
    district: string;
    city: string;
    status: string;
    nameDelivery: string;
    phoneNumberDelivery: string;
}

interface User {
    id: number;
    username: string;
    email: string;
    fullname: string;
    phone: string;
    addresses: Address[];
}


// interface ProductVariant {
//     [key: string]: { [variant: string]: string };
// }

interface Product {
    id: number;
    imagePath: string;
    price: number;
    title: string;
    averageRating: number;
    brand: string;
    description: string;
    // variants: ProductVariant;
}

interface WishListItem {
    id: number;
    user: User;
    product: Product;
}


const WishList: React.FC = () => {
    const [wishlist, setWishlist] = useState<WishListItem[]>([]);

    // Fetch wishlist data on component mount
    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const response = await fetch(`${API_URL}/api/wishlist/get-wishlist-of-user`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const data = await response.json();
                console.log("kkkk")
                console.log(data.status)
                if (data.status === 200) {
                    setWishlist(data.data);
                    console.log("hihihi")
                    console.log(data.data)

                }
            } catch (error) {
                console.error("Error fetching wishlist:", error);
            }
        };

        fetchWishlist();
    }, []);

    // Function to remove item from wishlist
    const removeFromWishlist = async (id: number) => {
        try {
            const response = await fetch(`${API_URL}/api/wishlist/delete-wishlist-of-user/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.ok) {
                // Update wishlist after removal
                setWishlist(wishlist.filter((item) => item.id !== id));
                console.log("Item removed successfully from wishlist");
            } else {
                console.error("Failed to remove item from wishlist");
            }
        } catch (error) {
            console.error("Error removing item from wishlist:", error);
        }
    };

    return (
        <Grid container spacing={3}>
            {wishlist.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                    <Card>
                        <CardMedia
                            component="img"
                            height="200"
                            image={item.product.imagePath}
                            alt={item.product.title}
                        />
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                {item.product.title}
                            </Typography>
                            {/* <Typography variant="body2" color="textSecondary">
                                {item.product.description}
                            </Typography> */}
                            <Typography variant="body1" color="textPrimary">
                                Price: ${item.product.price.toFixed(2)}
                            </Typography>

                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => removeFromWishlist(item.id)}
                            >
                                Remove from Wishlist
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default WishList;
