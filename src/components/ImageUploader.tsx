import { Upload, message } from 'antd';
import { PictureOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { getStorage } from 'firebase/storage';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface ImageUploaderProps {
  onImageUploaded: (imageUrl: string) => void;
}

export const ImageUploader = ({ onImageUploaded }: ImageUploaderProps) => {
  const props: UploadProps = {
    name: 'file',
    multiple: false,
    showUploadList: false,
    accept: 'image/*',
    beforeUpload: async (file) => {
      try {
        const fileName = `${Date.now()}-${file.name}`;
        const storage = getStorage();
        const storageRef = ref(storage, `chat-images/${fileName}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        onImageUploaded(downloadURL);
        message.success('圖片上傳成功！');
        return false;
      } catch (error) {
        message.error('圖片上傳失敗');
        return false;
      }
    },
  };

  return (
    <Upload {...props}>
      <button type="button" className="upload-button">
        <PictureOutlined />
      </button>
    </Upload>
  );
}; 