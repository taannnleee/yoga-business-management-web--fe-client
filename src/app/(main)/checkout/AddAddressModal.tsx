import React, { useState } from "react";
import { Button, TextField, CircularProgress } from "@mui/material";
import { useToast } from "@/hooks/useToast";
import { API_URL } from "@/config/url";
interface Address {
    id?: string;
    phoneNumberDelivery: string;
    nameDelivery: string;
    status?: boolean;

    houseNumber: string;
    street: string;
    district: string;
    city: string;

}

interface AddAddressModalProps {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    fetchAddresses: () => void;  // Function to fetch the updated address list
}

let token: string | null = null; // Khai báo rõ kiểu dữ liệu là string hoặc null



const AddAddressModal: React.FC<AddAddressModalProps> = ({
    isModalOpen,
    setIsModalOpen,
    fetchAddresses,
}) => {
    const toast = useToast();
    const [formData, setFormData] = useState<Address>({
        nameDelivery: "",
        phoneNumberDelivery: "",
        houseNumber: "",
        street: "",
        district: "",
        city: "",
        status: false,
    });

    const [loading, setLoading] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCreateAddress = async () => {
        if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
            token = localStorage.getItem("accessToken");
            const newAddress = {
                houseNumber: formData.houseNumber,
                street: formData.street,
                district: formData.district,
                city: formData.city,
                status: "NORMAL",
                nameDelivery: formData.nameDelivery,
                phoneNumberDelivery: formData.phoneNumberDelivery,
            };
    
            setLoading(true);
            try {
                await fetch(`${API_URL}/api/address/create`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify(newAddress),
                });
                toast.sendToast("Success", "Thêm địa chỉ thành công");
                setIsModalOpen(false);  // Close the modal
    
            } catch (error) {
                console.error("Error creating address", error);
            } finally {
                setLoading(false);  // Reset loading state
            }
        }
        
        
    };

    const handleSubmit = () => {
        handleCreateAddress();  // Call API on submit
    };

    const handleModalClose = () => {
        setIsModalOpen(false);  // Close modal without adding
    };

    return (
        <div
            className={`fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50 ${isModalOpen ? "block" : "hidden"
                }`}
        >
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-lg font-semibold mb-4">Thêm địa chỉ mới</h3>
                <form className="space-y-4">
                    <TextField
                        label="Họ tên"
                        fullWidth
                        name="nameDelivery"
                        value={formData.nameDelivery}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Số điện thoại"
                        fullWidth
                        name="phoneNumberDelivery"
                        value={formData.phoneNumberDelivery}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Số nhà"
                        fullWidth
                        name="houseNumber"
                        value={formData.houseNumber}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Đường"
                        fullWidth
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Quận / Huyện"
                        fullWidth
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Tỉnh / Thành phố"
                        fullWidth
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                    />

                    <div className="flex justify-between mt-4">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            disabled={loading}  // Disable button when loading
                            startIcon={loading ? <CircularProgress size={20} /> : null}
                        >
                            {loading ? "Đang thêm..." : "Thêm"}
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleModalClose}
                            disabled={loading}  // Disable close button when loading
                        >
                            Hủy
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAddressModal;
