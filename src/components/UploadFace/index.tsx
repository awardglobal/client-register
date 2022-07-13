import { Toast } from '@douyinfe/semi-ui';
import Upload from 'rc-upload';
import addFace from '@/assets/images/addFace.svg';
import newFace from '@/assets/images/newFace.jpg';
import deleteIcon from '@/assets/images/delete.svg';
import { useEffect, useState } from 'react';
import classnames from 'classnames';

interface PropsType {
  onChange?: (value: any) => void;
  value?: File;
}

export default function UploadFile({ onChange, value }: PropsType) {
  useEffect(() => {
    if (value) {
      const reader = new FileReader();
      reader.addEventListener(
        'load',
        () => {
          setImgSmall(reader.result as string);
        },
        false
      );
      reader.readAsDataURL(value);
    }
  }, []);

  const [imgSmall, setImgSmall] = useState<string>('');
  const [isIn, setIsin] = useState<boolean>(false);

  const beforeUpload = (file: File) => {
    onChange?.(file);
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      Toast.error('图片大小不能超过2M!');
    }

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

  const deletePic = (e: any) => {
    onChange?.(null);
    setImgSmall('');
    e.stopPropagation();
  };
  return (
    <div className="w-full  flex">
      <Upload beforeUpload={beforeUpload}>
        <div className="border-2 w-80 h-48 mr-12 text-center rounded overflow-hidden">
          {imgSmall ? (
            <div
              className="w-full h-full relative"
              onMouseEnter={() => setIsin(true)}
            >
              <div
                className={classnames(
                  'inset-0 position: absolute opacity-50 flex justify-center items-center transition-all',
                  {
                    'bg-black': isIn,
                    'bg-transparent': !isIn,
                  }
                )}
                onMouseLeave={() => setIsin(false)}
              >
                {isIn && (
                  <img src={deleteIcon} className="w-12" onClick={deletePic} />
                )}
              </div>
              <img
                src={imgSmall}
                alt=""
                className="w-full h-full transition ease-in-out"
              />
            </div>
          ) : (
            <>
              <img src={addFace} alt="" className="w-16 ml-32 mt-10" />
              <span style={{ color: 'gray' }}>点击上传文件</span>
            </>
          )}
        </div>
      </Upload>
      <img src={newFace} alt="" className="w-80 h-48" />
    </div>
  );
}
