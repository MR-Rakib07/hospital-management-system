import { API } from "@/api/API";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface LogoutResponse {
  success?: boolean;
  message?: string;
}

interface CustomError {
  message?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
}

const clearLocalAuthData = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  }
  Cookies.remove("refreshToken");
};

export const logoutThunk = createAsyncThunk<
  LogoutResponse,
  void,
  { rejectValue: string }
>("auth/logout", async (_, { rejectWithValue }) => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const data = await API<LogoutResponse>({
      endpoint: "/auth/logout",
      option: {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      },
    });

    clearLocalAuthData();
    return data;
  } catch (error) {
    clearLocalAuthData();

    const customErr = error as CustomError;
    const errorMessage =
      customErr?.response?.data?.message ||
      customErr?.message ||
      (error instanceof Error ? error.message : "Failed to log out");

    return rejectWithValue(errorMessage);
  }
});

interface LogoutState {
  loading: boolean;
  error: string | null;
  message: string | null;
}

const initialState: LogoutState = {
  loading: false,
  error: null,
  message: null,
};

const logoutSlice = createSlice({
  name: "logout",
  initialState,
  reducers: {
    clearLogoutState: (state) => {
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logoutThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        logoutThunk.fulfilled,
        (state, action: PayloadAction<LogoutResponse>) => {
          state.loading = false;
          state.error = null;
          state.message = action.payload?.message || "Logged out successfully";
        }
      )
      .addCase(logoutThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Logout failed";
      });
  },
});

export const { clearLogoutState } = logoutSlice.actions;

export default logoutSlice.reducer;