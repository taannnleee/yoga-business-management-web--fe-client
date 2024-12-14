import React, { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

interface IUploadWidgetProps {
  thumbnailUploaded: string;
  setThumbnailUploaded: (image: string) => void;
  setVideoDuration: (duration: string) => void;
}

const UploadVideoWidget: React.FC<IUploadWidgetProps> = (props) => {
  const cloudinaryRef = useRef() as any;
  const widgetRef = useRef() as any;

  useEffect(() => {
    cloudinaryRef.current = (window as any).cloudinary;
    widgetRef.current = cloudinaryRef.current?.createUploadWidget(
      {
        cloudName: 'dfnuzzpe3',
        uploadPreset: 'ml_default',
      },
      function (error: any, result: any) {
        if (result.event === 'success') {
          props.setThumbnailUploaded(result?.info?.secure_url);

          // Lấy duration từ kết quả và chuyển đổi sang phút
          const durationSeconds = result?.info?.duration;
          const durationMinutes = (durationSeconds / 60).toFixed(2);
          props.setVideoDuration(durationMinutes);

          // Hiển thị thời lượng video
          toast.success(`Video uploaded successfully! Duration: ${durationMinutes} minutes`);
        } else if (error) {
          toast.error('Failed to upload video');
        }
      },
    );
  }, []);

  return (
    <>
      <p className="text-md mr-1 font-bold text-gray-700">Upload video giới thiệu khoá học</p>
      <button
        className="mt-2 flex flex-wrap rounded-lg border-gray-300 bg-gray-200 px-4 py-2 text-sm text-gray-600"
        onClick={() => widgetRef.current?.open()}
      >
        {!!props.thumbnailUploaded ? props.thumbnailUploaded : 'Đăng video'}
      </button>
    </>
  );
};

export default UploadVideoWidget;
