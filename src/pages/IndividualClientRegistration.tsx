import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FieldDecorator from '@/components/FieldDecorator';
import { DatePicker, Input, Modal, Select, Steps } from '@douyinfe/semi-ui';
import { IconChevronLeft, IconChevronRight } from '@douyinfe/semi-icons';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import PageSection from './PageSection';
import './fade_animate.css';
import './company.css';
import classnames from 'classnames';
import usePage from './usePage';
import UploadFile from '@/components/UploadFile';
import { SectionTitle } from '@/components/Section';
import { useRef } from 'react';
import Signature from '@/components/Signature';
import complete from '@/assets/images/complete.svg';

const schema = yup
  .object({
    // email: yup.string().email().required('请输入邮箱'),
    name: yup.string().required('请输入姓名'),
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
        onOk: handleSubmit,
        centered: true,
      });
      return;
    }
    nextPage();
  };
  const handlePrevious = () => {
    previousPage();
  };
  const [purpose, b_beneficiaryType, comAccount] = methods.watch([
    'purpose',
    'b_beneficiaryType',
    'comAccount',
  ]);
  const handleSubmit = methods.handleSubmit((values) => {
    console.log(values);
  });
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
              console.log('exited');
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
                <Steps.Step title="First" description="汇款人信息" />
                <Steps.Step title="Second" description="收入及证件" />
                <Steps.Step title="Third" description="收款人信息" />
                <Steps.Step title="Last" description="完成" />
              </Steps>
              <form className="flex flex-col w-full" onSubmit={handleNext}>
                {page === 1 && (
                  <>
                    <SectionTitle isTop>个人信息</SectionTitle>
                    <PageSection>
                      {/* <FieldDecorator label="名字 FirstName" name="firstName">
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator label="姓氏 LastName" name="lastName">
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        label="常用名 PreferredName"
                        name="preferredName"
                      >
                        <Input />
                      </FieldDecorator> */}
                      <FieldDecorator label="姓名 Name" name="name">
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator label="性别 Gender" name="gender">
                        <Select filter showClear className="w-full">
                          <Select.Option value={0}>男 Male</Select.Option>
                          <Select.Option value={1}>女 Female</Select.Option>
                          <Select.Option value={2}>
                            其他 Indeterminate
                          </Select.Option>
                        </Select>
                      </FieldDecorator>
                      <FieldDecorator label="出生日期 Date of Birth" name="dob">
                        <DatePicker
                          className="w-full"
                          placeholder={'Select date'}
                        />
                      </FieldDecorator>
                      <FieldDecorator
                        label="电子邮箱 Email Address"
                        name="email"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator label="联系号码 Phone" name="phone">
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
                      <FieldDecorator label="汇款目的 Purpose" name="purpose">
                        <Select filter showClear className="w-full">
                          <Select.Option key="Property" value="Property">
                            买房
                          </Select.Option>
                          <Select.Option key="Repayment" value="Repayment">
                            偿还贷款
                          </Select.Option>
                          <Select.Option key="Immigration" value="Immigration">
                            移民
                          </Select.Option>
                          <Select.Option key="Investment" value="Investment">
                            投资
                          </Select.Option>
                          <Select.Option key="Living" value="Living">
                            旅游/生活开销
                          </Select.Option>
                          <Select.Option key="Deposit" value="Deposit">
                            个人存款
                          </Select.Option>
                          <Select.Option key="Gift" value="Gift">
                            亲属赠予
                          </Select.Option>
                          <Select.Option key="Other" value="Other">
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
                    </PageSection>
                    <SectionTitle>居住信息</SectionTitle>
                    <PageSection>
                      <FieldDecorator label="国家 Country" name="country">
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator label="州 State/省 Province" name="state">
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator label="区 Suburb" name="suburb">
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        className="lg:col-span-2 md:col-span-1"
                        label="街道地址 Address"
                        name="address"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator label="邮政编码 Postcode" name="postcode">
                        <Input />
                      </FieldDecorator>
                    </PageSection>
                  </>
                )}
                {page === 2 && (
                  <>
                    <SectionTitle isTop>汇款人收入信息</SectionTitle>

                    <PageSection>
                      <FieldDecorator
                        label="职业与行业 Occupation & Industry"
                        name="occupation"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        label="雇主名字 Employer's Name"
                        name="employerName"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        label="年收入 Annual Income"
                        name="annualIncome"
                      >
                        <Select filter showClear className="w-full">
                          <Select.Option key="Property" value="Property">
                            5-8万(AUD)
                          </Select.Option>
                          <Select.Option key="Repayment" value="Repayment">
                            8-10万(AUD)
                          </Select.Option>
                          <Select.Option key="Immigration" value="Immigration">
                            10-20万(AUD)
                          </Select.Option>
                          <Select.Option key="Investment" value="Investment">
                            20-30万(AUD)
                          </Select.Option>
                          <Select.Option key="Living" value="Living">
                            30万+(AUD)
                          </Select.Option>
                        </Select>
                      </FieldDecorator>
                      <FieldDecorator
                        label="收入来源 Source of Income"
                        name="incomeSource"
                      >
                        <Input />
                      </FieldDecorator>
                    </PageSection>
                    <SectionTitle>汇款人证件信息</SectionTitle>
                    <div className="mb-6">
                      需要提供汇款人的2个证件（护照、身份证、驾照、澳洲photo ID
                      四选二）
                      <br />
                      Please provide 2 personal IDs for identification purpose.
                      (Passport, Identification Card, Driver License, Australian
                      Photo Card. Provide two of the four)
                    </div>

                    <PageSection>
                      <FieldDecorator
                        label="身份证明1正面 front side of the identity certificate 1."
                        name="document1FrontId"
                      >
                        <UploadFile />
                      </FieldDecorator>
                      <FieldDecorator
                        label="身份证明1背面  back side of the identity certificate 1."
                        name="document1BackId"
                      >
                        <UploadFile />
                      </FieldDecorator>
                      <FieldDecorator
                        label="身份证明2正面 front side of the identity certificate 2."
                        name="document2FrontId"
                      >
                        <UploadFile />
                      </FieldDecorator>
                      <FieldDecorator
                        label="身份证明2背面  back side of the identity certificate 2"
                        name="document2BackId"
                      >
                        <UploadFile />
                      </FieldDecorator>
                      <FieldDecorator
                        label="人脸识别照片 face recognition"
                        name="facePicId"
                      >
                        <UploadFile />
                      </FieldDecorator>
                    </PageSection>
                  </>
                )}
                {page === 3 && (
                  <>
                    <SectionTitle isTop>收款人账户信息</SectionTitle>
                    <PageSection>
                      <FieldDecorator
                        label="收款人类型 Payee Type"
                        name="b_beneficiaryType"
                      >
                        <Select showClear className="w-full">
                          <Select.Option key="1" value={0}>
                            汇款到本人账户 Remit to my personal account
                          </Select.Option>
                          <Select.Option key="2" value={1}>
                            汇款到他人账户 Remit to other's account
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
                        label="账户信息 Account Number"
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
                {page === 3 && b_beneficiaryType === 1 && (
                  <>
                    <SectionTitle>收款人个人信息</SectionTitle>
                    <PageSection>
                      <FieldDecorator label="收款人姓名 Name" name="b_name">
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        label="收款人生日 Date of Birth"
                        name="b_dob"
                      >
                        <DatePicker className="w-full" />
                      </FieldDecorator>
                      <FieldDecorator
                        label="收款人联系方式 Phone"
                        name="b_phone"
                      >
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
                    <SectionTitle>收款人居住信息</SectionTitle>
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
                        label="街道地址 Address"
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
                    <SectionTitle>证件及其他信息</SectionTitle>
                    <div className="mb-6">
                      需要提供收款人的一个证件
                      <br />
                      Provide beneficiary account holder's ID if not
                      transferring to your personal account.
                    </div>
                    <PageSection>
                      <FieldDecorator label="转账类型 " name="transother">
                        <Select showClear className="w-full">
                          <Select.Option key="" value={0}>
                            转到其他人银行账户 Transfer to Other's Account
                          </Select.Option>
                        </Select>
                      </FieldDecorator>
                      <FieldDecorator
                        label="收款人证件正面 front side of payee's ID"
                        name="document1FrontId"
                      >
                        <UploadFile />
                      </FieldDecorator>
                      <FieldDecorator
                        label="收款人证件背面 back side of payee's ID"
                        name="document1BackId"
                      >
                        <UploadFile />
                      </FieldDecorator>
                    </PageSection>
                    <PageSection>
                      <FieldDecorator
                        label="账户类型"
                        name="comAccount"
                        className="mt-6"
                      >
                        <Select showClear className="w-full">
                          <Select.Option key="" value={0}>
                            非公司信托账户 Non-Trust Account
                          </Select.Option>
                          <Select.Option key="" value={1}>
                            公司信托账户 Trust Account
                          </Select.Option>
                        </Select>
                      </FieldDecorator>
                      <FieldDecorator
                        className="mt-6"
                        visible={comAccount === 1}
                        hiddenWhenInvisible
                        label="公司名称 Company Name"
                        name="companyName"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        className="mt-6"
                        visible={comAccount === 1}
                        hiddenWhenInvisible
                        label="公司地址 Company Address"
                        name="companyName"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        visible={comAccount === 1}
                        hiddenWhenInvisible
                        label="公司ABN Company ABN"
                        name="companyName"
                      >
                        <Input />
                      </FieldDecorator>
                    </PageSection>
                  </>
                )}
                {page === 3 && (
                  <>
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
