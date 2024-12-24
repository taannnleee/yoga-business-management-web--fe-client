'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    RadioGroup,
    FormControlLabel,
    Typography,
    TextField,
    Button,
    Avatar,
    Divider,
    Snackbar,
    Radio,
    Alert,
} from '@mui/material';
import { API_URL } from "@/config/url";
import { useToast } from "@/hooks/useToast";

const AccountInfo: React.FC = () => {
    const [phoneError, setPhoneError] = useState<string>('');
    const toast = useToast();
    const [activeTab, setActiveTab] = useState<'accountInfo' | 'changePassword'>('accountInfo');
    const [profileData, setProfileData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);


    const [isProfileUpdated, setIsProfileUpdated] = useState<boolean>(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    const isPhoneValid = (phone: string) => {
        // Kiểm tra số điện thoại có đúng định dạng (10 chữ số và bắt đầu bằng 0)
        const phoneRegex = /^0\d{9}$/;
        return phoneRegex.test(phone);
    };
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        imagePath: '',
        gender: '',
        dateOfBirth: '',// Thêm gender vào formData
    });

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleChangePassword = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            toast.sendToast("Error", "Access token is missing.", "error");
            return;
        }

        // Kiểm tra nếu mật khẩu hiện tại và mật khẩu mới giống nhau
        if (passwordForm.currentPassword === passwordForm.newPassword) {
            toast.sendToast("Error", "New password cannot be the same as the current password.", "error");
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
            toast.sendToast("Error", "New password and confirm new password must match.", "error");
            return;
        }

        // Kiểm tra độ dài mật khẩu
        if (passwordForm.newPassword.length > 50) {
            toast.sendToast("Error", "Password cannot be longer than 50 characters.", "error");
            return;
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,50}$/;
        if (!passwordRegex.test(passwordForm.newPassword)) {
            toast.sendToast("Error", "Password must be at least 8 characters long and contain at least one letter, one number, and one special character.", "error");

            return;
        }

        try {
            const response = await axios.post(
                `${API_URL}/api/user/change-password`,
                {
                    password: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword,
                    confirmNewPassword: passwordForm.confirmNewPassword,
                },
                {
                    headers: { "Authorization": `Bearer ${token}` },
                }
            );
            toast.sendToast("Success", "Password changed successfully");

            // Gọi API đăng xuất
            await axios.post(
                `${API_URL}/api/auth/logout`,
                {},
                {
                    headers: { "Authorization": `Bearer ${token}` },

                }
            );

            // Xóa token sau khi đăng xuất
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");

            // Đưa người dùng trở lại trang đăng nhập (hoặc redirect)
            window.location.href = "/login"; // Thay đổi trang theo yêu cầu của bạn
        } catch (err: any) {
            toast.sendToast("Error", "Pass word incorrect", "error");
        }
    };

    const hasChanges = () => {
        return (
            formData.firstName !== profileData?.firstName ||
            formData.lastName !== profileData?.lastName ||
            formData.email !== profileData?.email ||
            formData.phone !== profileData?.phone ||
            formData.imagePath !== profileData?.imagePath ||
            formData.gender !== profileData?.gender ||
            formData.dateOfBirth !== profileData?.dateOfBirth
        );
    };

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("accessToken");
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/api/user/get-profile`, {
                    headers: { "Authorization": `Bearer ${token}` },
                });

                setProfileData(response.data.data);

                const formattedDateOfBirth = response.data.data.dateOfBirth
                    ? new Date(response.data.data.dateOfBirth).toISOString().split('T')[0] // Convert to YYYY-MM-DD format
                    : '';
                setFormData({
                    firstName: response.data.data.firstName || '',
                    lastName: response.data.data.lastName || '',
                    email: response.data.data.email || '',
                    phone: response.data.data.phone || '',
                    imagePath: response.data.data.imagePath || '',
                    gender: response.data.data.gender || '',
                    dateOfBirth: formattedDateOfBirth || '',
                });
            } catch (err) {
                toast.sendToast("Error", "Failed to load profile data.", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const newFormData = { ...prev, [name]: value };

            // Reset isProfileUpdated when there is a change
            setIsProfileUpdated(false);

            return newFormData;
        });
    };

    const handleImageUpload = async (file: File): Promise<string | null> => {
        const accessToken = localStorage.getItem('accessToken');
        const formDataObj = new FormData();
        formDataObj.append('file', file);

        try {
            const response = await axios.post<{ data: { url: string } }>(
                `${API_URL}/api/image/upload`,
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
            toast.sendToast("Error", "Failed to upload image.", "error");

            return null;
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const imageUrl = await handleImageUpload(file);
            if (imageUrl) {
                setFormData((prev) => ({ ...prev, imagePath: imageUrl }));
            }
        }
    };

    const handleUpdateProfile = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            toast.sendToast("Error", "Access token is missing.", "error");
            return;
        }
        // Kiểm tra số điện thoại
        if (!isPhoneValid(formData.phone)) {
            setPhoneError("Phone number is invalid. It must be a 10-digit number.");
            return;
        } else {
            setPhoneError(""); // Xóa lỗi nếu số điện thoại hợp lệ
        }

        try {
            const response = await axios.post(
                `${API_URL}/api/user/update-profile`,
                formData,
                {
                    headers: { "Authorization": `Bearer ${token}` },
                }
            );

            toast.sendToast("Success", "Profile updated successfully!");

            setIsProfileUpdated(true);
        } catch (err: any) {
            toast.sendToast("Error", "Failed to update profile.", "error");
        }
    };

    const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newGender = event.target.value;
        setFormData((prev) => {
            // Kiểm tra nếu gender thay đổi
            const updatedFormData = { ...prev, gender: newGender };

            // Cập nhật trạng thái khi có thay đổi
            setIsProfileUpdated(false);  // Đánh dấu là chưa cập nhật
            return updatedFormData;
        });
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }



    return (
        <Box display="flex" padding={4}>
            <Box width="20%" paddingRight={4}>
                <Typography variant="h6" gutterBottom>
                    Settings
                </Typography>
                <Box component="ul" style={{ listStyle: 'none', padding: 0 }}>
                    {[
                        { label: 'Account Info', value: 'accountInfo' },
                        { label: 'Change Password', value: 'changePassword' },
                    ].map((item, index) => (
                        <li
                            key={index}
                            style={{
                                marginBottom: '10px',
                                cursor: 'pointer',
                                color: activeTab === item.value ? 'blue' : 'black',
                            }}
                        // onClick={() => setActiveTab(item.value)}
                        >
                            <Typography variant="body1">{item.label}</Typography>
                        </li>
                    ))}
                </Box>
            </Box>

            <Divider orientation="vertical" flexItem />

            <Box width="80%" paddingLeft={4}>
                {activeTab === 'accountInfo' && (
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            About you
                        </Typography>

                        <Box display="flex" alignItems="center" marginBottom={4}>
                            <Avatar
                                alt="User Avatar"
                                src={formData.imagePath || '/avatar-placeholder.png'}
                                sx={{ width: 80, height: 80, marginRight: 2 }}
                            />
                            <Button variant="outlined" component="label">
                                Upload image
                                <input type="file" hidden onChange={handleFileChange} />
                            </Button>
                        </Box>

                        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} style={{ marginBottom: '20px' }}>
                            <TextField
                                label="First name"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                variant="outlined"
                                fullWidth
                            />
                            <TextField
                                label="Last name"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                variant="outlined"
                                fullWidth
                            />
                            <TextField
                                label="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                variant="outlined"
                                fullWidth
                                InputProps={{
                                    readOnly: true,  // Ngăn người dùng sửa email
                                }}
                            />
                            <TextField
                                label="Phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                variant="outlined"
                                fullWidth
                                error={!!phoneError}  // Hiển thị lỗi nếu có
                                helperText={phoneError}  // Hiển thị thông báo lỗi
                            />
                        </Box>

                        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                            <TextField
                                label="Birth date (optional)"
                                name="dateOfBirth"
                                type="date"
                                variant="outlined"
                                value={formData.dateOfBirth}  // Bind the value to the formData
                                onChange={handleInputChange}  // Handle input change to update formData
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    inputProps: {
                                        max: new Date().toISOString().split("T")[0], // Set max date to today's date
                                    },
                                }}
                                fullWidth
                            />
                        </Box>

                        <Box marginTop={3}>
                            <Typography variant="subtitle1" gutterBottom>
                                Gender
                            </Typography>
                            <RadioGroup row value={formData.gender} onChange={handleGenderChange}>
                                <FormControlLabel value="MALE" control={<Radio />} label="Male" />
                                <FormControlLabel value="FEMALE" control={<Radio />} label="Female" />
                                <FormControlLabel value="OTHER" control={<Radio />} label="Other" />
                            </RadioGroup>
                        </Box>

                        <Box marginTop={4}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleUpdateProfile}
                                disabled={!hasChanges() || isProfileUpdated}
                            >
                                Update profile
                            </Button>
                        </Box>
                    </Box>
                )}
                {activeTab === 'changePassword' && (
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Change Password
                        </Typography>
                        <Box display="grid" gridTemplateColumns="1fr" gap={2} marginTop={2}>
                            <TextField
                                label="Current Password"
                                type="password"
                                variant="outlined"
                                fullWidth
                                name="currentPassword"
                                value={passwordForm.currentPassword}
                                onChange={handlePasswordChange}
                            />
                            <TextField
                                label="New Password"
                                type="password"
                                variant="outlined"
                                fullWidth
                                name="newPassword"
                                value={passwordForm.newPassword}
                                onChange={handlePasswordChange}
                            />
                            <TextField
                                label="Confirm New Password"
                                type="password"
                                variant="outlined"
                                fullWidth
                                name="confirmNewPassword"
                                value={passwordForm.confirmNewPassword}
                                onChange={handlePasswordChange}
                            />
                        </Box>

                        <Box marginTop={4}>
                            <Button variant="contained" color="primary" onClick={handleChangePassword}>
                                Save Password
                            </Button>
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default AccountInfo;
