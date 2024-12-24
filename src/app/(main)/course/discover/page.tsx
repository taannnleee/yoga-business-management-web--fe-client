"use client";
import React, { useEffect, useState } from "react";
import CourseCard from "@/components/organisms/CourseCard";
import { API_URL } from "@/config/url";
// Define types for your courses and categories
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

interface Category {
    id: number;
    name: string;
    courses: Course[];
}

const DisCoverPage: React.FC = () => {
    const [categoryCourses, setCategoryCourses] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // Add loading state
    const [error, setError] = useState<string | null>(null); // Add error state

    useEffect(() => {
        // Fetch the courses from the API
        const fetchCourses = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const response = await fetch(`${API_URL}/api/course/all-course`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });
                const data = await response.json();

                if (response.ok && data.status === 200) {
                    console.log("độ dài của mảng")

                    console.log(data.data.length)
                    // Map the API data to the structure you need for your component
                    const transformedData: Category[] = data.data.map((item: any) => ({
                        id: item.topicName, // Assuming topicName is the category name
                        name: item.topicName,
                        courses: item.course.map((course: any) => ({
                            id: course.id,
                            name: course.name, // Changed from name to title
                            imagePath: course.imagePath, // Changed to match API response
                            instruction: course.instruction, // Assuming 'instruction' is the author
                            rating: 4.0, // Defaulting rating for now (can be updated based on data or requirements)
                        })),
                    }));

                    setCategoryCourses(transformedData);
                } else {

                    console.error("Error fetching courses:", data.message);
                    setError(data.message);
                }
            } catch (error) {
                console.error("Error fetching courses:", error);
                setError("There was an error fetching the courses.");
            } finally {
                setLoading(false); // Set loading to false after fetch completes
            }
        };

        fetchCourses();
    }, []);

    useEffect(() => {
        console.log("Dữ liệu category đã được set:");
        console.log(categoryCourses)
    }, [categoryCourses]);

    if (loading) {
        return <div>Loading...</div>; // Show a loading state
    }

    if (error) {
        return <div>Error: {error}</div>; // Show an error message if fetching failed
    }

    return (
        <div className="w-screen">
            {categoryCourses.map((category) => (
                <div key={category.id} className="w-full max-w-6xl px-4 mx-auto mt-[30px]">
                    <h2 className="text-xl text-left mb-2">{category.name}</h2>
                    {/* Pass category.courses to CourseCard */}
                    <CourseCard courses={category.courses} />
                </div>
            ))}
        </div>
    );
};

export default DisCoverPage;
