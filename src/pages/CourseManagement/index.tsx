import React, { useEffect, useState, useCallback } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import MainLayout from '../../components/SIdeBar';
import axios from 'axios';
import { apiURL } from '../../config/constanst';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import CourseCard from './CourseCard';
import FormDialog from './FormDialog';
import CourseFilter from './CourseFilter';
import { Course } from '../../types/course';

const CourseManagement = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<string>('A-Z');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<Course | undefined>(undefined);
  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);

  // Define fetchCourses as a function to be reused
  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(`${apiURL}/api/admin/all-course`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setCourses(response.data.data);
    } catch (error) {
      setError('Error fetching courses');
    } finally {
      setLoading(false);
    }
  }, []);

  // Call fetchCourses in the useEffect hook to load courses initially
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    const newSortOrder = event.target.value;
    setSortOrder(newSortOrder);
    const sortedCourses = [...courses].sort((a, b) =>
      newSortOrder === 'A-Z' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name),
    );
    setCourses(sortedCourses);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const openDialog = (course?: Course) => {
    setSelectedCourse(course || undefined);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedCourse(undefined);
  };
  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  return (
    <MainLayout
      title="Quản lý khóa học"
      content={
        <Box sx={{ padding: 4 }}>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography variant="h4">Khóa học</Typography>
            <Button variant="contained" color="primary" onClick={() => openDialog()}>
              + Khóa học mới
            </Button>
          </Box>

          <CourseFilter
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
          />

          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : filteredCourses.length === 0 ? (
            <Typography color="textSecondary">Không tìm thấy khóa học nào.</Typography>
          ) : (
            <Grid container spacing={2}>
              {filteredCourses.map((course) => (
                <Grid item xs={12} key={course.id}>
                  <CourseCard course={course} />
                </Grid>
              ))}
            </Grid>
          )}
          <FormDialog
            open={isDialogOpen}
            onClose={closeDialog}
            course={selectedCourse}
            onSave={fetchCourses} // Call fetchCourses to reload courses after saving
          />
        </Box>
      }
    />
  );
};

export default CourseManagement;
