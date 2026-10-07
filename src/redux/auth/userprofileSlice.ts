import { API } from "@/api/API";
import { UserProfile } from "@/types/authTypes";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProfileApiResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}

interface CustomError {
  message?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const fetchProfileThunk = createAsyncThunk<
  UserProfile,
  void,
  { rejectValue: string }
>("auth/fetchProfile", async (_, { rejectWithValue }) => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
      return rejectWithValue("Authentication token not found");
    }

    const res = await API<ProfileApiResponse>({
      endpoint: "/auth/me",
      option: {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    });

    if (!res?.data) {
      return rejectWithValue("Failed to retrieve user data");
    }

    if (typeof window !== "undefined" && res.data.role) {
      localStorage.setItem("role", res.data.role);
    }

    return res.data;
  } catch (error) {
    const customErr = error as CustomError;
    const errorMessage =
      customErr?.response?.data?.message ||
      customErr?.message ||
      (error instanceof Error ? error.message : "Failed to fetch profile information.");

    return rejectWithValue(errorMessage);
  }
});

interface ProfileState {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  user: null,
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.user = null;
      state.error = null;
      state.loading = false;
    },
    updateLocalProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProfileThunk.fulfilled,
        (state, action: PayloadAction<UserProfile>) => {
          state.loading = false;
          state.error = null;
          state.user = action.payload;
        }
      )
      .addCase(fetchProfileThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearProfile, updateLocalProfile } = profileSlice.actions;

export default profileSlice.reducer;