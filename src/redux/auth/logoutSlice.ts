import { API } from "@/api/API";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface LogoutResponse {
  message?: string;
  success?: boolean;
}

export const logoutThunk = createAsyncThunk<
  LogoutResponse,
  void,
  { rejectValue: string }
>("auth/logout", async (_, { rejectWithValue }) => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const data = await API({
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

    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    Cookies.remove("refreshToken");

    return data;
  } catch (error: any) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    Cookies.remove("refreshToken");

    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to log out";
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
      .addCase(logoutThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload?.message || "Logged out successfully";
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Logout failed";
      });
  },
});

export const { clearLogoutState } = logoutSlice.actions;

export default logoutSlice.reducer;