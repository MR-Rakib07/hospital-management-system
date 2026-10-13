'use client'

import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { clearAppointmentMessages } from '@/redux/appointment/appointmentSlice'
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import AppointmentsView from '@/components/appointments/AppointmentsView'

export default function AdminAppointmentsPage() {
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

  if (user?.role !== 'ADMIN') {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center text-sm font-medium text-rose-800">
        You do not have administrative privileges to access this page.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Hospital Appointments Registry</h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Complete hospital-wide appointment master records (Online & In-Person)
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs sm:text-sm text-emerald-800">
          <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-xs sm:text-sm text-rose-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <AppointmentsView userRole="ADMIN" />
    </div>
  )
}