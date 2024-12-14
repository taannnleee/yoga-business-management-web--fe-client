import React, { useState } from 'react';
import { Card, CardContent, CardMedia, IconButton, Typography, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Link } from 'react-router-dom';
import { Course } from '../../types/course';
import FormDialog from './FormDialog'; // Assuming FormDialog is in the same folder

const CourseCard = ({ course }: { course: Course }) => {
  const [openDialog, setOpenDialog] = useState(false); // Manage dialog open/close state

  // Handle edit button click
  const handleEdit = () => {
    setOpenDialog(true); // Show dialog
  };

  // Handle closing the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false); // Close dialog
  };

  // Handle save after editing
  const handleSaveCourse = () => {
    // You can add any logic to refresh the course data or update the state after saving
    handleCloseDialog();
  };

  return (
    <>
      <Card sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
        <CardMedia
          component="img"
          sx={{ width: 100, height: 100, borderRadius: 1 }}
          image={course.imagePath || 'https://via.placeholder.com/100'}
          alt={course.name}
        />
        <CardContent sx={{ flex: 1 }} component={Link} to={`/course-detail/${course.id}`}>
          <Typography variant="h6">{course.name}</Typography>
          <Typography color="textSecondary">{course.description}</Typography>
          <Typography variant="body2" color="textSecondary">
            Thời lượng: {course.duration} phút
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Giá: {course.price ? `${course.price} VNĐ` : 'Miễn phí'}
          </Typography>
        </CardContent>
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton color="primary" onClick={handleEdit}>
            <EditIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </Box>
      </Card>

      {/* Dialog component for editing the course */}
      <FormDialog
        open={openDialog}
        onClose={handleCloseDialog}
        course={course} // Passing the course to the dialog
        onSave={handleSaveCourse} // This function will be called when save is triggered
      />
    </>
  );
};

export default CourseCard;
