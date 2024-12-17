'use client'; // Đánh dấu đây là Client Component

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation'; // Import usePathname và useRouter từ next/navigation

export default function Home() {
    const router = useRouter();
    const pathname = usePathname(); // Sử dụng usePathname để lấy pathname

    useEffect(() => {
        // Điều hướng đến trang /login nếu hiện tại là trang chủ "/"
        if (pathname === '/') {
            router.push('/login');
        }
    }, [pathname, router]);

    // return <div>Home Page</div>;
}
