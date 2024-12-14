import { useEffect, useState } from 'react';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { auth } from '../common/config/firebase';
import { IRootState } from '../redux';
import { setAccessToken, setUser } from '../redux/slices/auth';
import { useAppSelector } from './useRedux';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { apiURL } from '../config/constanst';
import SockJS from "sockjs-client";
import { Client, StompSubscription } from "@stomp/stompjs";

export const useAuth = () => {
  const [loginWithGoogle] = useSignInWithGoogle(auth);

  //login
  const [loginError, setLoginError] = useState<string>();
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const isAuth = useAppSelector((state: IRootState) => state.auth.accessToken);

  const { user } = useAppSelector((state: IRootState) => state.auth);
  const history = useHistory();

  const dispatch = useDispatch();

  const login = async (username: string, password: string) => {
    console.log('Username, password', username);
    try {
      setLoginLoading(true);
      const response = await fetch('http://localhost:8080/api/auth/login-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success('Đăng nhập thành công', {

          position: 'top-right',
          autoClose: 0,
          theme: 'colored',
          hideProgressBar: true,
        });

        localStorage.setItem('accessToken', result.data.accesstoken);
        localStorage.setItem('refreshToken', result.data.accesstoken);
        history.push('/home/dashboard');
        console.log("kkk1")
        console.log(result.data.accesstoken)

        // dispatch(setUser(response?.data?.data as any));
        // dispatch(setAccessToken(response?.data?.data?.accessToken));
        // Khởi tạo WebSocket sau khi đăng nhập thành công
        const socket = new SockJS("http://localhost:8080/ws");
        const stompClient = new Client({
          webSocketFactory: () => socket,
          debug: (str: string) => console.log(str),
        });

        stompClient.onConnect = () => {
          console.log("WebSocket Connected");

          // Đăng ký lắng nghe kênh /topic/admin
          stompClient.subscribe("/topic/admin", (message) => {
            if (message.body) {
              alert(message.body); // Hiển thị thông báo
            }
          });
        };

        stompClient.activate();

        // localStorage.setItem('websocket', JSON.stringify(stompClient));

        // Cleanup khi component bị unmount
        // return () => {
        //   stompClient.deactivate();
        // };

        // Lưu trữ stompClient nếu cần sử dụng sau
        // window.stompClient = stompClient;
      } else {
        toast.error('Phone number or password in incorrect', {
          position: 'top-right',
          theme: 'colored',
          hideProgressBar: true,
        });
      }
    } catch (error) {
      console.log(error);
      setLoginError(error as string);
    } finally {
      setLoginLoading(false);
    }
  };

  const googleLogin = async () => {
    try {
      setLoginLoading(true);
      await loginWithGoogle();
    } catch (error) {
      console.log(error);
    }
  };

  return {
    isAuth: !!isAuth,
    login,
    loginError,
    googleLogin,
    loginLoading,
  };
};
