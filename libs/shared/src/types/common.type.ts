export type THeaders = Record<string, any>;

export interface IUserHeaderInfo {
  validation: boolean;
  client_id: string;
  message: string;
  tenants: string;
  customer_id: string;
  customer_numId: string;
  customer_ciam_orgId: string;
  reseller_id: string;
  customer_name: string;
  user_name: string;
}

export interface IMetaApiError {
  error: {
    message: string;
    type: string;
    code: number;
    error_subcode: number;
    is_transient: boolean;
    error_user_title: string;
    error_user_msg: string;
    fbtrace_id: string;
  };
}
