import { TextField, Select, MenuItem, Box, OutlinedInput } from "@mui/material";
import React from "react";

interface ISearchBarProps {
  placeholder: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  category: string;
  onCategoryChange: (value: string) => void;
}

const SearchBar: React.FC<ISearchBarProps> = (props) => {
  const { onChange, category, onCategoryChange, onBlur, onFocus } = props;

  return (
    <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
      <TextField
        onBlur={() => onBlur?.()}
        onFocus={() => onFocus?.()}
        InputProps={{
          sx: { height: 40 },
          classes: {
            notchedOutline: "no-border",
          },
        }}
        placeholder={props.placeholder}
        fullWidth
        id="input"
        onChange={(e) => {
          onChange(e.target.value);
        }}
        sx={{
          backgroundColor: "#f6f7f9",
          borderRadius: "20px 0 0 20px",
          padding: "0px 16px",
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              border: "none",
            },
          },
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          "& .MuiInputLabel-root": {
            top: "-4px", // Adjust the label position if needed
          },
        }}
      />
    </Box>
  );
};

export default SearchBar;
