'use client'

import { changePasswordThunk, clearChangePasswordState } from '@/redux/auth/changePassSlice'
import { clearUpdateProfileState, updateProfileThunk } from '@/redux/auth/updateProfileSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { UserProfile } from '@/types/user'
import { Check, Eye, EyeOff, X } from 'lucide-react'
import Image from 'next/image'
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'

interface ProfileSettingsProps {
  user?: UserProfile | null
  onUpdate?: () => void
}

function ProfileSettings({ user, onUpdate }: ProfileSettingsProps) {
  const dispatch = useAppDispatch()

  const {
    loading: profileLoading,
    error: profileError,
    message: profileMessage,
    success: profileSuccess,
  } = useAppSelector((state) => state.updateProfile)

  const {
    loading: passwordLoading,
    error: passwordError,
    message: passwordMessage,
    success: passwordSuccess,
  } = useAppSelector((state) => state.changePass)

  const [form, setForm] = useState({
    fullname: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    maritalStatus: '',
    presentAddress: '',
    permanentAddress: '',
    emergencyContactName: '',
    emergencyRelation: '',
    emergencyPhone: '',
  })

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
    if (user) {
      setForm({
        fullname: user.fullname || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
        gender: user.gender || '',
        bloodGroup: user.bloodGroup || '',
        maritalStatus: user.maritalStatus || '',
        presentAddress: user.presentAddress || '',
        permanentAddress: user.permanentAddress || '',
        emergencyContactName: user.emergencyContactName || '',
        emergencyRelation: user.emergencyRelation || '',
        emergencyPhone: user.emergencyPhone || '',
      })
    }
  }, [user])

  useEffect(() => {
    if (profileSuccess) {
      if (onUpdate) onUpdate()
      const timer = setTimeout(() => {
        dispatch(clearUpdateProfileState())
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [profileSuccess, onUpdate, dispatch])

  useEffect(() => {
    if (passwordSuccess) {
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
  }, [passwordSuccess, dispatch])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordForm((prev) => ({ ...prev, [name]: value }))
    if (passwordClientError) setPasswordClientError(null)
  }

  const isLengthValid = passwordForm.newPassword.length >= 6
  const isMatch = Boolean(
    passwordForm.confirmPassword && passwordForm.newPassword === passwordForm.confirmPassword
  )
  const isMismatch = Boolean(
    passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword
  )

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const payload: Record<string, any> = {}

    Object.entries(form).forEach(([key, value]) => {
      if (key === 'email') return

      if (key === 'dateOfBirth') {
        if (value) {
          payload.dateOfBirth = new Date(value).toISOString()
        }
        return
      }

      if (typeof value === 'string' && value.trim() !== '') {
        payload[key] = value.trim()
      }
    })

    dispatch(updateProfileThunk(payload))
  }

  const handlePasswordSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPasswordClientError(null)

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

    dispatch(
      changePasswordThunk({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      })
    )
  }

  return (
    <div className="py-4">
      <div className="px-2 bg-white text-[#333]">
        <h2 className="text-xl font-bold mb-8 text-gray-800">Personal Information :</h2>

        <div className="flex flex-wrap items-center gap-6 mb-10">
          <div className="relative">
            <Image
              src="/profile.jpg"
              width={500}
              height={500}
              alt="User Profile"
              className="w-24 h-24 rounded-full object-cover border border-gray-100"
            />
          </div>

          <div className="flex-1 min-w-[200px]">
            <h3 className="text-lg font-semibold text-gray-700">Upload your picture</h3>
            <p className="text-sm text-gray-400 mt-1 leading-relaxed">
              For best results, use an image at least 256px by 256px in either .jpg or .png format
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              className="px-6 py-2.5 bg-[#3b71ed] text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Upload
            </button>
            <button
              type="button"
              className="px-6 py-2.5 bg-[#eef2ff] text-[#4f46e5] rounded-md font-medium hover:bg-indigo-100 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-2">
              <label className="block text-[15px] font-semibold text-gray-700">Full Name</label>
              <input
                type="text"
                name="fullname"
                value={form.fullname}
                onChange={handleChange}
                placeholder="Full Name :"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[15px] font-semibold text-gray-700">Your Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                disabled
                placeholder="Your email :"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none bg-gray-50 text-gray-400 cursor-not-allowed placeholder:text-gray-300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[15px] font-semibold text-gray-700">Phone no.</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone no. :"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[15px] font-semibold text-gray-700">Birthday</label>
              <input
                type="date"
                name="dateOfBirth"
                value={form.dateOfBirth}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-gray-700"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[15px] font-semibold text-gray-700">Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-white text-gray-700"
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-[15px] font-semibold text-gray-700">Blood Group</label>
              <select
                name="bloodGroup"
                value={form.bloodGroup}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-white text-gray-700"
              >
                <option value="">Select Group</option>
                <option value="A_POSITIVE">A+</option>
                <option value="A_NEGATIVE">A-</option>
                <option value="B_POSITIVE">B+</option>
                <option value="B_NEGATIVE">B-</option>
                <option value="O_POSITIVE">O+</option>
                <option value="O_NEGATIVE">O-</option>
                <option value="AB_POSITIVE">AB+</option>
                <option value="AB_NEGATIVE">AB-</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-[15px] font-semibold text-gray-700">Marital Status</label>
              <select
                name="maritalStatus"
                value={form.maritalStatus}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-white text-gray-700"
              >
                <option value="">Select Status</option>
                <option value="SINGLE">Single</option>
                <option value="MARRIED">Married</option>
                <option value="DIVORCED">Divorced</option>
                <option value="WIDOWED">Widowed</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-[15px] font-semibold text-gray-700">Present Address</label>
              <input
                type="text"
                name="presentAddress"
                value={form.presentAddress}
                onChange={handleChange}
                placeholder="Present Address :"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[15px] font-semibold text-gray-700">Permanent Address</label>
              <input
                type="text"
                name="permanentAddress"
                value={form.permanentAddress}
                onChange={handleChange}
                placeholder="Permanent Address :"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[15px] font-semibold text-gray-700">Emergency Contact Name</label>
              <input
                type="text"
                name="emergencyContactName"
                value={form.emergencyContactName}
                onChange={handleChange}
                placeholder="Emergency Contact Name :"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[15px] font-semibold text-gray-700">Emergency Relation</label>
              <input
                type="text"
                name="emergencyRelation"
                value={form.emergencyRelation}
                onChange={handleChange}
                placeholder="Emergency Relation :"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[15px] font-semibold text-gray-700">Emergency Phone</label>
              <input
                type="text"
                name="emergencyPhone"
                value={form.emergencyPhone}
                onChange={handleChange}
                placeholder="Emergency Phone :"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-300"
              />
            </div>
          </div>

          {profileError && (
            <p className="text-sm font-medium text-red-500 bg-red-50 p-3 rounded-lg border border-red-200">
              {profileError}
            </p>
          )}

          {profileMessage && (
            <p className="text-sm font-medium text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
              {profileMessage}
            </p>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={profileLoading}
              className="px-8 py-3 bg-[#3b71ed] disabled:bg-blue-300 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              {profileLoading ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>

      <div className="py-4 px-2 space-y-12 p-6 bg-white">
        <section>
          <h2 className="text-xl font-bold mb-6 text-gray-800">Change Password :</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-5 max-w-2xl">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Old password :</label>
              <div className="relative">
                <input
                  type={showOldPassword ? 'text' : 'password'}
                  name="oldPassword"
                  value={passwordForm.oldPassword}
                  onChange={handlePasswordChange}
                  placeholder="Old password"
                  className="w-full px-4 py-2.5 pr-11 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  tabIndex={-1}
                >
                  {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">New password :</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="New password"
                  className={`w-full px-4 py-2.5 pr-16 border rounded-lg outline-none transition-all placeholder:text-gray-400 ${
                    passwordForm.newPassword
                      ? isLengthValid
                        ? 'border-green-500 focus:ring-1 focus:ring-green-500'
                        : 'border-red-400 focus:ring-1 focus:ring-red-400'
                      : 'border-gray-200 focus:ring-1 focus:ring-blue-500'
                  }`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {passwordForm.newPassword && (
                    <div>
                      {isLengthValid ? (
                        <Check size={18} className="text-green-500" />
                      ) : (
                        <X size={18} className="text-red-500" />
                      )}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="text-gray-400 hover:text-gray-600 cursor-pointer"
                    tabIndex={-1}
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              {passwordForm.newPassword && !isLengthValid && (
                <p className="text-xs text-red-500">Password must be at least 6 characters</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Re-type New password :</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Re-type New password"
                  className={`w-full px-4 py-2.5 pr-16 border rounded-lg outline-none transition-all placeholder:text-gray-400 ${
                    passwordForm.confirmPassword
                      ? isMatch
                        ? 'border-green-500 focus:ring-1 focus:ring-green-500'
                        : 'border-red-400 focus:ring-1 focus:ring-red-400'
                      : 'border-gray-200 focus:ring-1 focus:ring-blue-500'
                  }`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {passwordForm.confirmPassword && (
                    <div>
                      {isMatch ? (
                        <Check size={18} className="text-green-500" />
                      ) : (
                        <X size={18} className="text-red-500" />
                      )}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="text-gray-400 hover:text-gray-600 cursor-pointer"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              {isMatch && (
                <p className="text-xs text-green-600 font-medium">Passwords match</p>
              )}
              {isMismatch && (
                <p className="text-xs text-red-500 font-medium">Passwords do not match</p>
              )}
            </div>

            {(passwordClientError || passwordError) && (
              <p className="text-sm font-medium text-red-500 bg-red-50 p-3 rounded-lg border border-red-200">
                {passwordClientError || passwordError}
              </p>
            )}

            {passwordMessage && (
              <p className="text-sm font-medium text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
                {passwordMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={passwordLoading || !isLengthValid || !isMatch}
              className="mt-2 px-6 py-2.5 bg-[#3b71ed] disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-medium rounded shadow-sm hover:bg-blue-700 transition-colors cursor-pointer"
            >
              {passwordLoading ? 'Saving...' : 'Save password'}
            </button>
          </form>
        </section>

        <hr className="border-gray-100" />

        <section>
          <h2 className="text-xl font-bold text-[#ef7b61]">Delete Account :</h2>
          <div className="space-y-6">
            <p className="text-gray-600 text-[15px]">
              Do you want to delete the account? Please press below Delete button
            </p>
            <button
              type="button"
              className="px-6 py-3 bg-[#ef7b61] text-white font-semibold rounded-lg shadow-sm hover:bg-[#d96a52] transition-colors cursor-pointer"
            >
              Delete Account
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default ProfileSettings