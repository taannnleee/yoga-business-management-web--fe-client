// File: components/template/LeftSide/LeftSideGetAllProductSkeleton.tsx

import React from 'react';
import { Skeleton } from '@mui/material'; // Import Skeleton component from Material-UI

export const LeftSideGetAllProductSkeleton: React.FC = () => {
    return (
        <div className="w-64 bg-white shadow-lg p-4 space-y-4">
            {/* Category Skeleton */}
            <div className="space-y-2">
                <Skeleton variant="text" width="60%" height={30} />
                {/* Subcategory Skeleton */}
                <ul className="mt-2 space-y-1 ml-4">
                    <li>
                        <Skeleton variant="text" width="50%" height={20} />
                    </li>
                    <li>
                        <Skeleton variant="text" width="50%" height={20} />
                    </li>
                    <li>
                        <Skeleton variant="text" width="50%" height={20} />
                    </li>
                </ul>
            </div>

            {/* Repeat for multiple categories */}
            <div className="space-y-2">
                <Skeleton variant="text" width="60%" height={30} />
                {/* Subcategory Skeleton */}
                <ul className="mt-2 space-y-1 ml-4">
                    <li>
                        <Skeleton variant="text" width="50%" height={20} />
                    </li>
                    <li>
                        <Skeleton variant="text" width="50%" height={20} />
                    </li>
                    <li>
                        <Skeleton variant="text" width="50%" height={20} />
                    </li>
                </ul>
            </div>
        </div>
    );
};
