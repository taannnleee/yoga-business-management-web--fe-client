"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { Snackbar, Alert, AlertColor } from "@mui/material";

interface ToastContextType {
  sendToast: (title: string, message: string, type?: AlertColor) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<AlertColor>("success");

  const sendToast = useCallback(
    (title: string, message: string, type?: AlertColor) => {
      setTitle(title);
      setMessage(message);
      setOpen(true);
      setType(type || "success");
    },
    []
  );

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ToastContext.Provider value={{ sendToast }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ zIndex: 10000 }}
      >
        <Alert onClose={handleClose} severity={type} sx={{ width: "100%" }}>
          <strong>{title}</strong> - {message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};
