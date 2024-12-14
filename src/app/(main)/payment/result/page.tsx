'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Button from "@/components/atom/Button";
import { API_URL } from "@/config/url";
const PaymentResult = () => {
    const searchParams = useSearchParams();
    const status = searchParams.get('status');
    const transactionId = searchParams.get('transactionId');
    const addressId = searchParams.get('addressId');
    const paymentMethod = searchParams.get('paymentMethod');
    const vnp_Amount = searchParams.get('vnp_Amount');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isOrderCreated, setIsOrderCreated] = useState(false); // Guard variable

    const createOrder = async () => {
        if (isOrderCreated) return; // Prevent duplicate calls
        setIsOrderCreated(true); // Set flag to true

        const token = localStorage.getItem("accessToken");
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/order/create-order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    addressId: addressId,
                    paymentMethod: paymentMethod,
                }),
            });

            if (!response.ok) throw new Error("Failed to create order");

            const data = await response.json();
            console.log("Order created successfully:", data);
        } catch (error:any) {
            console.error("Error creating order:", error.message);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (status === 'success') {
            createOrder();
        }
    }, [status]);

    return (
        <div className="max-w-2xl mx-auto p-6 border rounded-lg shadow-lg">
            <h2 className={`text-2xl font-semibold mb-4 ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {status === 'success' ? 'Giao dịch được thực hiện thành công' : 'Giao dịch thất bại'}
            </h2>
            {status === 'success' && (
                <p className="mb-6">Cảm ơn quý khách đã sử dụng dịch vụ.</p>
            )}

            <table className="min-w-full table-auto border-collapse">
                <tbody>
                <tr className="border-b">
                    <td className="px-4 py-2 font-medium">Merchant ID</td>
                    <td className="px-4 py-2">CTTVNP01</td>
                </tr>
                <tr className="border-b">
                    <td className="px-4 py-2 font-medium">Merchant Name</td>
                    <td className="px-4 py-2">VNPAY Demo</td>
                </tr>
                <tr className="border-b">
                    <td className="px-4 py-2 font-medium">Merchant Transaction Reference</td>
                    <td className="px-4 py-2">{transactionId}</td>
                </tr>
                <tr className="border-b">
                    <td className="px-4 py-2 font-medium">Transaction Info</td>
                    <td className="px-4 py-2">Thanh toán đơn hàng thời gian: {new Date().toLocaleString()}</td>
                </tr>
                <tr className="border-b">
                    <td className="px-4 py-2 font-medium">Amount</td>
                    <td className="px-4 py-2">{vnp_Amount}</td>
                </tr>
                <tr className="border-b">
                    <td className="px-4 py-2 font-medium">Currency</td>
                    <td className="px-4 py-2">VND</td>
                </tr>
                <tr className="border-b">
                    <td className="px-4 py-2 font-medium">Transaction Response Code</td>
                    <td className="px-4 py-2">00</td>
                </tr>
                <tr className="border-b">
                    <td className="px-4 py-2 font-medium">Message</td>
                    <td className="px-4 py-2">Giao dịch được thực hiện thành công. Cảm ơn quý khách đã sử dụng dịch vụ</td>
                </tr>
                <tr className="border-b">
                    <td className="px-4 py-2 font-medium">Transaction Number</td>
                    <td className="px-4 py-2">{transactionId}</td>
                </tr>
                <tr className="border-b">
                    <td className="px-4 py-2 font-medium">Bank</td>
                    <td className="px-4 py-2">NCB</td>
                </tr>
                </tbody>
            </table>

            {/* Render different buttons based on status */}
            {status === 'success' ? (
                <Button>
                    <a href="/status-order">Tiếp tục</a>
                </Button>
            ) : (
                <div className="flex space-x-4">
                    <Button className={"bg-red-500 text-white"}>

                        <a href="/checkout">Thử lại</a>
                    </Button>
                    <Button>
                        <a href="/home">Trở về Trang chủ</a>
                    </Button>
                </div>
            )}

            {loading && <p className="mt-4 text-blue-500">Đang xử lý...</p>}
            {error && <p className="mt-4 text-red-500">{error}</p>}
        </div>
    );
};

export default PaymentResult;
