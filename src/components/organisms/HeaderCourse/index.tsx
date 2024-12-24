"use client";

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
import LogoCourse from "@/components/atom/LogoCourse";
import ButtonShop from "@/components/atom/ButtonShop";
interface IHeaderV2Props {}

const HeaderV2Course: React.FC<IHeaderV2Props> = (props) => {
  const router = useRouter();

  //state
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
            <LogoCourse />
            <nav className="hidden laptop:flex space-x-6">
              <a href="/" className="text-gray-600 hover:text-orange-600">
                Nhận ưu đãi
              </a>
              <a href="/about" className="text-gray-600 hover:text-orange-600">
                Kích hoạt thẻ
              </a>
              <a href="/about" className="text-gray-600 hover:text-orange-600">
                Khám phá
              </a>
              <a href="/about" className="text-gray-600 hover:text-orange-600">
                Luyện tập
              </a>
              <ButtonShop className={"mt-[-14px]"}/>
            </nav>


            <div className="hidden laptop:flex">
              <div className="hidden laptop:flex flex-end space-x-1 items-center justify-between w-64">

                <button
                    className="rounded-xl px-4 py-2 text-center text-gray-600 text-sm w-fit flex space-x-1 items-center hover:bg-gray-100"
                    onClick={() => router.replace("/login")}
                >
                  <UserIcon className="w-8 h-8 text-gray-600"/>
                </button>
              </div>
            </div>
          </div>

        </div>
      </>
  );
};

export default HeaderV2Course;
