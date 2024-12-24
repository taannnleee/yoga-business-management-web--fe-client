"use client";

import React, { useState, useEffect } from "react";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Image from "next/image";
import { useRouter } from "next/navigation";
import CourseCard from "@/components/organisms/CourseCard";
import { API_URL } from "@/config/url";
// Định nghĩa interface cho dữ liệu giáo viên
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
}


const CoursePage: React.FC = () => {
    const router = useRouter();
    const [currentInstructorIndex, setCurrentInstructorIndex] = useState(0);
    const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
    const [instructors, setInstructors] = useState<Teacher[]>([]); // State lưu danh sách giáo viên
    const [isLoading, setIsLoading] = useState(true); // Trạng thái loading

    const [error, setError] = useState<string | null>(null);
    //course
    const [isLoadingCourses, setIsLoadingCourses] = useState(true);
    const [courses, setCourses] = useState<Course[]>([]);
    // Function to get the current instructors for the slider
    const getCurrentInstructors = () => {
        const start = currentInstructorIndex * 4;
        return instructors.slice(start, start + 4);
    };

    // Function to get the current testimonials for the slider
    const getCurrentTestimonials = () => {
        const start = currentTestimonialIndex * 3; // Change to 3 for the testimonials
        return studentTestimonials.slice(start, start + 3);
    };

    const nextInstructorSlide = () => {
        setCurrentInstructorIndex((prevIndex) => (prevIndex + 1) % Math.ceil(instructors.length / 4));
    };

    const prevInstructorSlide = () => {
        setCurrentInstructorIndex((prevIndex) => (prevIndex - 1 + Math.ceil(instructors.length / 4)) % Math.ceil(instructors.length / 4));
    };

    const nextTestimonialSlide = () => {
        setCurrentTestimonialIndex((prevIndex) => (prevIndex + 1) % Math.ceil(studentTestimonials.length / 3));
    };

    const prevTestimonialSlide = () => {
        setCurrentTestimonialIndex((prevIndex) => (prevIndex - 1 + Math.ceil(studentTestimonials.length / 3)) % Math.ceil(studentTestimonials.length / 3));
    };

    const nextPageInforTeacher = (id: number) => {
        router.push(`/course/teacher/${id}`);
    };

    const coursesPerPage = 4;
    const courseGroups = [];
    for (let i = 0; i < courses.length; i += coursesPerPage) {
        courseGroups.push(courses.slice(i, i + coursesPerPage));
    }

    // Gọi API lấy danh sách giáo viên
    useEffect(() => {
        const fetchInstructors = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const response = await fetch(`${API_URL}/api/teacher/all-teachers`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                if (data.status === 200) {
                    setInstructors(data.data);
                    console.log("kk")
                    console.log(data.data)
                } else {
                    console.error("Failed to fetch instructors:", data.message);
                }
            } catch (error) {
                console.error("Error fetching instructors:", error);
            } finally {
                setIsLoading(false); // Kết thúc quá trình loading
            }
        };

        fetchInstructors();
    }, []); // Chạy một lần khi component mount


    // Fetch các khóa học của giáo viên từ API
    useEffect(() => {
        const fetchTeacherCourses = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const response = await fetch(`${API_URL}/api/course/get-outstanding-courses`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });
                const data = await response.json();

                if (data.status === 200) {
                    setCourses(data.data); // Lưu các khóa học của giáo viên vào state
                } else {
                    setError("Không thể tải các khóa học.");
                }
            } catch (err) {
                setError("Có lỗi xảy ra khi tải các khóa học.");
            } finally {
                setIsLoadingCourses(false);
            }
        };

        fetchTeacherCourses();
    }, []);

    const studentTestimonials = [
        { name: "Nguyễn Văn A", feedback: "Tôi đã học yoga ở đây và thấy rất hiệu quả. Các bài học dễ hiểu, giảng viên tận tình!", image: "https://yoga.vn/statics/yoga/img//images_hv/tesmonial_2.jpg" },
        { name: "Trần Thị B", feedback: "Thời gian linh hoạt, học được mọi lúc mọi nơi, phù hợp với công việc bận rộn của tôi.", image: "https://yoga.vn/statics/yoga/img//images_hv/tesmonial_3.jpg" },
        { name: "Lê Văn C", feedback: "Chi phí rất hợp lý và các bài học rất bài bản, tôi thấy tiến bộ rõ rệt.", image: "https://yoga.vn/statics/yoga/img//images_hv/tesmonial_4.jpg" },
        { name: "Phạm Thị D", feedback: "Chất lượng giảng dạy tuyệt vời, có rất nhiều lựa chọn bài học và lộ trình phù hợp.", image: "https://yoga.vn/statics/yoga/img//images_hv/tesmonial_5.jpg" },
        { name: "Nguyễn Thị E", feedback: "Các giảng viên rất tận tình, tôi cảm thấy tự tin hơn khi thực hành.", image: "https://yoga.vn/statics/yoga/img//images_hv/tesmonial_6.jpg" },
    ];
    const reasons = [
        {
            title: "Học mọi lúc mọi nơi",
            description: "Chỉ cần có điện thoại máy tính bảng, laptop hoặc TV kết nối Internet",
            image: "https://yoga.vn/statics/yoga/img/reason-2.png",
        },
        {
            title: "Tiết kiệm chi phí",
            description: "Học phí chỉ bằng 1/10 so với các trung tâm dạy Yoga",
            image: "https://yoga.vn/statics/yoga/img/reason-6.png",
        },
        {
            title: "Chương trình học đa dạng",
            description: "Hơn 1000 bài học được Giảng dạy bởi các huấn luyện viên Yoga số 1 Việt Nam và Ấn Độ, theo từng cấp độ và nhu cầu học của bạn",
            image: "https://yoga.vn/statics/yoga/img/reason-4.png",
        },
        {
            title: "Được tư vấn miễn phí",
            description: "Được tư vấn về sức khỏe dinh dưỡng, chế độ luyện tập bởi các chuyên gia",
            image: "https://yoga.vn/statics/yoga/img/reason-5.png",
        },
    ];

    return (
        <div className="w-screen">
            {/* Background Image Section */}
            <div className="h-screen bg-[url('https://yoga.vn/statics/yoga/img/yoga.jpg')] bg-cover bg-center flex items-center justify-center">
                <button className="w-[400px] h-[54px] bg-[#ee4987] text-white text-[24px] font-bold rounded hover:bg-[#fced0e] hover:text-[#ec3496] transition duration-200">
                    BẮT ĐẦU CHƯƠNG TRÌNH NÀY
                </button>
            </div>

            {/* Reasons Section */}
            <div className="w-full max-w-6xl px-4 mx-auto mt-[70px]">
                <div className="text-center text-2xl font-bold mb-6">4 LÝ DO NÊN HỌC YOGA ONLINE</div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {reasons.map((reason, index) => (
                        <div key={index} className="flex flex-col items-center bg-white rounded-lg p-6 text-center">
                            <img src={reason.image} alt={reason.title} className="w-[75px] h-[75px] mb-4" />
                            <h3 className="text-lg font-semibold text-gray-800">{reason.title}</h3>
                            <p className="text-gray-700 mt-2">{reason.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Instructor Slider Section */}
            <div className="w-full max-w-7xl mx-auto mt-[70px] flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-4">CHỌN HUẤN LUYỆN VIÊN CỦA BẠN</h2>
                {isLoading ? (
                    <div className="text-center">Loading instructors...</div>
                ) : (
                    <div className="flex justify-between items-center w-full">
                        <button onClick={prevInstructorSlide} className="p-2 bg-gray-200 rounded-full">
                            <ArrowBackIcon />
                        </button>
                        <div className="flex space-x-2">
                            {getCurrentInstructors().map((instructor, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col items-center w-[285px] h-[313px]"
                                    onClick={() => nextPageInforTeacher(instructor.id)}
                                >
                                    <Image
                                        src={instructor.profilePicture}
                                        alt={instructor.fullName}
                                        width={120}
                                        height={120}
                                        className="rounded-full cursor-pointer transition-opacity duration-300 hover:opacity-50"
                                    />
                                    <h3 className="text-lg cursor-pointer font-semibold my-[20px]">{instructor.fullName}</h3>
                                    <p className="text-gray-600 cursor-pointer">{instructor.introduction}</p>
                                </div>
                            ))}
                        </div>
                        <button onClick={nextInstructorSlide} className="p-2 bg-gray-200 rounded-full">
                            <ArrowForwardIcon />
                        </button>
                    </div>
                )}
                <div className="relative mt-[70px] mb-[45px]">
                    <div className="absolute bottom-[4px] left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                        {Array.from({ length: Math.ceil(instructors.length / 4) }).map((_, index) => (
                            <button
                                key={index}
                                className={`w-3 h-3 rounded-full ${currentInstructorIndex === index ? "bg-yellow-500" : "bg-gray-300"}`}
                                onClick={() => setCurrentInstructorIndex(index)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Courses Section */}
            <div className="w-full max-w-6xl px-4 mx-auto mt-[30px]">
                <h2 className="text-2xl font-bold text-center mb-6">CÁC KHÓA HỌC NỔI BẬT</h2>
                {/* {courses.map((course, index) => (
                    <CourseCard key={index} courses={course} />
                ))} */}
                {courseGroups.map((group, index) => (
                    <CourseCard key={index} courses={group} />
                ))}

            </div>
            <div className="flex justify-center mt-4">
                <button
                    onClick={() => router.push("/course/discover")}
                    className="bg-[#ee4987] w-[198px] h-[46px] text-white text-[18px] font-light rounded hover:bg-[#fced0e] hover:text-[#ec3496] transition duration-200 mt-[70px]"
                >
                    Xem toàn bộ khoá học
                </button>
            </div>

            {/* Student Testimonials Section */}
            <div className="w-full max-w-7xl mx-auto mt-[70px] flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-4">CẢM NHẬN HỌC VIÊN</h2>
                <div className="flex justify-between items-center w-full mt-[40px]">
                    <button onClick={prevTestimonialSlide} className="p-2 bg-gray-200 rounded-full">
                        <ArrowBackIcon />
                    </button>
                    <div className="flex space-x-4">
                        {getCurrentTestimonials().map((testimonial, index) => (
                            <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden w-[360px] h-[589px] flex flex-col items-center p-4">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="rounded-full w-[120px] h-[120px] object-cover"
                                />
                                <h3 className="font-semibold mt-5">{testimonial.name}</h3>
                                <p className="text-gray-600 text-center mt-2">{testimonial.feedback}</p>
                            </div>
                        ))}
                    </div>
                    <button onClick={nextTestimonialSlide} className="p-2 bg-gray-200 rounded-full">
                        <ArrowForwardIcon />
                    </button>
                </div>
                <div className="relative mt-[35px] mb-[45px]">
                    <div className="absolute bottom-[4px] left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                        {Array.from({ length: Math.ceil(studentTestimonials.length / 3) }).map((_, index) => (
                            <button
                                key={index}
                                className={`w-3 h-3 rounded-full ${currentTestimonialIndex === index ? "bg-yellow-500" : "bg-gray-300"}`}
                                onClick={() => setCurrentTestimonialIndex(index)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoursePage;
