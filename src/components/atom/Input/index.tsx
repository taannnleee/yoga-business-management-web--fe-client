import React from "react";
import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";

interface InputProps {
  control: any;
  name: string;
  label: string;
  placeholder: string;
  mode?: string;
  rules?: any;
}

const Input: React.FC<InputProps> = ({
  control,
  name,
  label,
  placeholder,
  mode = "text",
  rules,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <div className="flex flex-col gap-y-4">
          <TextField
            InputProps={{ sx: { height: 44, borderRadius: "8px" } }}
            type={mode}
            placeholder={placeholder}
            fullWidth
            value={value}
            label={label}
            id="input"
            onChange={(e) => onChange(e.target.value)}
            error={!!error}
            sx={{
              borderRadius: "8px",
              "& .MuiInputLabel-root": {
                top: "-4px", // Adjust the label position if needed
              },
            }}
          />
          {error && (
            <FormHelperText sx={{ marginTop: -1 }} error>
              {error.message}
            </FormHelperText>
          )}
        </div>
      )}
    />
  );
};

export default Input;
