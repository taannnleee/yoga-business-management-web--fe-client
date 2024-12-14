"use client"
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CourseContent from "@/components/organisms/CourseContent";
import { API_URL } from "@/config/url";
interface Section {
    id: number;
    title: string;
    lectures: Lecture[];
}

interface Lecture {
    id: number;
    title: string;
    content: string;
    videoPath: string;
    duration: string;
}

interface Teacher {
    id: number;
    fullName: string;
    introduction: string;
    email: string;
    phoneNumber: string;
    experienceYears: number;
    profilePicture: string;
}

interface Course {
    id: number;
    name: string;
    instruction: string;
    description: string;
    duration: number;
    imagePath: string;
    level: number;
    videoPath: string;
    price: number;
    rating: number;
    sections: Section[];
    teacher: Teacher;
}

const CourseDetailPage: React.FC = () => {
    const router = useRouter();
    const { id: courseId } = useParams<{ id: string }>();
    const [course, setCourse] = useState<Course | null>(null);
    const [sections, setSections] = useState<Section[] | null>(null);  // State for sections
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const handleStartProgram = () => {
        const firstLesson = course?.sections[0]?.lectures[0];
        if (firstLesson) {
            router.push(`/course/lession/${course.id}/${firstLesson.id}`);
        }
    };

    useEffect(() => {
        if (courseId) {
            const fetchCourseData = async () => {
                try {
                    const token = localStorage.getItem("accessToken");
                    setLoading(true);
                    const response = await fetch(
                        `${API_URL}/api/course/get-course/${courseId}`,
                        {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`,
                            },
                        }
                    );
                    const data = await response.json();

                    if (data.status === 200) {
                        setCourse(data.data);
                    } else {
                        setError("Không thể tải dữ liệu khóa học.");
                    }
                } catch (err) {
                    setError("Đã xảy ra lỗi khi gọi API.");
                } finally {
                    setLoading(false);
                }
            };

            // Fetch course data
            fetchCourseData();
        }
    }, [courseId]);

    if (!course) return <div>Loading...</div>;

    return (
        <div className="w-screen">
            {/* Background Image Section */}
            <div
                className="relative h-[500px] w-full bg-cover bg-center flex items-center justify-center opacity-90 bg-[#f1f1f1]"
                style={{ backgroundImage: `url(${course.imagePath})` }}
            >
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="relative text-center">
                    <h3 className="text-orange-600 text-[36px] font-bold">{course.name}</h3>
                    <p className="text-white text-[24px] my-6 font-thin">Discover the secrets of timeless youth</p>
                    <button
                        className="mt-6 w-[300px] h-[54px] bg-[#ee4987] text-white text-[14px] font-bold rounded hover:bg-[#fced0e] hover:text-[#ec3496] transition duration-200"
                        onClick={handleStartProgram}
                    >
                        BẮT ĐẦU CHƯƠNG TRÌNH NÀY
                    </button>
                </div>
            </div>

            {/* Introduction Section */}
            <div className="container mx-auto mt-10 px-4">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-1/2 text-gray-800">
                        <h2 className="text-2xl font-semibold mb-4">Giới thiệu chương trình</h2>
                        <p className="mb-4">{course.instruction}</p>
                    </div>
                    <div className="lg:w-1/2 flex flex-col items-center">
                        <div className="ytp-cued-thumbnail-overlay relative w-full h-[312px] bg-cover bg-center cursor-pointer"
                            style={{ backgroundImage: `url("https://i.ytimg.com/vi_webp/xGMXPky1wUc/maxresdefault.webp")` }}
                            onClick={() => window.open("https://www.youtube.com/watch?v=xGMXPky1wUc", "_blank")}
                        >
                            {/* Play Button Overlay */}
                            <button className="absolute mx-auto my-auto inset-0 flex items-center justify-center ytp-large-play-button ytp-button w-[68px] h-[48px]" aria-label="Phát" title="Phát">
                                <svg height="100%" width="100%" viewBox="0 0 68 48">
                                    <path className="ytp-large-play-button-bg" d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#f00"></path>
                                    <path d="M 45,24 27,14 27,34" fill="#fff"></path>
                                </svg>
                            </button>
                        </div>

                        {/* Channel Information */}
                        <div className="flex items-center mt-4">
                            <div className="w-12 h-12 rounded-full bg-cover bg-center" style={{ backgroundImage: `url("https://yt3.ggpht.com/ytc/AIdro_mCxSAtsHLQq8az5EiKyVQMziAocER_Z2xrPHqNuyIGYg=s88-c-k-c0x00ffffff-no-rj")` }}></div>
                            <div className="ml-3">
                                <a href="https://www.youtube.com/channel/UCUnicaChannel" target="_blank" className="text-lg font-semibold text-blue-600">Unica</a>
                                <p className="text-sm text-gray-600">33.7K người đăng ký</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* What's study Section */}
            <div className="w-full max-w-7xl mx-auto mt-[70px] flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-4">Bạn sẽ học được gì</h2>
                <div className="flex justify-start items-center w-full">
                    <ul>
                        <li className="text-gray-600 text-lg mb-2">{course.description}</li>
                    </ul>
                </div>
            </div>

            {/* Sections Display */}
            {sections && (
                <div className="w-full max-w-7xl mx-auto mt-[70px] flex flex-col items-center">
                    <h2 className="text-2xl font-bold mb-4">Các Mục Học</h2>
                    <div className="w-full">
                        {sections.map((section) => (
                            <div key={section.id} className="mb-4">
                                <h3 className="text-xl font-semibold">{section.title}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Teacher Info Section */}
            <div className="w-full max-w-7xl mx-auto mt-[70px] flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-4">Giảng viên</h2>
                <div className="flex justify-center items-center w-full">
                    <div className="flex">
                        <div key={course.teacher.id} className="flex flex-col items-center w-[285px] h-[313px]">
                            <img
                                src={course.teacher.profilePicture}
                                alt={course.teacher.fullName}
                                className="rounded-full cursor-pointer transition-opacity duration-300 hover:opacity-50"
                            />
                            <h3 className="text-lg cursor-pointer font-semibold my-[20px]">{course.teacher.fullName}</h3>
                            <p className="text-gray-600 cursor-pointer">{course.teacher.experienceYears} năm kinh nghiệm</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <CourseContent sections={course.sections} />

        </div>
    );
};

export default CourseDetailPage;
