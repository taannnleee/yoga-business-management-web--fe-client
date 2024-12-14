import React from "react";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ButtonShop: React.FC<{ className?: string }> = ({ className }) => {
    const route = useRouter();

    return (
        <Box
            onClick={() => route.replace("/home")}
            className={className}  // Allow custom className for additional styling
            sx={{
                display: "flex",
                columnGap: "12px",
                alignItems: "center",
                cursor: "pointer",
                backgroundColor: "#F3F3E0", // Blue background color
                padding: "4px",
                borderRadius: "8px",
            }}
        >
            <Typography
                sx={{
                    margin: 0,
                    padding: 0,
                    display: {
                        xs: "none",
                        md: "flex",
                    },
                }}
                fontWeight="400"
                variant="h6"
                gutterBottom
                color="textSecondary"
            >
                Mua sắm
            </Typography>
            <Image
                alt="Demo Icon"
                src={require("@/assets/icons/logo_shop.png")}
                width={94}
                height={94}
            />
        </Box>
    );
};

export default ButtonShop;
