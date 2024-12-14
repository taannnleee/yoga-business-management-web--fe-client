import React, { useState, useEffect, ChangeEvent } from 'react';
import { Box, Typography, Button, TextField, Grid, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Header from '../../components/Header';
import FooterSection from '../../components/FooterSection';
import axios from 'axios';
import { apiURL } from '../../config/constanst';
import { toast } from 'react-toastify';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import MainLayout from '../../components/SIdeBar';

interface FormData {
    fullName: string;
    email: string;
    phoneNumber: string;
    experienceYears: number;
    profilePicture: File | null;
    introduction: string;
    description: string;
}

interface Teacher {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    experienceYears: number;
    profilePicture: string;
    introduction: string;
    description: string;
}

const TeacherManagement: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        email: '',
        phoneNumber: '',
        experienceYears: 0,
        profilePicture: null,
        introduction: '',
        description: '',
    });
    const [previewImage, setPreviewImage] = useState<string>('https://cdn.pixabay.com/photo/2017/11/10/05/46/group-2935521_1280.png');
    const [loading, setLoading] = useState<boolean>(false);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [totalTeachers, setTotalTeachers] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

    // Fetch teachers from the API
    const fetchTeachers = async () => {
        setLoading(true);
        const accessToken = localStorage.getItem('accessToken');
        try {
            const response = await axios.get(`${apiURL}/api/admin/all-teachers`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                params: {
                    page,
                    limit: rowsPerPage,
                },
            });
            setTeachers(response.data.data);
            setTotalTeachers(response.data.total);
        } catch (error) {
            console.error('Failed to fetch teachers', error);
            toast.error('Không thể tải danh sách giáo viên.');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTeachers();
    }, [page, rowsPerPage]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, files } = e.target;
        if (type === 'file' && files) {
            const file = files[0];
            setFormData(prevData => ({ ...prevData, profilePicture: file }));
            setPreviewImage(URL.createObjectURL(file));
        } else {
            setFormData(prevData => ({ ...prevData, [name]: value }));
        }
    };

    const handleImageUpload = async (): Promise<string | null> => {
        const accessToken = localStorage.getItem('accessToken');
        if (formData.profilePicture) {
            const formDataObj = new FormData();
            formDataObj.append('file', formData.profilePicture);

            try {
                const response = await axios.post<{ data: { url: string } }>(
                    `${apiURL}/api/image/upload`,
                    formDataObj,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                return response.data.data.url;
            } catch (error) {
                console.error('Image upload failed', error);
                return null;
            }
        }
        return null;
    };

    const handleSubmit = async () => {
        setLoading(true);
        const accessToken = localStorage.getItem('accessToken');
        const imageUrl = await handleImageUpload();

        if (imageUrl) {
            const teacherData = {
                fullName: formData.fullName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                experienceYears: formData.experienceYears,
                profilePicture: imageUrl,
                introduction: formData.introduction,
                description: formData.description,
            };

            try {
                const response = await axios.post(`${apiURL}/api/admin/add-teacher`, teacherData, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                toast.success('Tạo Giáo Viên thành công!');
                setFormData({
                    fullName: '',
                    email: '',
                    phoneNumber: '',
                    experienceYears: 0,
                    profilePicture: null,
                    introduction: '',
                    description: '',
                });
                setPreviewImage('https://cdn.pixabay.com/photo/2017/11/10/05/46/group-2935521_1280.png'); // Reset preview image
                fetchTeachers();
            } catch (error) {
                console.error('Teacher creation failed', error);
                toast.error('Đã có lỗi xảy ra khi tạo giáo viên.');
            }
        } else {
            toast.error('Vui lòng tải ảnh đại diện.');
        }

        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        const accessToken = localStorage.getItem('accessToken');
        setLoading(true);
        try {
            await axios.delete(`${apiURL}/api/admin/delete-teacher/${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            toast.success('Xóa giáo viên thành công!');
            fetchTeachers();
        } catch (error) {
            console.error('Delete failed', error);
            toast.error('Đã có lỗi xảy ra khi xóa giáo viên.');
        }
        setLoading(false);
    };

    const handleEdit = (teacher: Teacher) => {
        setSelectedTeacher(teacher);
        setFormData({
            fullName: teacher.fullName,
            email: teacher.email,
            phoneNumber: teacher.phoneNumber,
            experienceYears: teacher.experienceYears,
            profilePicture: null,
            introduction: teacher.introduction,
            description: teacher.description,
        });
        setPreviewImage(teacher.profilePicture);
        setEditDialogOpen(true);
    };

    const handleUpdate = async () => {
        if (selectedTeacher) {
            setLoading(true);
            const accessToken = localStorage.getItem('accessToken');
            const imageUrl = await handleImageUpload();

            const updatedTeacherData = {
                fullName: formData.fullName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                experienceYears: formData.experienceYears,
                profilePicture: imageUrl || selectedTeacher.profilePicture,
                introduction: formData.introduction,
                description: formData.description,
            };

            try {
                await axios.put(`${apiURL}/api/admin/update-teacher/${selectedTeacher.id}`, updatedTeacherData, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                toast.success('Cập nhật giáo viên thành công!');
                fetchTeachers();
                setEditDialogOpen(false);
            } catch (error) {
                console.error('Update failed', error);
                toast.error('Đã có lỗi xảy ra khi cập nhật giáo viên.');
            }
            setLoading(false);
        }
    };

    const handleChangePage = (newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (newRowsPerPage: number) => {
        setRowsPerPage(newRowsPerPage);
        setPage(0);
    };

    const columns: GridColDef[] = [
        {
            field: 'profilePicture',
            headerName: 'Ảnh',
            width: 100,
            renderCell: (params) => (
                <img
                    src={params.value || 'https://via.placeholder.com/100'}
                    alt={params.row.fullName}
                    width="50"
                    height="50"
                    style={{ objectFit: 'cover', borderRadius: '50%' }}
                />
            ),
        },
        {
            field: 'fullName',
            headerName: 'Họ và Tên',
            width: 200,
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 250,
        },
        {
            field: 'phoneNumber',
            headerName: 'Số Điện Thoại',
            width: 150,
        },
        {
            field: 'experienceYears',
            headerName: 'Kinh Nghiệm',
            width: 150,
            valueFormatter: (params) => `${params.value} năm`,
        },
        {
            field: 'introduction',
            headerName: 'Giới Thiệu',
            width: 200,
            valueFormatter: (params) => params.value || 'Chưa có',
        },
        {
            field: 'actions',
            headerName: 'Hành động',
            width: 180,
            renderCell: (params) => (
                <>
                    <Button variant="outlined" color="primary" onClick={() => handleEdit(params.row)}>
                        Cập Nhật
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDelete(params.row.id)}
                        sx={{ ml: 1 }}
                    >
                        Xóa
                    </Button>
                </>
            ),
        },
    ];

    return (
        <MainLayout
            title="Quản lý giáo viên"
            content={
                <>
                    <Box padding={3}>

                        <Box marginBottom={3}>
                            <TextField
                                label="Họ và Tên"
                                fullWidth
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                            />
                        </Box>

                        <Box marginBottom={3}>
                            <TextField
                                label="Email"
                                fullWidth
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </Box>

                        <Box marginBottom={3}>
                            <TextField
                                label="Số Điện Thoại"
                                fullWidth
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                            />
                        </Box>

                        <Box marginBottom={3}>
                            <TextField
                                label="Kinh Nghiệm (năm)"
                                fullWidth
                                name="experienceYears"
                                type="number"
                                value={formData.experienceYears}
                                onChange={handleChange}
                            />
                        </Box>

                        <Box marginBottom={3}>
                            <TextField
                                label="Giới Thiệu Ngắn"
                                fullWidth
                                name="introduction"
                                value={formData.introduction}
                                onChange={handleChange}
                                multiline
                                rows={4}  // Cho phép nhập nhiều dòng
                            />
                        </Box>

                        <Box marginBottom={3}>
                            <TextField
                                label="Mô tả"
                                fullWidth
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                multiline
                                rows={4}  // Cho phép nhập nhiều dòng
                            />
                        </Box>

                        <Box marginBottom={3}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleChange}
                            />
                            <img
                                src={previewImage}
                                alt="preview"
                                style={{ marginTop: 10, width: 100, height: 100, borderRadius: '50%' }}
                            />
                        </Box>

                        <Box marginTop={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                Tạo Giáo Viên
                            </Button>
                        </Box>

                        {/* DataGrid */}
                        <Box marginTop={5} height={400}>
                            <DataGrid
                                rows={teachers}
                                columns={columns}
                                pageSize={rowsPerPage}
                                rowCount={totalTeachers}
                                paginationMode="server"
                                onPageChange={handleChangePage}
                                onPageSizeChange={handleChangeRowsPerPage}
                                loading={loading}
                            />
                        </Box>
                    </Box>

                    {/* Edit Teacher Dialog */}
                    <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
                        <DialogTitle>Cập Nhật Giáo Viên</DialogTitle>
                        <DialogContent>
                            <Box marginBottom={3}>
                                <TextField
                                    label="Họ và Tên"
                                    fullWidth
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    sx={{ width: '900px' }}
                                />
                            </Box>

                            <Box marginBottom={3}>
                                <TextField
                                    label="Email"
                                    fullWidth
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </Box>

                            <Box marginBottom={3}>
                                <TextField
                                    label="Số Điện Thoại"
                                    fullWidth
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                />
                            </Box>

                            <Box marginBottom={3}>
                                <TextField
                                    label="Kinh Nghiệm (năm)"
                                    fullWidth
                                    name="experienceYears"
                                    type="number"
                                    value={formData.experienceYears}
                                    onChange={handleChange}
                                />
                            </Box>

                            <Box marginBottom={3}>
                                <TextField
                                    label="Giới Thiệu"
                                    fullWidth
                                    name="introduction"
                                    value={formData.introduction}
                                    onChange={handleChange}
                                    multiline
                                    rows={4}
                                />
                            </Box>

                            <Box marginBottom={3}>
                                <TextField
                                    label="Mô tả"
                                    fullWidth
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    multiline
                                    rows={4}
                                />
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setEditDialogOpen(false)} color="primary">
                                Hủy
                            </Button>
                            <Button onClick={handleUpdate} color="primary" disabled={loading}>
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Cập Nhật'}
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <FooterSection />
                </>
            }
        />


    );
};

export default TeacherManagement;
