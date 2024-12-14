import React, { useEffect } from "react";

import { XMarkIcon } from "@heroicons/react/20/solid";
import { Formik } from "formik";
import * as yup from "yup";
import InputText from "../../designs/InputText";
import Button from "../../designs/Button";
import RichTextInput from "../../designs/RichTextInput";
import InputNumber from "../../designs/InputNumber";
import BaseInput from "../../components/BaseInput";
import { useAppSelector } from "../../hooks/useRedux";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import SelectComponent from "../../components/Select";
import { apiURL } from "../../config/constanst";
import UploadWidget from "../../designs/UploadWidget";
import UploadMultipleWidget from "../../designs/UploadMultipleWidget";

interface IFormValue extends Omit<IProduct, "id"> {}
interface IProductFormProps {
  currentProduct: IProduct | null;
  onClose: () => void;
  loading: boolean;
  onConfirm: (values: IFormValue) => void;
}

const StoreProductForm: React.FC<IProductFormProps> = (props) => {
  const { currentProduct, onClose, loading, onConfirm } = props;
  const [initialValues, setInitialValues] = React.useState<IFormValue | null>(
    currentProduct || null
  );
  const [listCategory, setListCategory] = React.useState<IProductCategory[]>(
    []
  );
  const { accessToken } = useAppSelector((state) => state.auth);
  const [selectedCategory, setSelectedCategory] =
    React.useState<IProductCategory | null>(null);
  const [thumbnailSelected, setThumbnailSelected] = React.useState<string>("");
  const [images, setImagesSelected] = React.useState<string[]>([]);

  const validationSchema = yup
    .object()
    .shape<{ [k in keyof IFormValue]: any }>({
      name: yup.string().required("Vui lòng điền tên sản phẩm"),
      upc: yup.string().required("Vui lòng nhập mã sản phẩm"),
      price: yup.object().shape<{ [k in keyof ProductPrice]: any }>({
        price: yup.number().required("Vui lòng nhập giá sản phẩm"),
        displayPrice: yup.string().required("Vui lòng nhập giá sản phẩm"),
      }),
    });

  const handleSubmit = async (values: IFormValue) => {
    onConfirm({
      ...values,
      price: {
        ...values.price,
        price: Number(values.price.price),
      },
      thumbnail: thumbnailSelected,
      images: images,
    });
  };

  const getAllCategories = async () => {
    try {
      const response = await axios.get(`${apiURL}/category`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response?.data.success) {
        setListCategory(response?.data?.data?.data);
      }
    } catch (error) {
      console.log("GET PRODUCT CATEGORY ERROR", error);
    } finally {
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  useEffect(() => {
    if (currentProduct?.category) {
      setInitialValues({
        ...currentProduct,
        category: (currentProduct.category as any).id,
      });
      setSelectedCategory(currentProduct.category as any);
      setThumbnailSelected(currentProduct.thumbnail || "");
      setImagesSelected(currentProduct.images || []);
    }
  }, [currentProduct]);

  return (
    <Formik
      initialValues={initialValues || ({} as any)}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ submitForm, values, handleSubmit, setValues, setFieldValue }) => {
        return (
          <div className="flex flex-col space-y-10">
            <div className="flex flex-col space-y-5">
              <div className="grid grid-cols-1 tablet:grid-cols-2 gap-x-2 gap-y-5 items-center justify-between">
                <BaseInput
                  type="text"
                  name="name"
                  value={values?.name}
                  label="Tên sản phẩm"
                  placeholder="Nhập tên sản phẩm"
                />
                <BaseInput
                  type="text"
                  name="upc"
                  value={values?.upc}
                  label="Mã sản phẩm"
                  placeholder="Nhập mã sản phẩm"
                />
              </div>

              <div className="grid grid-cols-1 tablet:grid-cols-2 gap-x-2 gap-y-5 items-center justify-between">
                <BaseInput
                  type="number"
                  mode="text"
                  name="price.price"
                  value={values?.price?.price}
                  label="Giá sản phẩm"
                  placeholder="Nhập giá sản phẩm"
                />
                <BaseInput
                  type="text"
                  name="price.displayPrice"
                  value={values?.price?.displayPrice}
                  label="Giá hiển thị sản phẩm"
                  placeholder="Nhập giá hiển thị sản phẩm"
                />
              </div>
              <UploadWidget
                thumbnailUploaded={thumbnailSelected}
                setThumbnailUploaded={(image) => setThumbnailSelected(image)}
              />
              <UploadMultipleWidget
                thumbnailUploaded={images}
                setThumbnailUploaded={(images) => setImagesSelected(images)}
              />
              <div className="grid grid-cols-1 tablet:grid-cols-2 gap-x-2 gap-y-5 items-center justify-between">
                <SelectComponent
                  name="category"
                  label="Danh mục"
                  placeholder="Chọn danh mục"
                  optionSelected={selectedCategory}
                  keyValue="id"
                  keyLabel="name"
                  options={listCategory}
                  onSelect={(option) => {
                    setSelectedCategory(option);
                    setFieldValue("category", option.id);
                  }}
                />
              </div>

              <RichTextInput
                name="fullDescription"
                value={values?.fullDescription}
                label="Mô tả"
                placeholder="Mô tả sản phẩm"
              />
            </div>
            <div className="flex justify-between items-center">
              <div></div>
              <div className="flex items-center">
                <Button
                  variant="secondary"
                  onClick={() => onClose()}
                  title="Đóng"
                />
                <Button
                  type="submit"
                  title="Xác nhận"
                  variant="primary"
                  className="ml-2"
                  isLoading={loading}
                  onClick={handleSubmit}
                />
              </div>
            </div>
          </div>
        );
      }}
    </Formik>
  );
};

export default StoreProductForm;
