'use client'

import Container from '@/utils/Container'
import { useState, useEffect, type FormEvent, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { fetchDoctorsThunk, type DoctorWithProfile } from '@/redux/doctor/doctorFetchSlice'
import { fetchDoctorConfigThunk, type DepartmentItem } from '@/redux/department/departmentSlice'
import {
  bookAppointmentThunk,
  clearAppointmentMessages,
  type AppointmentType,
  type Gender,
} from '@/redux/appointment/appointmentSlice'
import Link from 'next/link'

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

  const [appointmentType, setAppointmentType] = useState<AppointmentType>('OFFLINE')
  const [selectedDepartment, setSelectedDepartment] = useState<string>('')
  const [selectedDoctorProfileId, setSelectedDoctorProfileId] = useState<string>('')
  const [appointmentDate, setAppointmentDate] = useState<string>('')
  const [patientName, setPatientName] = useState<string>('')
  const [patientPhone, setPatientPhone] = useState<string>('')
  const [patientEmail, setPatientEmail] = useState<string>('')
  const [patientAge, setPatientAge] = useState<string>('')
  const [patientGender, setPatientGender] = useState<Gender>('MALE')
  const [problemDetails, setProblemDetails] = useState<string>('')

  useEffect(() => {
    void dispatch(fetchDoctorsThunk())
    void dispatch(fetchDoctorConfigThunk())
  }, [dispatch])

  useEffect(() => {
    if (departments.length > 0 && selectedDepartment.length === 0) {
      setSelectedDepartment(departments[0].name)
    }
  }, [departments, selectedDepartment])

  const getDoctorId = (doc: DoctorWithProfile): string => {
    const profile = doc.doctorProfile as (typeof doc.doctorProfile & { _id?: string }) | undefined
    return profile?.id || profile?._id || doc.id || ''
  }

  const getDoctorDepartment = (doc: DoctorWithProfile): string => {
    const directDoc = doc as (DoctorWithProfile & { department?: string })
    return (doc.doctorProfile?.department || directDoc.department || '').trim().toLowerCase()
  }

  const filteredDoctors = useMemo(() => {
    if (selectedDepartment.length === 0) return []
    const targetDept = selectedDepartment.trim().toLowerCase()
    return doctors.filter((doc: DoctorWithProfile) => {
      const docDept = getDoctorDepartment(doc)
      return docDept === targetDept || docDept.includes(targetDept) || targetDept.includes(docDept)
    })
  }, [doctors, selectedDepartment])

  useEffect(() => {
    if (filteredDoctors.length > 0) {
      const isValid = filteredDoctors.some(
        (doc: DoctorWithProfile) => getDoctorId(doc) === selectedDoctorProfileId
      )
      if (!isValid) {
        setSelectedDoctorProfileId(getDoctorId(filteredDoctors[0]))
      }
    } else {
      setSelectedDoctorProfileId('')
    }
  }, [filteredDoctors, selectedDoctorProfileId])

  const activeDoctor = useMemo(() => {
    return doctors.find((doc: DoctorWithProfile) => getDoctorId(doc) === selectedDoctorProfileId)
  }, [doctors, selectedDoctorProfileId])

  const consultationFee = useMemo(() => {
    if (!activeDoctor?.doctorProfile) return 0
    return appointmentType === 'ONLINE'
      ? activeDoctor.doctorProfile.teleconsultationFee ?? activeDoctor.doctorProfile.fee
      : activeDoctor.doctorProfile.fee
  }, [activeDoctor, appointmentType])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (selectedDoctorProfileId.length === 0 || appointmentDate.length === 0) return

    const isoDateString = new Date(appointmentDate).toISOString()

    dispatch(clearAppointmentMessages())
    void dispatch(
      bookAppointmentThunk({
        doctorId: selectedDoctorProfileId,
        appointmentDate: isoDateString,
        type: appointmentType,
        patientName,
        patientPhone,
        patientEmail,
        patientAge: patientAge.length > 0 ? Number(patientAge) : undefined,
        patientGender,
        problemDetails: problemDetails.length > 0 ? problemDetails : undefined,
      })
    )
  }

  const todayStr = new Date().toISOString().split('T')[0]

  return (
    <Container>
      <div className="max-w-4xl mx-auto my-12 bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-xs">
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            type="button"
            onClick={() => setAppointmentType('OFFLINE')}
            className={`py-3 px-4 text-center rounded-xl font-semibold transition-all cursor-pointer ${
              appointmentType === 'OFFLINE'
                ? 'bg-[#396CF0] text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Chamber Consultation (OFFLINE)
          </button>
          <button
            type="button"
            onClick={() => setAppointmentType('ONLINE')}
            className={`py-3 px-4 text-center rounded-xl font-semibold transition-all cursor-pointer ${
              appointmentType === 'ONLINE'
                ? 'bg-[#396CF0] text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Video Consultation (ONLINE)
          </button>
        </div>

        {bookingError && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-200">
            {bookingError}
          </div>
        )}

        {successMessage && lastBookedAppointment && (
          <div className="mb-6 p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900">
            <h4 className="font-bold text-lg mb-2">🎉 Appointment Successfully Booked!</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <p>
                <strong>Serial Number:</strong> #{lastBookedAppointment.serialNumber}
              </p>
              <p>
                <strong>Date:</strong> {new Date(lastBookedAppointment.appointmentDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Patient Name:</strong> {lastBookedAppointment.patientName}
              </p>
              <p>
                <strong>Consultation Type:</strong> {lastBookedAppointment.type}
              </p>
              <p>
                <strong>Payment Status:</strong> {lastBookedAppointment.paymentStatus || 'UNPAID'}
              </p>
              <p>
                <strong>Consultation Fee:</strong> ৳ {lastBookedAppointment.paidAmount ?? consultationFee}
              </p>
              {lastBookedAppointment.type === 'ONLINE' && lastBookedAppointment.meetingLink && (
                <p className="md:col-span-2 mt-2">
                  <strong>Meeting Room:</strong>{' '}
                  <Link
                    href={lastBookedAppointment.meetingLink}
                    target="_blank"
                    className="text-[#396CF0] underline font-semibold ml-1"
                  >
                    Join Consultation
                  </Link>
                </p>
              )}
            </div>
          </div>
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
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#396CF0] focus:ring-1 focus:ring-[#396CF0] outline-none text-sm transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium text-gray-700 text-sm">Department *</label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                disabled={departmentsLoading || departments.length === 0}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#396CF0] focus:ring-1 focus:ring-[#396CF0] outline-none text-sm transition-colors bg-white text-gray-800 disabled:bg-gray-100"
              >
                {departments.length === 0 ? (
                  <option value="">No departments available</option>
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
              <label className="block mb-2 font-medium text-gray-700 text-sm">Doctor *</label>
              <select
                value={selectedDoctorProfileId}
                onChange={(e) => setSelectedDoctorProfileId(e.target.value)}
                required
                disabled={doctorsLoading || filteredDoctors.length === 0}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#396CF0] focus:ring-1 focus:ring-[#396CF0] outline-none text-sm transition-colors bg-white text-gray-800 disabled:bg-gray-100"
              >
                {doctorsLoading ? (
                  <option value="">Loading doctors...</option>
                ) : filteredDoctors.length === 0 ? (
                  <option value="">No doctor available in this department</option>
                ) : (
                  filteredDoctors.map((doc: DoctorWithProfile) => {
                    const id = getDoctorId(doc)
                    const title = doc.doctorProfile?.designation || doc.doctorProfile?.specialization

                    return (
                      <option key={id} value={id}>
                        {doc.fullname} {title ? `(${title})` : ''}
                      </option>
                    )
                  })
                )}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium text-gray-700 text-sm">Patient Email *</label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={patientEmail}
                onChange={(e) => setPatientEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#396CF0] focus:ring-1 focus:ring-[#396CF0] outline-none text-sm transition-colors"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium text-gray-700 text-sm">Patient Phone *</label>
              <input
                type="tel"
                required
                placeholder="017XXXXXXXX"
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#396CF0] focus:ring-1 focus:ring-[#396CF0] outline-none text-sm transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block mb-2 font-medium text-gray-700 text-sm">Appointment Date *</label>
              <input
                type="date"
                required
                min={todayStr}
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#396CF0] focus:ring-1 focus:ring-[#396CF0] outline-none text-sm transition-colors"
              />
              {activeDoctor?.doctorProfile?.availableDays && (
                <p className="text-[11px] text-gray-500 mt-1">
                  Available days: {activeDoctor.doctorProfile.availableDays.join(', ')}
                </p>
              )}
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
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#396CF0] focus:ring-1 focus:ring-[#396CF0] outline-none text-sm transition-colors"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700 text-sm">Patient Gender</label>
              <select
                value={patientGender}
                onChange={(e) => setPatientGender(e.target.value as Gender)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#396CF0] focus:ring-1 focus:ring-[#396CF0] outline-none text-sm transition-colors bg-white text-gray-800"
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
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#396CF0] focus:ring-1 focus:ring-[#396CF0] outline-none text-sm transition-colors resize-none"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
            <span className="text-sm font-medium text-gray-600">Total Consultation Fee:</span>
            <span className="text-xl font-bold text-[#396CF0]">৳ {consultationFee}</span>
          </div>

          <button
            type="submit"
            disabled={isBooking || selectedDoctorProfileId.length === 0 || appointmentDate.length === 0}
            className="w-full bg-[#396CF0] disabled:bg-gray-400 text-white py-3.5 px-6 rounded-xl font-medium hover:bg-[#2857d0] transition-colors cursor-pointer"
          >
            {isBooking ? 'Processing Appointment...' : 'Book An Appointment'}
          </button>
        </form>
      </div>
    </Container>
  )
}