export type Role = "PATIENT" | "DOCTOR" | "ADMIN" | "STAFF";

export type Gender = "MALE" | "FEMALE" | "OTHER";

export type BloodGroup =
  | "A_POSITIVE"
  | "A_NEGATIVE"
  | "B_POSITIVE"
  | "B_NEGATIVE"
  | "AB_POSITIVE"
  | "AB_NEGATIVE"
  | "O_POSITIVE"
  | "O_NEGATIVE";

export type MaritalStatus = "SINGLE" | "MARRIED" | "DIVORCED" | "WIDOWED";

export interface RegisterFormInput {
  email: string;
  password: string;
  fullname: string;
  phone: string;
  dateOfBirth?: string;
  gender?: Gender;
  bloodGroup?: BloodGroup;
  maritalStatus?: MaritalStatus;
  presentAddress?: string;
  permanentAddress?: string;
  emergencyContactName?: string;
  emergencyRelation?: string;
  emergencyPhone?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  role: Role;
  fullname: string;
  phone: string;
  dateOfBirth?: string | null;
  gender?: Gender | null;
  bloodGroup?: BloodGroup | null;
  maritalStatus?: MaritalStatus | null;
  presentAddress?: string | null;
  permanentAddress?: string | null;
  emergencyContactName?: string | null;
  emergencyRelation?: string | null;
  emergencyPhone?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface AuthSuccessData {
  user: UserProfile;
  accessToken?: string;
}