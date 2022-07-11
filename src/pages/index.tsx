import { IconApartment, IconUser } from '@douyinfe/semi-icons';
import { Link } from 'react-router-dom';

export default function ClientRegistration() {
  return (
    <div className="w-screen h-screen justify-center items-center">
      <div className="w-full h-full flex flex-col justify-center items-center overflow-x-hidden bg-[url('@/assets/images/login_bg.jpg')]">
        <div className="mb-8 text-xl">
          <div>
            请问您是<span className="font-bold">个人客户</span>还是
            <span className="font-bold">公司客户</span> ?
          </div>
          <div>
            Are you a <span className="font-bold">Individual Client</span> or
            <span className="font-bold"> Company Client ?</span>
          </div>
        </div>
        <div className="flex space-x-4">
          <Link to={'individual'}>
            <div className="hover:border-current hover:text-current border-2 p-4 shadow-lg rounded-lg cursor-pointer bg-gray-100 transition-all">
              <div className="flex items-center space-x-4 px-4">
                <div className="flex flex-col">
                  <div>个人用户信息登记</div>
                  <div>Individual Registration</div>
                </div>
                <IconUser size="extra-large" />
              </div>
            </div>
          </Link>
          <Link to={'company'}>
            <div className="hover:border-current hover:text-current border-2 p-4 shadow-lg rounded-lg cursor-pointer bg-gray-100 transition-all">
              <div className="flex items-center space-x-4 px-4">
                <div className="flex flex-col">
                  <div>公司客户注册登记</div>
                  <div>Company Registration</div>
                </div>
                <IconApartment size="extra-large" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
