"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti";
import { toast } from "react-toastify"; // Bạn cần cài thư viện react-toastify
import { Parallax } from "react-parallax";
import AudioPlayer from "react-audio-player"; // Cài đặt react-audio-player
import { FaMusic } from "react-icons/fa"; // Thêm thư viện react-icons để dùng icon âm nhạc

const StatusOrder = () => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const router = useRouter();
    const [showConfetti, setShowConfetti] = useState(false);
    const [userName, setUserName] = useState("Nguyễn Minh Quang"); // Giả sử đây là tên người dùng, có thể thay đổi từ API hoặc props
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);

    useEffect(() => {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000); // Tắt hiệu ứng sau 3 giây
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            setWindowHeight(window.innerHeight);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.play(); // Automatically start playing the music
        }
    }, []);

    const handleGoToPurchased = () => {
        router.push("/order"); // Điều hướng đến trang sản phẩm đã mua
    };

    return (
        <div className="relative min-h-screen">
            {/* Phát nhạc nền */}
            <audio ref={audioRef} autoPlay loop>
                <source src="/gods.mp3" type="audio/mp3" />
                Your browser does not support the audio element.
            </audio>

            {/* Hiệu ứng Confetti */}
            <Confetti
                width={windowWidth}
                height={windowHeight}
                recycle={false}
                numberOfPieces={500}
                run={showConfetti}
            />

            {/* Parallax background effect */}
            <Parallax
                strength={300}
                bgImage="https://images.pexels.com/photos/8127309/pexels-photo-8127309.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" // Thay đổi ảnh nền theo ý bạn
                bgImageAlt="Background Image"
                className="absolute top-0 left-0 right-0 bottom-0"
            >
                <div className="flex justify-center items-center min-h-screen bg-black">
                    <div className="text-center text-white p-8 rounded-lg shadow-lg bg-gray-500 max-w-md mx-auto">
                        {/* Thông điệp chúc mừng */}
                        <h1 className="text-4xl font-bold mb-4 animate__animated animate__fadeIn animate__delay-1s">
                            Chúc mừng
                        </h1>
                        <p className="text-xl mb-6 animate__animated animate__fadeIn animate__delay-2s">
                            Đơn hàng của bạn đã được đặt thành công. Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi!
                        </p>

                        {/* Thêm câu thông báo về nhạc thư giãn */}
                        <p className="text-lg mb-6 flex justify-center items-center animate__animated animate__fadeIn animate__delay-3s">
                            <FaMusic className="mr-2" />
                            Nghe một xíu nhạc thư giãn rồi mua sắm tiếp nhé!
                        </p>

                        <button
                            onClick={handleGoToPurchased}
                            className="px-6 py-3 bg-orange-600 text-xl font-semibold rounded-lg hover:bg-orange-700 transform transition-all duration-300 hover:scale-105"
                        >
                            Chuyển đến: Sản phẩm đã mua
                        </button>
                    </div>
                </div>
            </Parallax>
        </div>
    );
};

export default StatusOrder;
