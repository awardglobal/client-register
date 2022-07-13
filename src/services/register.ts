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

interface ClientBeneficiary {
  b_beneficiaryType: number; // 0 自己 1 他人
  b_bankName: string;
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
  b_dob?: string;
  b_phone?: string;
  b_relation?: string;
  b_occupation?: string;
  b_purpose?: string;

  b_documentFront?: File;
  b_documentBack?: File;
}

type IndividualClientRegistrationRequest = IndividualClientRegistration &
  ClientBeneficiary;

export async function addIndividual(
  params: IndividualClientRegistrationRequest
) {
  const res = await requestAPI({
    url: '/api/registration/registrationIndividualClient',
    method: 'post',
    data: params,
  });
  return res.data;
}

export async function saleIdList() {
  const res = await requestAPI({
    url: '/api/registration/getAllSales',
    method: 'post',
  });
  return res.data;
}
