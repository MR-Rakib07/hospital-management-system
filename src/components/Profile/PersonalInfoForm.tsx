'use client'

import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { clearUpdateProfileState, updateProfileThunk } from '@/redux/auth/updateProfileSlice'
import { BloodGroup, Gender, MaritalStatus, UserProfile } from '@/types/authTypes'

interface PersonalInfoFormProps {
  user?: UserProfile | null
  onUpdate?: () => void
}

type UpdateProfilePayload = Partial<Omit<UserProfile, 'role' | 'id' | 'createdAt' | 'updatedAt'>>

export default function PersonalInfoForm({ user, onUpdate }: PersonalInfoFormProps) {
  const dispatch = useAppDispatch()
  const { loading, error, message, success } = useAppSelector((state) => state.updateProfile)

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

  const [isFormDirty, setIsFormDirty] = useState<boolean>(false)

  useEffect(() => {
    if (user && !isFormDirty) {
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
  }, [user, isFormDirty])

  useEffect(() => {
    if (success) {
      setIsFormDirty(false)
      if (onUpdate) onUpdate()
      const timer = setTimeout(() => {
        dispatch(clearUpdateProfileState())
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [success, onUpdate, dispatch])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setIsFormDirty(true)
    setForm((prev) => ({ ...prev, [name]: value }))

    if (success || error || message) {
      dispatch(clearUpdateProfileState())
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const payload: UpdateProfilePayload = {}

    if (form.fullname.trim()) payload.fullname = form.fullname.trim()
    if (form.phone.trim()) payload.phone = form.phone.trim()
    if (form.presentAddress.trim()) payload.presentAddress = form.presentAddress.trim()
    if (form.permanentAddress.trim()) payload.permanentAddress = form.permanentAddress.trim()
    if (form.emergencyContactName.trim()) payload.emergencyContactName = form.emergencyContactName.trim()
    if (form.emergencyRelation.trim()) payload.emergencyRelation = form.emergencyRelation.trim()
    if (form.emergencyPhone.trim()) payload.emergencyPhone = form.emergencyPhone.trim()

    if (form.dateOfBirth) {
      payload.dateOfBirth = new Date(form.dateOfBirth).toISOString()
    }

    if (form.gender) {
      payload.gender = form.gender as Gender
    }

    if (form.bloodGroup) {
      payload.bloodGroup = form.bloodGroup as BloodGroup
    }

    if (form.maritalStatus) {
      payload.maritalStatus = form.maritalStatus as MaritalStatus
    }

    dispatch(updateProfileThunk(payload))
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 lg:p-8 shadow-xs">
      <h2 className="text-lg sm:text-xl font-bold mb-6 text-gray-800">Personal Information :</h2>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 mb-8 pb-8 border-b border-gray-100">
        <div className="relative shrink-0">
          <Image
            src="/profile.jpg"
            width={120}
            height={120}
            alt="User Profile"
            priority
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-gray-100 shadow-xs"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">Upload your picture</h3>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-md leading-relaxed">
            For best results, use an image at least 256px by 256px in either .jpg or .png format
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            className="flex-1 sm:flex-initial px-5 py-2.5 bg-[#3b71ed] text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-blue-700 transition shadow-xs cursor-pointer text-center"
          >
            Upload
          </button>
          <button
            type="button"
            className="flex-1 sm:flex-initial px-5 py-2.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-xl text-xs sm:text-sm font-semibold hover:bg-gray-100 transition cursor-pointer text-center"
          >
            Remove
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs sm:text-sm font-semibold text-gray-700">Full Name</label>
            <input
              type="text"
              name="fullname"
              value={form.fullname}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition placeholder:text-gray-300"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs sm:text-sm font-semibold text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              disabled
              placeholder="Your email"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl outline-none bg-gray-50 text-gray-400 cursor-not-allowed placeholder:text-gray-300"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs sm:text-sm font-semibold text-gray-700">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone number"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition placeholder:text-gray-300"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs sm:text-sm font-semibold text-gray-700">Birthday</label>
            <input
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-gray-700 bg-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs sm:text-sm font-semibold text-gray-700">Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition bg-white text-gray-700"
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs sm:text-sm font-semibold text-gray-700">Blood Group</label>
            <select
              name="bloodGroup"
              value={form.bloodGroup}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition bg-white text-gray-700"
            >
              <option value="">Select Blood Group</option>
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

          <div className="space-y-1.5">
            <label className="block text-xs sm:text-sm font-semibold text-gray-700">Marital Status</label>
            <select
              name="maritalStatus"
              value={form.maritalStatus}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition bg-white text-gray-700"
            >
              <option value="">Select Marital Status</option>
              <option value="SINGLE">Single</option>
              <option value="MARRIED">Married</option>
              <option value="DIVORCED">Divorced</option>
              <option value="WIDOWED">Widowed</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs sm:text-sm font-semibold text-gray-700">Emergency Contact Name</label>
            <input
              type="text"
              name="emergencyContactName"
              value={form.emergencyContactName}
              onChange={handleChange}
              placeholder="Contact Person Name"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition placeholder:text-gray-300"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs sm:text-sm font-semibold text-gray-700">Emergency Relation</label>
            <input
              type="text"
              name="emergencyRelation"
              value={form.emergencyRelation}
              onChange={handleChange}
              placeholder="Relation (e.g. Brother, Father)"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition placeholder:text-gray-300"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs sm:text-sm font-semibold text-gray-700">Emergency Phone</label>
            <input
              type="text"
              name="emergencyPhone"
              value={form.emergencyPhone}
              onChange={handleChange}
              placeholder="Emergency Phone Number"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition placeholder:text-gray-300"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
            <label className="block text-xs sm:text-sm font-semibold text-gray-700">Present Address</label>
            <input
              type="text"
              name="presentAddress"
              value={form.presentAddress}
              onChange={handleChange}
              placeholder="Present Address"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition placeholder:text-gray-300"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2 lg:col-span-2">
            <label className="block text-xs sm:text-sm font-semibold text-gray-700">Permanent Address</label>
            <input
              type="text"
              name="permanentAddress"
              value={form.permanentAddress}
              onChange={handleChange}
              placeholder="Permanent Address"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition placeholder:text-gray-300"
            />
          </div>
        </div>

        {error && (
          <p className="text-xs sm:text-sm font-medium text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
            {error}
          </p>
        )}

        {message && (
          <p className="text-xs sm:text-sm font-medium text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
            {message}
          </p>
        )}

        <div className="pt-2 flex justify-end sm:justify-start">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 bg-[#3b71ed] disabled:bg-blue-300 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs hover:bg-blue-700 transition active:scale-95 cursor-pointer"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>{loading ? 'Saving...' : 'Save changes'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}