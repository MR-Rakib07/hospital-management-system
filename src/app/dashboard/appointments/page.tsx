'use client'

import {
  clearAppointmentMessages,
  fetchAppointmentsThunk,
  updateAppointmentStatusThunk,
  cancelAppointmentThunk,
} from '@/redux/appointment/appointmentSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import type { AppointmentStatus, AppointmentWithRelations } from '@/types/authTypes'
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Filter,
  Loader2,
  Search,
  UserCheck,
  XCircle,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'

export default function AppointmentsPage() {
  const dispatch = useAppDispatch()

  const { user, loading: profileLoading } = useAppSelector((state) => state.profile)
  const { appointments, loading, actionLoading, error, successMessage } =
    useAppSelector((state) => state.appointment)

  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL')

  useEffect(() => {
    if (user?.role === 'ADMIN' || user?.role === 'DOCTOR') {
      void dispatch(fetchAppointmentsThunk(undefined))
    }
  }, [dispatch, user])

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        dispatch(clearAppointmentMessages())
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [successMessage, error, dispatch])

  const canModify = (appointment: AppointmentWithRelations): boolean => {
    if (user?.role === 'ADMIN') {
      return true
    }
    if (user?.role === 'DOCTOR') {
      return Boolean(
        user.doctorProfile?.id && appointment.doctorId === user.doctorProfile.id
      )
    }
    return false
  }

  const handleStatusUpdate = (id: string, newStatus: AppointmentStatus): void => {
    const target = appointments.find((a) => a.id === id)
    if (!target || !canModify(target)) {
      alert('You are not authorized to modify this appointment.')
      return
    }

    void dispatch(updateAppointmentStatusThunk({ id, status: newStatus }))
  }

  const handleCancelAppointment = (id: string): void => {
    const target = appointments.find((a) => a.id === id)
    if (!target || !canModify(target)) {
      alert('You are not authorized to modify this appointment.')
      return
    }

    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      void dispatch(cancelAppointmentThunk(id))
    }
  }

  const displayedAppointments = (appointments || []).filter((apt) => {
    const patientName = apt.patient?.fullname || ''
    const patientPhone = apt.patient?.phone || ''
    const doctorName = apt.doctor?.user?.fullname || ''

    const matchesSearch =
      patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patientPhone.includes(searchTerm) ||
      doctorName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      selectedStatus === 'ALL' || apt.status === selectedStatus

    return matchesSearch && matchesStatus
  })

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
            {user?.role === 'ADMIN'
              ? 'Complete hospital appointment register (Offline Payment at Arrival)'
              : 'Patients booked under your chamber slot'}
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

      <div className="flex flex-col gap-3 rounded-xl border border-blue-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by patient, phone or doctor..."
            className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">PENDING</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
            <thead className="bg-blue-50/50 text-xs font-semibold uppercase text-blue-900">
              <tr>
                <th className="px-5 py-3.5">Serial</th>
                <th className="px-5 py-3.5">Patient Details</th>
                {user?.role === 'ADMIN' && <th className="px-5 py-3.5">Doctor & Dept</th>}
                <th className="px-5 py-3.5">Date & Problem</th>
                <th className="px-5 py-3.5">Offline Fee</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {loading ? (
                <tr>
                  <td
                    colSpan={user?.role === 'ADMIN' ? 7 : 6}
                    className="py-12 text-center text-sm text-gray-500"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                      <span>Loading appointments from server...</span>
                    </div>
                  </td>
                </tr>
              ) : displayedAppointments.length === 0 ? (
                <tr>
                  <td
                    colSpan={user?.role === 'ADMIN' ? 7 : 6}
                    className="py-10 text-center text-sm text-gray-400"
                  >
                    No appointments found matching current criteria.
                  </td>
                </tr>
              ) : (
                displayedAppointments.map((item) => {
                  const hasAccess = canModify(item)
                  const formattedDate = item.appointmentDate
                    ? new Date(item.appointmentDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'N/A'

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-blue-50/30 transition-colors"
                    >
                      <td className="px-5 py-4 font-bold text-blue-600">
                        #{item.serialNumber ? item.serialNumber.toString().padStart(2, '0') : '00'}
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-900">
                          {item.patient?.fullname || 'Patient'}
                        </p>
                        <p className="text-xs text-gray-400">
                          {item.patient?.phone || 'No phone'}
                        </p>
                      </td>
                      {user?.role === 'ADMIN' && (
                        <td className="px-5 py-4">
                          <p className="font-medium text-gray-800">
                            {item.doctor?.user?.fullname || 'Doctor'}
                          </p>
                          <p className="text-xs text-blue-600">
                            {(item.doctor as { department?: string })?.department || 'General'}
                          </p>
                        </td>
                      )}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <Calendar className="h-3.5 w-3.5 text-blue-500" />
                          <span>{formattedDate}</span>
                        </div>
                        {item.problemDetails && (
                          <p
                            className="mt-1 line-clamp-1 max-w-[180px] text-xs text-gray-400"
                            title={item.problemDetails}
                          >
                            {item.problemDetails}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-semibold text-gray-800">
                          ৳{(item.doctor as { fee?: number })?.fee ?? 0}
                        </span>
                        <p className="text-[11px] font-medium text-amber-600">
                          Pay on Arrival
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                            item.status === 'CONFIRMED'
                              ? 'bg-blue-100 text-blue-800'
                              : item.status === 'COMPLETED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.status === 'PENDING'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        {hasAccess ? (
                          <div className="flex items-center justify-end gap-1.5">
                            {item.status === 'PENDING' && (
                              <button
                                type="button"
                                disabled={actionLoading}
                                onClick={() =>
                                  handleStatusUpdate(item.id, 'CONFIRMED')
                                }
                                className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition cursor-pointer"
                              >
                                <UserCheck className="h-3.5 w-3.5" />
                                <span>Confirm</span>
                              </button>
                            )}
                            {item.status === 'CONFIRMED' && (
                              <button
                                type="button"
                                disabled={actionLoading}
                                onClick={() =>
                                  handleStatusUpdate(item.id, 'COMPLETED')
                                }
                                className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition cursor-pointer"
                              >
                                <CheckCircle className="h-3.5 w-3.5" />
                                <span>Complete</span>
                              </button>
                            )}
                            {item.status !== 'CANCELLED' &&
                              item.status !== 'COMPLETED' && (
                                <button
                                  type="button"
                                  disabled={actionLoading}
                                  onClick={() => handleCancelAppointment(item.id)}
                                  className="rounded-md p-1 text-gray-400 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50 transition cursor-pointer"
                                  title="Cancel"
                                >
                                  <XCircle className="h-4 w-4" />
                                </button>
                              )}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">
                            Read-only
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}