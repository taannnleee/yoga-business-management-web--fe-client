import * as React from 'react';
import { DataGrid, GridColDef, GridRenderCellParams, GridSelectionModel } from '@mui/x-data-grid';
import MainLayout from '../../components/SIdeBar';
import { Pagination } from '@mui/material';
import axios from 'axios';
import { useAppSelector } from '../../hooks/useRedux';
import { IRootState } from '../../redux';
import { apiURL } from '../../config/constanst';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import Spinner from '../../components/Spinner';
import ActionMenu from '../../components/ActionMenu';
import { PlusIcon } from '@heroicons/react/24/outline';
import CreateStoreForm from './CreateStoreForm';
import CustomDialog from '../../components/CustomDialog';
import { toast } from 'react-toastify';
import UpdateStoreForm from './UpdateStoreForm'; // Import the dialog

interface IStoreProps {
  id: number;
  name: string;
  storeCode: number;
  supportDelivery: boolean;
  supportPickup: boolean;
  openTime: number;
  closeTime: number;
  lng: number | null;
  lat: number | null;
  address: {
    streetAddress: string;
    state: string;
    city: string;
    country: string;
  };
}

const StoreMangement = () => {
  const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);
  const { user, accessToken } = useAppSelector((state: IRootState) => state.auth);
  const [stores, setStores] = React.useState<IStoreProps[]>([]);
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [page, setPage] = React.useState<number>(1);
  const [totalPage, setTotalPage] = React.useState<number>(1);

  const [selectedItem, setSelectedItem] = React.useState<IStoreProps | null>(null);
  const [openUpdateModal, setOpenUpdateModal] = React.useState<boolean>(false); // Use
  const [openCreateModal, setOpenCreateModal] = React.useState<boolean>(false); // Use // openUpdateModal

  const getAllStores = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiURL}/store?page=${page}&pageSize=10`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response?.data?.success) {
        setStores(response?.data?.data?.results || []);
        setTotalPage(Math.ceil(response?.data?.data?.total / 10));
      }
    } catch (error) {
      console.error('GET STORE ERROR', error);
    } finally {
      setLoading(false);
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    {
      field: 'name',
      headerName: 'Tên cửa hàng',
      width: 250,
    },
    {
      field: 'supportDelivery',
      headerName: 'Hỗ trợ giao hàng',
      width: 150,
      renderCell: (params: GridRenderCellParams<boolean>) =>
        params.value ? (
          <p className="rounded-full bg-green-50 px-2 py-1 text-xs font-bold text-green-800">
            Có hỗ trợ
          </p>
        ) : (
          <p className="rounded-full bg-red-50 px-2 py-1 text-xs font-bold text-red-800">
            Không hỗ trợ
          </p>
        ),
    },
    {
      field: 'supportPickup',
      headerName: 'Hỗ trợ lấy hàng',
      width: 150,
      renderCell: (params: GridRenderCellParams<boolean>) =>
        params.value ? (
          <p className="rounded-full bg-green-50 px-2 py-1 text-xs font-bold text-green-800">
            Có hỗ trợ
          </p>
        ) : (
          <p className="rounded-full bg-red-50 px-2 py-1 text-xs font-bold text-red-800">
            Không hỗ trợ
          </p>
        ),
    },
    {
      field: 'openTime',
      headerName: 'Giờ mở cửa',
      width: 150,
    },
    {
      field: 'closeTime',
      headerName: 'Giờ đóng cửa',
      width: 150,
    },
    {
      field: 'address',
      headerName: 'Địa chỉ',
      width: 400,
      valueGetter: (params) => {
        const { streetAddress, state, city, country } = params.row.address || {};

        if (!streetAddress && !state && !city && !country) {
          return 'Chưa có địa chỉ';
        }

        return `${streetAddress}, ${state}, ${city}, ${country}`;
      },
    },
    {
      field: 'actions',
      headerName: 'Hành động',
      width: 300,
      renderCell: (params: GridRenderCellParams<any>) => {
        const options = [
          {
            id: 'update',
            title: 'Cập nhật cửa hàng',
            onPress: () => {
              setSelectedItem(params.row as IStoreProps);
              setOpenUpdateModal(true); // Open the modal for updating
            },
            onActionSuccess: () => getAllStores(),
          },
        ];
        return isLoading && selectionModel.includes(params.row.id) ? (
          <Spinner size={20} />
        ) : (
          <ActionMenu options={options} />
        );
      },
    },
  ];

  React.useEffect(() => {
    if (user) {
      getAllStores();
    }
  }, [user, page]);

  return (
    <MainLayout
      title="Danh sách cửa hàng"
      content={
        isLoading ? (
          <div className="mt-20 h-full w-full px-8">
            <LoadingSkeleton />
          </div>
        ) : (
          <div className="flex w-full flex-col gap-y-5 rounded-2xl bg-white shadow-xl">
            <div className="flex flex-row items-center justify-between">
              <div></div>
              <div className="flex flex-row gap-x-2">
                <button
                  onClick={() => {
                    setSelectedItem(null); // Clear selected item for adding a new store
                    setOpenCreateModal(true); // Open the modal for adding
                  }}
                  className="flex h-[40px] w-fit items-center rounded-lg bg-gray-500 px-3 py-1 font-bold text-white hover:opacity-80"
                >
                  <PlusIcon className="h-[20px] w-[20px] font-bold text-white" />
                  <p>Thêm cửa hàng</p>
                </button>
              </div>
            </div>
            <div className="h-[800px] w-full">
              <DataGrid
                rows={stores}
                getRowId={(row) => row.id}
                paginationMode="server"
                page={page}
                rowCount={totalPage * 10} // Adjusted for rowCount
                pageSize={10}
                columns={columns}
                hideFooterPagination
                disableSelectionOnClick
                onSelectionModelChange={(newSelectionModel) => setSelectionModel(newSelectionModel)}
                selectionModel={selectionModel}
                checkboxSelection={false}
              />
            </div>
            <Pagination
              onChange={(event, changedPage) => setPage(changedPage)}
              count={totalPage}
              page={page}
            />

            {/* Modal for Adding or Updating Store */}
            {openUpdateModal && (
              <CustomDialog
                title={'Cập nhật cửa hàng'}
                open={openUpdateModal}
                onClose={() => setOpenUpdateModal(false)}
              >
                <UpdateStoreForm
                  onClose={() => setOpenUpdateModal(false)}
                  onConfirm={() => {
                    setOpenUpdateModal(false);
                    getAllStores(); // Refresh the store list
                    toast.success('Cập nhật cửa hàng thành công');
                  }}
                  // @ts-ignore
                  currentStore={selectedItem}
                  loading={isLoading}
                />
              </CustomDialog>
            )}

            {openCreateModal && (
              <CustomDialog
                title={'Thêm cửa hàng'}
                open={openCreateModal}
                onClose={() => setOpenCreateModal(false)}
              >
                <CreateStoreForm
                  onClose={() => setOpenCreateModal(false)}
                  onConfirm={() => {
                    setOpenCreateModal(false);
                    getAllStores(); // Refresh the store list
                    toast.success('Tạo cửa hàng thành công');
                  }}
                  loading={isLoading}
                />
              </CustomDialog>
            )}
          </div>
        )
      }
    />
  );
};

export default StoreMangement;
