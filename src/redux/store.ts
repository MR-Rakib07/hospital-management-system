import { configureStore } from "@reduxjs/toolkit";
import signupReducer from '@/redux/auth/signupSlice'
import signinReducer from '@/redux/auth/signinSlice'
import profileReducer from '@/redux/auth/userprofileSlice'
import updateProfileReducer from '@/redux/auth/updateProfileSlice'
import logoutReducer from '@/redux/auth/logoutSlice'
import changePassReducer from '@/redux/auth/changePassSlice'
export const store = configureStore({
    reducer:{
      signup:signupReducer,
      signin:signinReducer,
      profile: profileReducer,
      updateProfile:updateProfileReducer,
      logout: logoutReducer,
      changePass:changePassReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch