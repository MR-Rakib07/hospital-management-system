export type RoleType = 'DOCTOR' | 'STAFF'

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

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface ApiErrorResponse {
  message?: string
}