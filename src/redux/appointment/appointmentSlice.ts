import { API } from "@/api/API"
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type {
  AppointmentStatus,
  AppointmentType,
  AppointmentWithRelations,
  Gender,
} from "@/types/authTypes"

export interface BookAppointmentPayload {
  doctorId: string
  appointmentDate: string
  type: AppointmentType
  problemDetails?: string
  patientName: string
  patientPhone: string
  patientEmail?: string
  patientAge?: number
  patientGender?: Gender
}

export interface FetchAppointmentsQuery {
  doctorId?: string
  date?: string
  status?: AppointmentStatus
}

export interface UpdateStatusPayload {
  id: string
  status: AppointmentStatus
}

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

interface CustomErrorResponse {
  message?: string
}

const extractErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === "object" && error !== null && "message" in error) {
    const customErr = error as CustomErrorResponse
    if (typeof customErr.message === "string") {
      return customErr.message
    }
  }
  if (typeof error === "string") {
    return error
  }
  return fallback
}

export const bookAppointmentThunk = createAsyncThunk<
  AppointmentWithRelations,
  BookAppointmentPayload,
  { rejectValue: string }
>("appointments/book", async (payload, { rejectWithValue }) => {
  try {
    const res = await API<ApiResponse<AppointmentWithRelations>>({
      endpoint: "/appointments/book",
      option: {
        method: "POST",
        body: JSON.stringify(payload),
      },
    })
    return res.data
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, "Failed to book appointment."))
  }
})

export const fetchMyAppointmentsThunk = createAsyncThunk<
  AppointmentWithRelations[],
  { phone?: string; email?: string } | undefined,
  { rejectValue: string }
>("appointments/fetchMyAppointments", async (query, { rejectWithValue }) => {
  try {
    const params = new URLSearchParams()
    if (query?.phone) params.append("phone", query.phone)
    if (query?.email) params.append("email", query.email)

    const queryString = params.toString() ? `?${params.toString()}` : ""

    const res = await API<ApiResponse<AppointmentWithRelations[]>>({
      endpoint: `/appointments/my-appointments${queryString}`,
      option: {
        method: "GET",
      },
    })
    return res.data ?? []
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, "Failed to fetch your appointments."))
  }
})

export const fetchAppointmentsThunk = createAsyncThunk<
  AppointmentWithRelations[],
  FetchAppointmentsQuery | string | undefined,
  { rejectValue: string }
>("appointments/fetchAppointments", async (filter, { rejectWithValue }) => {
  try {
    const params = new URLSearchParams()

    if (typeof filter === "string") {
      if (filter.trim().length > 0) params.append("date", filter.trim())
    } else if (filter) {
      if (filter.doctorId) params.append("doctorId", filter.doctorId)
      if (filter.date) params.append("date", filter.date)
      if (filter.status) params.append("status", filter.status)
    }

    const queryString = params.toString() ? `?${params.toString()}` : ""

    const res = await API<ApiResponse<AppointmentWithRelations[]>>({
      endpoint: `/appointments${queryString}`,
      option: {
        method: "GET",
      },
    })
    return res.data ?? []
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, "Failed to fetch appointments."))
  }
})

export const fetchAppointmentByIdThunk = createAsyncThunk<
  AppointmentWithRelations,
  string,
  { rejectValue: string }
>("appointments/fetchById", async (id, { rejectWithValue }) => {
  try {
    const res = await API<ApiResponse<AppointmentWithRelations>>({
      endpoint: `/appointments/${encodeURIComponent(id)}`,
      option: {
        method: "GET",
      },
    })
    return res.data
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, "Failed to fetch appointment details."))
  }
})

export const updateAppointmentStatusThunk = createAsyncThunk<
  AppointmentWithRelations,
  UpdateStatusPayload,
  { rejectValue: string }
>("appointments/updateStatus", async ({ id, status }, { rejectWithValue }) => {
  try {
    const res = await API<ApiResponse<AppointmentWithRelations>>({
      endpoint: `/appointments/${encodeURIComponent(id)}/status`,
      option: {
        method: "PATCH",
        body: JSON.stringify({ status }),
      },
    })
    return res.data
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, "Failed to update appointment status."))
  }
})

export const cancelAppointmentThunk = createAsyncThunk<
  AppointmentWithRelations,
  string,
  { rejectValue: string }
