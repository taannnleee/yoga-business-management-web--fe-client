'use client'
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { format } from "date-fns";
import MainLayout from "../../components/SIdeBar";
import useWindowDimensions from "../../hooks/useWindowDimension";
import axios from "axios";
import { apiURL } from "../../config/constanst";
import { useAppSelector } from "../../hooks/useRedux";
import { IRootState } from "../../redux";
import RevenueIcon from "../../assets/images/RevenueIcon.png";
import GiveMoneyIcon from "../../assets/images/GiveMoneyIcon.png";
import RevenueOnEveryBid from "../../assets/images/RevenueOnBid.png";
import CreateFeeRevenue from "../../assets/images/CreateFeeRevenue.png";
import DailyRevenueChart from "./DailyRevenueChart";

interface ProductWithCategory {
  id: string;
  name: string;
  urlImage: string;
  quantity: string;
}

export default function DashBoard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalPriceForDay, setTotalPriceForDay] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [theProdcutOfStore, setTheProductOfStore] = useState<ProductWithCategory[]>([]);

  const [monthlyRevenueData, setMonthlyRevenueData] = useState<number[]>([]);
  const accessToken = localStorage.getItem('accessToken');

  // Fetch product data from the API
  const fetchTheProductOfStore = async () => {
    setLoading(true);
    setError(null);  // Reset error state before fetching

    try {
      const response = await fetch(`${apiURL}/api/admin/get-all-category-and-quantity-product`, {
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
      setTheProductOfStore(data.data); // Update the products list

      // Update the barState
      const categories = data.data.map((item: ProductWithCategory) => item.name);
      const quantities = data.data.map((item: ProductWithCategory) => parseInt(item.quantity));  // Convert quantity to number

      setBarState(prevState => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            categories, // Update categories from the response data
          },
        },
        series: [
          {
            name: "Số lượng",
            data: quantities, // Update data with product quantities
          },
        ],
      }));

    } catch (error) {

      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch product data from the API
  const fetchStoreRevenueByMonth = async () => {
    setLoading(true);
    setError(null);  // Reset error state before fetching

    try {
      const response = await fetch(`${apiURL}/api/admin/get-month-revenue`, {
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
      console.log("tanne");
      console.log(data.data);
      setTheProductOfStore(data.data);

      const revenuePerMonth = data.data.map((monthData: any) => {
        return monthData.reduce((sum: number, order: any) => sum + order.totalPrice, 0);
      });
      console.log(revenuePerMonth);
      setMonthlyRevenueData(revenuePerMonth);

      setLineState(prevState => ({
        ...prevState,
        series: [
          {
            name: "Doanh thu",
            data: revenuePerMonth,  // Cập nhật dữ liệu của biểu đồ
          },
        ],
      }));
    } catch (error) {

      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheProductOfStore();
    fetchStoreRevenueByMonth();
  }, []);


  // Handle date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setSelectedDate(new Date(newDate));
  };

  const [lineState, setLineState] = useState({
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: [
          "Tháng 1",
          "Tháng 2",
          "Tháng 3",
          "Tháng 4",
          "Tháng 5",
          "Tháng 6",
          "Tháng 7",
          "Tháng 8",
          "Tháng 9",
          "Tháng 10",
          "Tháng 11",
          "Tháng 12",
        ],
      },
    },
    series: [
      {
        name: "Doanh thu",
        data: monthlyRevenueData,


        // monthlyRevenueData,
      },
    ],
  });

  const [barState, setBarState] = useState({
    options: {
      chart: {
        id: "basic-line",
      },
      xaxis: {
        categories: [], // Initially empty, will be updated after fetching data
      },
    },
    series: [
      {
        name: "Số lượng",
        data: [], // Initially empty, will be updated after fetching data
      },
    ],
  });

  const [pieState, setPieState] = useState({
    series: [44, 55, 13, 43, 22, 20, 30, 11],
    options: {
      chart: {
        width: 380,
        type: "pie",
      },
      labels: ["Chiếu khấu sản phẩm", "Phí đăng sản phẩm"],
      theme: {
        monochrome: {
          enabled: true,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  });

  return (
    <MainLayout
      title="Tổng quan thông tin của sàn"
      content={
        <div className="flex flex-col gap-y-10 px-10">
          <div className="bg-white px-10 py-5 rounded-xl shadow-lg drop-shadow-md w-full">
            <p className="text-center text-2xl text-gray-500 font-bold mb-4">
              Doanh thu của cửa hàng theo tháng (2024)
            </p>
            <Chart
              options={lineState.options}
              series={lineState.series}
              type="line"
              width="99%"
              height="280"
            />
            <p className="text-center text-xl text-gray-500 font-bold">
              Số lượng sản phẩm đang có trên sàn theo từng danh mục
            </p>
            <Chart
              options={barState.options}
              series={barState.series}
              type="bar"
              height="300"
            />
          </div>
          {/* New daily revenue chart */}
          <div className="bg-white px-10 py-5 rounded-xl shadow-lg drop-shadow-md w-full">
            <p className="text-center text-2xl text-gray-500 font-bold mb-4">
              Doanh thu ngày: {format(selectedDate, "dd/MM/yyyy")}
            </p>
            <div className="flex justify-between items-center">
              <input
                type="date"
                value={format(selectedDate, "yyyy-MM-dd")}
                onChange={handleDateChange}
                className="border p-2 rounded-lg"
              />
            </div>
            <DailyRevenueChart selectedDate={selectedDate} />
          </div>
        </div>
      }
    />
  );
}
