'use client'
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { format } from "date-fns";
import { apiURL } from "../../config/constanst";

interface DailyRevenueChartProps {
    selectedDate: Date;
}

const DailyRevenueChart: React.FC<DailyRevenueChartProps> = ({ selectedDate }) => {
    const [totalPriceForDay, setTotalPriceForDay] = useState(0);
    const [loading, setLoading] = useState(false);
    const accessToken = localStorage.getItem('accessToken');

    // Fetch daily revenue data from the API
    const fetchOrdersByDate = async (date: string) => {
        setLoading(true);

        try {
            const response = await fetch(`${apiURL}/api/admin/get-daily-revenue?updatedAt=${date}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }

            const data = await response.json();

            if (data?.data?.length > 0) {
                const totalPriceForDay = data.data.reduce((acc: number, item: any) => acc + item.totalPrice, 0);
                setTotalPriceForDay(totalPriceForDay);
            } else {
                setTotalPriceForDay(0);
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrdersByDate(format(selectedDate, 'yyyy-MM-dd'));
    }, [selectedDate]);

    return (
        <div className="bg-white px-10 py-5 rounded-xl shadow-lg drop-shadow-md w-full">

            <Chart
                options={{
                    chart: {
                        id: "daily-revenue",
                    },
                    xaxis: {
                        categories: ["Doanh thu"],
                    },
                    title: {
                        text: "Doanh thu ngày",
                    },
                }}
                series={[{
                    name: "Doanh thu",
                    data: [totalPriceForDay],
                }]}
                type="bar"
                height="300"
                width={700}
            />
        </div>
    );
};

export default DailyRevenueChart;
