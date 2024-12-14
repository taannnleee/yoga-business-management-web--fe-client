import React from 'react';

interface IFooterSectionProps {}

const FooterSection: React.FC<IFooterSectionProps> = (props) => {
  return (
    <div className="mt-40 h-fit bg-gray-50 px-8 py-10 laptop:mt-20 laptop:px-28">
      <div className="space-y-5">
        <div>
          <h2 className="text-left text-3xl font-bold text-gray-500">Yoga Admin</h2>
          <p className="text-left text-lg font-normal text-gray-500">
            2024 - Designed and Developed by QT Group - All rights reserve
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-10 gap-y-10 tablet:grid-cols-2 laptop:grid-cols-6">
          <div className="space-y-2">
            <p className="cursor-pointer text-left text-sm font-normal text-gray-400 hover:text-gray-700">
              Điều khoản
            </p>
            <p className="cursor-pointer text-left text-sm font-normal text-gray-400 hover:text-gray-700">
              Chính sách bảo mật
            </p>
            <p className="cursor-pointer text-left text-sm font-normal text-gray-400 hover:text-gray-700">
              Trần Quốc Siêu
            </p>
            <p className="cursor-pointer text-left text-sm font-normal text-gray-400 hover:text-gray-700">
              Võ Huỳnh anh Nhật
            </p>
          </div>
          <div className="space-y-2">
            <p className="cursor-pointer text-left text-sm font-normal text-gray-400 hover:text-gray-700">
              Điều khoản
            </p>
            <p className="cursor-pointer text-left text-sm font-normal text-gray-400 hover:text-gray-700">
              Chính sách bảo mật
            </p>
            <p className="cursor-pointer text-left text-sm font-normal text-gray-400 hover:text-gray-700">
              Nguyễn Minh Quang
            </p>
            <p className="cursor-pointer text-left text-sm font-normal text-gray-400 hover:text-gray-700">
              Võ Huỳnh anh Nhật
            </p>
          </div>
          <div className="space-y-2">
            <p className="cursor-pointer text-left text-sm font-normal text-gray-400 hover:text-gray-700">
              Điều khoản
            </p>
            <p className="cursor-pointer text-left text-sm font-normal text-gray-400 hover:text-gray-700">
              Chính sách bảo mật
            </p>
            <p className="cursor-pointer text-left text-sm font-normal text-gray-400 hover:text-gray-700">
              Nguyễn Minh Quang
            </p>
            <p className="cursor-pointer text-left text-sm font-normal text-gray-400 hover:text-gray-700">
              Lê Tân
            </p>
          </div>
          <div className="space-y-2">
            <p className="cursor-pointer text-left text-sm font-normal text-gray-400 hover:text-gray-700">
              Điều khoản
            </p>
            <p className="cursor-pointer text-left text-sm font-normal text-gray-400 hover:text-gray-700">
              Chính sách bảo mật
            </p>
            <p className="cursor-pointer text-left text-sm font-normal text-gray-400 hover:text-gray-700">
              Nguyễn Minh Quang
            </p>
            <p className="cursor-pointer text-left text-sm font-normal text-gray-400 hover:text-gray-700">
              Lê Tân
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterSection;
