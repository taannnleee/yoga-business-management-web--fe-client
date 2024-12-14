import React, { useState, useRef, useEffect } from "react";
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import { Button } from "@mui/material";

interface Lecture {
    id: number;
    title: string;
    content: string;
    videoPath: string;
    duration: string;
}

interface Section {
    id: number;
    title: string;
    lectures: Lecture[];
}
interface CourseContentProps {
    sections: Section[]; 
}

const CourseContent: React.FC<CourseContentProps> = ({ sections }) => {



    const [openPanel, setOpenPanel] = useState<number | null>(null);

    const togglePanel = (id: number) => {
        setOpenPanel(openPanel === id ? null : id);
    };

    return (
        <div className="w-full max-w-7xl mx-auto mt-[70px] pb-[48px] flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4">Nội dung khóa học</h2>
            {sections.map((section) => (
                <div key={section.id} className="w-full border-b border-gray-300 my-1">
                    {/* Panel Header */}
                    <div
                        className="flex justify-between items-center p-4 cursor-pointer bg-gray-100 hover:bg-gray-200"
                        onClick={() => togglePanel(section.id)}
                    >
                        <h3 className="text-lg font-semibold">
                            {openPanel === section.id ? "- " : "+ "} {section.title}
                        </h3>
                        <span className="text-gray-600">
                            {/* Tính tổng duration của các bài học trong section */}
                            {section.lectures.length} bài học - {
                                section.lectures.reduce((total, lecture) => {
                                    // Chuyển đổi duration thành số (parseInt hoặc parseFloat nếu là số thập phân)
                                    const duration = parseFloat(lecture.duration);
                                    return total + (isNaN(duration) ? 0 : duration); // Nếu không phải số, tính là 0
                                }, 0).toFixed(2)
                            } phút
                        </span>
                    </div>

                    {/* Panel Content */}
                    <div
                        className={`overflow-hidden transition-all duration-200 ease-in-out ${openPanel === section.id ? "h-auto opacity-100" : "h-0 opacity-0"
                            }`}
                    >
                        <div className={`p-4 bg-white transition-all duration-200 ease-in-out`}>
                            <ul>
                                {section.lectures.map((lecture, index) => (
                                    <div key={lecture.id}>
                                        <li className="flex justify-between items-center py-2">
                                            <div>
                                                <OndemandVideoIcon className="text-blue-500 mr-1 ml-8" />
                                                <span className="text-gray-800 font-medium">{lecture.title}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600 mr-2">{lecture.duration} phút</span>

                                                <Button variant="contained" color="primary" sx={{ marginLeft: "auto" }}>
                                                    Học thử
                                                </Button>


                                            </div>

                                        </li>
                                        {index < section.lectures.length - 1 && (
                                            <hr className="border-gray-300 my-2" />
                                        )}
                                    </div>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CourseContent;
