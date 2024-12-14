import React, { useState, useEffect, ChangeEvent } from 'react';
import { Box, Button, TextField, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import axios from 'axios';
import { apiURL } from '../../config/constanst';
import { toast } from 'react-toastify';
import Header from '../../components/Header';
import FooterSection from '../../components/FooterSection';
import UploadWidget from '../../designs/UploadWidget';
import MainLayout from '../../components/SIdeBar';

interface Category {
  id: number;
  name: string;
  status: string;
}

const CategoryManagement: React.FC = () => {
  const [formData, setFormData] = useState<{ name: string }>({ name: '' });
  const [subcategoryName, setSubcategoryName] = useState<string>(''); // State cho subcategory
  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalCategories, setTotalCategories] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  // Dialog State
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('');
  const [urlImage, setUrlImage] = useState<string>("");

  const fetchCategories = async () => {
    setLoading(true);
    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await axios.get(`${apiURL}/api/admin/get-all-category`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          page,
          limit: rowsPerPage,
        },
      });
      setCategories(response.data.data);
      setTotalCategories(response.data.data.length);
    } catch (error) {
      console.error('Failed to fetch categories', error);
      toast.error('Không thể tải danh mục.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, [page, rowsPerPage]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const accessToken = localStorage.getItem('accessToken');
    try {
      await axios.post(
        `${apiURL}/api/admin/add-category`,
        {
          name: formData.name,
          urlImage: urlImage
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success('Tạo danh mục thành công!');
      setFormData({ name: '' });
      fetchCategories();
    } catch (error) {
      console.error('Failed to create category', error);
      toast.error('Đã có lỗi xảy ra khi tạo danh mục.');
    }
    setLoading(false);
  };

  const handleRowClick = (params: any) => {
    // Lưu cả id và name của category đã chọn
    setSelectedCategoryId(params.row.id);
    setSelectedCategoryName(params.row.name);  // Lưu tên của danh mục vào state
    setOpenDialog(true);  // Mở dialog
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCategoryId(null);  // Reset lại id khi đóng dialog
    setSelectedCategoryName('');  // Reset lại name khi đóng dialog
    setSubcategoryName('');  // Reset lại subcategory name
  };

  const handleSubmitSubcategory = async () => {
    if (!selectedCategoryId || !subcategoryName) {
      toast.error('Vui lòng nhập tên category phụ.');
      return;
    }
    setLoading(true);
    const accessToken = localStorage.getItem('accessToken');
    try {
      await axios.post(
        `http://localhost:8080/api/admin/add-subcategory`,
        {
          name: subcategoryName,
          categoryId: selectedCategoryId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success('Tạo category phụ thành công!');
      setSubcategoryName('');  // Reset lại subcategory name sau khi thành công
      setOpenDialog(false);  // Đóng dialog sau khi tạo thành công
      fetchCategories();  // Tải lại danh mục
    } catch (error) {
      console.error('Failed to create subcategory', error);
      toast.error('Đã có lỗi xảy ra khi tạo category phụ.');
    }
    setLoading(false);
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Tên Danh Mục', width: 200 },
    { field: 'status', headerName: 'Trạng Thái', width: 150 },
    {
      field: 'actions',
      headerName: 'Hành động',
      width: 180,
      renderCell: () => (
        <>
          <Button variant="outlined" color="primary">
            Cập Nhật
          </Button>
          <Button variant="outlined" color="error" sx={{ ml: 1 }}>
            Xóa
          </Button>
        </>
      ),
    },
  ];

  return (
    <MainLayout
      title="Quản lý danh mục"
      content={
        <>

          <Box padding={3}>
            <Box marginBottom={3}>
              <TextField
                label="Tên Danh Mục"
                fullWidth
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              <UploadWidget
                setThumbnailUploaded={(image: string) => setUrlImage(image)}
                thumbnailUploaded={urlImage}
              />
            </Box>
            <Box marginTop={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={loading || !formData.name}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Tạo Danh Mục'}
              </Button>
            </Box>

            {/* DataGrid */}
            <Box marginTop={5} height={400}>
              <DataGrid
                rows={categories}
                columns={columns}
                pageSize={rowsPerPage}
                rowCount={totalCategories}
                paginationMode="server"
                onPageChange={(newPage) => setPage(newPage)}
                onPageSizeChange={(newRowsPerPage) => {
                  setRowsPerPage(newRowsPerPage);
                  setPage(0);
                }}
                loading={loading}
                onRowClick={handleRowClick}  // Thêm sự kiện row click
              />
            </Box>
          </Box>

          {/* Dialog */}
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Chi tiết Danh Mục</DialogTitle>
            <DialogContent>
              <Box>
                <p>ID: {selectedCategoryId}</p>
                <p>Tên Danh Mục: {selectedCategoryName}</p>

                {/* TextField cho category phụ */}
                <TextField
                  label="Tên Category Phụ"
                  fullWidth
                  name="subcategoryName"
                  value={subcategoryName}
                  onChange={(e) => setSubcategoryName(e.target.value)}
                  margin="normal"
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Đóng
              </Button>
              <Button
                onClick={handleSubmitSubcategory}
                color="primary"
                disabled={loading || !subcategoryName}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Tạo Category Phụ'}
              </Button>
            </DialogActions>
          </Dialog>


        </>
      }
    />

  );
};

export default CategoryManagement;
