import { API } from '@/api/API'
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface DepartmentItem {
  id: string
  name: string
  specializations: string[]
  createdAt?: string
  updatedAt?: string
}

export interface DoctorConfigData {
  departments: DepartmentItem[]
  designations: string[]
}

export interface CreateDepartmentPayload {
  name: string
  specializations: string[]
}

export interface UpdateDepartmentPayload {
  id: string
  data: {
    name?: string
    specializations?: string[]
  }
}

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

const extractErrorMessage = (error: object | null | undefined, fallback: string): string => {
  if (error && 'message' in error && typeof error.message === 'string' && error.message.trim().length > 0) {
    return error.message
  }
  return fallback
}

export const fetchDoctorConfigThunk = createAsyncThunk<
  DoctorConfigData,
  void,
  { rejectValue: string }
>('departments/fetchDoctorConfig', async (_, { rejectWithValue }) => {
  try {
    const res = await API<ApiResponse<DoctorConfigData>>({
      endpoint: '/departments/doctor-config',
      option: {
        method: 'GET',
      },
    })
    return res.data
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error as object, 'Failed to fetch doctor configuration'))
  }
})

export const fetchDepartmentsThunk = createAsyncThunk<
  DepartmentItem[],
  void,
  { rejectValue: string }
>('departments/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await API<ApiResponse<DepartmentItem[]>>({
      endpoint: '/departments',
      option: {
        method: 'GET',
      },
    })
    return res.data
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error as object, 'Failed to fetch departments'))
  }
})

export const createDepartmentThunk = createAsyncThunk<
  DepartmentItem,
  CreateDepartmentPayload,
  { rejectValue: string }
>('departments/create', async (payload, { rejectWithValue }) => {
  try {
    const res = await API<ApiResponse<DepartmentItem>>({
      endpoint: '/departments',
      option: {
        method: 'POST',
        body: JSON.stringify(payload),
      },
    })
    return res.data
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error as object, 'Failed to create department'))
  }
})

export const updateDepartmentThunk = createAsyncThunk<
  DepartmentItem,
  UpdateDepartmentPayload,
  { rejectValue: string }
>('departments/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await API<ApiResponse<DepartmentItem>>({
      endpoint: `/departments/${id}`,
      option: {
        method: 'PATCH',
        body: JSON.stringify(data),
      },
    })
    return res.data
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error as object, 'Failed to update department'))
  }
})

interface DepartmentState {
  departments: DepartmentItem[]
  designations: string[]
  loading: boolean
  actionLoading: boolean
  error: string | null
  actionError: string | null
  successMessage: string | null
}

const initialState: DepartmentState = {
  departments: [],
  designations: [],
  loading: false,
  actionLoading: false,
  error: null,
  actionError: null,
  successMessage: null,
}

const departmentSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {
    clearDepartmentMessages: (state) => {
      state.error = null
      state.actionError = null
      state.successMessage = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctorConfigThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        fetchDoctorConfigThunk.fulfilled,
        (state, action: PayloadAction<DoctorConfigData>) => {
          state.loading = false
          state.departments = action.payload.departments
          state.designations = action.payload.designations
        }
      )
      .addCase(fetchDoctorConfigThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to load configuration'
      })

    builder
      .addCase(fetchDepartmentsThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        fetchDepartmentsThunk.fulfilled,
        (state, action: PayloadAction<DepartmentItem[]>) => {
          state.loading = false
          state.departments = action.payload
        }
      )
      .addCase(fetchDepartmentsThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to load departments'
      })

    builder
      .addCase(createDepartmentThunk.pending, (state) => {
        state.actionLoading = true
        state.actionError = null
      })
      .addCase(
        createDepartmentThunk.fulfilled,
        (state, action: PayloadAction<DepartmentItem>) => {
          state.actionLoading = false
          state.departments.unshift(action.payload)
          state.successMessage = 'Department created successfully'
        }
      )
      .addCase(createDepartmentThunk.rejected, (state, action) => {
        state.actionLoading = false
        state.actionError = action.payload || 'Failed to create department'
      })

    builder
      .addCase(updateDepartmentThunk.pending, (state) => {
        state.actionLoading = true
        state.actionError = null
      })
      .addCase(
        updateDepartmentThunk.fulfilled,
        (state, action: PayloadAction<DepartmentItem>) => {
          state.actionLoading = false
          const index = state.departments.findIndex((d) => d.id === action.payload.id)
          if (index !== -1) {
            state.departments[index] = action.payload
          }
          state.successMessage = 'Department updated successfully'
        }
      )
      .addCase(updateDepartmentThunk.rejected, (state, action) => {
        state.actionLoading = false
        state.actionError = action.payload || 'Failed to update department'
      })
  },
})

export const { clearDepartmentMessages } = departmentSlice.actions
export default departmentSlice.reducer