import { API } from "@/api/API";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface LoginCredentials {
  email: string;
  password: string;
}

interface SigninResponse {
  message: string;
  accessToken: string;
  refreshToken?: string;
  user?: Record<string, unknown>;
}

export const signinThunk = createAsyncThunk<
  SigninResponse,
  LoginCredentials,
  { rejectValue: string }
>("auth/login", async (formData: LoginCredentials, { rejectWithValue }) => {
  try {
    const data = await API({
      endpoint: "/auth/login",
      option: {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      },
    });
    if (data?.accessToken) {
      localStorage.setItem("token", data.accessToken);
    }
    // if (data?.refreshToken) {
    //   Cookies.set("refreshToken", data.refreshToken, {
    //     expires: 30,
    //     secure: true,
    //     sameSite: "strict",
    //   });
    // }

    return data;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Unable to log in. Please try again.";
    return rejectWithValue(errorMessage);
  }
});

interface InitialStateTypes {
  message: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: InitialStateTypes = {
  message: null,
  loading: false,
  error: null,
};

const signinSlice = createSlice({
  name: "signin",
  initialState,
  reducers: {
    clearSigninState: (state) => {
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signinThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        signinThunk.fulfilled,
        (state, action: PayloadAction<SigninResponse>) => {
          state.loading = false;
          state.error = null;
          state.message = action.payload?.message || "Login successful";
        }
      )
      .addCase(signinThunk.rejected, (state, action) => {
        state.loading = false;
        state.message = null;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearSigninState } = signinSlice.actions;

export default signinSlice.reducer;