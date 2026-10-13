import { API } from '@/api/API'
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'

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

export interface RoleConfigData {
  departments: DepartmentItem[]
  designations: string[]
}

export interface CreateDepartmentPayload {
  name: string
  roleType: RoleType
}

export interface UpdateDepartmentPayload {
  id: string
  data: {
    name?: string
    roleType?: RoleType
  }
}

export interface CreateDesignationPayload {
  name: string
  roleType: RoleType
}

export interface UpdateDesignationPayload {
  id: string
  data: {
    name?: string
    roleType?: RoleType
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

export const fetchRoleConfigThunk = createAsyncThunk<
  RoleConfigData,
  RoleType,
  { rejectValue: string }
>('departments/fetchRoleConfig', async (roleType, { rejectWithValue }) => {
  try {
    const res = await API<ApiResponse<RoleConfigData>>({
      endpoint: `/departments/config?roleType=${roleType}`,
      option: {
        method: 'GET',
      },
    })
    return res.data
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error as object, 'Failed to fetch configuration'))
  }
})

export const fetchDepartmentsThunk = createAsyncThunk<
  DepartmentItem[],
  RoleType | undefined,
  { rejectValue: string }
>('departments/fetchAll', async (roleType, { rejectWithValue }) => {
  try {
    const endpoint = roleType ? `/departments?roleType=${roleType}` : '/departments'
    const res = await API<ApiResponse<DepartmentItem[]>>({
      endpoint,
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

export const deleteDepartmentThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('departments/delete', async (id, { rejectWithValue }) => {
  try {
    await API<ApiResponse<{ message: string }>>({
      endpoint: `/departments/${id}`,
      option: {
        method: 'DELETE',
      },
    })
    return id
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error as object, 'Failed to delete department'))
  }
})

export const fetchDesignationsThunk = createAsyncThunk<
  DesignationItem[],
  RoleType | undefined,
  { rejectValue: string }
>('departments/fetchDesignations', async (roleType, { rejectWithValue }) => {
  try {
    const endpoint = roleType ? `/departments/designations?roleType=${roleType}` : '/departments/designations'
    const res = await API<ApiResponse<DesignationItem[]>>({
      endpoint,
      option: {
        method: 'GET',
      },
    })
    return res.data
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error as object, 'Failed to fetch designations'))
  }
})

export const createDesignationThunk = createAsyncThunk<
  DesignationItem,
  CreateDesignationPayload,
  { rejectValue: string }
>('departments/createDesignation', async (payload, { rejectWithValue }) => {
  try {
    const res = await API<ApiResponse<DesignationItem>>({
      endpoint: '/departments/designations',
      option: {
        method: 'POST',
        body: JSON.stringify(payload),
      },
    })
    return res.data
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error as object, 'Failed to create designation'))
  }
})

export const updateDesignationThunk = createAsyncThunk<
  DesignationItem,
  UpdateDesignationPayload,
  { rejectValue: string }
>('departments/updateDesignation', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await API<ApiResponse<DesignationItem>>({
      endpoint: `/departments/designations/${id}`,
      option: {
        method: 'PATCH',
        body: JSON.stringify(data),
      },
    })
    return res.data
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error as object, 'Failed to update designation'))
  }
})

export const deleteDesignationThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('departments/deleteDesignation', async (id, { rejectWithValue }) => {
  try {
    await API<ApiResponse<{ message: string }>>({
      endpoint: `/departments/designations/${id}`,
      option: {
        method: 'DELETE',
      },
    })
    return id
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error as object, 'Failed to delete designation'))
  }
})

interface DepartmentState {
  departments: DepartmentItem[]
  designations: DesignationItem[]
  configDesignationNames: string[]
  loading: boolean
  actionLoading: boolean
  error: string | null
  actionError: string | null
  successMessage: string | null
}

const initialState: DepartmentState = {
  departments: [],
  designations: [],
  configDesignationNames: [],
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
      .addCase(fetchRoleConfigThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        fetchRoleConfigThunk.fulfilled,
        (state, action: PayloadAction<RoleConfigData>) => {
          state.loading = false
          state.departments = action.payload.departments
          state.configDesignationNames = action.payload.designations
        }
      )
      .addCase(fetchRoleConfigThunk.rejected, (state, action) => {
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

    builder
      .addCase(deleteDepartmentThunk.pending, (state) => {
        state.actionLoading = true
        state.actionError = null
      })
      .addCase(
        deleteDepartmentThunk.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.actionLoading = false
          state.departments = state.departments.filter((d) => d.id !== action.payload)
          state.successMessage = 'Department deleted successfully'
        }
      )
      .addCase(deleteDepartmentThunk.rejected, (state, action) => {
        state.actionLoading = false
        state.actionError = action.payload || 'Failed to delete department'
      })

    builder
      .addCase(fetchDesignationsThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        fetchDesignationsThunk.fulfilled,
        (state, action: PayloadAction<DesignationItem[]>) => {
          state.loading = false
          state.designations = action.payload
        }
      )
      .addCase(fetchDesignationsThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to load designations'
      })

    builder
      .addCase(createDesignationThunk.pending, (state) => {
        state.actionLoading = true
        state.actionError = null
      })
      .addCase(
        createDesignationThunk.fulfilled,
        (state, action: PayloadAction<DesignationItem>) => {
          state.actionLoading = false
          state.designations.unshift(action.payload)
          state.successMessage = 'Designation created successfully'
        }
      )
      .addCase(createDesignationThunk.rejected, (state, action) => {
        state.actionLoading = false
        state.actionError = action.payload || 'Failed to create designation'
      })

    builder
      .addCase(updateDesignationThunk.pending, (state) => {
        state.actionLoading = true
        state.actionError = null
      })
      .addCase(
        updateDesignationThunk.fulfilled,
        (state, action: PayloadAction<DesignationItem>) => {
          state.actionLoading = false
          const index = state.designations.findIndex((d) => d.id === action.payload.id)
          if (index !== -1) {
            state.designations[index] = action.payload
          }
          state.successMessage = 'Designation updated successfully'
        }
      )
      .addCase(updateDesignationThunk.rejected, (state, action) => {
        state.actionLoading = false
        state.actionError = action.payload || 'Failed to update designation'
      })

    builder
      .addCase(deleteDesignationThunk.pending, (state) => {
        state.actionLoading = true
        state.actionError = null
      })
      .addCase(
        deleteDesignationThunk.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.actionLoading = false
          state.designations = state.designations.filter((d) => d.id !== action.payload)
          state.successMessage = 'Designation deleted successfully'
        }
      )
      .addCase(deleteDesignationThunk.rejected, (state, action) => {
        state.actionLoading = false
        state.actionError = action.payload || 'Failed to delete designation'
      })
  },
})

export const { clearDepartmentMessages } = departmentSlice.actions
export default departmentSlice.reducer