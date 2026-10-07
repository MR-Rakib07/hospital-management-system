import { API } from "@/api/API";
import {
  ApiResponse,
  AuthSuccessData,
  RegisterFormInput,
  UserProfile,
} from "@/types/authTypes";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CustomApiError {
  message?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const signupThunk = createAsyncThunk<
  ApiResponse<AuthSuccessData>,
  RegisterFormInput,
  { rejectValue: string }
>("auth/signup", async (formData: RegisterFormInput, { rejectWithValue }) => {
  try {
    const data = await API<ApiResponse<AuthSuccessData>>({
      endpoint: "/auth/register",
      option: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      },
    });

    return data;
  } catch (error) {
    const customErr = error as CustomApiError;
    const errorMessage =
      customErr?.response?.data?.message ||
      customErr?.message ||
      (error instanceof Error ? error.message : "Registration failed");
    return rejectWithValue(errorMessage);
  }
});

interface SignupState {
  user: UserProfile | null;
  message: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: SignupState = {
  user: null,
  message: null,
  loading: false,
  error: null,
};

const signupSlice = createSlice({
  name: "signup",
  initialState,
  reducers: {
    clearSignupState: (state) => {
      state.user = null;
      state.message = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        signupThunk.fulfilled,
        (state, action: PayloadAction<ApiResponse<AuthSuccessData>>) => {
          state.loading = false;
          state.error = null;
          state.message = action.payload.message;
          state.user = action.payload.data?.user || null;
        }
      )
      .addCase(signupThunk.rejected, (state, action) => {
        state.loading = false;
        state.message = null;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearSignupState } = signupSlice.actions;

export default signupSlice.reducer;