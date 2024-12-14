import React from "react";
import { Typography, Button } from "@mui/material";
import Image from "next/image";

const CustomerBenefits = () => {
    return (
        <div className="w-full bg-gray-100 p-6 rounded-md shadow-md">
            <div className="space-y-4">
                <div className="flex items-center space-x-4">
                    <Image
                        src="https://bizweb.dktcdn.net/100/262/937/themes/813962/assets/policy_pro_1.svg?1730181507139"
                        alt="Ship COD"
                        width={45}
                        height={45}
                    />
                    <div>
                        <Typography variant="body1" className="font-bold text-black">
                            Ship COD toàn quốc
                        </Typography>
                        <Typography variant="body2" className="text-gray-600">
                            Đồng giá 30K - Miễn phí cho ĐH trên 600K & Tặng móc khóa OM
                        </Typography>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <Image
                        src="https://bizweb.dktcdn.net/100/262/937/themes/813962/assets/policy_pro_2.svg?1730181507139"
                        alt="Loyalty Points"
                        width={45}
                        height={45}
                    />
                    <div>
                        <Typography variant="body1" className="font-bold text-black">
                            Tích điểm lớn
                        </Typography>
                        <Typography variant="body2" className="text-gray-600">
                            Lên đến 5% giá trị đơn hàng, giảm trừ vào đơn hàng tiếp theo
                        </Typography>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <Image
                        src="https://bizweb.dktcdn.net/100/262/937/themes/813962/assets/policy_pro_3.svg?1730181507139"
                        alt="Sale Offer"
                        width={45}
                        height={45}
                    />
                    <div>
                        <Typography variant="body1" className="font-bold text-black">
                            Sale OFF up to 50%
                        </Typography>
                        <Typography variant="body2" className="text-gray-600">
                            Đừng bỏ lỡ! Xem ngay các SP đang sale
                        </Typography>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <Image
                        src="https://bizweb.dktcdn.net/100/262/937/themes/813962/assets/policy_pro_4.svg?1730181507139"
                        alt="Hotline"
                        width={45}
                        height={45}
                    />
                    <div>
                        <Typography variant="body1" className="font-bold text-black">
                            Hotline
                        </Typography>
                        <Typography variant="body2" className="text-gray-600">
                            0916339781
                        </Typography>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerBenefits;
