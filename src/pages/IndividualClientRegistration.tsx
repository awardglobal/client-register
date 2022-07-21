import { FormProvider, useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
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
  IconChevronLeft,
  IconChevronRight,
  IconHelpCircleStroked,
} from '@douyinfe/semi-icons';
import useValueDebounce from '@/hooks/useValueDebounce';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import PageSection from './PageSection';
import './fade_animate.css';
import './company.css';
import classnames from 'classnames';
import usePage from './usePage';
import UploadFile from '@/components/UploadFile';
import { SectionTitle } from '@/components/Section';
import Flag from '@/components/Flag';
import { useRef, useState } from 'react';
import Signature from '@/components/Signature';
import complete from '@/assets/images/complete.svg';
import {
  addIndividual,
  getSaleListService,
  getAllCurrencyListService,
} from '@/services/register';
import UploadFace from '@/components/UploadFace';
import copy from 'copy-to-clipboard';
import { useQuery } from 'react-query';
import Textarea from '@douyinfe/semi-ui/lib/es/input/textarea';

const schema = yup
  .object({
    firstName: yup.string().required('请输入姓名'),
    lastName: yup.string().required('请输入姓氏'),
    gender: yup.string().required('请选择性别'),
    dob: yup.string().required('请选择出生日期'),
    email: yup.string().required('请输入邮箱').email('邮箱格式错误'),
    phone: yup.string().required('请输入联系号码'),
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
    address: yup.string().required('请输入地址'),
    occupation: yup.string().required('请输入职业'),
    employerName: yup.string().required('请输入雇主名字'),
    annualIncome: yup.string().required('请输入年收入'),
    sourceOfIncome: yup.string().required('请选择收入来源'),
    document1Front: yup.mixed().required('请上传身份证正面'),
    document1Back: yup.mixed().required('请上传身份证反面'),
    document2Front: yup.mixed().required('请上传护照正面'),
    document2Back: yup.mixed().required('请上传护照反面'),
    facePic: yup.mixed().required('请上传人脸识别照片'),

    b_beneficiaryType: yup.number().required('请选择收款人类型'),
    b_bankName: yup.string().required('请输入银行名称'),
    b_branchName: yup.string().required('请输入银行支行'),
    b_accountName: yup.string().required('请输入银行账号名'),
    b_accountNumber: yup.string().required('请输入银行账号'),
    b_bsb_swiftCode: yup.string().required('请输入银行BSB/SWIFT代码'),
    b_firstName: yup.string().when('b_beneficiaryType', {
      is: (arg: number) => arg === 1,
      then: yup.string().required('请输入收款人姓名'),
    }),
    b_lastName: yup.string().when('b_beneficiaryType', {
      is: (arg: number) => arg === 1,
      then: yup.string().required('请输入收款人姓氏'),
    }),
    b_dob: yup.string().when('b_beneficiaryType', {
      is: (arg: number) => arg === 1,
      then: yup.string().required('请选择收款人生日'),
    }),
    b_phone: yup.string().when('b_beneficiaryType', {
      is: (arg: number) => arg === 1,
      then: yup.string().required('请输入收款人联系号码'),
    }),
    b_occupation: yup.string().when('b_beneficiaryType', {
      is: (arg: number) => arg === 1,
      then: yup.string().required('请输入收款人职业'),
    }),
    b_relation: yup.string().when('b_beneficiaryType', {
      is: (arg: number) => arg === 1,
      then: yup.string().required('请选择收款人关系'),
    }),
    b_country: yup.string().when('b_beneficiaryType', {
      is: (arg: number) => arg === 1,
      then: yup.string().required('请输入收款人所在国家'),
    }),
    b_state: yup.string().when('b_beneficiaryType', {
      is: (arg: number) => arg === 1,
      then: yup.string().required('请输入收款人所在州/省'),
    }),
    b_suburb: yup.string().when('b_beneficiaryType', {
      is: (arg: number) => arg === 1,
      then: yup.string().required('请输入收款人所在区'),
    }),
    b_address: yup.string().when('b_beneficiaryType', {
      is: (arg: number) => arg === 1,
      then: yup.string().required('请输入收款人街道地址'),
    }),
    b_postcode: yup.string().when('b_beneficiaryType', {
      is: (arg: number) => arg === 1,
      then: yup.string().required('请输入收款人邮编'),
    }),
    b_documentFront: yup.mixed().when('b_beneficiaryType', {
      is: (arg: number) => arg === 1,
      then: yup.mixed().required('请上传收款人身份证正面'),
    }),
    b_documentBack: yup.mixed().when('b_beneficiaryType', {
      is: (arg: number) => arg === 1,
      then: yup.mixed().required('请上传收款人身份证反面'),
    }),
    b_trustAccount: yup.number().when('b_beneficiaryType', {
      is: (arg: number) => arg === 1,
      then: yup.number().required('请选择委托账户类型'),
    }),
    b_companyName: yup.string().when(['b_beneficiaryType', 'b_trustAccount'], {
      is: (arg: number, arg2: number) => arg === 1 && arg2 === 1,
      then: yup.string().required('请输入公司名称'),
    }),
    b_companyAddress: yup
      .string()
      .when(['b_beneficiaryType', 'b_trustAccount'], {
        is: (arg: number, arg2: number) => arg === 1 && arg2 === 1,
        then: yup.string().required('请输入公司地址'),
      }),
    b_companyABN: yup.string().when(['b_beneficiaryType', 'b_trustAccount'], {
      is: (arg: number, arg2: number) => arg === 1 && arg2 === 1,
      then: yup.string().required('请输入公司ABN'),
    }),
    choose1: yup.boolean().required('请选择').oneOf([true], '请确认上述信息'),
    choose2: yup.boolean().required('请选择').oneOf([true], '请确认上述信息'),
    signature: yup.mixed().required('请确认信息并签名'),
  })
  .required();
