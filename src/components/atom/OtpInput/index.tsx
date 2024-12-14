'use client';
import {
  ChangeEvent,
  DetailedHTMLProps,
  InputHTMLAttributes,
  useState,
} from "react";
import { Control, Controller } from "react-hook-form";
import { TextField } from "@mui/material";

interface IInputProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  name: string;
  className?: string;
  label?: string | null;
  isRequired?: boolean;
  control: Control;
  onChangeValue?: (value: string) => void;
}

const OTPInput: React.FC<IInputProps> = (props) => {
  const {
    name,
    className,
    label = null,
    isRequired,
    control,
    onChangeValue,
  } = props;

  // Di chuyển useState ra ngoài render của Controller
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (/^\d$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      onChangeValue?.(newOtp.join(""));

      // Cập nhật giá trị cho `onChange` của react-hook-form
      // (Để sử dụng trong form validation)
      // if (onChange) onChange(newOtp.join(""));

      if (value !== "" && index < otp.length - 1) {
        const nextInput = document.getElementById(
          `otp-input-${index + 1}`
        );
        nextInput?.focus();
      }
    }
  };

  const handleFocus = (index: number) => {
    const nextInput = document.getElementById(`otp-input-${index}`);
    nextInput?.focus();
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && otp[index] === "") {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ formState: { errors }, field: { value, onChange } }) => (
        <div className="flex gap-2">
          {otp.map((digit, index) => (
            <TextField
              key={index}
              id={`otp-input-${index}`}
              value={digit}
              onChange={(e: any) => handleChange(e, index)}
              onFocus={() => handleFocus(index)}
              onKeyDown={(e: any) => handleKeyDown(e, index)}
              inputProps={{ maxLength: 1, style: { textAlign: "center" } }}
              sx={{ width: 1 / 6, height: 44, borderRadius: "8px" }}
            />
          ))}
        </div>
      )}
    />
  );
};

export default OTPInput;
