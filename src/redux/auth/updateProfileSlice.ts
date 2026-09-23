import { API } from "@/api/API";
import { UserProfile } from "@/types/user";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UpdateProfilePayload = Partial<Omit<UserProfile, "id" | "createdAt" | "updatedAt">>;

interface UpdateProfileResponse {
  message?: string;
  data?: UserProfile;
  user?: UserProfile;
}

export const updateProfileThunk = createAsyncThunk<
  UserProfile,
  UpdateProfilePayload,
  { rejectValue: string }
>("profile/updateProfile", async (updatedData, { rejectWithValue }) => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const res: UpdateProfileResponse = await API({
      endpoint: "/auth/profile",
      option: {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(updatedData),
      },
    });

    const data = res?.data || res?.user || (res as unknown as UserProfile);
    return data;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to update profile. Please try again.";
    return rejectWithValue(errorMessage);
  }
});

interface UpdateProfileState {
  loading: boolean;
  success: boolean;
  message: string | null;
  error: string | null;
}

const initialState: UpdateProfileState = {
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