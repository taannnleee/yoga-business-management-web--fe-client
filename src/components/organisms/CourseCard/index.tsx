import React, { useState } from "react";
import {
    Box,
    Typography,
    Button,
    IconButton,
    Dialog,
    DialogContent,
    ListItem,
    ListItemIcon,
    ListItemText,
    List,
} from "@mui/material";
import Image from "next/image";
import SearchIcon from "@mui/icons-material/Search";
import { CheckCircleIcon } from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation"; // Import useRouter
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

interface CourseCardProps {
    courses: Course[];
}

const CourseCard: React.FC<CourseCardProps> = ({ courses }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [open, setOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const router = useRouter(); // Initialize router
    const itemsPerPage = 5;

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex + itemsPerPage >= courses.length ? 0 : prevIndex + itemsPerPage
        );
    };

    const roundRating = (rating: number) => {
        return Math.round(rating * 2) / 2;
    };

    const renderStars = (rating: number) => {
        const roundedRating = roundRating(rating);
        const stars = [];

        for (let i = 0; i < 5; i++) {
            stars.push(
                <span key={i} style={{ color: i < roundedRating ? "gold" : "lightgray" }}>
                    ★
                </span>
            );
        }
        return stars;
    };

    const handleOpenModal = (course: Course) => {
        setSelectedCourse(course);
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
        setSelectedCourse(null);
    };
    const navigateToDetail = (id: number) => {
        router.push(`/course/detail/${id}`);
    };
    return (
        <Box mt={2} p={2} ml={4} mr={4}>
            <Box display="flex" alignItems="center" overflow="hidden">
                <Box display="flex" justifyContent="space-between" overflow="hidden" mx={2}>
                    {courses.slice(currentIndex, currentIndex + itemsPerPage).map((course) => (
                        <Box
                            key={course.id}
                            position="relative"
                            mx={2}
                            className="w-56 h-72 flex flex-col items-center justify-between hover:cursor-pointer"
                        >
                            <Image
                                src={course.imagePath}
                                alt={course.name}
                                width={245} // Image width
                                height={240} // Image height
                                layout="responsive" // Changed to responsive
                            />

                            <Box
                                className="product-hover absolute left-0 w-full h-full flex flex-col justify-center items-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out opacity-0 hover:opacity-100"
                            >
                                <IconButton
                                    color="secondary"
                                    className="top-[-80px]"
                                    onClick={() => handleOpenModal(course)}
                                >
                                    <SearchIcon fontSize="large" className={"hover:bg-red-500 rounded-full w-[46px]"} />
                                </IconButton>
                            </Box>

                            <Box textAlign="center" mt={1}>
                                <Typography
                                    onClick={() => navigateToDetail(course.id)}
                                    variant="subtitle1"
                                    component="a"
                                    href="#"
                                    className="no-underline cursor-pointer"
                                    style={{
                                        color: "black",
                                        transition: "color 0.3s",
                                        maxWidth: "192px",
                                        display: "-webkit-box",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.color = "red")}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = "black")}
                                >
                                    {course.name}
                                </Typography>

                                {/*<Typography variant="body2" color="textSecondary" style={{ fontStyle: "italic", fontSize: "0.875rem" }}>*/}
                                {/*    {course.author}*/}
                                {/*</Typography>*/}

                                <Box mt={1}>
                                    {renderStars(course.rating)}
                                    <Typography variant="body2" color="textSecondary">
                                        {/* ({Math.round(course.rating * 10)}) */}
                                    </Typography>
                                </Box>

                                <Typography variant="body2" className="text-red-500" mt={1}>
                                    {course.price} VND
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>
            {/* Modal for course details */}
            <Dialog open={open} onClose={handleCloseModal} maxWidth="lg">
                <DialogContent>
                    <Box display="flex" width="990px" height="366px">
                        {/* Left - Image */}
                        <Box flex={1}>
                            <Image
                                src={selectedCourse?.imagePath || ""}
                                alt={selectedCourse?.name || ""}
                                width={390}
                                height={390}
                                layout="fixed"
                            />
                            <Typography
                                onClick={() => navigateToDetail(selectedCourse?.id || 0)}
                                variant="body1" className={"text-orange-600 font-thin cursor-pointer"} style={{ marginTop: '32px', marginLeft: "120px", color: "red" }}>
                                Xem chi tiết
                            </Typography>
                            <Button variant="contained" color="primary" style={{ marginTop: "42px", marginLeft: "120px" }}>
                                Tham gia
                            </Button>
                        </Box>
                        {/* Right - Course details */}
                        <Box flex={2} ml={2}>
                            <Typography variant="h6" fontWeight="bold">
                                {selectedCourse?.name}
                            </Typography>
                            <Typography variant="body1" className={"py-2"} style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical' }}>
                                Bài học Yoga cho Người mới bắt đầu - Học các kỹ năng Yoga, mẹo luyện tập Yoga hiệu quả, các nguyên tắc cơ bản, Cách luyện tập các tư thế Yoga.
                            </Typography>
                            <Typography variant="body1" className={"py-2"}>
                                <strong>Khóa học Yoga cho người mới bắt đầu giúp bạn:</strong>
                            </Typography>
                            <List className="benefits-list">
                                <ListItem>
                                    <ListItemIcon>
                                        <CheckCircleIcon style={{ color: 'green', width: "16px" }} />
                                    </ListItemIcon>
                                    <ListItemText className={"font-thin font-mono"} primary="Nắm vững các kiến thức nền tảng trong luyện tập Yoga" />
                                </ListItem>
                                {/* Repeat the ListItem for the other benefits as per your requirement */}
                                <ListItem>
                                    <ListItemIcon>
                                        <CheckCircleIcon style={{ color: 'green', width: "16px" }} />
                                    </ListItemIcon>
                                    <ListItemText className={"font-thin font-mono"} primary="Cải thiện tư thế và sự liên kết của bạn" />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <CheckCircleIcon style={{ color: 'green', width: "16px" }} />
                                    </ListItemIcon>
                                    <ListItemText className={"font-thin font-mono"} primary="Cải thiện tính linh hoạt" />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <CheckCircleIcon style={{ color: 'green', width: "16px" }} />
                                    </ListItemIcon>
                                    <ListItemText className={"font-thin font-mono"} primary="Phát triển sự cân bằng" />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <CheckCircleIcon style={{ color: 'green', width: "16px" }} />
                                    </ListItemIcon>
                                    <ListItemText className={"font-thin font-mono"} primary="Phát triển sự tập trung và năng suất" />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <CheckCircleIcon style={{ color: 'green', width: "16px" }} />
                                    </ListItemIcon>
                                    <ListItemText className={"font-thin font-mono"} primary="Giảm căng thẳng và lo âu" />
                                </ListItem>
                            </List>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default CourseCard;
