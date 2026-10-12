import { API } from '@/api/API'
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type GenderType = 'MALE' | 'FEMALE' | 'OTHER'
export type BloodGroupType =
  | 'A_POSITIVE'
  | 'A_NEGATIVE'
  | 'B_POSITIVE'
  | 'B_NEGATIVE'
  | 'AB_POSITIVE'
  | 'AB_NEGATIVE'
  | 'O_POSITIVE'
  | 'O_NEGATIVE'

export interface StaffProfile {
  id: string
  userId?: string | null
  counterNumber?: string | null
  department?: string | null
  createdAt?: string
  updatedAt?: string
}

export interface StaffUser {
  id: string
  email: string
  fullname: string
  phone: string
  role: 'STAFF'
  gender?: GenderType | null
  bloodGroup?: BloodGroupType | null
  presentAddress?: string | null
  permanentAddress?: string | null
  emergencyContactName?: string | null
  emergencyRelation?: string | null
  emergencyPhone?: string | null
  isActive: boolean
  isDeleted: boolean
  staffProfile?: StaffProfile | null
  createdAt?: string
  updatedAt?: string
}

export interface CreateStaffPayload {
  fullname: string
  email: string
  password: string
  phone: string
  gender?: GenderType
  department?: string
  counterNumber?: string
  presentAddress?: string
  permanentAddress?: string
  emergencyContactName?: string
  emergencyRelation?: string
  emergencyPhone?: string
}

export type UpdateStaffPayload = Partial<CreateStaffPayload> & {
  isActive?: boolean
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

export const fetchStaffsThunk = createAsyncThunk<
  StaffUser[],
  void,
  { rejectValue: string }
>('staff/fetchStaffs', async (_, { rejectWithValue }) => {
  try {
    const res = await API<ApiResponse<StaffUser[]>>({
      endpoint: '/staffs',
      option: {
        method: 'GET',
      },
    })
    return res.data
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, 'Failed to fetch staff list'))
  }
})

export const fetchStaffByIdThunk = createAsyncThunk<
  StaffUser,
  string,
  { rejectValue: string }
>('staff/fetchStaffById', async (id, { rejectWithValue }) => {
  try {
    const res = await API<ApiResponse<StaffUser>>({
      endpoint: `/staffs/${id}`,
      option: {
        method: 'GET',
      },
    })
    return res.data
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, 'Failed to fetch staff details'))
  }
})

export const createStaffThunk = createAsyncThunk<
  StaffUser,
  CreateStaffPayload,
  { rejectValue: string }
>('staff/createStaff', async (staffData, { rejectWithValue }) => {
  try {
    const res = await API<ApiResponse<StaffUser>>({
      endpoint: '/staffs',
      option: {
        method: 'POST',
        body: JSON.stringify(staffData),
      },
    })
    return res.data
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, 'Failed to register staff'))
  }
})

export const updateStaffThunk = createAsyncThunk<
  StaffUser,
  { id: string; data: UpdateStaffPayload },
  { rejectValue: string }
>('staff/updateStaff', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await API<ApiResponse<StaffUser>>({
      endpoint: `/staffs/${id}`,
      option: {
        method: 'PATCH',
        body: JSON.stringify(data),
      },
    })
    return res.data
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, 'Failed to update staff record'))
  }
})

export const deleteStaffThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('staff/deleteStaff', async (id, { rejectWithValue }) => {
  try {
    await API<ApiResponse<null>>({
      endpoint: `/staffs/${id}`,
      option: {
        method: 'DELETE',
      },
    })
    return id
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, 'Failed to remove staff'))
  }
})

interface StaffState {
  staffs: StaffUser[]
  selectedStaff: StaffUser | null
  loading: boolean
  error: string | null
  actionLoading: boolean
  actionError: string | null
  successMessage: string | null
}

const initialState: StaffState = {
  staffs: [],
  selectedStaff: null,
  loading: false,
  error: null,
  actionLoading: false,
  actionError: null,
  successMessage: null,
}

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    setSelectedStaff: (state, action: PayloadAction<StaffUser | null>) => {
      state.selectedStaff = action.payload
    },
    clearStaffMessages: (state) => {
      state.actionLoading = false
      state.actionError = null
      state.successMessage = null
    },
    clearStaffState: (state) => {
      state.staffs = []
      state.selectedStaff = null
      state.loading = false
      state.error = null
      state.actionLoading = false
      state.actionError = null
      state.successMessage = null
    },
  },
  extraReducers: (builder) => {
    // Fetch Staffs
    builder
      .addCase(fetchStaffsThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchStaffsThunk.fulfilled, (state, action) => {
        state.loading = false
        state.staffs = action.payload
      })
      .addCase(fetchStaffsThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Failed to load staff list'
      })

    // Fetch By ID
    builder
      .addCase(fetchStaffByIdThunk.pending, (state) => {
        state.actionLoading = true
        state.actionError = null
      })
      .addCase(fetchStaffByIdThunk.fulfilled, (state, action) => {
        state.actionLoading = false
        state.selectedStaff = action.payload
      })
      .addCase(fetchStaffByIdThunk.rejected, (state, action) => {
        state.actionLoading = false
        state.actionError = action.payload ?? 'Failed to load staff details'
      })

    // Create Staff
    builder
      .addCase(createStaffThunk.pending, (state) => {
        state.actionLoading = true
        state.actionError = null
        state.successMessage = null
      })
      .addCase(createStaffThunk.fulfilled, (state, action) => {
        state.actionLoading = false
        state.staffs.unshift(action.payload)
        state.successMessage = 'Staff member registered successfully'
      })
      .addCase(createStaffThunk.rejected, (state, action) => {
        state.actionLoading = false
        state.actionError = action.payload ?? 'Failed to add staff'
      })

    // Update Staff
    builder
      .addCase(updateStaffThunk.pending, (state) => {
        state.actionLoading = true
        state.actionError = null
        state.successMessage = null
      })
      .addCase(updateStaffThunk.fulfilled, (state, action) => {
        state.actionLoading = false
        const index = state.staffs.findIndex((s) => s.id === action.payload.id)
        if (index !== -1) {
          state.staffs[index] = action.payload
        }
        if (state.selectedStaff?.id === action.payload.id) {
          state.selectedStaff = action.payload
        }
        state.successMessage = 'Staff profile updated successfully'
      })
      .addCase(updateStaffThunk.rejected, (state, action) => {
        state.actionLoading = false
        state.actionError = action.payload ?? 'Failed to update staff'
      })

    // Delete Staff
    builder
      .addCase(deleteStaffThunk.pending, (state) => {
        state.actionLoading = true
        state.actionError = null
        state.successMessage = null
      })
      .addCase(deleteStaffThunk.fulfilled, (state, action) => {
        state.actionLoading = false
        state.staffs = state.staffs.filter((s) => s.id !== action.payload)
        if (state.selectedStaff?.id === action.payload) {
          state.selectedStaff = null
        }
        state.successMessage = 'Staff record removed successfully'
      })
      .addCase(deleteStaffThunk.rejected, (state, action) => {
        state.actionLoading = false
        state.actionError = action.payload ?? 'Failed to delete staff'
      })
  },
})

export const { setSelectedStaff, clearStaffMessages, clearStaffState } = staffSlice.actions
export default staffSlice.reducer