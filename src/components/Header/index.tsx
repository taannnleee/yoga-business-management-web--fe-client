import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import { useAppSelector } from '../../hooks/useRedux';
import { IRootState } from '../../redux';
import { setAccessToken, setUser } from '../../redux/slices/auth';
import LogoutConfirmDialog from '../LogoutConfirmDialog';
import { useHistory } from 'react-router-dom';
import { Client, StompSubscription } from "@stomp/stompjs";
interface IHeaderProps {
  title: string;
}

const Header: React.FC<IHeaderProps> = (props) => {
  const history = useHistory();
  const { user } = useAppSelector((state: IRootState) => state.auth);
  const dispatch = useDispatch();
  const [open, setOpen] = useState<boolean>(false);
  const logOut = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        return;
      }
      console.log("hehehe")

      // Gọi API logout sử dụng fetch
      const response = await fetch(`http://localhost:8080/api/auth/logout`, {
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

        toast.success('Đăng xuất thành công')
        history.push('/login');
      } else {
        // Xử lý trường hợp logout không thành công
        toast.error("Đăng xuất thất bại, vui lòng thử lại.");
      }
    } catch (error) {
      // Xử lý lỗi trong quá trình gọi API
      console.error("Logout error", error);
      toast.error("Đăng xuất thất bại, vui lòng thử lại.");
    }
  };

  return (
    <div className="flex items-center justify-between border-b border-b-gray-300 px-12 py-[16.5px]">
      <h2 className="text-2xl font-bold text-gray-600">{props.title}</h2>
      <div className="flex items-center space-x-4">
        <p className="text-lg font-bold text-gray-500">Xin chào {user?.username} !</p>
        <button
          className="rounded-full bg-gray-100 px-3 py-1 font-bold text-gray-800 hover:opacity-50"
          onClick={() => setOpen(true)}
        >
          Đăng xuất
        </button>
      </div>
      <LogoutConfirmDialog open={open} onClose={() => setOpen(false)} onConfirm={logOut} />
    </div>
  );
};

export default Header;
