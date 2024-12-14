import React, { ReactComponentElement, ReactNode } from 'react';

import {
  BuildingStorefrontIcon,
  ChartBarSquareIcon,
  InboxStackIcon,
  TagIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import Header from '../../components/Header';
import { Link, useRouteMatch } from 'react-router-dom';

interface IMainLayoutProps {
  children: ReactNode;
  title: string;
}

const MainLayout: React.FC<IMainLayoutProps> = (props) => {
  return (
    // <div className="space-x-30 flex w-full bg-gray-50">
    //   <div className="flex h-screen w-[400px] flex-col space-y-8 border-r border-r-gray-300 py-4 pt-4">
    //     <div className="flex-start flex h-[50px] border-b border-b-gray-300">
    //       <h1 className="curor-pointer ml-4 text-2xl font-bold text-gray-500">
    //         Market Floor Admin
    //       </h1>
    //     </div>
    //     <Link to="/home">
    //       <div className="flex cursor-pointer items-center space-x-3 px-4 py-4 hover:bg-gray-100">
    //         <ChartBarSquareIcon className="h-6 w-6 text-gray-500" />
    //         <p className="text-lg font-semibold text-gray-500">Tổng quan</p>
    //       </div>
    //     </Link>
    //     <Link to="/user-management">
    //       <div className="flex cursor-pointer items-center space-x-3 px-4 py-4 hover:bg-gray-100">
    //         <UserCircleIcon className="h-6 w-6 text-gray-500" />
    //         <p className="text-lg font-semibold text-gray-500">Quản lý người dùng</p>
    //       </div>
    //     </Link>
    //     <Link to="/category-management">
    //       <div className="flex cursor-pointer items-center space-x-3 px-4 py-4 hover:bg-gray-100">
    //         <TagIcon className="h-6 w-6 text-gray-500" />
    //         <p className="text-lg font-semibold text-gray-500">Quản lý danh mục</p>
    //       </div>
    //     </Link>
    //     <Link to="/products-management">
    //       <div className="flex cursor-pointer items-center space-x-3 px-4 py-4 hover:bg-gray-100">
    //         <InboxStackIcon className="h-6 w-6 text-gray-500" />
    //         <p className="text-lg font-semibold text-gray-500">Quản lý sản phẩm</p>
    //       </div>
    //     </Link>

    //     <Link to="/store-management">
    //       <div className="flex cursor-pointer items-center space-x-3 px-4 py-4 hover:bg-gray-100">
    //         <BuildingStorefrontIcon className="h-6 w-6 text-gray-500" />
    //         <p className="text-lg font-semibold text-gray-500">Quản lý cửa hàng</p>
    //       </div>
    //     </Link>
    //   </div>
    //   <div className="w-full">
    //     <Header title={props.title} />
    //     <div className="mt-10 px-5">{props.children}</div>
    //   </div>
    // </div>
    <div>abc</div>
  );
};

export default MainLayout;
