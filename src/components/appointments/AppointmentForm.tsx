'use client'

import Container from '@/utils/Container'
import { useState, useEffect, type FormEvent, useMemo, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { fetchDoctorsThunk, type DoctorWithProfile } from '@/redux/doctor/doctorFetchSlice'
import { fetchRoleConfigThunk, type DepartmentItem } from '@/redux/department/departmentSlice'
import {
  bookAppointmentThunk,
  clearAppointmentMessages,
} from '@/redux/appointment/appointmentSlice'
import type { Gender } from '@/types/authTypes'
import AppointmentSuccessCard from './AppointmentSuccessCard'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function AppointmentForm() {
  const dispatch = useAppDispatch()

  const { doctors, loading: doctorsLoading } = useAppSelector((state) => state.doctors)
  const { departments, loading: departmentsLoading } = useAppSelector((state) => state.department)
  const {
    actionLoading: isBooking,
    error: bookingError,
    successMessage,
    lastBookedAppointment,
  } = useAppSelector((state) => state.appointment)

  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [selectedDoctorProfileId, setSelectedDoctorProfileId] = useState('')
  const [appointmentDate, setAppointmentDate] = useState('')
  const [patientName, setPatientName] = useState('')
  const [patientPhone, setPatientPhone] = useState('')
  const [patientEmail, setPatientEmail] = useState('')
  const [patientAge, setPatientAge] = useState('')
  const [patientGender, setPatientGender] = useState<Gender>('MALE')
  const [problemDetails, setProblemDetails] = useState('')
  const [dateError, setDateError] = useState('')

  useEffect(() => {
    void dispatch(fetchDoctorsThunk())
    void dispatch(fetchRoleConfigThunk('DOCTOR'))
  }, [dispatch])

  const getDoctorProfileId = (doc: DoctorWithProfile): string => {
    const profile = doc.doctorProfile as (typeof doc.doctorProfile & { _id?: string }) | undefined
    return profile?.id || profile?._id || ''
  }

  const filteredDoctors = useMemo(() => {
    if (!selectedDepartment.trim()) return []
    const targetDept = selectedDepartment.trim().toLowerCase()
    return doctors.filter((doc: DoctorWithProfile) => {
      const docDept = (doc.doctorProfile?.department || '').trim().toLowerCase()
      return Boolean(getDoctorProfileId(doc)) && (docDept === targetDept || docDept.includes(targetDept))
    })
  }, [doctors, selectedDepartment])

  const activeDoctor = useMemo(() => {
    return doctors.find((doc: DoctorWithProfile) => getDoctorProfileId(doc) === selectedDoctorProfileId)
  }, [doctors, selectedDoctorProfileId])

  const availableDaysRaw = useMemo(() => activeDoctor?.doctorProfile?.availableDays || [], [activeDoctor])

  const validateSelectedDate = useCallback(
    (dateValue: string) => {
      if (!dateValue) return setDateError('')
      const parts = dateValue.split('-')
      if (parts.length !== 3) return setDateError('Invalid date format')

      const dayName = DAY_NAMES[new Date(Date.UTC(+parts[0], +parts[1] - 1, +parts[2])).getUTCDay()]
      const normalizedDays = availableDaysRaw.map((d: string) => d.trim().toLowerCase())

      if (normalizedDays.length > 0 && dayName && !normalizedDays.includes(dayName.toLowerCase())) {
        setDateError(`Doctor is unavailable on ${dayName}. Available: ${availableDaysRaw.join(', ')}`)
      } else {
        setDateError('')
      }
    },
    [availableDaysRaw]
  )

  const handleDateChange = (dateValue: string) => {
    setAppointmentDate(dateValue)
    validateSelectedDate(dateValue)
  }

  useEffect(() => {
    if (appointmentDate) validateSelectedDate(appointmentDate)
  }, [appointmentDate, validateSelectedDate])

  const consultationFee = useMemo(() => {
    return activeDoctor?.doctorProfile?.fee ?? 0
  }, [activeDoctor])

  const isSubmitDisabled =
    isBooking ||
    !selectedDepartment ||
    !selectedDoctorProfileId ||
    !appointmentDate ||
    !/^\d{4}-\d{2}-\d{2}$/.test(appointmentDate) ||
    Boolean(dateError)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isSubmitDisabled) return

    dispatch(clearAppointmentMessages())
    void dispatch(
      bookAppointmentThunk({
        doctorId: selectedDoctorProfileId,
        appointmentDate,
        patientName: patientName.trim(),
        patientPhone: patientPhone.trim(),
        patientEmail: patientEmail.trim() || undefined,
        patientAge: patientAge ? Number(patientAge) : undefined,
        patientGender,
        problemDetails: problemDetails.trim() || undefined,
      })
    )
  }

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], [])

  return (
    <Container>
      <div className="max-w-4xl mx-auto my-12 bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-xs">
        {bookingError && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-200">
            {bookingError}
          </div>
        )}

        {successMessage && lastBookedAppointment && (
          <AppointmentSuccessCard appointment={lastBookedAppointment} fee={consultationFee} />
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-medium text-gray-700 text-sm">Patient Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Tanvir Ahmed"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#396CF0] focus:ring-1 focus:ring-[#396CF0] outline-none text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium text-gray-700 text-sm">Department *</label>
              <select
                value={selectedDepartment}
                onChange={(e) => {
                  setSelectedDepartment(e.target.value)
                  setSelectedDoctorProfileId('')
                }}
                required
                disabled={departmentsLoading || departments.length === 0}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#396CF0] focus:ring-1 focus:ring-[#396CF0] outline-none text-sm bg-white cursor-pointer"
              >
                <option value="">Select Department</option>
                {departments.map((dept: DepartmentItem) => (
                  <option key={dept.id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700 text-sm">Doctor *</label>
              <select
                value={selectedDoctorProfileId}
                onChange={(e) => setSelectedDoctorProfileId(e.target.value)}
                required
                disabled={doctorsLoading || !selectedDepartment}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#396CF0] focus:ring-1 focus:ring-[#396CF0] outline-none text-sm bg-white cursor-pointer"
              >
                <option value="">Select Doctor</option>
                {selectedDepartment && filteredDoctors.length === 0 ? (
                  <option value="" disabled>No doctor available in this department</option>
                ) : (
                  filteredDoctors.map((doc: DoctorWithProfile) => (
                    <option key={getDoctorProfileId(doc)} value={getDoctorProfileId(doc)}>
                      {doc.fullname}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium text-gray-700 text-sm">Patient Phone *</label>
              <input
                type="tel"
                required
                placeholder="017XXXXXXXX"
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#396CF0] focus:ring-1 focus:ring-[#396CF0] outline-none text-sm"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium text-gray-700 text-sm">Patient Email (Optional)</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={patientEmail}
                onChange={(e) => setPatientEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#396CF0] focus:ring-1 focus:ring-[#396CF0] outline-none text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block mb-2 font-medium text-gray-700 text-sm">Appointment Date (YYYY-MM-DD) *</label>
              <input
                type="date"
                required
                min={todayStr}
                value={appointmentDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border outline-none text-sm cursor-pointer ${
                  dateError ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-[#396CF0]'
                }`}
              />
              {dateError ? (
                <p className="text-[11px] text-red-600 mt-1 font-medium">{dateError}</p>
              ) : availableDaysRaw.length > 0 ? (
                <p className="text-[11px] text-gray-500 mt-1">Available: {availableDaysRaw.join(', ')}</p>
              ) : null}
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700 text-sm">Patient Age</label>
              <input
                type="number"
                min="1"
                max="120"
                placeholder="Age"
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#396CF0] outline-none text-sm"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700 text-sm">Patient Gender</label>
              <select
                value={patientGender}
                onChange={(e) => setPatientGender(e.target.value as Gender)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#396CF0] outline-none text-sm bg-white cursor-pointer"
              >
                <option value="MALE">MALE</option>
                <option value="FEMALE">FEMALE</option>
                <option value="OTHER">OTHER</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 text-sm">Problem Details / Symptoms</label>
            <textarea
              rows={3}
              placeholder="Describe symptoms or reasons for visit..."
              value={problemDetails}
              onChange={(e) => setProblemDetails(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#396CF0] outline-none text-sm resize-none"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
            <span className="text-sm font-medium text-gray-600">Total Consultation Fee (Pay at Counter):</span>
            <span className="text-xl font-bold text-[#396CF0]">৳ {consultationFee}</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="w-full bg-[#396CF0] disabled:bg-gray-400 text-white py-3.5 px-6 rounded-xl font-medium hover:bg-[#2857d0] transition-colors cursor-pointer"
          >
            {isBooking ? 'Processing Appointment...' : 'Book An Appointment'}
          </button>
        </form>
      </div>
    </Container>
  )
}