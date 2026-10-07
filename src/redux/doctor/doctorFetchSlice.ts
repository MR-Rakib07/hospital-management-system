import { API } from "@/api/API"
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface User {
  id: string
  fullname: string
  email: string
  phone?: string | null
  presentAddress?: string | null
  permanentAddress?: string | null
  gender?: string | null
  role?: string
}

export interface DoctorProfile {
  id: string
  userId: string
  department: string
  specialization: string
  designation?: string | null
  experience: number
  fee: number
  image?: string | null
  availableDays: string[]
  isAvailable: boolean
  visitingHours?: string | null
  createdAt: string
  updatedAt: string
}

export interface DoctorWithProfile extends User {
  doctorProfile: DoctorProfile
}

interface DoctorsApiResponse {
  success: boolean
  message: string
  data: DoctorWithProfile[]
}

interface CustomError {
  message?: string
  response?: {
    data?: {
      message?: string
    }
  }
}

export const fetchDoctorsThunk = createAsyncThunk<
  DoctorWithProfile[],
  void,
  { rejectValue: string }
>("doctors/fetchDoctors", async (_, { rejectWithValue }) => {
  try {
    const res = await API<DoctorsApiResponse | DoctorWithProfile[]>({
      endpoint: "/doctors",
      option: {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    })

    const doctorsList = Array.isArray(res)
      ? res
      : (res as DoctorsApiResponse)?.data || []

    return doctorsList
  } catch (error) {
    const customErr = error as CustomError
    const errorMessage =
      customErr?.response?.data?.message ||
      customErr?.message ||
      (error instanceof Error ? error.message : "Failed to fetch doctors list.")

    return rejectWithValue(errorMessage)
  }
})

interface DoctorsState {
  doctors: DoctorWithProfile[]
  loading: boolean
  error: string | null
}

const initialState: DoctorsState = {
  doctors: [],
  loading: false,
  error: null,
}

const doctorSlice = createSlice({
  name: "doctors",
  initialState,
  reducers: {
    clearDoctorsState: (state) => {
      state.doctors = []
      state.loading = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctorsThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        fetchDoctorsThunk.fulfilled,
        (state, action: PayloadAction<DoctorWithProfile[]>) => {
          state.loading = false
          state.error = null
          state.doctors = action.payload
        }
      )
      .addCase(fetchDoctorsThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to load doctors"
      })
  },
})

export const { clearDoctorsState } = doctorSlice.actions

export default doctorSlice.reducer