import React, { useState, useEffect } from "react";
import { Box, TextField, Button, CircularProgress } from "@mui/material";
import { apiURL } from "../../config/constanst";
import axios from "axios";
import { toast } from "react-toastify";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Pagination } from "@mui/material";
import UploadWidget from '../../designs/UploadWidget';

interface IImportProductFormProps {
  open: boolean;
  onClose: () => void;
  subId: number;
  onImportSuccess: () => void;
}




const ImportProductForm: React.FC<IImportProductFormProps> = (props) => {
  const { open, onClose, subId, onImportSuccess } = props;

  // Các state để lưu thông tin sản phẩm
  const [title, setTitle] = useState<string>("");
  const [imagePath, setImagePath] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [code, setCode] = useState<string>("");
  const [brand, setBrand] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [variants, setVariants] = useState<{ [key: string]: { [key: string]: string } }>({
    size: {},
    color: {},
    thin: {},
  });

  const colors = ["#2196F3", "#FF5722", "#FFEB3B"];
  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [selectedItem, setSelectedItem] = useState<IProduct[]>([]);

  // State để lưu trữ ảnh cho từng màu
  const [uploadedImages, setUploadedImages] = useState<{ [key: string]: string }>({});

  //upload ảnh
  const uploadImage = async (file: File, color: string) => {
    setLoading(true);
    const accessToken = localStorage.getItem("accessToken");
    console.log("kkkk2")
    console.log(accessToken)

    try {
      const formData = new FormData();
      formData.append("file", file); // Thêm file vào formData

      const response = await axios.post<{ data: { url: string } }>(
        `${apiURL}/api/image/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const uploadedImageUrl = response.data.data.url;
      setVariants((prev) => ({
        ...prev,
        color: {
          ...prev.color,
          [color]: uploadedImageUrl,  // Lưu URL ảnh cho màu sắc tương ứng
        },
      }));
      setUploadedImages((prev) => ({ ...prev, [color]: uploadedImageUrl }));
      toast.success("Tải ảnh lên thành công!");

    } catch (error) {
      toast.error("Đã có lỗi khi tải ảnh lên.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };





  const importProduct = async () => {
    const accessToken = localStorage.getItem("accessToken");
    console.log("kkkk2")
    console.log(accessToken)
    try {
      const productData = {
        title,
        subCategoryId: subId,
        imagePath,
        price,
        averageRating,
        code,
        brand,
        description,
        variants,
      };

      console.log(productData);
      console.log(accessToken)
      const response = await axios.post(
        `${apiURL}/api/admin/add-product`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response?.data?.status === 200) {
        toast.success("Sản phẩm đã được thêm vào cửa hàng!");
        onClose();
        onImportSuccess();
      } else {
        toast.error(response?.data?.message || "Lỗi khi thêm sản phẩm.");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Có lỗi xảy ra khi thêm sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {open ? (
        <div className="h-[900px] py-4">
          {/* Phần nhập liệu */}
          <div className="mb-6">
            <h3>Thêm sản phẩm vào cửa hàng</h3>
            <TextField
              label="Tên sản phẩm"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              margin="normal"
            />
            <UploadWidget
              setThumbnailUploaded={(image: string) => setImagePath(image)}
              thumbnailUploaded={imagePath}
            />
            <TextField
              label="Giá"
              fullWidth
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              margin="normal"
            />
            <TextField
              label="Đánh giá trung bình"
              fullWidth
              type="number"
              value={averageRating}
              onChange={(e) => setAverageRating(Number(e.target.value))}
              margin="normal"
            />
            <TextField
              label="Mã sản phẩm"
              fullWidth
              value={code}
              onChange={(e) => setCode(e.target.value)}
              margin="normal"
            />
            <TextField
              label="Thương hiệu"
              fullWidth
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              margin="normal"
            />
            <TextField
              label="Mô tả"
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              margin="normal"
            />

            <TextField
              label="Size (ví dụ: S, M, L)"
              fullWidth
              value={Object.keys(variants.size).join(", ")}
              onChange={(e) => {
                const newSize = e.target.value.split(",").reduce((acc, size) => {
                  acc[size.trim()] = `https://example.com/size${size.trim()}`;
                  return acc;
                }, {} as { [key: string]: string });
                setVariants((prev) => ({ ...prev, size: newSize }));
              }}
              margin="normal"
            />
            <TextField
              label="Thin (ví dụ: Thin, Medium, Thick)"
              fullWidth
              value={Object.keys(variants.thin).join(", ")}
              onChange={(e) => {
                const newThin = e.target.value.split(",").reduce((acc, thin) => {
                  acc[thin.trim()] = `https://example.com/thin${thin.trim()}`;
                  return acc;
                }, {} as { [key: string]: string });
                setVariants((prev) => ({ ...prev, thin: newThin }));
              }}
              margin="normal"
            />

            {/* Các ô vuông màu */}
            <Box display="flex" gap={2} marginBottom={3}>
              {colors.map((color) => (
                <div key={color} style={{ position: "relative" }}>
                  <input
                    id={`upload-input-${color}`}
                    type="file"
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files ? e.target.files[0] : null;
                      if (file) {
                        uploadImage(file, color);
                      }
                    }}
                  />
                  <Button
                    variant="outlined"
                    sx={{
                      backgroundColor: color,
                      width: 60,
                      height: 60,
                      borderRadius: 1,
                      boxShadow: uploadedImages[color] ? 3 : 0,
                    }}
                    onClick={() => {
                      const inputElement = document.getElementById(`upload-input-${color}`);
                      if (inputElement) {
                        inputElement.click(); // Tự động mở dialog file upload khi bấm vào ô màu
                      }
                    }}
                  />
                  {/* Hiển thị ảnh đã tải lên dưới ô màu */}
                  {uploadedImages[color] && (
                    <img
                      src={uploadedImages[color]}
                      alt={`Màu ${color}`}
                      style={{ width: 60, height: 60, marginTop: 8 }}
                    />
                  )}
                </div>
              ))}
            </Box>

            <div className="flex justify-end gap-x-2 mt-4">
              <Button onClick={onClose} variant="outlined" color="secondary">
                Hủy
              </Button>
              <Button
                onClick={importProduct}
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Thêm vào cửa hàng"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ImportProductForm;
