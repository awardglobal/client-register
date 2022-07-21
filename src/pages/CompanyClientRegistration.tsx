import { Controller, FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import copy from 'copy-to-clipboard';
import * as yup from 'yup';
import FieldDecorator from '@/components/FieldDecorator';
import {
  Checkbox,
  DatePicker,
  Input,
  Modal,
  Select,
  Steps,
  Toast,
} from '@douyinfe/semi-ui';
import {
  IconChevronRight,
  IconChevronLeft,
  IconHelpCircleStroked,
} from '@douyinfe/semi-icons';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

import PageSection from './PageSection';
import './fade_animate.css';
import './company.css';
import classnames from 'classnames';
import usePage from './usePage';
import UploadFile from '@/components/UploadFile';
import {
  addCompany,
  getSaleListService,
  getAllCurrencyListService,
} from '@/services/register';
import { SectionTitle } from '@/components/Section';
import Signature from '@/components/Signature';
import complete from '@/assets/images/complete.svg';
import { useRef, useState } from 'react';
import { useQuery } from 'react-query';
import Flag from '@/components/Flag';
import useValueDebounce from '@/hooks/useValueDebounce';
import Textarea from '@douyinfe/semi-ui/lib/es/input/textarea';

const schema = yup
  .object({
    companyName: yup.string().required('请输入公司名称'),
    entityType: yup.string().required('请输入公司类型'),
    phone: yup.string().required('请输入联系号码'),
    registeredAddress: yup.string().required('请输入公司注册地址'),
    email: yup.string().required('请输入公司邮箱').email('邮箱格式错误'),
    principalAddress: yup.string().required('请输入公司办公地址'),
    saleId: yup.string().when('other_sale', {
      is: (arg: boolean) => arg !== true,
      then: yup.string().required('请选择业务员'),
    }),
    fromCurrency: yup.string().when('other_sale', {
      is: (arg: boolean) => arg === true,
      then: yup.string().required('请选择汇出币种'),
    }),
    toCurrency: yup.string().when('other_sale', {
      is: (arg: boolean) => arg === true,
      then: yup.string().required('请选择汇入币种'),
    }),
    amount: yup.string().when('other_sale', {
      is: (arg: boolean) => arg === true,
      then: yup.string().required('请输入汇款金额'),
    }),
    approximateExchangeTime: yup.string().when('other_sale', {
      is: (arg: boolean) => arg === true,
      then: yup.string().required('请选择汇款时间'),
    }),
    notes: yup.string().when('other_sale', {
      is: (arg: boolean) => arg === true,
      then: yup.string().required('请输入备注'),
    }),
    purpose: yup.string().required('请选择汇款目的'),
    otherPurpose: yup.string().when('purpose', {
      is: 'Other',
      then: yup.string().required('请输入其他汇款目的'),
    }),
    document1Front: yup.mixed().required('请上传证件1正面'),
    document1Back: yup.mixed().required('请上传证件1反面'),
    document2Front: yup.mixed().required('请上传证件2正面'),
    document2Back: yup.mixed().required('请上传证件2反面'),
    companyExtract: yup.mixed().required('请上传公司extract'),
    accountHolderName: yup.string().required('请输入账户主要持有人姓名'),
    accountHolderPosition: yup.string().required('请输入账户主要持有人职位'),
    accountHolderDOB: yup.string().required('请输入账户主要持有人生日'),
    accountHolderPhone: yup.string().required('请输入账户主要持有人联系号码'),
    accountHolderEmail: yup
      .string()
      .required('请输入账户主要持有人邮箱')
      .email('邮箱格式错误'),
    accountHolderAddress: yup.string().required('请输入账户主要持有人地址'),
    b_beneficiaryType: yup.number().required('请选择收款人类型'),
    b_bankName: yup.string().required('请输入银行名称'),
    b_branchName: yup.string().required('请输入银行支行'),
    b_accountName: yup.string().required('请输入银行账号名'),
    b_accountNumber: yup.string().required('请输入银行账号'),
    b_bsb_swiftCode: yup.string().required('请输入银行BSB/SWIFT代码'),
    b_firstName: yup.string().when('b_beneficiaryType', {
      is: (arg: number) => arg === 0,
      then: yup.string().required('请输入收款人姓名'),
    }),
    b_lastName: yup.string().when('b_beneficiaryType', {
      is: (arg: number) => arg === 0,
      then: yup.string().required('请输入收款人姓氏'),
    }),
    b_name: yup.string().when('b_beneficiaryType', {
      is: (arg: number) => arg === 1,
      then: yup.string().required('请输入收款公司名称'),
    }),
    b_dob: yup.string().when('b_beneficiaryType', {
      is: (arg: number) => arg === 0,
      then: yup.string().required('请选择收款人出生日期'),
    }),
    b_phone: yup.string().required('请输入联系号码'),

    b_occupation: yup.string().when('b_beneficiaryType', {
      is: (arg: number) => arg === 0,
      then: yup.string().required('请输入收款人职业'),
    }),
    b_relation: yup.string().when('b_beneficiaryType', {
      is: (arg: number) => arg === 0,
      then: yup.string().required('请选择收款人关系'),
      otherwise: yup.string().required('请选择收款公司关系'),
    }),
    b_documentFront: yup.mixed().when('b_beneficiaryType', {
      is: (arg: number) => arg === 0,
      then: yup.mixed().required('请上传证件1正面'),
    }),
    b_documentBack: yup.mixed().when('b_beneficiaryType', {
      is: (arg: number) => arg === 0,
      then: yup.mixed().required('请上传证件1反面'),
    }),
    b_country: yup.string().required('请输入收款方所在国家'),
    b_state: yup.string().required('请输入收款方所在州/省'),
    b_suburb: yup.string().required('请输入收款方所在区'),
    b_address: yup.string().required('请输入收款方街道地址'),
    b_postcode: yup.string().required('请输入收款方邮编'),
    choose1: yup.boolean().required('请选择').oneOf([true], '请确认上述信息'),
    choose2: yup.boolean().required('请选择').oneOf([true], '请确认上述信息'),
    signature: yup.mixed().required('请确认信息并签名'),
  })
  .required();

export default function IndividualClientRegistration() {
  const { page, isFirstPage, isLastPage, nextPage, previousPage } = usePage({
    maxPage: 4,
  });
  const contentRef = useRef<HTMLDivElement>(null);
  const [no, setNo] = useState<string>('');
  const [otherSale, setOtherSale] = useState<boolean>(false);
  const [searchSaleName, setSearchSaleName] = useValueDebounce<string>({
    milliseconds: 500,
  });
  const { data: allCurrencyList } = useQuery(
    ['getAllCurrencyList'],
    getAllCurrencyListService
  );

  const { data: saleList } = useQuery(['getSaleList', searchSaleName], () =>
    getSaleListService({
      name: searchSaleName,
    })
  );

  const methods = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });
  const pageField: { [props: string]: string[] } = {
    '1': [
      'companyName',
      'entityType',
      'phone',
      'registeredAddress',
      'email',
      'principalAddress',
      'saleId',
      'fromCurrency',
      'toCurrency',
      'amount',
      'approximateExchangeTime',
      'notes',
      'purpose',
      'otherPurpose',
      'document1Front',
      'document1Back',
      'document2Front',
      'document2Back',
      'companyExtract',
    ],
    '2': [
      'accountHolderName',
      'accountHolderPosition',
      'accountHolderDOB',
      'accountHolderPhone',
      'accountHolderEmail',
      'accountHolderAddress',
    ],
    '3': [
      'choose1',
      'choose2',
      'b_beneficiaryType',
      'b_bankName',
      'b_branchName',
      'b_accountName',
      'b_accountNumber',
      'b_bsb_swiftCode',
      'b_firstName',
      'b_lastName',
      'b_dob',
      'b_phone',
      'b_occupation',
      'b_relation',
      'b_country',
      'b_state',
      'b_suburb',
      'b_address',
      'b_postcode',
      'b_documentFront',
      'b_documentBack',
      'b_name',
      'b_relatedDoc',
      'signature',
    ],
  };

  const handleNext = async (e?: any) => {
    window.scrollTo(0, 0);
    e?.preventDefault();
    const validPage = await methods.trigger(pageField[page] ?? []);
    if (!isLastPage && validPage) {
      if (page !== 3) {
        nextPage();
      }
      if (page === 3) {
        Modal.confirm({
          title: '确认提交?',
          content: '请核实信息无误后提交',
          onOk: handleSubmit,
          centered: true,
        });
      }
    }
  };

  const handleSubmit = methods.handleSubmit(async (values) => {
    const { choose1, choose2, ...valueObj } = values;
    const formData = new FormData();
    for (const key in valueObj) {
      if (valueObj[key] === undefined) {
        continue;
      }
      formData.append(key, valueObj[key]);
    }
    const res: any = await addCompany(formData as any);
    if (res.code == 0) {
      setNo(res.data.registrationCode);
      nextPage();
      copy(res.data.registrationCode);
      Toast.success('已复制到剪贴板');
    } else {
      Toast.error(res.data.msg);
    }
  });

  const handleSaleSearch = (value: string) => {
    setSearchSaleName(value);
  };
  const handlePrevious = () => {
    previousPage();
  };
  const [purpose, b_beneficiaryType, fromCurrency, toCurrency] = methods.watch([
    'purpose',
    'b_beneficiaryType',
    'fromCurrency',
    'toCurrency',
  ]);
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
                        required
                        label="公司名称 Entity Name"
                        name="companyName"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        required
                        label="公司类型 Entity Type"
                        name="entityType"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        required
                        label="公司联系电话 Company Contact Number"
                        name="phone"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        required
                        className="lg:col-span-2 md:col-span-1"
                        label="公司注册地址 Registered Business Address"
                        name="registeredAddress"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        required
                        label="公司邮箱 Company Email"
                        name="email"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        required
                        className="lg:col-span-2 md:col-span-1"
                        label="公司主要营业地址 Principal Business Address"
                        name="principalAddress"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        required
                        label="汇款目的 Purpose"
                        name="purpose"
                      >
                        <Select className="w-full">
                          <Select.Option key="provider" value="provider">
                            支付供应商 Provider
                          </Select.Option>
                          <Select.Option key="salary" value="salary">
                            工资 Salary
                          </Select.Option>
                          <Select.Option key="property" value="property">
                            买卖商业财产 Property
                          </Select.Option>
                          <Select.Option key="loan" value="loan">
                            商业贷款/抵押/租金/账单 Loan/Mortgage/Rent/Billing
                          </Select.Option>
                          <Select.Option key="investment" value="investment">
                            投资 Investment
                          </Select.Option>
                          <Select.Option key="other" value="Other">
                            其他
                          </Select.Option>
                        </Select>
                      </FieldDecorator>
                      <FieldDecorator
                        required
                        visible={purpose === 'Other'}
                        hiddenWhenInvisible
                        label="其他汇款目的 Other Purpose"
                        name="otherPurpose"
                      >
                        <Input />
                      </FieldDecorator>

                      {!otherSale && (
                        <div className="relative">
                          <FieldDecorator
                            label="业务员 Sale"
                            name="saleId"
                            required
                          >
                            <Select
                              filter
                              className="w-full"
                              onSearch={handleSaleSearch}
                            >
                              {saleList?.list.map((item) => (
                                <Select.Option key={item.id} value={item.id}>
                                  {item.name}
                                </Select.Option>
                              ))}
                            </Select>
                          </FieldDecorator>
                          <div
                            className="text-blue-500 cursor text-sm cursor-pointer absolute right-0 bottom-[-25px] flex items-center"
                            onClick={() => {
                              setOtherSale(true);
                              methods.setValue('other_sale', true);
                              methods.setValue('saleId', undefined);
                            }}
                          >
                            <IconHelpCircleStroked className="pr-1" />
                            <div>没有业务员?</div>
                          </div>
                        </div>
                      )}
                      <FieldDecorator label="ABN/ACN/ARBN" name="abn_acn_arbn">
                        <Input />
                      </FieldDecorator>
                    </PageSection>
                    {otherSale && (
                      <>
                        <SectionTitle>其他信息</SectionTitle>
                        <div
                          className="text-blue-500 cursor text-sm cursor-pointer mb-4 flex items-center"
                          onClick={() => {
                            setOtherSale(false);
                            methods.setValue('other_sale', false);
                            methods.setValue('fromCurrency', undefined);
                            methods.setValue('toCurrency', undefined);
                            methods.setValue('amount', undefined);
                            methods.setValue(
                              'approximateExchangeTime',
                              undefined
                            );
                            methods.setValue('notes', undefined);
                          }}
                        >
                          <IconHelpCircleStroked className="pr-1 " />
                          已有业务员?
                        </div>
                        <PageSection>
                          {/* <div className="relative"> */}
                          <FieldDecorator
                            label="汇出币种"
                            name="fromCurrency"
                            required
                          >
                            <Select className="w-full" showClear>
                              {allCurrencyList?.list
                                .filter((item: any) => item.id !== toCurrency)
                                .map((currency: any) => (
                                  <Select.Option
                                    key={currency.id}
                                    value={currency.id}
                                  >
                                    <div className="flex space-x-2">
                                      <Flag name={currency.symbol} size={36} />
                                      <div>{currency.name}</div>
                                    </div>
                                  </Select.Option>
                                ))}
                            </Select>
                          </FieldDecorator>

                          {/* </div> */}

                          <FieldDecorator
                            label="汇入币种"
                            name="toCurrency"
                            required
                          >
                            <Select className="w-full" showClear>
                              {allCurrencyList?.list
                                .filter((item: any) => item.id !== fromCurrency)
                                .map((currency: any) => (
                                  <Select.Option
                                    key={currency.id}
                                    value={currency.id}
                                  >
                                    <div className="flex space-x-2">
                                      <Flag name={currency.symbol} size={36} />
                                      <div>{currency.name}</div>
                                    </div>
                                  </Select.Option>
                                ))}
                            </Select>
                          </FieldDecorator>

                          <FieldDecorator
                            label="汇出金额"
                            name="amount"
                            required
                          >
                            <Input />
                          </FieldDecorator>

                          <FieldDecorator
                            required
                            label="换汇时间"
                            name="approximateExchangeTime"
                          >
                            <Select filter showClear className="w-full">
                              <Select.Option value={0}>一周以内</Select.Option>
                              <Select.Option value={1}>一月以内</Select.Option>
                              <Select.Option value={2}>三月以内</Select.Option>
                              <Select.Option value={3}>一年以内</Select.Option>
                            </Select>
                          </FieldDecorator>
                          <FieldDecorator label="备注" name="notes" required>
                            <Textarea />
                          </FieldDecorator>
                        </PageSection>
                      </>
                    )}
                    <SectionTitle>公司法人证件</SectionTitle>
                    <div className="mb-6">
                      需要提供两个公司法人证件的正面及反面
                      <br />
                      Provide front and back side of company legal person's ID。
                    </div>
                    <PageSection>
                      <FieldDecorator
                        required
                        label="公司法人证件1正面 front side of legal person's ID"
                        name="document1Front"
                      >
                        <UploadFile />
                      </FieldDecorator>
                      <FieldDecorator
                        required
                        label="公司法人证件1背面 back side of legal person's ID"
                        name="document1Back"
                      >
                        <UploadFile />
                      </FieldDecorator>
                      <div className="lg:block md:hidden sm:hidden" />
                      <FieldDecorator
                        required
                        label="公司法人证件2正面 front side of legal person's ID"
                        name="document2Front"
                      >
                        <UploadFile />
                      </FieldDecorator>

                      <FieldDecorator
                        required
                        label="公司法人证件2背面 back side of legal person's ID"
                        name="document2Back"
                      >
                        <UploadFile />
                      </FieldDecorator>
                      <div className="lg:block md:hidden sm:hidden" />
                      <FieldDecorator
                        required
                        label="Company extract"
                        name="companyExtract"
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
                      <FieldDecorator
                        required
                        label="姓名 name"
                        name="accountHolderName"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        required
                        label="职位 Position"
                        name="accountHolderPosition"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        required
                        label="出生日期 Date of Birth"
                        name="accountHolderDOB"
                        transformOut={(value: any) => value.toISOString()}
                        transformIn={(value: any) => new Date(value)}
                      >
                        <DatePicker className="w-full" />
                      </FieldDecorator>
                      <FieldDecorator
                        required
                        label="联系电话 Contact Number"
                        name="accountHolderPhone"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        required
                        label="邮箱 Email"
                        name="accountHolderEmail"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        required
                        className="lg:col-span-2 md:col-span-1"
                        label="住址 Resident Address"
                        name="accountHolderAddress"
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
                        required
                        label="收款人类型 payee Type"
                        name="b_beneficiaryType"
                      >
                        <Select showClear className="w-full">
                          <Select.Option key="1" value={2}>
                            汇款到个人账户 Remit to personal account
                          </Select.Option>
                          <Select.Option key="2" value={3}>
                            汇款到公司账户 Remit to company's account
                          </Select.Option>
                        </Select>
                      </FieldDecorator>
                      <FieldDecorator
                        required
                        label="银行名称 Bank Name"
                        name="b_bankName"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        required
                        label="开户行支行 Branch Name"
                        name="b_branchName"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        required
                        label="账户名称 Account Name"
                        name="b_accountName"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        required
                        label="账户信息 Account Number "
                        name="b_accountNumber"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        required
                        label="BSB/Swift Code"
                        name="b_bsb_swiftCode"
                      >
                        <Input />
                      </FieldDecorator>
                    </PageSection>
                  </>
                )}
                {page === 3 && b_beneficiaryType !== 1 && (
                  <>
                    <SectionTitle>收款人个人信息</SectionTitle>
                    <PageSection>
                      <FieldDecorator
                        required
                        label="名字 FirstName"
                        name="b_firstName"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        required
                        label="姓氏 LastName"
                        name="b_lastName"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        required
                        label="出生日期 Date of birth"
                        name="b_dob"
                        transformOut={(value: any) => value.toISOString()}
                        transformIn={(value: any) => new Date(value)}
                      >
                        <DatePicker className="w-full" />
                      </FieldDecorator>
                      <FieldDecorator
                        required
                        label="收款人电话 Phone"
                        name="b_phone"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        required
                        label="收款人职业 Occupation"
                        name="b_occupation"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        required
                        label="与交易人关系 Relationship"
                        name="b_relation"
                      >
                        <Input />
                      </FieldDecorator>
                    </PageSection>
                    <SectionTitle>收款人证件信息</SectionTitle>
                    <div className="mb-6">
                      需要提供收款人的一个证件正面及反面
                      <br />
                      Provide front and back side of beneficiary account
                      holder's ID
                    </div>
                    <PageSection>
                      <FieldDecorator
                        required
                        label="证件1(正面) front side of legal person's ID"
                        name="b_documentFront"
                      >
                        <UploadFile />
                      </FieldDecorator>
                      <FieldDecorator
                        required
                        label="证件1(背面) back side of legal person's ID"
                        name="b_documentBack"
                      >
                        <UploadFile />
                      </FieldDecorator>
                    </PageSection>
                  </>
                )}
                {page === 3 && b_beneficiaryType === 1 && (
                  <>
                    <SectionTitle>收款公司信息</SectionTitle>
                    <PageSection>
                      <FieldDecorator
                        required
                        label="收款公司名称 Company Name"
                        name="b_name"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        required
                        label="收款公司电话 Company Phone"
                        name="b_phone"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        required
                        label="与交易人关系 Ralationship"
                        name="b_relation"
                      >
                        <Input />
                      </FieldDecorator>
                    </PageSection>
                    <SectionTitle>收款人证件信息</SectionTitle>
                    <div className="mb-6">
                      需要提供与本次交易相关的证明文件。
                      <br />
                      Provide evidence related to the transaction
                    </div>
                    <PageSection>
                      <FieldDecorator
                        label="证明文件 evidence photo related to the transaction"
                        name="b_relatedDoc"
                      >
                        <UploadFile />
                      </FieldDecorator>
                    </PageSection>
                  </>
                )}
                {page === 3 && (
                  <>
                    <SectionTitle>收款方地址信息</SectionTitle>
                    <PageSection>
                      <FieldDecorator
                        required
                        className="lg:col-span-2 md:col-span-1"
                        label="街道地址 Street Address"
                        name="b_address"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        required
                        label="邮政编码 Postcode"
                        name="b_postcode"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        required
                        label="区 Suburb"
                        name="b_suburb"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        required
                        label="州 State/省 Province"
                        name="b_state"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        required
                        label="国家 Country"
                        name="b_country"
                      >
                        <Input />
                      </FieldDecorator>
                    </PageSection>

                    <SectionTitle>信息确认及签名</SectionTitle>
                    <FieldDecorator
                      required
                      name="choose1"
                      valuePropName="checked"
                      className="mb-6"
                      transformOut={(val: any) => val.target.checked}
                    >
                      <Checkbox extra="Please confirm all the information provided is true and correct">
                        请确认以上所提供信息是真实和正确的，并且确认提交
                      </Checkbox>
                    </FieldDecorator>
                    <FieldDecorator
                      required
                      name="choose2"
                      valuePropName="checked"
                      transformOut={(val: any) => val.target.checked}
                    >
                      <Checkbox extra="I agree to terms and conditions">
                        我已阅读并同意以上
                        <a style={{ color: 'blue' }} href="www.baidu.com">
                          条款
                        </a>
                        。
                      </Checkbox>
                    </FieldDecorator>
                    <Controller
                      name="signature"
                      control={methods.control}
                      render={({ field }) => {
                        return (
                          <Signature
                            onChange={field.onChange}
                            errors={methods.formState.errors}
                          />
                        );
                      }}
                    />
                  </>
                )}
                {page === 4 && (
                  <div className="h-full flex flex-col justify-center items-center mt-28">
                    <img src={complete} className="w-20" alt="" />
                    <div className="mt-8 mb-4 font-bold text-xl ">提交成功</div>
                    您的回执编号为 {no}
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