>("appointments/cancel", async (id, { rejectWithValue }) => {
  try {
    const res = await API<ApiResponse<AppointmentWithRelations>>({
      endpoint: `/appointments/${encodeURIComponent(id)}/cancel`,
      option: {
        method: "PATCH",
      },
    })
    return res.data
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, "Failed to cancel appointment."))
  }
})

interface AppointmentState {
  appointments: AppointmentWithRelations[]
  selectedAppointment: AppointmentWithRelations | null
  lastBookedAppointment: AppointmentWithRelations | null
  loading: boolean
  actionLoading: boolean
  error: string | null
  successMessage: string | null
}

const initialState: AppointmentState = {
  appointments: [],
  selectedAppointment: null,
  lastBookedAppointment: null,
  loading: false,
  actionLoading: false,
  error: null,
  successMessage: null,
}

const appointmentSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    setSelectedAppointment: (
      state,
      action: PayloadAction<AppointmentWithRelations | null>
    ) => {
      state.selectedAppointment = action.payload
    },
    clearAppointmentMessages: (state) => {
      state.error = null
      state.successMessage = null
    },
    clearLastBookedAppointment: (state) => {
      state.lastBookedAppointment = null
    },
    clearAppointmentsState: (state) => {
      state.appointments = []
      state.selectedAppointment = null
      state.lastBookedAppointment = null
      state.loading = false
      state.actionLoading = false
      state.error = null
      state.successMessage = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bookAppointmentThunk.pending, (state) => {
        state.actionLoading = true
        state.error = null
      })
      .addCase(bookAppointmentThunk.fulfilled, (state, action) => {
        state.actionLoading = false
        state.error = null
        state.lastBookedAppointment = action.payload
        state.appointments.unshift(action.payload)
        state.successMessage = "Appointment booked successfully"
      })
      .addCase(bookAppointmentThunk.rejected, (state, action) => {
        state.actionLoading = false
        state.error = action.payload ?? "Failed to book appointment"
      })

      .addCase(fetchMyAppointmentsThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMyAppointmentsThunk.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.appointments = action.payload
      })
      .addCase(fetchMyAppointmentsThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? "Failed to load your appointments"
      })

      .addCase(fetchAppointmentsThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAppointmentsThunk.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.appointments = action.payload
      })
      .addCase(fetchAppointmentsThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? "Failed to load appointments"
      })

      .addCase(fetchAppointmentByIdThunk.pending, (state) => {
        state.actionLoading = true
        state.error = null
      })
      .addCase(fetchAppointmentByIdThunk.fulfilled, (state, action) => {
        state.actionLoading = false
        state.selectedAppointment = action.payload
      })
      .addCase(fetchAppointmentByIdThunk.rejected, (state, action) => {
        state.actionLoading = false
        state.error = action.payload ?? "Failed to fetch appointment details"
      })

      .addCase(updateAppointmentStatusThunk.pending, (state) => {
        state.actionLoading = true
        state.error = null
      })
      .addCase(updateAppointmentStatusThunk.fulfilled, (state, action) => {
        state.actionLoading = false
        const updated = action.payload
        state.appointments = state.appointments.map((item) =>
          item.id === updated.id ? updated : item
        )
        if (state.selectedAppointment?.id === updated.id) {
          state.selectedAppointment = updated
        }
        state.successMessage = "Appointment status updated successfully"
      })
      .addCase(updateAppointmentStatusThunk.rejected, (state, action) => {
        state.actionLoading = false
        state.error = action.payload ?? "Failed to update appointment status"
      })

      .addCase(cancelAppointmentThunk.pending, (state) => {
        state.actionLoading = true
        state.error = null
      })
      .addCase(cancelAppointmentThunk.fulfilled, (state, action) => {
        state.actionLoading = false
        const updated = action.payload
        state.appointments = state.appointments.map((item) =>
          item.id === updated.id ? updated : item
        )
        if (state.selectedAppointment?.id === updated.id) {
          state.selectedAppointment = updated
        }
        state.successMessage = "Appointment cancelled successfully"
      })
      .addCase(cancelAppointmentThunk.rejected, (state, action) => {
        state.actionLoading = false
        state.error = action.payload ?? "Failed to cancel appointment"
      })
  },
})

export const {
  setSelectedAppointment,
  clearAppointmentMessages,
  clearLastBookedAppointment,
  clearAppointmentsState,
} = appointmentSlice.actions

export default appointmentSlice.reducer