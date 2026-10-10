export type Role = 'PATIENT' | 'DOCTOR' | 'ADMIN' | 'STAFF'
export type Gender = 'MALE' | 'FEMALE' | 'OTHER'
export type MaritalStatus = 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED'
export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'

export type BloodGroup =
  | 'A_POSITIVE'
  | 'A_NEGATIVE'
  | 'B_POSITIVE'
  | 'B_NEGATIVE'
  | 'AB_POSITIVE'
  | 'AB_NEGATIVE'
  | 'O_POSITIVE'
  | 'O_NEGATIVE'

export interface DoctorProfile {
  id: string
  userId: string
  department: string
  specialization: string
  designation?: string | null
  experience: number
  fee: number
  image?: string | null
  availableDays: string[]
  isAvailable: boolean
  createdAt: string
  updatedAt: string
}

export interface AdminProfile {
  id: string
  userId: string
  designation?: string | null
  department?: string | null
  createdAt: string
  updatedAt: string
}

export interface UserProfile {
  id: string
  email: string
  role: Role
  fullname: string
  phone: string
  dateOfBirth?: string | null
  gender?: Gender | null
  bloodGroup?: BloodGroup | null
  maritalStatus?: MaritalStatus | null
  presentAddress?: string | null
  permanentAddress?: string | null
  emergencyContactName?: string | null
  emergencyRelation?: string | null
  emergencyPhone?: string | null
  doctorProfile?: DoctorProfile | null
  adminProfile?: AdminProfile | null
  createdAt: string
  updatedAt: string
}

export interface AppointmentWithRelations {
  id: string
  patientId: string
  patient?: UserProfile
  doctorId: string
  doctor?: DoctorProfile & { user?: Pick<UserProfile, 'fullname' | 'phone' | 'email'> }
  appointmentDate: string
  serialNumber: number
  problemDetails?: string | null
  status: AppointmentStatus
  createdAt: string
  updatedAt: string
}