'use client'

import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { Check, Eye, EyeOff, Loader2, X } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { changePasswordThunk, clearChangePasswordState } from '@/redux/auth/changePassSlice'
import { clearUpdateProfileState } from '@/redux/auth/updateProfileSlice'

export default function ChangePasswordForm() {
  const dispatch = useAppDispatch()
  const { loading, error, message, success } = useAppSelector((state) => state.changePass)

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [showOldPassword, setShowOldPassword] = useState<boolean>(false)
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const [passwordClientError, setPasswordClientError] = useState<string | null>(null)

  useEffect(() => {
    if (success) {
      setPasswordForm({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      const timer = setTimeout(() => {
        dispatch(clearChangePasswordState())
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [success, dispatch])

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordForm((prev) => ({ ...prev, [name]: value }))

    dispatch(clearUpdateProfileState())
    if (passwordClientError) setPasswordClientError(null)
    if (success || error || message) {
      dispatch(clearChangePasswordState())
    }
  }

  const isLengthValid = passwordForm.newPassword.length >= 6
  const isMatch = Boolean(
    passwordForm.confirmPassword && passwordForm.newPassword === passwordForm.confirmPassword
  )
  const isMismatch = Boolean(
    passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword
  )

  const handlePasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPasswordClientError(null)

    dispatch(clearUpdateProfileState())

    if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordClientError('Please fill in all password fields.')
      return
    }

    if (!isLengthValid) {
      setPasswordClientError('New password must be at least 6 characters long.')
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordClientError('New password and re-type password do not match.')
      return
    }

    if (passwordForm.oldPassword === passwordForm.newPassword) {
      setPasswordClientError('New password cannot be the same as old password.')
      return
    }

    try {
      await dispatch(
        changePasswordThunk({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword,
        })
      ).unwrap()
    } catch {}
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 lg:p-8 shadow-xs">
      <h2 className="text-lg sm:text-xl font-bold mb-6 text-gray-800">Change Password :</h2>

      <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-xl">
        <div className="space-y-1.5">
          <label className="block text-xs sm:text-sm font-semibold text-gray-700">Old Password :</label>
          <div className="relative">
            <input
              type={showOldPassword ? 'text' : 'password'}
              name="oldPassword"
              value={passwordForm.oldPassword}
              onChange={handlePasswordChange}
              placeholder="Old password"
              className="w-full px-3.5 py-2.5 pr-10 text-xs sm:text-sm border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition placeholder:text-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowOldPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              tabIndex={-1}
            >
              {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs sm:text-sm font-semibold text-gray-700">New Password :</label>
          <div className="relative">
            <input
              type={showNewPassword ? 'text' : 'password'}
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              placeholder="New password (min 6 characters)"
              className={`w-full px-3.5 py-2.5 pr-16 text-xs sm:text-sm border rounded-xl outline-none transition placeholder:text-gray-400 ${
                passwordForm.newPassword
                  ? isLengthValid
                    ? 'border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                    : 'border-red-400 focus:ring-1 focus:ring-red-400'
                  : 'border-gray-200 focus:ring-1 focus:ring-blue-500'
              }`}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {passwordForm.newPassword && (
                <span>
                  {isLengthValid ? (
                    <Check size={16} className="text-emerald-500" />
                  ) : (
                    <X size={16} className="text-red-500" />
                  )}
                </span>
              )}
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
                tabIndex={-1}
              >
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          {passwordForm.newPassword && !isLengthValid && (
            <p className="text-[11px] text-red-500 font-medium">Password must be at least 6 characters</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs sm:text-sm font-semibold text-gray-700">Re-type New Password :</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Confirm new password"
              className={`w-full px-3.5 py-2.5 pr-16 text-xs sm:text-sm border rounded-xl outline-none transition placeholder:text-gray-400 ${
                passwordForm.confirmPassword
                  ? isMatch
                    ? 'border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                    : 'border-red-400 focus:ring-1 focus:ring-red-400'
                  : 'border-gray-200 focus:ring-1 focus:ring-blue-500'
              }`}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {passwordForm.confirmPassword && (
                <span>
                  {isMatch ? (
                    <Check size={16} className="text-emerald-500" />
                  ) : (
                    <X size={16} className="text-red-500" />
                  )}
                </span>
              )}
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          {isMatch && (
            <p className="text-[11px] text-emerald-600 font-medium">Passwords match</p>
          )}
          {isMismatch && (
            <p className="text-[11px] text-red-500 font-medium">Passwords do not match</p>
          )}
        </div>

        {(passwordClientError || error) && (
          <p className="text-xs sm:text-sm font-medium text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
            {passwordClientError || error}
          </p>
        )}

        {message && (
          <p className="text-xs sm:text-sm font-medium text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
            {message}
          </p>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#3b71ed] disabled:bg-blue-300 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs hover:bg-blue-700 transition active:scale-95 cursor-pointer"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>{loading ? 'Saving...' : 'Save password'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}