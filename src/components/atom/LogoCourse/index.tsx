import React from "react";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";

const LogoCourse: React.FC = () => {
    const route = useRouter();

    return (
        <Box
            onClick={() => route.replace("/course")}
            sx={{
                display: "flex",
                columnGap: "12px",
                alignItems: "center",
                cursor: "pointer",
            }}
        >
            <Image
                alt="logo"
                src={require("@/assets/icons/logo_course.png")}
                style={{ width: 36, height: 36 }}
            />
            <Box
                sx={{
                    display: {
                        xs: "none",
                        md: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                    },
                    fontWeight: 500,
                }}
            >
                <Typography variant="h4" component="span" sx={{ lineHeight: 1.2 }}>
                    Course
                </Typography>
                <Typography variant="body2" component="span" color="textSecondary">
                    Everything free
                </Typography>
            </Box>
        </Box>
    );
};

export default LogoCourse;
