import React, { useEffect, useRef } from "react";
import { toast } from "react-toastify";

interface IUploadMultipleWidgetProps {
  thumbnailUploaded: string[];
  setThumbnailUploaded: (image: string[]) => void;
}

const UploadMultipleWidget: React.FC<IUploadMultipleWidgetProps> = (props) => {
  const cloudinaryRef = useRef() as any;
  const widgetRef = useRef() as any;
  const { thumbnailUploaded } = props;

  useEffect(() => {
    cloudinaryRef.current = (window as any).cloudinary;
    widgetRef.current = cloudinaryRef.current?.createUploadWidget(
      {
        cloudName: "dfnuzzpe3",
        uploadPreset: "ml_default",
      },
      function (error: any, result: any) {
        if (result?.data?.event == "queues-end") {
          console.log("thumbnailUploaded", thumbnailUploaded);
          props.setThumbnailUploaded(
            result?.data?.info?.files?.map(
              (file: any) => file?.uploadInfo?.secure_url
            )
          );
          //   toast.success("Đăng các ảnh khác thành công");
        } else {
          //   toast.error("Đăng thumbnail thất bại");
        }
      }
    );
  }, [widgetRef]);

  return (
    <>
      <p className="text-md font-bold text-gray-700 mr-1">
        Upload các ảnh khác
      </p>
      <button
        className="px-4 py-2 text-sm text-gray-600 bg-gray-200 border-gray-300 rounded-lg"
        onClick={() => widgetRef.current?.open()}
      >
        {props.thumbnailUploaded?.length > 0 ? "Các ảnh" : "Đăng các ảnh khác"}
      </button>

      <div className="w-full flex flex-wrap gap-x-2 gap-y-1">
        {props.thumbnailUploaded?.length > 0 &&
          props.thumbnailUploaded.map((image, index) => (
            <img
              key={index}
              src={image}
              alt="thumbnail"
              className="w-20 h-20 object-cover rounded-lg"
            />
          ))}
      </div>
    </>
  );
};

export default UploadMultipleWidget;
