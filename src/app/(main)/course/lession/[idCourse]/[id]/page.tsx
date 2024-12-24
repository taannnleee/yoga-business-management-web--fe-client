"use client";
import React, { useState, useEffect } from "react"; // Thêm useEffect để gọi API
import CourseCard from "@/components/organisms/CourseCard";
import { useParams, useRouter } from "next/navigation";
import Video from "next-video";
import Image from "next/image";
import Button from "@/components/atom/Button";
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import LectureItem from "@/components/organisms/LessionItem"; // Đổi từ LessionItem thành LectureItem
import { API_URL } from "@/config/url";
interface Lecture {
    id: number;
    title: string;
    content: string;
    videoPath: string;
    duration: string;
    image: string;
}

interface Section {
    id: number;
    title: string;
    lectures: Lecture[];
}

interface Teacher {
    id: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    experienceYears: number;
    profilePicture: string;
    introduction: string;
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

const LessionPage: React.FC<any> = () => {
    const router = useRouter();
    const params = useParams();
    const courseId = params?.idCourse;
    const lectureId = params?.id;

    // State for controlling the height of the sticky bottom bar
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [course, setCourse] = useState<Course | null>(null);
    const [lecture, setLecture] = useState<Lecture | null>(null); // State to store the lecture data

    // Function to toggle the visibility of the sticky bottom bar
    const handleExpandCollapse = () => {
        setIsExpanded(prev => !prev);
    };

    // Function to fetch section data
    const fetchSections = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            // Thay thế URL này với API endpoint của bạn
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
            }
        } catch (error) {
            console.error("Error fetching sections:", error);
        } finally {
            setIsLoading(false); // Đánh dấu kết thúc quá trình tải dữ liệu
        }
    };

    // Function to fetch lecture data
    const fetchLecture = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await fetch(
                `${API_URL}/api/lecture/get-lecture/${lectureId}`,
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
                setLecture(data.data); // Store the lecture data in state
                console.log(data.data);
            }
        } catch (error) {
            console.error("Error fetching lecture:", error);
        }
    };

    // Gọi API khi component được mount
    useEffect(() => {
        fetchSections();
        if (lectureId) {
            fetchLecture(); // Fetch the specific lecture when the page loads
        }
    }, [lectureId]);

    return (
        <div className="flex flex-col items-center py-6 px-4 min-h-screen bg-white">
            <div className="w-full max-w-[750px]">
                {/* Top Black Line */}
                <div className="border-t-2 border-black-500" />
                <Video src={lecture?.videoPath} className="w-full rounded-lg shadow-lg" />
                {/* Bottom Black Line */}
                <div className="border-b-2 border-black-500" />
            </div>

            <div className="flex flex-row justify-between w-full max-w-[750px] mt-6 p-4">
                {/* Left Side - Video Information */}
                <div className="flex flex-col space-y-4">
                    {lecture ? (
                        <>
                            <div className="flex flex-row items-center">
                                <h3 className="text-2xl font-bold">{lecture.title}</h3>
                                <span className="ml-5 text-sm text-gray-500">{lecture.duration}</span>
                            </div>
                            <div className="flex flex-row items-center space-x-3 cursor-pointer"
                                onClick={() => router.push(`/course/teacher/${course?.teacher.id}`)}
                            >
                                {/* Avatar */}
                                <Image
                                    src={course?.teacher.profilePicture || '/default-image.jpg'}
                                    alt="Avatar"
                                    width={50}
                                    height={50}
                                    className="rounded-full"
                                />
                                <div>
                                    <h3 className="text-lg font-semibold">{course?.teacher.fullName}</h3>
                                    <span className="text-sm text-gray-500">{course?.teacher.introduction}</span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div>Loading lecture data...</div>
                    )}
                </div>

                {/* Right Side - Buttons */}
                <div className="flex flex-col space-y-2">
                    <Button variant="secondary"
                    // className="w-[182px] h-[44px] bg-[#0e3521] text-white rounded-lg hover:bg-[#0b291a] text-sm"
                    >
                        Đánh dấu khóa học
                    </Button>
                    <Button variant="secondary"
                    // className="w-[182px] h-[44px] bg-[#a5a5a5] text-white rounded-lg hover:bg-[#8b8b8b] text-sm"
                    >
                        Thêm vào yêu thích
                    </Button>
                    <Button variant="secondary"
                    // className="w-[182px] h-[44px] bg-[#f05dab] text-white rounded-lg hover:bg-[#cc498c] text-sm"
                    >
                        Mở khóa Premium
                    </Button>
                </div>
            </div>

            {/* <div className="mt-6 w-full max-w-[750px] text-center">
                <p className="text-gray-700 text-base">
                    Cải thiện sức khoẻ tinh thần và thể chất với những bài tập Yoga cơ bản ngay tại nhà của bạn.
                </p>
            </div> */}

            {/* Conditional Sticky Bottom Bar */}
            {isExpanded ? (
                <div
                    className={`z-10 fixed bottom-0 w-full bg-gradient-to-r from-pink-500 to-orange-500 py-5 px-8 h-[366px] flex flex-col justify-start items-center text-white shadow-md transition-height duration-300 overflow-y-auto`}
                    style={{
                        backgroundImage: "-webkit-linear-gradient(-84.28deg, rgb(236, 52, 150) 0%, rgb(255, 118, 0) 100%)"
                    }}
                >
                    <div>
                        <div className="flex justify-between items-center w-full">
                            {/* Left Arrow Icon */}
                            <button
                                onClick={handleExpandCollapse}
                                className="text-white flex items-center justify-center mr-4"
                            >
                                <ExpandCircleDownIcon
                                    className={`transition-transform ${isExpanded ? "" : "rotate-180"}`}
                                    style={{ fontSize: 20 }} />
                            </button>

                            {/* Center Text */}
                            <span className="font-semibold text-sm md:text-base mx-4 whitespace-nowrap">
                                Tập Yoga cơ bản ngay tại nhà với Nguyễn Hiếu
                            </span>

                            {/* Right Side - Next Lesson Button */}
                            <Button
                                variant="secondary"
                            // className="w-[182px] h-[44px] bg-[#78c1f6] text-white rounded-lg hover:bg-[#78c1f6] text-sm"
                            >
                                Bài tiếp theo
                            </Button>
                        </div>

                        {/* Content Section */}
                        <div className="mt-4 w-full text-left overflow-y-auto max-h-[250px]">
                            <div className="text-sm md:text-base flex flex-col space-y-4">
                                {course?.sections.map((section) => (
                                    <div key={section.id} className="mb-4">
                                        <h2 className="text-xl font-bold">{section.title}</h2>
                                        {section.lectures.map((lecture) => (
                                            <LectureItem
                                                courseId={course.id}
                                                isChoosen={lecture.id === parseInt(lectureId as string)}
                                                key={lecture.id}
                                                id={lecture.id}
                                                title={lecture.title}
                                                thumbnail={lecture.image}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    className={`fixed bottom-0 w-full bg-gradient-to-r from-pink-500 to-orange-500 py-5 px-8 flex justify-between items-center text-white shadow-md transition-height duration-300`}
                    style={{
                        backgroundImage: "-webkit-linear-gradient(-84.28deg, rgb(236, 52, 150) 0%, rgb(255, 118, 0) 100%)"
                    }}
                >
                    {/* Left Arrow Icon */}
                    <button
                        onClick={handleExpandCollapse}
                        className="text-white flex items-center justify-center mr-4"
                    >
                        <ExpandCircleDownIcon className={`transition-transform ${isExpanded ? "" : "rotate-180"}`} />
                    </button>

                    {/* Center Text */}
                    <span className="font-semibold text-sm md:text-base mx-4 whitespace-nowrap">
                        Tập Yoga cơ bản ngay tại nhà với Nguyễn Hiếu
                    </span>

                    {/* Right Side - Next Lesson Button */}
                    <Button variant="secondary"
                        onClick={() => router.push(`/course/lession/${parseInt(lectureId as string) + 1}`)}
                    // className="w-[182px] h-[44px] bg-[#78c1f6] text-white rounded-lg hover:bg-[#78c1f6] text-sm"
                    >
                        Bài tiếp theo
                    </Button>
                </div>
            )}
        </div>
    );
};

export default LessionPage;
