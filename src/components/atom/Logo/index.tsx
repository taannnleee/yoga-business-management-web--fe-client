import React from "react";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Logo: React.FC = () => {
  const route = useRouter();
  return (
    <Box
      onClick={() => route.replace("/home")}
      sx={{
        display: "flex",
        columnGap: "12px",
        alignItems: "center",
        cursor: "pointer",
      }}
    >
      <Image
        alt="/logo"
        src={require("@/assets/icons/logo.png")}
        style={{ width: 36, height: 36 }}
      />
      <Typography
        sx={{
          margin: 0,
          padding: 0,
          display: {
            xs: "none",
            md: "flex",
          },
        }}
        fontWeight="500"
        variant="h4"
        gutterBottom
      >
        The Yoga
      </Typography>
    </Box>
  );
};

export default Logo;
