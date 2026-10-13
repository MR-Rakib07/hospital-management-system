export type Role = 'PATIENT' | 'DOCTOR' | 'ADMIN' | 'STAFF'
export type RoleType = 'DOCTOR' | 'STAFF'
export type Gender = 'MALE' | 'FEMALE' | 'OTHER'
export type MaritalStatus = 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED'

export type AppointmentStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'

export type AppointmentType = 'ONLINE' | 'OFFLINE'
export type PaymentStatus = 'UNPAID' | 'PAID' | 'REFUNDED'

export type BloodGroup =
  | 'A_POSITIVE'
  | 'A_NEGATIVE'
  | 'B_POSITIVE'
  | 'B_NEGATIVE'
  | 'AB_POSITIVE'
  | 'AB_NEGATIVE'
  | 'O_POSITIVE'
  | 'O_NEGATIVE'

export interface DepartmentItem {
  id: string
  name: string
  roleType: RoleType
  createdAt?: string
  updatedAt?: string
}

export interface DesignationItem {
  id: string
  name: string
  roleType: RoleType
  createdAt?: string
  updatedAt?: string
}

export interface DoctorProfile {
  id: string
  userId?: string | null
  department: string
  specialization: string
  designation?: string | null
  experience: number
  fee: number
  teleconsultationFee?: number | null
  image?: string | null
  availableDays: string[]
  visitingHours?: string | null
  roomNumber?: string | null
  floorNumber?: string | null
  isAvailable: boolean
  isEmployed: boolean
  createdAt: string
  updatedAt: string
}

export interface AdminProfile {
  id: string
  userId?: string | null
  designation?: string | null
  department?: string | null
  createdAt: string
  updatedAt: string
}

export interface StaffProfile {
  id: string
  userId?: string | null
  counterNumber?: string | null
  department?: string | null
  createdAt: string
  updatedAt: string
}

export interface Prescription {
  id: string
  appointmentId: string
  diagnosis?: string | null
  medicines?: Record<string, unknown> | null
  advice?: string | null
  pdfUrl?: string | null
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
  isActive?: boolean
  isDeleted?: boolean
  doctorProfile?: DoctorProfile | null
  adminProfile?: AdminProfile | null
  staffProfile?: StaffProfile | null
  createdAt: string
  updatedAt: string
}

export interface AppointmentWithRelations {
  id: string
  serialNumber: number
  serialCode?: string | null
  appointmentDate: string
  type: AppointmentType
  status: AppointmentStatus
  problemDetails?: string | null

  patientName: string
  patientPhone: string
  patientEmail?: string | null
  patientAge?: number | null
  patientGender?: Gender | null

  meetingRoomId?: string | null
  meetingLink?: string | null

  paymentStatus: PaymentStatus
  transactionId?: string | null
  paidAmount: number

  patientId?: string | null
  patient?: Pick<UserProfile, 'fullname' | 'phone' | 'email'> | null

  doctorId?: string | null
  doctor?: (DoctorProfile & {
    user?: Pick<UserProfile, 'fullname' | 'phone' | 'email'> | null
  }) | null

  prescription?: Prescription | null

  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data?: T
}

export interface AuthSuccessData {
  token?: string
  user: UserProfile
}

export interface RegisterFormInput {
  fullname: string
  email: string
  password?: string
  phone: string
  role?: Role
}