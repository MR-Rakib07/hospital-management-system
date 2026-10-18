'use client'

import React, { useState, useEffect, type FormEvent } from 'react'
import { X, Loader2, Phone, User, Calendar, Building, Mail, ShieldAlert, AlertCircle } from 'lucide-react'
import type { AppointmentWithRelations, Gender } from '@/types/authTypes'

export interface PatientUpdatePayload {
  id: string
  appointmentDate?: string
  patientName: string
  patientPhone: string
  patientEmail?: string
  patientAge?: number
  patientGender?: Gender
  problemDetails?: string
}

interface PatientAppointmentEditModalProps {
  isOpen: boolean
  appointment: AppointmentWithRelations | null
  userRole?: string
  loading: boolean
  onClose: () => void
  onUpdate: (payload: PatientUpdatePayload) => Promise<void>
}

const formatDateToLocalInput = (dateValue: string | Date | undefined): string => {
  if (!dateValue) return ''
  const d = new Date(dateValue)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-CA')
}

export default function PatientAppointmentEditModal({
  isOpen,
  appointment,
  userRole = 'PATIENT',
  loading,
  onClose,
  onUpdate,
}: PatientAppointmentEditModalProps) {
  const isAdminOrStaff = ['ADMIN', 'STAFF'].includes(userRole.toUpperCase())

  const [initialDate, setInitialDate] = useState<string>('')
  const [appointmentDate, setAppointmentDate] = useState<string>('')
  const [patientName, setPatientName] = useState<string>('')
  const [patientPhone, setPatientPhone] = useState<string>('')
  const [patientEmail, setPatientEmail] = useState<string>('')
  const [patientAge, setPatientAge] = useState<string>('')
  const [patientGender, setPatientGender] = useState<Gender>('MALE')
  const [problemDetails, setProblemDetails] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (appointment) {
      const localFormattedDate = formatDateToLocalInput(appointment.appointmentDate)
      setInitialDate(localFormattedDate)
      setAppointmentDate(localFormattedDate)
      setPatientName(appointment.patientName || '')
      setPatientPhone(appointment.patientPhone || '')
      setPatientEmail(appointment.patientEmail || '')
      setPatientAge(appointment.patientAge ? String(appointment.patientAge) : '')
      setPatientGender((appointment.patientGender as Gender) || 'MALE')
      setProblemDetails(appointment.problemDetails || '')
      setErrorMessage(null)
    }
  }, [appointment, isOpen])

  if (!isOpen || !appointment) return null

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage(null)

    const isDateChanged = appointmentDate !== initialDate

    try {
      await onUpdate({
        id: appointment.id,
        ...(isDateChanged && appointmentDate ? { appointmentDate } : {}),
        patientName: patientName.trim(),
        patientPhone: patientPhone.trim(),
        patientEmail: patientEmail.trim() || undefined,
        patientAge: patientAge ? Number(patientAge) : undefined,
        patientGender,
        problemDetails: problemDetails.trim() || undefined,
      })
      onClose()
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message)
      } else if (typeof err === 'string') {
        setErrorMessage(err)
      } else {
        setErrorMessage('Failed to update appointment details')
      }
    }
  }

  const todayStr = formatDateToLocalInput(new Date())
  const serial = appointment.formattedSerialCode || appointment.serialCode || (appointment.serialNumber ? `SL-${appointment.serialNumber}` : null)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl transition-all sm:p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-gray-900">
                {isAdminOrStaff ? 'Update Patient Contact & Details' : 'Edit Appointment'}
              </h3>
              {isAdminOrStaff && (
                <span className="rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                  {userRole} Mode
                </span>
              )}
            </div>
            {serial && (
              <p className="text-xs text-gray-500 font-mono mt-0.5">
                Serial Code: {serial}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {errorMessage && (
          <div className="mt-3 flex items-start gap-2 rounded-xl bg-rose-50 p-3 text-xs font-medium text-rose-700 border border-rose-200">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {isAdminOrStaff && appointment.status !== 'PENDING' && (
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-amber-50 p-2.5 text-xs font-medium text-amber-700 border border-amber-200">
            <ShieldAlert size={15} className="shrink-0" />
            <span>This appointment is {appointment.status}. You are modifying contact information as Staff/Admin.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-gray-700">
              <Phone size={13} className="text-blue-600" />
              <span>Patient Phone Number *</span>
            </label>
            <input
              type="tel"
              required
              placeholder="e.g. 017XXXXXXXX"
              value={patientPhone}
              onChange={(e) => setPatientPhone(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs text-gray-800 outline-none focus:border-[#396CF0] focus:ring-1 focus:ring-[#396CF0]"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                <User size={13} className="text-blue-600" />
                <span>Patient Full Name *</span>
              </label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs text-gray-800 outline-none focus:border-[#396CF0]"
              />
            </div>

            <div>
              <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                <Mail size={13} className="text-blue-600" />
                <span>Patient Email (Optional)</span>
              </label>
              <input
                type="email"
                value={patientEmail}
                onChange={(e) => setPatientEmail(e.target.value)}
                placeholder="patient@example.com"
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs text-gray-800 outline-none focus:border-[#396CF0]"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700">Consultation Type</label>
            <div className="grid grid-cols-1">
              <div className="inline-flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl border border-[#396CF0] bg-blue-50 text-[#396CF0]">
                <Building size={14} /> In-Clinic Chamber (Offline System)
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-gray-700">
              <Calendar size={13} className="text-blue-600" />
              <span>Appointment Date</span>
            </label>
            <input
              type="date"
              min={todayStr}
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs text-gray-800 outline-none focus:border-[#396CF0] cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">Age</label>
              <input
                type="number"
                min="1"
                max="120"
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs text-gray-800 outline-none focus:border-[#396CF0]"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">Gender</label>
              <select
                value={patientGender}
                onChange={(e) => setPatientGender(e.target.value as Gender)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 outline-none focus:border-[#396CF0] cursor-pointer"
              >
                <option value="MALE">MALE</option>
                <option value="FEMALE">FEMALE</option>
                <option value="OTHER">OTHER</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700">Problem Details / Symptoms</label>
            <textarea
              rows={2}
              value={problemDetails}
              onChange={(e) => setProblemDetails(e.target.value)}
              className="w-full resize-none rounded-xl border border-gray-200 px-3.5 py-2 text-xs text-gray-800 outline-none focus:border-[#396CF0]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#396CF0] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2857d0] transition disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Save Phone & Details</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}