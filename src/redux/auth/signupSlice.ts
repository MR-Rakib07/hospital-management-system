import { API } from "@/api/API";
import { authType } from "@/types/authTypes";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthResponse {
  message: string;
  user?: Record<string, unknown>;
  token?: string;
}

export const signupThunk = createAsyncThunk<
  AuthResponse,
  authType,
  { rejectValue: string }
>("auth/register", async (formData: authType, { rejectWithValue }) => {
  try {
    const data = await API({
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
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to complete registration";
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

const signupSlice = createSlice({
  name: "signup",
  initialState,
  reducers: {
    clearSignupState: (state) => {
      state.message = null;
      state.error = null;
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
        (state, action: PayloadAction<AuthResponse>) => {
          state.loading = false;
          state.error = null;
          state.message = action.payload?.message || "Registration successful";
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