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
  specialization?: string | null
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
  specialization?: string
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

interface CustomErrorResponse {
  message?: string
}

const extractErrorMessage = (err: unknown, fallback: string): string => {
  if (err instanceof Error) {
    return err.message
  }

  if (typeof err === 'object' && err !== null && 'message' in err) {
    const errorWithMsg = err as CustomErrorResponse
    if (typeof errorWithMsg.message === 'string') {
      return errorWithMsg.message
    }
  }

  if (typeof err === 'string') {
    return err
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
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, 'Failed to fetch doctors'))
  }
})

export const fetchDoctorByIdThunk = createAsyncThunk<
  DoctorWithProfile,
  string,
  { rejectValue: string }
>('doctors/fetchDoctorById', async (id, { rejectWithValue }) => {
  try {
    const res = await API<ApiResponse<DoctorWithProfile>>({
      endpoint: `/doctors/${id}`,
      option: {
        method: 'GET',
      },
    })

    return res.data
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, 'Failed to fetch doctor details'))
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
  } catch (error) {
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
  } catch (error) {
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
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, 'Failed to delete doctor'))
  }
})

interface DoctorsState {
  doctors: DoctorWithProfile[]
  selectedDoctor: DoctorWithProfile | null
  loading: boolean
  error: string | null
  actionLoading: boolean
  actionError: string | null
  successMessage: string | null
  selectedDepartment: string | null
}

const initialState: DoctorsState = {
  doctors: [],
  selectedDoctor: null,
  loading: false,
  error: null,
  actionLoading: false,
  actionError: null,
  successMessage: null,
  selectedDepartment: null,
}

const doctorSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {
    setSelectedDepartment: (state, action: PayloadAction<string | null>) => {
      state.selectedDepartment = action.payload
    },
    setSelectedDoctor: (state, action: PayloadAction<DoctorWithProfile | null>) => {
      state.selectedDoctor = action.payload
    },
    clearActionStatus: (state) => {
      state.actionLoading = false
      state.actionError = null
      state.successMessage = null
    },
    clearDoctorsState: (state) => {
      state.doctors = []
      state.selectedDoctor = null
      state.loading = false
      state.error = null
      state.actionLoading = false
      state.actionError = null
      state.successMessage = null
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
        state.error = action.payload ?? 'Failed to load doctors'
      })

    builder
      .addCase(fetchDoctorByIdThunk.pending, (state) => {
        state.actionLoading = true
        state.actionError = null
      })
      .addCase(fetchDoctorByIdThunk.fulfilled, (state, action) => {
        state.actionLoading = false
        state.selectedDoctor = action.payload
      })
      .addCase(fetchDoctorByIdThunk.rejected, (state, action) => {
        state.actionLoading = false
        state.actionError = action.payload ?? 'Failed to fetch doctor details'
      })

    builder
      .addCase(createDoctorThunk.pending, (state) => {
        state.actionLoading = true
        state.actionError = null
        state.successMessage = null
      })
      .addCase(createDoctorThunk.fulfilled, (state, action) => {
        state.actionLoading = false
        state.doctors.unshift(action.payload)
        state.successMessage = 'Doctor registered successfully'
      })
      .addCase(createDoctorThunk.rejected, (state, action) => {
        state.actionLoading = false
        state.actionError = action.payload ?? 'Failed to add doctor'
      })

    builder
      .addCase(updateDoctorThunk.pending, (state) => {
        state.actionLoading = true
        state.actionError = null
        state.successMessage = null
      })
      .addCase(updateDoctorThunk.fulfilled, (state, action) => {
        state.actionLoading = false
        const index = state.doctors.findIndex((doc) => doc.id === action.payload.id)
        if (index !== -1) {
          state.doctors[index] = action.payload
        }
        if (state.selectedDoctor?.id === action.payload.id) {
          state.selectedDoctor = action.payload
        }
        state.successMessage = 'Doctor profile updated successfully'
      })
      .addCase(updateDoctorThunk.rejected, (state, action) => {
        state.actionLoading = false
        state.actionError = action.payload ?? 'Failed to update doctor'
      })

    builder
      .addCase(deleteDoctorThunk.pending, (state) => {
        state.actionLoading = true
        state.actionError = null
        state.successMessage = null
      })
      .addCase(deleteDoctorThunk.fulfilled, (state, action) => {
        state.actionLoading = false
        state.doctors = state.doctors.filter((doc) => doc.id !== action.payload)
        if (state.selectedDoctor?.id === action.payload) {
          state.selectedDoctor = null
        }
        state.successMessage = 'Doctor removed successfully'
      })
      .addCase(deleteDoctorThunk.rejected, (state, action) => {
        state.actionLoading = false
        state.actionError = action.payload ?? 'Failed to remove doctor'
      })
  },
})

export const {
  setSelectedDepartment,
  setSelectedDoctor,
  clearActionStatus,
  clearDoctorsState,
} = doctorSlice.actions

export default doctorSlice.reducer