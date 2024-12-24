import React, { useState, useEffect } from "react";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Button, Skeleton } from "@mui/material";
import AddAddressModal from './AddAddressModal';
import MyListAddressModal from "@/app/(main)/checkout/MyListAddressModal";
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

let accessToken: string | null = null; // Khai báo rõ kiểu dữ liệu là string hoặc null



interface AddressSelectionProps {
    loading: boolean;
    addressId: string;
    setSelectedAddressId: React.Dispatch<React.SetStateAction<string>>;

    setIsAddressValid: (isValid: boolean) => void;



}

const AddressSelection: React.FC<AddressSelectionProps> = ({
    loading,
    addressId,
    setSelectedAddressId,
    setIsAddressValid
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isListModalOpen, setIsListModalOpen] = useState(false);
    const [shippingInfo, setShippingInfoState] = useState<Address | null>(null);



    const validateAddress = (address: Address) => {
        if (
            address &&
            address.street && address.street !== "" &&
            address.district && address.district !== "" &&
            address.city && address.city !== "" &&
            address.nameDelivery && address.nameDelivery !== "" &&
            address.phoneNumberDelivery && address.phoneNumberDelivery !== ""
        ) {
            setIsAddressValid(true); // All fields are valid

        } else {
            setIsAddressValid(false); // One or more fields are empty

        }
    };


    const openAddModal = () => {
        setIsModalOpen(true);
        setIsListModalOpen(false);
    };

    const openListModal = () => {
        setIsListModalOpen(true);
        setIsModalOpen(false);
    };

    const closeModal = () => setIsModalOpen(false);

    const handleAddressSelect = (address: Address) => {

        setShippingInfoState({
            id: address.id,
            houseNumber: address.houseNumber,
            street: address.street,
            district: address.district,
            city: address.city,
            nameDelivery: address.nameDelivery || "",  // Gán giá trị mặc định nếu cần
            phoneNumberDelivery: address.phoneNumberDelivery || "",  // Gán giá trị mặc định nếu cần
            status: address.status || false,  // Gán giá trị mặc định nếu cần
        });

        setSelectedAddressId(address.id);

        setIsListModalOpen(false);
        validateAddress(address);
    };
    const fetchDefaultAddress = async () => {
        try {

            if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
                accessToken = localStorage.getItem("accessToken");
                // Get token from localStorage
                if (!accessToken) {
                    console.error("No access token found.");
                    return;
                }

                const response = await fetch(`${API_URL}/api/user/get-user-address-default`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`, // Pass the token in the Authorization header
                        "Content-Type": "application/json"
                    }
                });

                const data = await response.json();
                if (data.status === 200) {
                    const { id, houseNumber, street, district, city, nameDelivery, phoneNumberDelivery } = data.data;

                    const address: Address = {
                        id,
                        houseNumber,
                        street,
                        district,
                        city,
                        nameDelivery,
                        phoneNumberDelivery
                    };

                    // Set shipping info state
                    setShippingInfoState(address);

                    // Set selected address ID
                    setSelectedAddressId(id);

                    // Validate the address after setting the shipping info
                    validateAddress(address);
                } else {
                    console.error("Failed to fetch address:", data.message);
                }
            }

        } catch (error) {
            console.error("Error fetching address:", error);
        }
    };
    // Fetch the default address when component mounts
    useEffect(() => {
        fetchDefaultAddress();
    }, []);

    return (
        <div className="p-5 bg-gray-300 rounded-lg shadow-md">
            <div className="flex">
                <LocationOnIcon className="text-2xl text-red-500" />
                <h2 className="text-xl font-bold mb-4 mx-2 text-orange-600">Địa chỉ nhận hàng</h2>
            </div>

            {loading || !shippingInfo ? (
                <div className="space-y-2">
                    <Skeleton variant="text" width="60%" height={30} />
                    <Skeleton variant="text" width="80%" height={20} />
                    <Skeleton variant="rectangular" width="100%" height={60} />
                </div>
            ) : (
                <div>
                    <div className="flex items-center justify-between w-full">
                        <p className="font-bold">
                            Họ và tên: {shippingInfo.nameDelivery} - Số điện thoại  {shippingInfo.phoneNumberDelivery}
                        </p>
                        {shippingInfo.houseNumber && (
                            <p className="border border-solid border-[#ee4d2d] rounded-[1px] text-[#ee4d2d] text-[10px] leading-[12px] mt-0 mb-0 ml-[15px] px-[5px] py-[2px] capitalize text-sm font-semibold text-right">
                                Mặc định
                            </p>
                        )}
                    </div>
                    <p>
                        Tỉnh: {shippingInfo.city}, Huyện: {shippingInfo.district}, Đường: {shippingInfo.street}, Số nhà: {shippingInfo.houseNumber}

                    </p>
                </div>

            )}

            <button
                onClick={openListModal}
                className="mt-4 px-4 py-2 border rounded-md hover:bg-gray-200 bg-gray-500"
            >
                Chọn địa chỉ
            </button>

            {isModalOpen && <AddAddressModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                fetchAddresses={fetchDefaultAddress}
            />}

            {isListModalOpen && (
                <MyListAddressModal
                    isModalOpen={isListModalOpen}
                    closeModal={() => setIsListModalOpen(false)}
                    onAddressSelect={handleAddressSelect}
                    openAddAddressModal={openAddModal}
                    fetchDefaultAddress={fetchDefaultAddress}
                />
            )}
        </div>
    );
};

export default AddressSelection;
