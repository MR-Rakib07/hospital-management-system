import { API } from "@/api/API";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

interface ChangePasswordResponse {
  success?: boolean;
  message?: string;
  data?: Record<string, string | number | boolean | null>;
}

interface CustomError {
  message?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const changePasswordThunk = createAsyncThunk<
  ChangePasswordResponse,
  ChangePasswordPayload,
  { rejectValue: string }
>("auth/changePassword", async (payload, { rejectWithValue }) => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const data = await API<ChangePasswordResponse>({
      endpoint: "/auth/change-password",
      option: {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      },
    });

    return data;
  } catch (error) {
    const customErr = error as CustomError;
    const errorMessage =
      customErr?.response?.data?.message ||
      customErr?.message ||
      (error instanceof Error ? error.message : "Failed to change password. Please try again.");

    return rejectWithValue(errorMessage);
  }
});

interface ChangePasswordState {
  loading: boolean;
  success: boolean;
  error: string | null;
  message: string | null;
}

const initialState: ChangePasswordState = {
  loading: false,
  success: false,
  error: null,
  message: null,
};

const changePasswordSlice = createSlice({
  name: "changePassword",
  initialState,
  reducers: {
    clearChangePasswordState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(changePasswordThunk.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.message = null;
      })
      .addCase(
        changePasswordThunk.fulfilled,
        (state, action: PayloadAction<ChangePasswordResponse>) => {
          state.loading = false;
          state.success = true;
          state.error = null;
          state.message = action.payload?.message || "Password changed successfully!";
        }
      )
      .addCase(changePasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = null;
        state.error = action.payload || "Failed to change password.";
      });
  },
});

export const { clearChangePasswordState } = changePasswordSlice.actions;

export default changePasswordSlice.reducer;