const pageField: { [props: string]: string[] } = {
  '1': [
    'firstName',
    'lastName',
    'gender',
    'dob',
    'email',
    'phone',
    'saleId',
    'fromCurrency',
    'toCurrency',
    'amount',
    'approximateExchangeTime',
    'notes',
    'purpose',
    'otherPurpose',
    'address',
  ],
  '2': [
    'occupation',
    'employerName',
    'annualIncome',
    'sourceOfIncome',
    'document1Front',
    'document1Back',
    'document2Front',
    'document2Back',
    'facePic',
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
    'b_trustAccount',
    'b_companyName',
    'b_companyAddress',
    'b_companyABN',
    'signature',
  ],
};

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
  const handlePrevious = () => {
    previousPage();
  };
  const [purpose, b_beneficiaryType, b_trustAccount, fromCurrency, toCurrency] =
    methods.watch([
      'purpose',
      'b_beneficiaryType',
      'b_trustAccount',
      'fromCurrency',
      'toCurrency',
    ]);
  const handleSubmit = methods.handleSubmit(async (values) => {
    const { choose1, choose2, ...valueObj } = values;
    const formData = new FormData();
    for (const key in valueObj) {
      formData.append(key, valueObj[key]);
    }
    const res: any = await addIndividual(formData as any);
    if (res.code === 0) {
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
                      <FieldDecorator
                        required
                        label="名字 FirstName"
                        name="firstName"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        required
                        label="姓氏 LastName"
                        name="lastName"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        required
                        label="性别 Gender"
                        name="gender"
                      >
                        <Select className="w-full">
                          <Select.Option value={0}>男 Male</Select.Option>
                          <Select.Option value={1}>女 Female</Select.Option>
                          <Select.Option value={2}>
                            其他 Indeterminate
                          </Select.Option>
                        </Select>
                      </FieldDecorator>
                      <FieldDecorator
                        required
                        label="出生日期 Date of Birth"
                        name="dob"
                        transformOut={(value: any) => value.toISOString()}
                        transformIn={(value: any) => new Date(value)}
                      >
                        <DatePicker
                          className="w-full"
                          placeholder={'Select date'}
                        />
                      </FieldDecorator>
                      <FieldDecorator
                        required
                        label="电子邮箱 Email Address"
                        name="email"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        required
                        label="联系号码 Phone"
                        name="phone"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        required
                        label="汇款目的 Purpose"
                        name="purpose"
                      >
                        <Select className="w-full">
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

                    <SectionTitle>居住信息</SectionTitle>
                    <PageSection>
                      <FieldDecorator
                        required
                        className="lg:col-span-2 md:col-span-1"
                        label="街道地址 Address"
                        name="address"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator label="邮政编码 Postcode" name="postcode">
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator label="区 Suburb" name="suburb">
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator label="州 State/省 Province" name="state">
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator label="国家 Country" name="country">
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
                        required
                        label="职业与行业 Occupation & Industry"
                        name="occupation"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        required
                        label="雇主名字 Employer's Name"
                        name="employerName"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        required
                        label="年收入 Annual Income"
                        name="annualIncome"
                      >
                        <Select className="w-full">
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
                        required
                        label="收入来源 Source of Income"
                        name="sourceOfIncome"
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
                        required
                        label="身份证明1正面 front side of the identity certificate 1."
                        name="document1Front"
                      >
                        <UploadFile />
                      </FieldDecorator>
                      <FieldDecorator
                        required
                        label="身份证明1背面  back side of the identity certificate 1."
                        name="document1Back"
                      >
                        <UploadFile />
                      </FieldDecorator>
                      <div className="lg:block md:hidden sm:hidden" />
                      <FieldDecorator
                        required
                        label="身份证明2正面 front side of the identity certificate 2."
                        name="document2Front"
                      >
                        <UploadFile />
                      </FieldDecorator>
                      <FieldDecorator
                        required
                        label="身份证明2背面  back side of the identity certificate 2"
                        name="document2Back"
                      >
                        <UploadFile />
                      </FieldDecorator>
                      <div className="lg:block md:hidden sm:hidden" />
                      <FieldDecorator
                        required
                        label="人脸识别照片 face recognition"
                        name="facePic"
                      >
                        <UploadFace />
                      </FieldDecorator>
                    </PageSection>
                  </>
                )}
                {page === 3 && (
                  <>
                    <SectionTitle isTop>收款人账户信息</SectionTitle>
                    <PageSection>
                      <FieldDecorator
                        required
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
                        label="账户信息 Account Number"
                        name="b_accountNumber"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        required
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
                        label="收款人生日 Date of Birth"
                        name="b_dob"
                        transformOut={(value: any) => value.toISOString()}
                        transformIn={(value: any) => new Date(value)}
                      >
                        <DatePicker className="w-full" />
                      </FieldDecorator>
                      <FieldDecorator
                        required
                        label="收款人联系方式 Phone"
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
                    <SectionTitle>收款人居住信息</SectionTitle>
                    <PageSection>
                      <FieldDecorator
                        required
                        className="lg:col-span-2 md:col-span-1"
                        label="街道地址 Address"
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
                    <SectionTitle>证件及其他信息</SectionTitle>
                    <div className="mb-6">
                      需要提供收款人的一个证件
                      <br />
                      Provide beneficiary account holder's ID if not
                      transferring to your personal account.
                    </div>
                    <PageSection>
                      <FieldDecorator
                        required
                        label="收款人证件正面 front side of payee's ID"
                        name="b_documentFront"
                      >
                        <UploadFile />
                      </FieldDecorator>
                      <FieldDecorator
                        required
                        label="收款人证件背面 back side of payee's ID"
                        name="b_documentBack"
                      >
                        <UploadFile />
                      </FieldDecorator>
                    </PageSection>
                    <PageSection>
                      <FieldDecorator
                        required
                        label="委托账户类型"
                        name="b_trustAccount"
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
                        required
                        className="mt-6"
                        visible={b_trustAccount === 1}
                        hiddenWhenInvisible
                        label="公司名称 Company Name"
                        name="b_companyName"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        required
                        className="mt-6"
                        visible={b_trustAccount === 1}
                        hiddenWhenInvisible
                        label="公司地址 Company Address"
                        name="b_companyAddress"
                      >
                        <Input />
                      </FieldDecorator>
                      <FieldDecorator
                        required
                        visible={b_trustAccount === 1}
                        hiddenWhenInvisible
                        label="公司ABN Company ABN"
                        name="b_companyABN"
                      >
                        <Input />
                      </FieldDecorator>
                    </PageSection>
                  </>
                )}
                {page === 3 && (
                  <>
                    <SectionTitle>信息确认及签名</SectionTitle>
                    <FieldDecorator
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
