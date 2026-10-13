'use client'

import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { createDoctorThunk, type CreateDoctorPayload } from '@/redux/doctor/doctorFetchSlice'
import { fetchRoleConfigThunk, type DepartmentItem } from '@/redux/department/departmentSlice'
import { X, Loader2 } from 'lucide-react'

interface AddDoctorModalProps {
  isOpen: boolean
  onClose: () => void
}

interface DoctorFormState {
  fullname: string
  email: string
  password: string
  phone: string
  experience: number
  fee: number
  teleconsultationFee: number
  roomNumber: string
  floorNumber: string
}

const DAYS_OF_WEEK: string[] = [
  'Saturday',
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
]

const INITIAL_FORM_STATE: DoctorFormState = {
  fullname: '',
  email: '',
  password: '',
  phone: '',
  experience: 1,
  fee: 1000,
  teleconsultationFee: 500,
  roomNumber: '',
  floorNumber: '',
}

export default function AddDoctorModal({ isOpen, onClose }: AddDoctorModalProps) {
  const dispatch = useAppDispatch()
  const { actionLoading, actionError } = useAppSelector((state) => state.doctors)
  const {
    departments,
    configDesignationNames,
    loading: loadingConfig,
  } = useAppSelector((state) => state.department)

  const [department, setDepartment] = useState<string>('')
  const [designation, setDesignation] = useState<string>('')
  const [availableDays, setAvailableDays] = useState<string[]>([])
  const [startTime, setStartTime] = useState<string>('17:00')
  const [endTime, setEndTime] = useState<string>('21:00')
  const [formData, setFormData] = useState<DoctorFormState>(INITIAL_FORM_STATE)

  useEffect(() => {
    if (isOpen) {
      void dispatch(fetchRoleConfigThunk('DOCTOR'))
    }
  }, [isOpen, dispatch])

  useEffect(() => {
    if (departments.length > 0 && !department) {
      setDepartment(departments[0].name)
    }
  }, [departments, department])

  useEffect(() => {
    if (configDesignationNames.length > 0 && !designation) {
      setDesignation(configDesignationNames[0])
    }
  }, [configDesignationNames, designation])

  if (!isOpen) return null

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDepartment(e.target.value)
  }

  const handleDayToggle = (day: string) => {
    setAvailableDays((prev: string[]) =>
      prev.includes(day) ? prev.filter((d: string) => d !== day) : [...prev, day]
    )
  }

  const formatVisitingHours = (start: string, end: string): string => {
    const formatTimeStr = (t: string): string => {
      const parts = t.split(':')
      const hour = parseInt(parts[0], 10)
      const minutes = parts[1] || '00'
      const period = hour >= 12 ? 'PM' : 'AM'
      const formattedHour = hour % 12 || 12
      return `${formattedHour}:${minutes} ${period}`
    }
    return `${formatTimeStr(start)} - ${formatTimeStr(end)}`
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const payload = {
      ...formData,
      department,
      designation,
      availableDays,
      visitingHours: formatVisitingHours(startTime, endTime),
    } as unknown as CreateDoctorPayload

    try {
      await dispatch(createDoctorThunk(payload)).unwrap()
      setFormData(INITIAL_FORM_STATE)
      setAvailableDays([])
      onClose()
    } catch {}
  }

  const isFormValid =
    Boolean(formData.fullname.trim()) &&
    Boolean(formData.email.trim()) &&
    Boolean(formData.password.trim()) &&
    Boolean(formData.phone.trim()) &&
    Boolean(department.trim()) &&
    Boolean(designation.trim()) &&
    availableDays.length > 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Register New Doctor</h2>
            <p className="text-xs text-gray-500">Provide chamber schedule and professional details</p>
          </div>
          <button
            type="button"
            aria-label="Close modal"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {actionError && (
          <div className="mt-4 rounded-lg bg-rose-50 p-3 text-sm font-medium text-rose-700">
            {actionError}
          </div>
        )}

        {loadingConfig ? (
          <div className="flex h-64 flex-col items-center justify-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <p className="text-xs text-gray-500">Loading doctor departments and designations...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-gray-700">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Dr. Tanvir Ahmed"
                  value={formData.fullname}
                  onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">Phone Number *</label>
                <input
                  type="text"
                  required
                  placeholder="017XXXXXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="doctor@hospital.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">Department *</label>
                <select
                  value={department}
                  onChange={handleDepartmentChange}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white cursor-pointer"
                >
                  {departments.length === 0 ? (
                    <option value="">No department available</option>
                  ) : (
                    departments.map((dept: DepartmentItem) => (
                      <option key={dept.id} value={dept.name}>
                        {dept.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">Designation *</label>
                <select
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white cursor-pointer"
                >
                  {configDesignationNames.length === 0 ? (
                    <option value="">No designation available</option>
                  ) : (
                    configDesignationNames.map((desig: string) => (
                      <option key={desig} value={desig}>
                        {desig}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">Experience (Years) *</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: Number(e.target.value) })}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">In-Chamber Fee (৳) *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.fee}
                  onChange={(e) => setFormData({ ...formData, fee: Number(e.target.value) })}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">Teleconsultation Fee (৳)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.teleconsultationFee}
                  onChange={(e) =>
                    setFormData({ ...formData, teleconsultationFee: Number(e.target.value) })
                  }
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">Visiting Start Time *</label>
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">Visiting End Time *</label>
                <input
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">Room Number</label>
                <input
                  type="text"
                  placeholder="Room 402"
                  value={formData.roomNumber}
                  onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">Floor</label>
                <input
                  type="text"
                  placeholder="4th Floor"
                  value={formData.floorNumber}
                  onChange={(e) => setFormData({ ...formData, floorNumber: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Available Visiting Days (Select at least one) *
              </label>
              <div className="flex flex-wrap gap-2">
                {DAYS_OF_WEEK.map((day: string) => {
                  const isSelected = availableDays.includes(day)
                  return (
                    <button
                      type="button"
                      key={day}
                      onClick={() => handleDayToggle(day)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition cursor-pointer border ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {day}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading || !isFormValid}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
              >
                {actionLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>{actionLoading ? 'Registering...' : 'Register Doctor'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}