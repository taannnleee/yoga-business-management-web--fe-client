/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false, // Disable React's strict mode
    images: {
        domains: [
            'bizweb.dktcdn.net',
            'encrypted-tbn0.gstatic.com',
            "media.istockphoto.com",
            "yoga.vn",
            "res.cloudinary.com",
            "images.pexels.com",
            "example.com",
            'bizweb.dktcdn.net',
            'encrypted-tbn0.gstatic.com',
            'dotapyogatot.com',
        ],
        dangerouslyAllowSVG: true,
    },
};

// Sử dụng CommonJS (module.exports thay vì export default)
module.exports = nextConfig;
