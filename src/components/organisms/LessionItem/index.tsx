"use client"; // Assuming you're using Next.js

import React from 'react';
import { useRouter } from 'next/navigation';

interface LessonItemProps {
    isChoosen?: boolean; // Optional prop to indicate if the lesson is choosen
    id: number; // Lesson ID
    title: string; // Lesson Title
    thumbnail: string; // Thumbnail URL
    courseId: number
}

const LectureItem: React.FC<LessonItemProps> = ({ courseId, isChoosen, id, title, thumbnail }) => {
    const router = useRouter();

    // Function to handle click and navigate to the lesson page
    const handleClick = () => {
        router.push(`/course/lession/${courseId}/${id}`);
    };

    return (
        <div
            onClick={handleClick}
            className={`cursor-pointer flex items-center w-[1130px] h-[115px] ${isChoosen ? 'bg-[#9b9797]' : ''} rounded-lg mb-2`}
        >
            {/* Left Image */}
            <div className="w-[296px] h-[110px] overflow-hidden rounded-l-lg">
                <img
                    className="w-full h-full object-cover"
                    src={thumbnail}
                    alt="Lesson Thumbnail"
                />
            </div>

            {/* Right Text Content */}
            <div className="flex flex-col justify-center pl-4 pr-2">
                <div className="text-lg font-semibold">{title}</div>
            </div>
        </div>
    );
};

export default LectureItem;
