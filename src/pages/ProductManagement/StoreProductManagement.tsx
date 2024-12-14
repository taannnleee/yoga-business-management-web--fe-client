import * as React from 'react';
import { DataGrid, GridColDef, GridRenderCellParams, GridSelectionModel } from '@mui/x-data-grid';
import MainLayout from '../../components/SIdeBar';
import { Button, Dialog, Pagination, Skeleton, TablePagination } from '@mui/material';
import axios from 'axios';
import { useAppSelector } from '../../hooks/useRedux';
import { IRootState } from '../../redux';
import Spinner from '../../components/Spinner';
import { apiURL } from '../../config/constanst';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import ActionMenu from '../../components/ActionMenu';
import { toast } from 'react-toastify';
import CustomDialog from '../../components/CustomDialog';
import ProductForm from './ProductForm';
import { PlusIcon } from '@heroicons/react/24/outline';
import SelectComponent from '../../components/Select';
import ImportProductForm from './ImportProducForm';
import StoreProductForm from './StoreProductForm';

interface IStoreManagementProps {
  onChangeViewMode: (mode: 'tenant' | 'store') => void;
}

const StoreProductManagement: React.FC<IStoreManagementProps> = (props) => {
  const [deleteDisable, setDeleteDisable] = React.useState<boolean>(false);
  const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);

  const [products, setProducts] = React.useState<any[]>([]);  // Lưu trữ danh sách sản phẩm
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [page, setPage] = React.useState<number>(1);  // Quản lý trang
  const [totalPages, setTotalPages] = React.useState<number>(0);  // Tổng số trang
  const [actionLoading, setActionLoading] = React.useState<boolean>(false);
  const [selectedRow, setSelectedRow] = React.useState<string | number>('');
  const [selectedItem, setSelectedItem] = React.useState<IProduct | null>(null);
  const [openImportProductModal, setOpenImportProductModal] = React.useState<boolean>(false);
  const [currentSubCategory, setCurrentSubCategory] = React.useState<IStore | null>(null);
  const [listStore, setListStore] = React.useState<IStore[]>([]);
  const [subcategories, setSubcategories] = React.useState<any[]>([]);  // State để lưu danh sách subcategories
  const [openUpdateModal, setOpenUpdateModal] = React.useState<boolean>(false);
  const [storeLoading, setStoreLoading] = React.useState<boolean>(false);
  const accessToken = localStorage.getItem('accessToken');

  // Hàm lấy tất cả sản phẩm
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${apiURL}/api/admin/get-all-product?page=${page}&size=10`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response?.data?.status === 200) {
        setProducts(response.data.data.content);  // Dữ liệu sản phẩm nằm trong content
        setTotalPages(response.data.data.totalPages);  // Tổng số trang
      } else {
        setProducts([]);  // Nếu không có dữ liệu, reset mảng sản phẩm
      }
    } catch (error) {
      console.log('Lỗi khi lấy sản phẩm:', error);
      toast.error('Không thể tải sản phẩm.');
    } finally {
      setLoading(false);
    }
  };

  // Hàm lấy tất cả subcategories
  const getAllSubCategories = async () => {
    try {
      const response = await axios.get(`${apiURL}/api/admin/get-all-subcategory`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response?.data?.status === 200) {
        setSubcategories(response.data.data);
        setCurrentSubCategory(response.data.data[0]);
      } else {
        setSubcategories([]);
      }
    } catch (error) {
      console.log('Lỗi khi lấy danh sách loại sản phẩm:', error);
      toast.error('Không thể tải loại sản phẩm.');
    }
  };

  React.useEffect(() => {
    getAllProducts();  // Lấy danh sách sản phẩm
    getAllSubCategories();  // Lấy danh sách loại sản phẩm (subcategories)
  }, [page]);

  // Cột trong DataGrid
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'upc',
      headerName: 'Mã sản phẩm',
      width: 200,
      renderCell: (params: GridRenderCellParams<any>) => {
        return <div>{params.row.code}</div>;  // Mã sản phẩm từ API
      },
    },
    {
      field: 'name',
      headerName: 'Tên sản phẩm',
      width: 250,
      renderCell: (params: GridRenderCellParams<any>) => {
        return <div>{params.row.title}</div>;  // Tên sản phẩm từ API
      },
    },
    {
      field: 'price',
      headerName: 'Giá bán',
      width: 200,
      renderCell: (params: GridRenderCellParams<any>) => {
        return (
          <div className="text-sm font-semibold text-green-800">
            {params.row.price.toLocaleString()} VND
          </div>
        );
      },
    },
    {
      field: 'createdAt',
      headerName: 'Ngày tạo',
      width: 150,
      renderCell: (params: GridRenderCellParams<any>) => {
        return <div>{new Date(params.row.createdAt).toLocaleDateString()}</div>;  // Ngày tạo
      },
    },
    {
      field: 'updatedAt',
      headerName: 'Ngày cập nhật',
      width: 150,
      renderCell: (params: GridRenderCellParams<any>) => {
        return <div>{new Date(params.row.updatedAt).toLocaleDateString()}</div>;  // Ngày cập nhật
      },
    },
    {
      field: 'actions',
      headerName: 'Hành động',
      type: 'string',
      width: 300,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params: GridRenderCellParams<any>) => {
        const options = [
          {
            id: 'update',
            title: 'Cập nhật sản phẩm',
            onPress: () => {
              setSelectedItem(params.row);
              setOpenUpdateModal(true);
            },
            onActionSuccess: () => getAllProducts(),
          },
        ];
        return actionLoading && selectedRow === params.row?.id ? (
          <Spinner size={20} />
        ) : (
          <ActionMenu options={options} />
        );
      },
    },
  ];

  return (
    <>
      <MainLayout
        title="Danh sách sản phẩm"
        content={
          <>
            <div className="mb-6 flex w-full items-center justify-between gap-y-2">
              <div className="flex items-center">
                <SelectComponent
                  optionSelected={currentSubCategory}
                  options={subcategories}
                  name="currentSubCategory"
                  label="Chọn loại sản phẩm"
                  onSelect={(sub) => {
                    if (sub.id === 'all') {
                      props.onChangeViewMode('tenant');
                    } else {
                      setCurrentSubCategory(sub);
                    }
                  }}
                  placeholder="Chọn loại sản phẩm"
                />
              </div>
              <button
                onClick={() => {
                  setOpenImportProductModal(true);
                  setSelectedItem(null);
                }}
                className="flex h-[40px] w-fit items-center rounded-lg bg-gray-500 px-3 py-1 font-bold text-white hover:opacity-80"
              >
                <PlusIcon className="h-[20px] w-[20px] font-bold text-white" />
                <p>Nhập sản phẩm</p>
              </button>
            </div>

            <div className="flex w-full flex-col gap-y-5 rounded-2xl bg-white shadow-xl">
              <div className="h-[700px] w-full">
                <DataGrid
                  loading={isLoading || storeLoading}
                  rows={products}
                  paginationMode="server"
                  page={page}
                  rowCount={totalPages * 10}
                  pageSize={10}
                  columns={columns}
                  hideFooterPagination
                  disableSelectionOnClick
                  onSelectionModelChange={(newSelectionModel) => {
                    setDeleteDisable(!deleteDisable);
                    setSelectionModel(newSelectionModel);
                  }}
                  selectionModel={selectionModel}
                  checkboxSelection={false}
                />
                <div className="mt-4 flex flex-row-reverse gap-x-2">
                  <Pagination
                    onChange={(event, changedPage) => setPage(changedPage)}
                    count={totalPages}
                    defaultPage={1}
                    page={page}
                  />
                </div>
              </div>
            </div>
          </>
        }
      />

      {/* Modal Import Product */}
      {openImportProductModal ? (
        <CustomDialog
          title="Nhập sản phẩm"
          maxWidth="lg"
          open={openImportProductModal}
          onClose={() => setOpenImportProductModal(false)}
          children={
            <ImportProductForm
              onImportSuccess={() => getAllProducts()}
              subId={currentSubCategory?.id as number}
              open={openImportProductModal}
              onClose={() => setOpenImportProductModal(false)}
            />
          }
        />
      ) : null}

      {/* Modal Update Product */}
      {openUpdateModal && (
        <CustomDialog
          title="Chỉnh sửa sản phẩm"
          maxWidth="md"
          open={openUpdateModal}
          onClose={() => setOpenUpdateModal(false)}
          children={
            <StoreProductForm
              onClose={() => setOpenImportProductModal(false)}
              loading={actionLoading}
              currentProduct={selectedItem}
              onConfirm={(productValue) => {
                if (selectedItem) {
                  // Gọi API cập nhật sản phẩm tại đây
                }
              }}
            />
          }
        />
      )}
    </>
  );
};

export default StoreProductManagement;
