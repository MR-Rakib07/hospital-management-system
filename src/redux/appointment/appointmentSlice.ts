import { API } from "@/api/API"
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { AppointmentStatus, AppointmentWithRelations } from "@/types/authTypes"

export type AppointmentType = "ONLINE" | "OFFLINE"
export type Gender = "MALE" | "FEMALE" | "OTHER"

export interface BookAppointmentPayload {
  doctorId: string
  appointmentDate: string
  type: AppointmentType
  problemDetails?: string
  patientName: string
  patientPhone: string
  patientEmail: string
  patientAge?: number
  patientGender?: Gender
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

const extractErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === "object" && error !== null && "message" in error) {
    const customErr = error as { message?: string }
    if (typeof customErr.message === "string") {
      return customErr.message
    }
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
  } catch (error: unknown) {
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

    return res.data || []
  } catch (error: unknown) {
    return rejectWithValue(extractErrorMessage(error, "Failed to fetch your appointments."))
  }
})

export const fetchAppointmentsThunk = createAsyncThunk<
  AppointmentWithRelations[],
  string | undefined,
  { rejectValue: string }
>("appointments/fetchAppointments", async (dateQuery, { rejectWithValue }) => {
  try {
    const endpoint = dateQuery
      ? `/appointments/doctor-schedule?date=${encodeURIComponent(dateQuery)}`
      : "/appointments/doctor-schedule"

    const res = await API<ApiResponse<AppointmentWithRelations[]>>({
      endpoint,
      option: {
        method: "GET",
      },
    })

    return res.data || []
  } catch (error: unknown) {
    return rejectWithValue(extractErrorMessage(error, "Failed to fetch appointments."))
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
  } catch (error: unknown) {
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
  } catch (error: unknown) {
    return rejectWithValue(extractErrorMessage(error, "Failed to cancel appointment."))
  }
})

interface AppointmentState {
  appointments: AppointmentWithRelations[]
  lastBookedAppointment: AppointmentWithRelations | null
  loading: boolean
  actionLoading: boolean
  error: string | null
  successMessage: string | null
}

const initialState: AppointmentState = {
  appointments: [],
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
    clearAppointmentMessages: (state) => {
      state.error = null
      state.successMessage = null
    },
    clearLastBookedAppointment: (state) => {
      state.lastBookedAppointment = null
    },
    clearAppointmentsState: (state) => {
      state.appointments = []
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
      .addCase(
        bookAppointmentThunk.fulfilled,
        (state, action: PayloadAction<AppointmentWithRelations>) => {
          state.actionLoading = false
          state.error = null
          state.lastBookedAppointment = action.payload
          state.appointments.unshift(action.payload)
          state.successMessage = "Appointment booked successfully"
        }
      )
      .addCase(bookAppointmentThunk.rejected, (state, action) => {
        state.actionLoading = false
        state.error = action.payload || "Failed to book appointment"
      })

      .addCase(fetchMyAppointmentsThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        fetchMyAppointmentsThunk.fulfilled,
        (state, action: PayloadAction<AppointmentWithRelations[]>) => {
          state.loading = false
          state.error = null
          state.appointments = action.payload
        }
      )
      .addCase(fetchMyAppointmentsThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to load your appointments"
      })

      .addCase(fetchAppointmentsThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        fetchAppointmentsThunk.fulfilled,
        (state, action: PayloadAction<AppointmentWithRelations[]>) => {
          state.loading = false
          state.error = null
          state.appointments = action.payload
        }
      )
      .addCase(fetchAppointmentsThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to load appointments"
      })

      .addCase(updateAppointmentStatusThunk.pending, (state) => {
        state.actionLoading = true
        state.error = null
      })
      .addCase(
        updateAppointmentStatusThunk.fulfilled,
        (state, action: PayloadAction<AppointmentWithRelations>) => {
          state.actionLoading = false
          const updated = action.payload
          state.appointments = state.appointments.map((item) =>
            item.id === updated.id ? updated : item
          )
          state.successMessage = "Appointment status updated successfully"
        }
      )
      .addCase(updateAppointmentStatusThunk.rejected, (state, action) => {
        state.actionLoading = false
        state.error = action.payload || "Failed to update appointment status"
      })

      .addCase(cancelAppointmentThunk.pending, (state) => {
        state.actionLoading = true
        state.error = null
      })
      .addCase(
        cancelAppointmentThunk.fulfilled,
        (state, action: PayloadAction<AppointmentWithRelations>) => {
          state.actionLoading = false
          const updated = action.payload
          state.appointments = state.appointments.map((item) =>
            item.id === updated.id ? updated : item
          )
          state.successMessage = "Appointment cancelled successfully"
        }
      )
      .addCase(cancelAppointmentThunk.rejected, (state, action) => {
        state.actionLoading = false
        state.error = action.payload || "Failed to cancel appointment"
      })
  },
})

export const {
  clearAppointmentMessages,
  clearLastBookedAppointment,
  clearAppointmentsState,
} = appointmentSlice.actions

export default appointmentSlice.reducer