import { fileSizeFormat } from '@/utils/toolFns';
import {
  IconDelete,
  IconEyeOpened,
  IconFile,
  IconUpload,
} from '@douyinfe/semi-icons';
import { Button, Toast } from '@douyinfe/semi-ui';
import Upload from 'rc-upload';
import { useState } from 'react';

interface PropsType {
  onChange?: (value: any) => void;
  value?: File;
}

export default function UploadFile({ onChange, value }: PropsType) {
  const [fileBlob, setFileBlob] = useState<Blob>();
  const [imgSmall, setImgSmall] = useState<string>('');

  const beforeUpload = (file: File) => {
    onChange?.(file);
    // const fmData = new FormData();
    // fmData.append('file', file);
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      Toast.error('图片大小不能超过2M!');
    }
    setFileBlob(file);

    const reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        setImgSmall(reader.result as string);
      },
      false
    );
    reader.readAsDataURL(file);
    return false;
  };
  const handleDelete = () => {
    onChange?.(null);
  };
  const handlePreview = () => {
    if (!value) {
      Toast.error('未找到文件');
      return;
    }
    if (fileBlob) {
      window.open(URL.createObjectURL(fileBlob));
    }
  };

  return (
    <div className="w-full overflow-hidden">
      <Upload
        beforeUpload={beforeUpload}
        // disabled={!!value || uploadStatus === 1}
      >
        {!value && <Button icon={<IconUpload />}>上传文件</Button>}
      </Upload>
      {value && (
        <div className="h-12 p-2 flex items-center space-x-1 rounded bg-[color:var(--semi-color-fill-0)] hover:bg-[color:var(--semi-color-fill-1)]">
          <div className="text-white bg-[#a7abb0] flex justify-center items-center w-8 h-8 rounded shrink-0">
            {value && value.type === 'image/jpeg' ? (
              <img src={imgSmall} />
            ) : (
              <IconFile />
            )}
          </div>
          <div className="truncate text-sm font-semibold">{value?.name}</div>
          <div className="text-xs font-light text-gray-500">
            {value?.size && fileSizeFormat(value?.size)}
          </div>
          <div className="flex space-x-1">
            <IconEyeOpened
              onClick={handlePreview}
              className="hover:bg-[color:var(--semi-color-fill-1)] cursor-pointer p-1 rounded"
            />
            <IconDelete
              onClick={handleDelete}
              className="hover:bg-[color:var(--semi-color-fill-1)] cursor-pointer p-1 rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
}
