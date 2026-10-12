'use client'

import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { clearAppointmentMessages } from '@/redux/appointment/appointmentSlice'
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import AdminAppointmentsView from '@/components/appointments/AdminAppointmentsView'
import DoctorAppointmentsView from '@/components/appointments/DoctorAppointmentsView'
import StaffAppointmentsView from '@/components/appointments/StaffAppointmentsView'

export default function AppointmentsPage() {
  const dispatch = useAppDispatch()
  const { user, loading: profileLoading } = useAppSelector((state) => state.profile)
  const { error, successMessage } = useAppSelector((state) => state.appointment)

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        dispatch(clearAppointmentMessages())
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [successMessage, error, dispatch])

  if (profileLoading && !user) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Advance Appointments</h2>
          <p className="text-xs sm:text-sm text-gray-500">
            {user?.role === 'ADMIN' && 'Complete hospital appointment register (Online & In-Person)'}
            {user?.role === 'STAFF' && 'Front desk verification & patient check-in management'}
            {user?.role === 'DOCTOR' && 'Patients booked under your consultation slot'}
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs sm:text-sm text-emerald-800">
          <CheckCircle className="h-4 w-4 flex-shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-xs sm:text-sm text-rose-800">
          <AlertCircle className="h-4 w-4 flex-shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {user?.role === 'ADMIN' && <AdminAppointmentsView />}
      {user?.role === 'STAFF' && <StaffAppointmentsView />}
      {user?.role === 'DOCTOR' && <DoctorAppointmentsView />}
      
      {user?.role !== 'ADMIN' && user?.role !== 'STAFF' && user?.role !== 'DOCTOR' && (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
          You do not have administrative privileges to manage appointments.
        </div>
      )}
    </div>
  )
}