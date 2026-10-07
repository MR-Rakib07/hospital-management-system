import { API } from "@/api/API";
import { UserProfile } from "@/types/authTypes";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UpdateProfilePayload = Partial<
  Omit<UserProfile, "id" | "role" | "createdAt" | "updatedAt">
>;

interface UpdateProfileResponse {
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

export const updateProfileThunk = createAsyncThunk<
  UserProfile,
  UpdateProfilePayload,
  { rejectValue: string }
>("profile/updateProfile", async (updatedData, { rejectWithValue }) => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
      return rejectWithValue("Authentication token not found");
    }

    const res = await API<UpdateProfileResponse>({
      endpoint: "/auth/profile",
      option: {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      },
    });

    if (!res?.data) {
      return rejectWithValue("Failed to update profile data");
    }

    return res.data;
  } catch (error) {
    const customErr = error as CustomError;
    const errorMessage =
      customErr?.response?.data?.message ||
      customErr?.message ||
      (error instanceof Error ? error.message : "Failed to update profile. Please try again.");

    return rejectWithValue(errorMessage);
  }
});

interface UpdateProfileState {
  updatedUser: UserProfile | null;
  loading: boolean;
  success: boolean;
  message: string | null;
  error: string | null;
}

const initialState: UpdateProfileState = {
  updatedUser: null,
  loading: false,
  success: false,
  message: null,
  error: null,
};

const updateProfileSlice = createSlice({
  name: "updateProfile",
  initialState,
  reducers: {
    clearUpdateProfileState: (state) => {
      state.loading = false;
      state.success = false;
      state.message = null;
      state.error = null;
      state.updatedUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProfileThunk.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.message = null;
      })
      .addCase(
        updateProfileThunk.fulfilled,
        (state, action: PayloadAction<UserProfile>) => {
          state.loading = false;
          state.success = true;
          state.updatedUser = action.payload;
          state.message = "Profile updated successfully";
          state.error = null;
        }
      )
      .addCase(updateProfileThunk.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = null;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearUpdateProfileState } = updateProfileSlice.actions;

export default updateProfileSlice.reducer;