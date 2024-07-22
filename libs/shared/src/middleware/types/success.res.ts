export interface ISuccessVerifyRes {
  success: boolean;
  data: IUserData;
}

export interface IUserData {
  sub: string;
  customer_id: string;
}
