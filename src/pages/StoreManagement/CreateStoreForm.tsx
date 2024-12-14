import React, { useState } from 'react';
import { Formik } from 'formik';
import axios from 'axios'; // Import axios
import * as yup from 'yup';
import Button from '../../designs/Button';
import SwitchListSecondary from './SwitchListSecondary';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { apiURL } from '../../config/constanst';
import BaseInput from '../../components/BaseInput';
import { toast } from 'react-toastify';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import StoreMap from './StoreMap'; // Import the dialog
interface IStoreFormValue {
  name: string;
  storeCode: string; // Changed to string
  supportDelivery: boolean;
  supportPickup: boolean;
  openTime: number | null; // Change to number
  closeTime: number | null; // Change to number
  lat: number | null; // Change to number
  lng: number | null; // Change to number
}

interface IStoreFormProps {
  onClose: () => void;
  loading: boolean;
  onConfirm: (values: IStoreFormValue) => void;
}

const CreateStoreForm: React.FC<IStoreFormProps> = ({ onClose, loading, onConfirm }) => {
  const [initialValues, setInitialValues] = useState<IStoreFormValue>({
    name: '',
    storeCode: '', // Changed to empty string
    supportDelivery: false,
    supportPickup: false,
    openTime: null,
    closeTime: null,
    lat: 10.8231,
    lng: 106.6297,
  });
  const handleSubmit = async (values: IStoreFormValue) => {
    try {
      // Call the API
      await axios.post(`${apiURL}/store`, {
        name: values.name,
        supportPickup: values.supportPickup,
        supportDelivery: values.supportDelivery,
        openTime: values.openTime, // Ensure this is in the correct format (e.g., 8 for 8 AM)
        closeTime: values.closeTime, // Ensure this is in the correct format (e.g., 21 for 9 PM)
        storeCode: Number(values.storeCode), // Convert storeCode to number
        lat: values.lat, // Include lat in the API call
        lng: values.lng,
      });
      // Call the onConfirm function if needed
      onConfirm(values);
    } catch (error) {
      toast.error('Đã có cửa hàng chọn mã của bạn rồi');
    }
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
      {({ handleSubmit, values, setFieldValue }) => (
        <div className="flex flex-col space-y-10">
          <div className="flex flex-col space-y-5">
            {/* Name and StoreCode */}
            <div className="grid grid-cols-1 gap-5 tablet:grid-cols-2">
              <BaseInput
                type="text"
                name="name"
                value={values.name}
                label="Tên cửa hàng"
                placeholder="Nhập tên cửa hàng"
                onChange={(e) => setFieldValue('name', e.target.value)}
              />
              <BaseInput
                type="text" // Changed to text for compatibility
                name="storeCode"
                value={values.storeCode}
                label="Mã cửa hàng"
                placeholder="Nhập mã cửa hàng"
                onChange={(e) => setFieldValue('storeCode', e.target.value)}
              />
            </div>

            {/* Support Options */}
            <SwitchListSecondary
              onChangeSupportDelivery={(value: boolean) => {
                console.log('Support Delivery changed to:', value); // Log state change
                setFieldValue('supportDelivery', value);
              }}
              onChangeSupportPickup={(value: boolean) => {
                console.log('Support Pickup changed to:', value); // Log state change
                setFieldValue('supportPickup', value);
              }}
              initialValues={{
                supportDelivery: values.supportDelivery,
                supportPickup: values.supportPickup,
              }}
            />

            {/* Time Pickers */}
            <div className="grid grid-cols-1 gap-5 tablet:grid-cols-2">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <StaticTimePicker
                  label="Giờ mở cửa"
                  value={values.openTime ? dayjs().hour(values.openTime) : null}
                  onChange={(newValue) => setFieldValue('openTime', newValue?.hour())}
                  renderInput={(params) => (
                    // @ts-ignore
                    <BaseInput {...params} />
                  )}
                />
                <StaticTimePicker
                  label="Giờ đóng cửa"
                  value={values.closeTime ? dayjs().hour(values.closeTime) : null}
                  onChange={(newValue) => setFieldValue('closeTime', newValue?.hour())} // Store
                  renderInput={(params) => (
                    // @ts-ignore
                    <BaseInput {...params} />
                  )}
                />
              </LocalizationProvider>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-semibold">Địa chỉ</h2>
              <StoreMap />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button variant="secondary" onClick={onClose} title="Đóng" />
            <Button
              type="button" // Changed to button
              title="Xác nhận"
              variant="primary"
              isLoading={loading}
              onClick={handleSubmit} // Directly calling submitForm
            />
          </div>
        </div>
      )}
    </Formik>
  );
};

export default CreateStoreForm;
