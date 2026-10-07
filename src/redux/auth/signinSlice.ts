import { API } from "@/api/API";
import { Role, UserProfile } from "@/types/authTypes";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LoginCredentials {
  email: string;
  password: string;
}

interface SigninSuccessData {
  user: UserProfile;
  accessToken: string;
}

interface SigninResponse {
  success?: boolean;
  message?: string;
  data?: SigninSuccessData;
  accessToken?: string;
  user?: UserProfile;
}

interface CustomError {
  message?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const signinThunk = createAsyncThunk<
  SigninResponse,
  LoginCredentials,
  { rejectValue: string }
>("auth/login", async (formData: LoginCredentials, { rejectWithValue }) => {
  try {
    const res = await API<SigninResponse>({
      endpoint: "/auth/login",
      option: {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      },
    });

    const token = res?.data?.accessToken || res?.accessToken;
    const userRole = res?.data?.user?.role || res?.user?.role;

    if (token) {
      localStorage.setItem("token", token);
    }
    if (userRole) {
      localStorage.setItem("role", userRole);
    }

    return res;
  } catch (error) {
    const customErr = error as CustomError;
    const errorMessage =
      customErr?.response?.data?.message ||
      customErr?.message ||
      (error instanceof Error ? error.message : "Unable to log in. Please try again.");

    return rejectWithValue(errorMessage);
  }
});

interface SigninState {
  user: UserProfile | null;
  role: Role | null;
  token: string | null;
  message: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: SigninState = {
  user: null,
  role: typeof window !== "undefined" ? (localStorage.getItem("role") as Role) : null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
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
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.token = null;
      state.message = null;
      state.error = null;
      state.loading = false;
      localStorage.removeItem("token");
      localStorage.removeItem("role");
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

          const resolvedUser = action.payload?.data?.user || action.payload?.user || null;
          const resolvedToken = action.payload?.data?.accessToken || action.payload?.accessToken || null;

          state.user = resolvedUser;
          state.role = resolvedUser?.role || null;
          state.token = resolvedToken;
        }
      )
      .addCase(signinThunk.rejected, (state, action) => {
        state.loading = false;
        state.message = null;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearSigninState, logout } = signinSlice.actions;

export default signinSlice.reducer;