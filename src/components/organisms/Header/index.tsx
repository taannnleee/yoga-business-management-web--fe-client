'use client'
import NotificationsIcon from '@mui/icons-material/Notifications';
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Bars3Icon,
  ShoppingCartIcon,
  UserIcon,
  ChevronDownIcon
} from "@heroicons/react/24/solid";
import axios from "axios";
import SearchBar from "../../molecules/SearchBar";
import Logo from "@/components/atom/Logo";
import FulfillmentMangement from "../FulfillmentMangement";
import useDebounce from "@/hooks/useDebounce";
import Image from "next/image";
import LogoCourse from "../../atom/ButtonCourse";
import ButtonCourse from "../../atom/ButtonCourse";
import { useToast } from "@/hooks/useToast";
import CartButton from "@/components/molecules/CartButton";
import HoverDropdown from "@/components/molecules/HoverDropdown";
import { API_URL } from "@/config/url";
interface IHeaderV2Props { }

const HeaderV2: React.FC<IHeaderV2Props> = (props) => {
  const dropdownItems = ['Sản phẩm 1', 'Sản phẩm 2', 'Sản phẩm 3'];
  const router = useRouter();
  const toast = useToast();
  const [openLogin, setOpenLogin] = useState<boolean>(false);
  const [isGettingProductCategory, setIsGettingProductCategory] =
    useState<boolean>(false);
  const [displayMenu, setDisplayMenu] = useState<boolean>(false);
  const [openRegister, setOpenRegister] = useState<boolean>(false);
  const [openMobileDrawer, setOpenMobileDrawer] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>("");
  const debounceKeyword = useDebounce(keyword, 900);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [openSearchDropDown, setOpenSearchDropdown] = useState<boolean>(false);
  const clickInsideDropdown = useRef(false);
  // Handle the hover modal visibility
  const [isHovered, setIsHovered] = useState(false);
  // Check if the access token exists
  var accessToken = null;
  if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
    // Đảm bảo localStorage chỉ được sử dụng trong môi trường client-side
    accessToken = localStorage.getItem("accessToken");
  }


  // Hàm logout sẽ gọi API và xử lý đăng xuất
  const logout = async () => {
    if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
      // Đảm bảo localStorage chỉ được sử dụng trong môi trường client-side
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          return;
        }
        console.log("hehehe")

        // Gọi API logout sử dụng fetch
        const response = await fetch(`${API_URL}/api/auth/logout`, {
          method: 'POST', // Phương thức POST
          headers: {
            'Authorization': `Bearer ${token}`, // Gửi token xác thực trong header
            'Content-Type': 'application/json', // Đảm bảo body là JSON (mặc dù ở đây body rỗng)
          },
        });
        console.log("hehehe")
        console.log(response)

        // Kiểm tra nếu logout thành công
        if (response.ok) {
          // Xóa token khỏi localStorage
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          toast.sendToast("Success", "Đăng xuất thành công");

          // Điều hướng về trang chủ
          router.replace("/home");
        } else {
          // Xử lý trường hợp logout không thành công
          toast.sendToast("Error", "Đăng xuất thất bại, vui lòng thử lại.");
        }
      } catch (error) {
        // Xử lý lỗi trong quá trình gọi API
        console.error("Logout error", error);
        toast.sendToast("Error", "Đăng xuất thất bại, vui lòng thử lại.");
      }
    }

  };


  const modalContent = accessToken ? (
    <div className="space-y-2 w-28 bg-white p-4 shadow-lg rounded-lg transform translate-y-[-24px]">
      <p className="cursor-pointer w-full" onClick={() => router.push("/address")}>Địa chỉ</p>
      <p className="cursor-pointer" onClick={() => router.push("/order")}>Đơn hàng của bạn</p>
      <p className="cursor-pointer" onClick={() => router.push("/profile")}>Thông tin cá nhân</p>
      <p className="cursor-pointer" onClick={() => router.push("/wishlist")}>Sản phẩm yêu thích</p>
      <p
        className="cursor-pointer"
        onClick={logout}  // Using logout before it is declared
      >
        Đăng xuất
      </p>
    </div>
  ) : (
    <div className="space-y-2">
      <p className="cursor-pointer" onClick={() => router.replace("/login")}>
        Đăng nhập
      </p>
      <p className="cursor-pointer" onClick={() => router.replace("/create-account")}>
        Tạo tài khoản
      </p>
      <p className="cursor-pointer">Facebook</p>
      <p className="cursor-pointer">Google</p>
    </div>
  );



  const searchingByKeyword = async (keyword: string) => {
    try {
      const searchResponse = await axios.post(
        "http://localhost:4000/products/search",
        {
          keyword: keyword,
        }
      );

      if (searchResponse) {
        if (searchResponse?.data?.data?.length > 0) {
          setSearchResults(searchResponse?.data?.data);
        }
      }
    } catch (error) {
      console.log("searching error", error);
      setSearchResults([]);
    }
  };

  useEffect(() => {
    if (debounceKeyword?.length > 0) {
      searchingByKeyword(debounceKeyword);
    }
  }, [debounceKeyword]);

  const handleItemClick = (item: any) => {
    let splits = (item?.name as string)?.split(" ");
    let final = "";

    const prefix = splits?.map((key: any, index: number) => {
      if (index == splits?.length - 1) {
        final = final + `${key}`;
      } else {
        final = final + `${key}-`;
      }
    });

    router.push(`/product-detail/${final}-${item?.upc}`);
  };

  return (
    <>
      <div className="w-full shadow-lg pb-4  bg-white laptop:pb-0 border-b border-gray-200">
        <div className="w-full flex space-x-4  tablet:space-x-6 laptop:space-x-6 desktop:space-x-8 items-center px-4 py-4  justify-between laptop:justify-around">
          <div className="flex laptop:hidden  w-1/3 laptop:w-0">
            <button
              className="bg-gray-100 p-2 rounded-lg active:bg-gray-300"
              onClick={() => setOpenMobileDrawer(true)}
            >
              <Bars3Icon className="text-gray-500 font-bold w-5 h-5" />
            </button>
          </div>
          <Logo />
          <nav className="hidden laptop:flex space-x-6">
            <a href="/" className="text-gray-600 hover:text-orange-600">
              Trang chủ
            </a>
            <a href="/about" className="text-gray-600 hover:text-orange-600">
              Giới thiệu
            </a>

            {/* <HoverDropdown buttonText="Sản phẩm" items={dropdownItems} /> */}


            {/* Tư vấn dropdown */}
            <div className="relative group">
              <button className="text-black hover:text-orange-600 flex items-center relative">
                <span>Tư vấn</span>
                <ChevronDownIcon className="w-5 h-5 ml-1 text-black" />

                {/* Pseudo bridge */}
                <div className="absolute left-0 top-full w-full h-4 bg-transparent group-hover:block z-10"></div>
              </button>

              {/* Dropdown menu */}
              <div
                className="absolute left-[-75%] hidden w-40 mt-2 bg-white shadow-lg group-hover:block z-50 overflow-visible">
                <ul className="py-2">
                  <li
                    className="px-4 py-2 hover:bg-gray-200 hover:text-orange-600 hover:cursor-pointer"
                    onClick={() => router.push("/choose-mat")}
                  >
                    <span className="text-black hover:text-orange-600 text-sm">Chọn thảm yoga</span>
                  </li>
                  <li
                    onClick={() => router.push("/yoga-clothing")}
                    className="px-4 py-2 hover:bg-gray-200 hover:text-orange-600 hover:cursor-pointer">
                    <span className="text-black hover:text-orange-600 text-sm">Chọn quần áo yoga</span>
                  </li>
                  <li
                    onClick={() => router.push("/question")}
                    className="px-4 py-2 hover:bg-gray-200 hover:text-orange-600 hover:cursor-pointer">
                    <span className="text-black hover:text-orange-600 text-sm">Câu hỏi thường gặp - FAQ</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Tin tức dropdown */}
            <div className="relative group">
              <button className="text-black hover:text-orange-600 flex items-center relative">
                {/* <span>Tin tức</span> */}
                {/* <ChevronDownIcon className="w-5 h-5 ml-1 text-black" /> */}

                {/* Pseudo bridge */}
                <div className="absolute left-0 top-full w-full h-4 bg-transparent group-hover:block z-10"></div>
              </button>

              {/* Dropdown menu */}
              <div
                className="absolute left-[-75%] hidden w-40 mt-2 bg-white shadow-lg group-hover:block z-50 overflow-visible">
                <ul className="py-2">
                  <li className="px-4 py-2 hover:bg-gray-200 hover:text-orange-600 hover:cursor-pointer">
                    <span className="text-black hover:text-orange-600 text-sm">Khuyến mãi</span>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-200 hover:text-orange-600 hover:cursor-pointer">
                    <span className="text-black hover:text-orange-600 text-sm">Yoga và Thiền</span>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-200 hover:text-orange-600 hover:cursor-pointer">
                    <span className="text-black hover:text-orange-600 text-sm">Ebook yoga</span>
                  </li>
                </ul>
              </div>
            </div>

            <ButtonCourse className={"mt-[-12px]"} />
          </nav>
          <div>
            <NotificationsIcon onClick={() => router.push("/notification")} style={{ fontSize: '30px' }} />
          </div>

          <div className="flex w-1/3 laptop:hidden laptop:w-0 flex-row-reverse">
            {false ? null : (
              <div className="flex flex-row-reverse laptop:hidden  w-1/3 laptop:w-0">
                <FulfillmentMangement />
              </div>
            )}
          </div>

          <div className="hidden laptop:flex">
            <div className="hidden laptop:flex flex-end space-x-1 items-center justify-between w-64">

              <FulfillmentMangement />
              <div
                className="relative"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <button
                  className="rounded-xl px-4 py-2 text-center text-gray-600 text-sm w-fit flex space-x-1 items-center hover:bg-gray-100"
                >
                  <UserIcon className="w-8 h-8 text-gray-600" />
                </button>

                {/* Hover modal */}
                {isHovered && (
                  <div className="absolute left-0 top-full mt-2 bg-white p-4 shadow-lg z-50">
                    {modalContent}
                  </div>
                )}
              </div>
              <CartButton />
            </div>

          </div>

        </div>
        {/*<div className="flex laptop:hidden px-2">*/}
        {/*  <SearchBar*/}
        {/*    placeholder="Search for anything, any words"*/}
        {/*    onChange={() => {*/}
        {/*    }}*/}
        {/*    onCategoryChange={() => {*/}
        {/*    }}*/}
        {/*    category=""*/}
        {/*  />*/}
        {/*</div>*/}
      </div>
    </>
  );
};

export default HeaderV2;
