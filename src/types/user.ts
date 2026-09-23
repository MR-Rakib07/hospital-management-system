export interface UserProfile {
  id: string;
  email: string;
  role: "PATIENT" | "DOCTOR" | "ADMIN" | "STAFF";
  fullname: string;
  phone: string;
  dateOfBirth?: string | null;
  gender?: "MALE" | "FEMALE" | "OTHER" | null;
  bloodGroup?: string | null;
  maritalStatus?: "SINGLE" | "MARRIED" | "DIVORCED" | "WIDOWED" | null;
  presentAddress?: string | null;
  permanentAddress?: string | null;
  emergencyContactName?: string | null;
  emergencyRelation?: string | null;
  emergencyPhone?: string | null;
  createdAt?: string;
  updatedAt?: string;
}