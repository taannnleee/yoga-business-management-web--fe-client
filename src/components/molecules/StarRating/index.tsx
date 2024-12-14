import React, { useState } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa'; // Import icons from react-icons/fa

interface StarRatingProps {
    rating: number;
    onRatingChange: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange }) => {
    const [currentRating, setCurrentRating] = useState<number>(rating || 0);

    // Function to handle the star click
    const handleStarPress = (index: number) => {
        setCurrentRating(index + 1); // Update the rating
        onRatingChange(index + 1); // Notify parent component about the rating change
    };

    // Render 5 stars
    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {Array.from({ length: 5 }).map((_, index) => (
                <button
                    key={index}
                    onClick={() => handleStarPress(index)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight:20 , width: 10, height: 10}}
                >
                    {index < currentRating ? (
                        <FaStar size={30} color="#FFD700" />
                    ) : (
                        <FaRegStar size={30} color="#D3D3D3" />
                    )}
                </button>
            ))}
            <span style={{ marginLeft: 10, fontSize: 16 }}>{currentRating}/5</span>
        </div>
    );
};

export default StarRating;
