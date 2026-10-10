import { API } from "@/api/API"
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { AppointmentStatus, AppointmentWithRelations } from "@/types/authTypes"

interface AppointmentApiResponse {
  success: boolean
  message: string
  data: AppointmentWithRelations[]
}

interface SingleAppointmentApiResponse {
  success: boolean
  message: string
  data: AppointmentWithRelations
}

interface CustomError {
  message?: string
  response?: {
    data?: {
      message?: string
    }
  }
}

export interface UpdateStatusPayload {
  id: string
  status: AppointmentStatus
}

export const fetchAppointmentsThunk = createAsyncThunk<
  AppointmentWithRelations[],
  string | undefined,
  { rejectValue: string }
>("appointments/fetchAppointments", async (dateQuery, { rejectWithValue }) => {
  try {
    const endpoint = dateQuery
      ? `/appointments/doctor-schedule?date=${encodeURIComponent(dateQuery)}`
      : "/appointments/doctor-schedule"

    const res = await API<AppointmentApiResponse | AppointmentWithRelations[]>({
      endpoint,
      option: {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    })

    const appointmentsList = Array.isArray(res)
      ? res
      : (res as AppointmentApiResponse)?.data || []

    return appointmentsList
  } catch (error) {
    const customErr = error as CustomError
    const errorMessage =
      customErr?.response?.data?.message ||
      customErr?.message ||
      (error instanceof Error ? error.message : "Failed to fetch appointments.")

    return rejectWithValue(errorMessage)
  }
})

export const updateAppointmentStatusThunk = createAsyncThunk<
  AppointmentWithRelations,
  UpdateStatusPayload,
  { rejectValue: string }
>("appointments/updateStatus", async ({ id, status }, { rejectWithValue }) => {
  try {
    const res = await API<SingleAppointmentApiResponse | AppointmentWithRelations>({
      endpoint: `/appointments/${encodeURIComponent(id)}/status`,
      option: {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      },
    })

    const updatedData =
      "data" in (res as SingleAppointmentApiResponse)
        ? (res as SingleAppointmentApiResponse).data
        : (res as AppointmentWithRelations)

    return updatedData
  } catch (error) {
    const customErr = error as CustomError
    const errorMessage =
      customErr?.response?.data?.message ||
      customErr?.message ||
      (error instanceof Error ? error.message : "Failed to update appointment status.")

    return rejectWithValue(errorMessage)
  }
})

export const cancelAppointmentThunk = createAsyncThunk<
  AppointmentWithRelations,
  string,
  { rejectValue: string }
>("appointments/cancel", async (id, { rejectWithValue }) => {
  try {
    const res = await API<SingleAppointmentApiResponse | AppointmentWithRelations>({
      endpoint: `/appointments/${encodeURIComponent(id)}/cancel`,
      option: {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      },
    })

    const cancelledData =
      "data" in (res as SingleAppointmentApiResponse)
        ? (res as SingleAppointmentApiResponse).data
        : (res as AppointmentWithRelations)

    return cancelledData
  } catch (error) {
    const customErr = error as CustomError
    const errorMessage =
      customErr?.response?.data?.message ||
      customErr?.message ||
      (error instanceof Error ? error.message : "Failed to cancel appointment.")

    return rejectWithValue(errorMessage)
  }
})

interface AppointmentState {
  appointments: AppointmentWithRelations[]
  loading: boolean
  actionLoading: boolean
  error: string | null
  successMessage: string | null
}

const initialState: AppointmentState = {
  appointments: [],
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
    clearAppointmentsState: (state) => {
      state.appointments = []
      state.loading = false
      state.actionLoading = false
      state.error = null
      state.successMessage = null
    },
  },
  extraReducers: (builder) => {
    builder
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

export const { clearAppointmentMessages, clearAppointmentsState } =
  appointmentSlice.actions

export default appointmentSlice.reducer