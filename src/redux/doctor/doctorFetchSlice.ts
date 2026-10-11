import { API } from '@/api/API'
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface User {
  id: string
  fullname: string
  email: string
  phone?: string | null
  presentAddress?: string | null
  permanentAddress?: string | null
  gender?: string | null
  role?: string
  isActive?: boolean
  isDeleted?: boolean
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

export interface DoctorWithProfile extends User {
  doctorProfile: DoctorProfile
}

export interface CreateDoctorPayload {
  fullname: string
  email: string
  password: string
  phone: string
  department: string
  specialization: string
  designation?: string
  experience: number
  fee: number
  teleconsultationFee?: number
  availableDays: string[]
  visitingHours?: string
  roomNumber?: string
  floorNumber?: string
  image?: string
}

export type UpdateDoctorPayload = Partial<CreateDoctorPayload> & {
  isAvailable?: boolean
  isEmployed?: boolean
}

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

const extractErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const customErr = error as { message?: string }
    if (typeof customErr.message === 'string') {
      return customErr.message
    }
  }
  return fallback
}

export const fetchDoctorsThunk = createAsyncThunk<
  DoctorWithProfile[],
  string | undefined,
  { rejectValue: string }
>('doctors/fetchDoctors', async (department, { rejectWithValue }) => {
  try {
    const endpoint =
      department && department.trim().length > 0
        ? `/doctors?department=${encodeURIComponent(department.trim())}`
        : '/doctors'

    const res = await API<ApiResponse<DoctorWithProfile[]>>({
      endpoint,
      option: {
        method: 'GET',
      },
    })

    return res.data
  } catch (error: unknown) {
    return rejectWithValue(extractErrorMessage(error, 'Failed to fetch doctors'))
  }
})

export const createDoctorThunk = createAsyncThunk<
  DoctorWithProfile,
  CreateDoctorPayload,
  { rejectValue: string }
>('doctors/createDoctor', async (doctorData, { rejectWithValue }) => {
  try {
    const res = await API<ApiResponse<DoctorWithProfile>>({
      endpoint: '/doctors',
      option: {
        method: 'POST',
        body: JSON.stringify(doctorData),
      },
    })

    return res.data
  } catch (error: unknown) {
    return rejectWithValue(extractErrorMessage(error, 'Failed to add doctor'))
  }
})

export const updateDoctorThunk = createAsyncThunk<
  DoctorWithProfile,
  { id: string; data: UpdateDoctorPayload },
  { rejectValue: string }
>('doctors/updateDoctor', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await API<ApiResponse<DoctorWithProfile>>({
      endpoint: `/doctors/${id}`,
      option: {
        method: 'PATCH',
        body: JSON.stringify(data),
      },
    })

    return res.data
  } catch (error: unknown) {
    return rejectWithValue(extractErrorMessage(error, 'Failed to update doctor'))
  }
})

export const deleteDoctorThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('doctors/deleteDoctor', async (id, { rejectWithValue }) => {
  try {
    await API<ApiResponse<null>>({
      endpoint: `/doctors/${id}`,
      option: {
        method: 'DELETE',
      },
    })

    return id
  } catch (error: unknown) {
    return rejectWithValue(extractErrorMessage(error, 'Failed to delete doctor'))
  }
})

interface DoctorsState {
  doctors: DoctorWithProfile[]
  loading: boolean
  error: string | null
  actionLoading: boolean
  actionError: string | null
  selectedDepartment: string | null
}

const initialState: DoctorsState = {
  doctors: [],
  loading: false,
  error: null,
  actionLoading: false,
  actionError: null,
  selectedDepartment: null,
}

const doctorSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {
    setSelectedDepartment: (state, action: PayloadAction<string | null>) => {
      state.selectedDepartment = action.payload
    },
    clearActionStatus: (state) => {
      state.actionLoading = false
      state.actionError = null
    },
    clearDoctorsState: (state) => {
      state.doctors = []
      state.loading = false
      state.error = null
      state.actionLoading = false
      state.actionError = null
      state.selectedDepartment = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctorsThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDoctorsThunk.fulfilled, (state, action) => {
        state.loading = false
        state.doctors = action.payload
      })
      .addCase(fetchDoctorsThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to load doctors'
      })

    builder
      .addCase(createDoctorThunk.pending, (state) => {
        state.actionLoading = true
        state.actionError = null
      })
      .addCase(createDoctorThunk.fulfilled, (state, action) => {
        state.actionLoading = false
        state.doctors.unshift(action.payload)
      })
      .addCase(createDoctorThunk.rejected, (state, action) => {
        state.actionLoading = false
        state.actionError = action.payload || 'Failed to add doctor'
      })

    builder
      .addCase(updateDoctorThunk.pending, (state) => {
        state.actionLoading = true
        state.actionError = null
      })
      .addCase(updateDoctorThunk.fulfilled, (state, action) => {
        state.actionLoading = false
        const index = state.doctors.findIndex((doc) => doc.id === action.payload.id)
        if (index !== -1) {
          state.doctors[index] = action.payload
        }
      })
      .addCase(updateDoctorThunk.rejected, (state, action) => {
        state.actionLoading = false
        state.actionError = action.payload || 'Failed to update doctor'
      })

    builder
      .addCase(deleteDoctorThunk.pending, (state) => {
        state.actionLoading = true
        state.actionError = null
      })
      .addCase(deleteDoctorThunk.fulfilled, (state, action) => {
        state.actionLoading = false
        state.doctors = state.doctors.filter((doc) => doc.id !== action.payload)
      })
      .addCase(deleteDoctorThunk.rejected, (state, action) => {
        state.actionLoading = false
        state.actionError = action.payload || 'Failed to remove doctor'
      })
  },
})

export const { setSelectedDepartment, clearActionStatus, clearDoctorsState } =
  doctorSlice.actions

export default doctorSlice.reducer