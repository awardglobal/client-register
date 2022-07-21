import requestAPI from '@/utils/request';

export interface IndividualClientRegistration {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  purpose: string;
  // 如果purpose为other 则需要提供purposeOther
  otherPurpose?: string;
  saleId?: string;
  document1Front: File;
  document1Back: File;
  document2Front: File;
  document2Back: File;
  signature: File;
  facePic: File;

  gender: number; // 0 male 1 femal 2 other
  dob: string; // format 1990-01-01
  occupation: string;
  employerName: string;
  annualIncome: string;
  sourceOfIncome: string;

  address: string;
  suburb: string;
  state: string;
  country: string;
  postcode: string;
}

interface CompanyClientRegistration {
  email: string;
  phone: string;
  purpose: string;
  otherPurpose?: string;
  saleId?: string;

  document1Front: File;
  document1Back: File;
  document2Front: File;
  document2Back: File;
  signature: File; // ?
  companyExtract: File;

  companyName: string;
  entityType: string;
  registeredAddress: string;
  principalAddress: string;
  abn_acn_arbn: string;

  accountHolderName: string;
  accountHolderDOB: string;
  accountHolderPosition: string;
  accountHolderPhone: string;
  accountHolderEmail: string;
  accountHolderAddress: string;
}

interface ClientBeneficiary {
  b_beneficiaryType: number; // 0 自己 1 他人
  b_bankName: string; //
  b_branchName: string;
  b_accountName: string;
  b_accountNumber: string;
  b_bsb_swiftCode: string;

  b_trustAccount?: boolean;
  b_companyName?: string;
  b_companyAddress?: string;
  b_companyABN?: string;

  b_address?: string;
  b_suburb?: string;
  b_state?: string;
  b_postcode?: string;
  b_country?: string;

  b_firstName?: string;
  b_lastName?: string;
  b_name?: string;
  b_dob?: string;
  b_phone?: string;
  b_relation?: string;
  b_occupation?: string;

  b_documentFront?: File;
  b_documentBack?: File;
  b_relatedDoc?: File;
}

type IndividualClientRegistrationRequest = IndividualClientRegistration &
  ClientBeneficiary;

type CompanyClientRegistrationRequest = CompanyClientRegistration &
  ClientBeneficiary;

export async function addIndividual(
  params: IndividualClientRegistrationRequest
) {
  const res = await requestAPI({
    url: '/api/registration/registrationIndividualClient',
    method: 'post',
    data: params,
  });
  return res;
}

export async function addCompany(params: CompanyClientRegistrationRequest) {
  const res = await requestAPI({
    url: '/api/registration/registrationCompanyClient',
    method: 'post',
    data: params,
  });
  return res;
}

export async function getSaleListService(params: any) {
  const res = await requestAPI({
    url: '/api/registration/getSaleList',
    method: 'post',
    data: params,
  });
  return res.data;
}

export async function getAllCurrencyListService() {
  const res = await requestAPI({
    url: '/api/registration/getAllCurrencyList',
    method: 'post',
  });
  return res.data;
}
