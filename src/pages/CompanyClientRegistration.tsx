// export default function CompanyClientRegistration() {
//   return <div>CompanyClientRegistration</div>;
// }

import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FieldDecorator from '@/components/FieldDecorator';
import { DatePicker, Input, Modal, Select, Steps } from '@douyinfe/semi-ui';
import { IconChevronRight, IconChevronLeft } from '@douyinfe/semi-icons';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import PageSection from './PageSection';
import './fade_animate.css';
import './company.css';
import classnames from 'classnames';
import usePage from './usePage';
import UploadFile from '@/components/UploadFile';
import { SectionTitle } from '@/components/Section';
import Signature from '@/components/Signature';
import complete from '@/assets/images/complete.svg';
import { useRef } from 'react';

const schema = yup
  .object({
    // email: yup.string().email().required('请输入邮箱'),
    // name: yup.string().required('请输入姓名'),
  })
  .required();

export default function IndividualClientRegistration() {
  const { page, isFirstPage, isLastPage, nextPage, previousPage } = usePage({
    maxPage: 4,
  });
  const contentRef = useRef<HTMLDivElement>(null);
  const methods = useForm({
    resolver: yupResolver(schema),
    mode: 'onTouched',
  });

  const handleNext = (e?: any) => {
    window.scrollTo(0, 0);
    e?.preventDefault();
    if (page === 3) {
      Modal.confirm({
        title: '确认提交?',
        content: '请核实信息无误后提交',
        onOk: nextPage,
        centered: true,
      });
      return;
    }
    nextPage();
  };
  const handlePrevious = () => {
    previousPage();
  };
  const [purpose, payeeType] = methods.watch(['purpose', 'payeeType']);
  return (
    <div className="register w-full h-full flex flex-col px-20 items-center overflow-auto">
      <FormProvider {...methods}>
        <SwitchTransition mode={'out-in'}>
          <CSSTransition
            key={page}
            addEndListener={(node, done) => {
              node.addEventListener('transitionend', done, false);
            }}
            classNames={'fade'}
            onExited={() => {
              contentRef.current?.scrollIntoView();
            }}
          >
            <div
              ref={contentRef}
              className="flex flex-col items-center w-full pt-10"
            >
              <Steps
                type="basic"
                className="mb-8 lg:w-3/5 md:w-4/5 w-full "
                current={page - 1}
              >
                <Steps.Step title="First" description="公司信息" />
                <Steps.Step title="Second" description="账户持有人" />
                <Steps.Step title="Third" description="收款人信息" />
                <Steps.Step title="Last" description="完成" />
              </Steps>
              <form className="flex flex-col w-full mx-5" onSubmit={handleNext}>
                {page === 1 && (
                  <>
                    <SectionTitle isTop>基本信息</SectionTitle>
                    <PageSection>
                      <FieldDecorator
                        label="公司名称 Entity Name"
                        name="Entity Name"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        label="公司类型 Entity Type"
                        name="EntityType"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        label="公司联系电话 Company Contact Number"
                        name="companyNumber"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        className="lg:col-span-2 md:col-span-1"
                        label="公司注册地址 Registered Business Address"
                        name="RegisteredAddress"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        label="公司邮箱 Company Email"
                        name="companyEmail"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        className="lg:col-span-2 md:col-span-1"
                        label="公司主要营业地址 Principal Business Address"
                        name="PrincipalAddress"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator label="业务员 Salesman" name="salesMan">
                        <Select filter showClear className="w-full">
                          <Select.Option key="Echo Yu" value="Echo Yu">
                            Echo Yu
                          </Select.Option>
                          <Select.Option key="Francis Li" value="Francis Li">
                            Francis Li
                          </Select.Option>
                        </Select>
                      </FieldDecorator>

                      {/* <FieldDecorator
                        visible={purpose === 'Other'}
                        hiddenWhenInvisible
                        label="其他汇款目的 Other Purpose"
                        name="otherPurpose"
                      >
                        <Input />
                      </FieldDecorator> */}
                      {/* <FieldDecorator label="业务员 Sale" name="saleId">
                        <Select
                          filter
                          showClear
                          onSearch={handleSaleSearch}
                          className="w-full"
                        >
                          {saleList?.list.map((item) => (
                            <Select.Option key={item.id} value={item.id}>
                              {item.name}
                            </Select.Option>
                          ))}
                        </Select>
                      </FieldDecorator> */}
                      <FieldDecorator label="汇款目的 Purpose" name="purpose">
                        <Select filter showClear className="w-full">
                          <Select.Option key="provider" value="provider">
                            支付供应商 Provider
                          </Select.Option>
                          <Select.Option key="other" value="Other">
                            其他
                          </Select.Option>
                        </Select>
                      </FieldDecorator>
                      <FieldDecorator
                        visible={purpose === 'Other'}
                        hiddenWhenInvisible
                        label="其他汇款目的 Other Purpose"
                        name="otherPurpose"
                      >
                        <Input />
                      </FieldDecorator>
                    </PageSection>
                    <SectionTitle>公司法人证件</SectionTitle>
                    <div className="mb-6">
                      需要提供两个公司法人证件的正面及反面
                      <br />
                      Provide front and back side of company legal person's ID。
                    </div>
                    <PageSection>
                      <FieldDecorator
                        label="公司法人证件1正面 front side of legal person's ID"
                        name="document1FrontId"
                      >
                        <UploadFile />
                      </FieldDecorator>
                      <FieldDecorator
                        label="公司法人证件1背面 back side of legal person's ID"
                        name="document1BackId"
                      >
                        <UploadFile />
                      </FieldDecorator>
                      <FieldDecorator
                        label="公司法人证件2正面 front side of legal person's ID"
                        name="document2FrontId"
                      >
                        <UploadFile />
                      </FieldDecorator>

                      <FieldDecorator
                        label="公司法人证件2背面 back side of legal person's ID"
                        name="document2BackId"
                      >
                        <UploadFile />
                      </FieldDecorator>
                      <FieldDecorator
                        label="Company extract"
                        name="CompanyExtract"
                      >
                        <UploadFile />
                      </FieldDecorator>
                    </PageSection>
                  </>
                )}
                {page === 2 && (
                  <>
                    <SectionTitle isTop>账户主要持有人</SectionTitle>
                    <PageSection>
                      <FieldDecorator label="名字 FirstName" name="firstName">
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator label="姓氏 LastName" name="lastName">
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator label="职位 Position" name="position">
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator label="出生日期 Date of Birth" name="dob">
                        <DatePicker
                          className="w-full"
                          placeholder={'Select date'}
                        />
                      </FieldDecorator>
                      <FieldDecorator
                        label="联系电话 Contact Number"
                        name="ContactNumber"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator label="邮箱 Email" name="email">
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        className="lg:col-span-2 md:col-span-1"
                        label="住址 Resident Address"
                        name="ResidentAddress"
                      >
                        <Input />
                      </FieldDecorator>
                    </PageSection>
                  </>
                )}
                {page === 3 && (
                  <>
                    <SectionTitle>收款方账户信息</SectionTitle>
                    <PageSection>
                      <FieldDecorator
                        label="收款人类型 payee Type"
                        name="payeeType"
                      >
                        <Select showClear className="w-full">
                          <Select.Option key="1" value={0}>
                            汇款到本人账户 Remit to personal account
                          </Select.Option>
                          <Select.Option key="2" value={1}>
                            汇款到公司账户 Remit to company's account
                          </Select.Option>
                        </Select>
                      </FieldDecorator>
                      <FieldDecorator
                        label="银行名称 Bank Name"
                        name="b_bankName"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        label="开户行支行 Branch Name"
                        name="b_branchName"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        label="账户名称 Account Name"
                        name="b_accountName"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        label="账户信息 Account Number "
                        name="b_accountNumber"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        label="账户信息 BSB/Swift Code"
                        name="b_bsb_swiftCode"
                      >
                        <Input />
                      </FieldDecorator>
                    </PageSection>
                  </>
                )}
                {page === 3 && payeeType !== 1 && (
                  <>
                    <SectionTitle>收款人个人信息</SectionTitle>
                    <PageSection>
                      <FieldDecorator label="收款人姓名 Name" name="b_name">
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        label="出生日期 Date of birth"
                        name="b_dob"
                      >
                        <DatePicker className="w-full" />
                      </FieldDecorator>
                      <FieldDecorator label="收款人电话 Phone" name="b_phone">
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        label="收款人职业 Occupation"
                        name="b_occupation"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        label="与交易人关系 Relationship"
                        name="b_relation"
                      >
                        <Input />
                      </FieldDecorator>
                    </PageSection>
                  </>
                )}
                {page === 3 && payeeType === 1 && (
                  <>
                    <SectionTitle>收款公司信息</SectionTitle>
                    <PageSection>
                      <FieldDecorator
                        label="收款公司名称 Company Name"
                        name="c_name"
                      >
                        <Input />
                      </FieldDecorator>
                      {/* <FieldDecorator label="收款人生日" name="b_dob">
                        <DatePicker className="w-full" />
                      </FieldDecorator> */}
                      <FieldDecorator
                        label="收款公司电话 Company Phone"
                        name="c_phone"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        label="与交易人关系 Ralationship"
                        name="c_relation"
                      >
                        <Input />
                      </FieldDecorator>
                    </PageSection>
                  </>
                )}
                {page === 3 && (
                  <>
                    <SectionTitle>收款方地址信息</SectionTitle>
                    <PageSection>
                      <FieldDecorator label="国家 Country" name="b_country">
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        label="州 State/省 Province"
                        name="b_state"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator label="区 Suburb" name="b_suburb">
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        className="lg:col-span-2 md:col-span-1"
                        label="街道地址 Street Address"
                        name="b_address"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        label="邮政编码 Postcode"
                        name="b_postcode"
                      >
                        <Input />
                      </FieldDecorator>
                    </PageSection>
                    <SectionTitle>收款方证件信息</SectionTitle>
                    <div className="mb-6">
                      需要提供收款人的一个证件正面及反面
                      <br />
                      Provide front and back side of beneficiary account
                      holder's ID
                    </div>
                    <PageSection>
                      <FieldDecorator
                        label="证件1(正面) front side of legal person's ID"
                        name="document1FrontId"
                      >
                        <UploadFile />
                      </FieldDecorator>
                      <FieldDecorator
                        label="证件1(背面) back side of legal person's ID"
                        name="document1BackId"
                      >
                        <UploadFile />
                      </FieldDecorator>
                    </PageSection>
                    <Signature />
                  </>
                )}
                {page === 4 && (
                  <div className="h-full flex flex-col justify-center items-center mt-28">
                    <img src={complete} className="w-20" alt="" />
                    <div className="mt-8 mb-4 font-bold text-xl ">提交成功</div>
                    您的回执编号为#1232121312321
                  </div>
                )}
                <button type="submit" className="hidden" />
              </form>
              <div
                className={classnames('flex justify-end py-8 w-full', {
                  'justify-between': !isFirstPage && !isLastPage,
                })}
              >
                {!isFirstPage && !isLastPage && (
                  <div
                    onClick={handlePrevious}
                    className="flex justify-center cursor-pointer items-center text-gray-400 hover:text-current w-16 h-16 ]"
                  >
                    <IconChevronLeft size="extra-large" />
                    previous
                  </div>
                )}
                {!isLastPage && (
                  <div
                    onClick={handleNext}
                    className="flex justify-center cursor-pointer items-center text-gray-400 hover:text-current w-16 h-16 ]"
                  >
                    Next
                    <IconChevronRight size="extra-large" />
                  </div>
                )}
              </div>
            </div>
          </CSSTransition>
        </SwitchTransition>
      </FormProvider>
    </div>
  );
}
