'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaMusic } from 'react-icons/fa'; // Add music icon
import dynamic from 'next/dynamic'; // For dynamic import
import { Parallax } from 'react-parallax'; // Add parallax effect

// Dynamically import Confetti with ssr: false
const Confetti = dynamic(() => import('react-confetti'), { ssr: false });

const StatusOrder = () => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const router = useRouter();
    const [showConfetti, setShowConfetti] = useState(false);
    const [userName, setUserName] = useState('Nguyễn Minh Quang'); // User name as an example
    const [windowWidth, setWindowWidth] = useState(0);
    const [windowHeight, setWindowHeight] = useState(0);

    // Effect for showing confetti
    useEffect(() => {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000); // Hide confetti after 3 seconds
    }, []);

    // Effect to handle resizing the window (only on the client-side)
    useEffect(() => {
        // Ensure the code runs only on the client-side
        if (typeof window !== 'undefined') {
            const handleResize = () => {
                setWindowWidth(window.innerWidth);
                setWindowHeight(window.innerHeight);
            };

            // Set initial window size
            setWindowWidth(window.innerWidth);
            setWindowHeight(window.innerHeight);

            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);

    // Play background music when the component mounts
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.play();
        }
    }, []);

    const handleGoToPurchased = () => {
        router.push('/order'); // Navigate to the purchased items page
    };

    return (
        <div className="relative min-h-screen">
            {/* Background Music */}
            <audio ref={audioRef} autoPlay loop>
                <source src="/gods.mp3" type="audio/mp3" />
                Your browser does not support the audio element.
            </audio>

            {/* Confetti Effect */}
            {showConfetti && (
                <Confetti
                    width={windowWidth}
                    height={windowHeight}
                    recycle={false}
                    numberOfPieces={500}
                    run={showConfetti}
                />
            )}

            {/* Parallax Background */}
            <Parallax
                strength={300}
                bgImage="https://images.pexels.com/photos/8127309/pexels-photo-8127309.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                bgImageAlt="Background Image"
                className="absolute top-0 left-0 right-0 bottom-0"
            >
                <div className="flex justify-center items-center min-h-screen bg-black">
                    <div className="text-center text-white p-8 rounded-lg shadow-lg bg-gray-500 max-w-md mx-auto">
                        {/* Congratulations Message */}
                        <h1 className="text-4xl font-bold mb-4 animate__animated animate__fadeIn animate__delay-1s">
                            Chúc mừng
                        </h1>
                        <p className="text-xl mb-6 animate__animated animate__fadeIn animate__delay-2s">
                            Đơn hàng của bạn đã được đặt thành công. Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi!
                        </p>

                        {/* Relaxing Music Message */}
                        <p className="text-lg mb-6 flex justify-center items-center animate__animated animate__fadeIn animate__delay-3s">
                            <FaMusic className="mr-2" />
                            Nghe một xíu nhạc thư giãn rồi mua sắm tiếp nhé!
                        </p>

                        {/* Button to Go to Purchased Products */}
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
