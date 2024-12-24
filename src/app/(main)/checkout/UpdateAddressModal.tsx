import React, { useState, useEffect } from "react";
import { Button, CircularProgress, TextField } from "@mui/material";
import { useToast } from "@/hooks/useToast";
import { API_URL } from "@/config/url";
interface Address {
    id: string;
    phoneNumberDelivery: string;
    nameDelivery: string;
    status?: boolean;

    houseNumber: string;
    street: string;
    district: string;
    city: string;
}

interface UpdateAddressModalProps {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedAddress: Address;
    fetchAddresses: () => Promise<void>;
    fetchDefaultAddress: () => Promise<void>;
}

let token: string | null = null; // Khai báo rõ kiểu dữ liệu là string hoặc null



const UpdateAddressModal: React.FC<UpdateAddressModalProps> = ({
    isModalOpen,
    setIsModalOpen,
    selectedAddress,
    fetchAddresses,
    fetchDefaultAddress,
}) => {
    const toast = useToast();
    const [formData, setFormData] = useState<Address>(selectedAddress);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setFormData(selectedAddress); // Update form data when selectedAddress changes
    }, [selectedAddress]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleUpdateAddress = async () => {
        if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
            token = localStorage.getItem("accessToken");
            setLoading(true); // Set loading to true at the start of the API call


            const updatedAddress = {
                houseNumber: formData.houseNumber,
                street: formData.street,
                district: formData.district,
                city: formData.city,
                nameDelivery: formData.nameDelivery,
                phoneNumberDelivery: formData.phoneNumberDelivery,
                status: formData.status ? "DEFAULT" : "NORMAL",
            };

            try {
                const response = await fetch(`${API_URL}/api/address/update/${formData.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify(updatedAddress),
                });

                if (response.ok) {

                    toast.sendToast("Success", "Cập nhật địa chỉ thành công");
                    fetchDefaultAddress
                    fetchAddresses();
                    setIsModalOpen(false);
                } else {
                    toast.sendToast("Error", "Cập nhật địa chỉ thất bại", "error");
                }
            } catch (error) {
                console.error("Error updating address", error);
            } finally {
                setLoading(false); // Set loading to false after the API call completes
            }
        }

    };

    return (
        <div
            className={`fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50 ${isModalOpen ? "block" : "hidden"
                }`}
        >
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-lg font-semibold mb-4">Cập nhật địa chỉ</h3>
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
                        label="Quận/Huyện"
                        fullWidth
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Tỉnh/Thành phố"
                        fullWidth
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                    />
                </form>
                <div className="mt-4 flex justify-between">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpdateAddress}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Cập nhật"}
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => setIsModalOpen(false)}
                        disabled={loading}
                    >
                        Hủy
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default UpdateAddressModal;
