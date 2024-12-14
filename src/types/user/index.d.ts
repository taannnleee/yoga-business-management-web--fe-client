type IRole = "admin" | "staff";

export interface IUser {
  id: string;
  username: string;
  email: string;
  role: IRole;
  token: string;
}

export interface IAddress {
  city: string;
  district: string;
  ward: string;
  addressDetail: string;
}

export type IPaymentStatus = "PENDING" | "OVERDUE" | "COMPLETED";
