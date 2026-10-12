'use client'

import React, { useMemo } from 'react'
import type { AppointmentStatus, AppointmentWithRelations } from '@/types/authTypes'
import {
  Calendar,
  CheckCircle,
  Loader2,
  UserCheck,
  Video,
  Building,
  XCircle,
  PlayCircle,
} from 'lucide-react'
import Link from 'next/link'

interface AppointmentsTableProps {
  appointments: (AppointmentWithRelations & { serialCode?: string | null })[]
  loading: boolean
  actionLoading: boolean
  showDoctorColumn: boolean
  userRole?: 'ADMIN' | 'DOCTOR' | 'STAFF' | string
  canModify: (appointment: AppointmentWithRelations) => boolean
  onStatusUpdate: (id: string, newStatus: AppointmentStatus) => void
  onCancelAppointment: (id: string) => void
}

export default function AppointmentsTable({
  appointments,
  loading,
  actionLoading,
  showDoctorColumn,
  userRole = 'ADMIN',
  canModify,
  onStatusUpdate,
  onCancelAppointment,
}: AppointmentsTableProps) {
  const colSpanCount = useMemo(() => (showDoctorColumn ? 8 : 7), [showDoctorColumn])

  return (
    <div className="overflow-hidden rounded-xl border border-blue-100 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
          <thead className="bg-blue-50/50 text-xs font-semibold uppercase text-blue-900">
            <tr>
              <th className="px-5 py-3.5">Serial</th>
              <th className="px-5 py-3.5">Patient Details</th>
              <th className="px-5 py-3.5">Type & Channel</th>
              {showDoctorColumn && <th className="px-5 py-3.5">Doctor & Dept</th>}
              <th className="px-5 py-3.5">Date & Problem</th>
              <th className="px-5 py-3.5">Fee & Payment</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {loading ? (
              <tr>
                <td colSpan={colSpanCount} className="py-12 text-center text-sm text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                    <span>Loading appointments...</span>
                  </div>
                </td>
              </tr>
            ) : appointments.length === 0 ? (
              <tr>
                <td colSpan={colSpanCount} className="py-10 text-center text-sm text-gray-400">
                  No appointments found matching current criteria.
                </td>
              </tr>
            ) : (
              appointments.map((item) => {
                const hasAccess = canModify(item)
                const formattedDate = item.appointmentDate
                  ? new Date(item.appointmentDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'N/A'

                return (
                  <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-5 py-4">
                      <span className="inline-block rounded-md bg-blue-50 px-2.5 py-1 font-mono text-xs font-bold text-blue-700 border border-blue-100">
                        {item.serialCode}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900">
                        {item.patientName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.patientPhone}
                      </p>
                      {item.patientEmail && (
                        <p className="text-[11px] text-gray-400">
                          {item.patientEmail}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                        {item.patientAge && <span>Age: {item.patientAge}</span>}
                        {item.patientGender && <span>{item.patientGender}</span>}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${
                          item.type === 'ONLINE'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {item.type === 'ONLINE' ? (
                          <>
                            <Video className="h-3 w-3" /> Online
                          </>
                        ) : (
                          <>
                            <Building className="h-3 w-3" /> Offline
                          </>
                        )}
                      </span>
                      {item.type === 'ONLINE' && item.meetingLink && (
                        <div className="mt-1">
                          <Link
                            href={item.meetingLink}
                            target="_blank"
                            className="text-[11px] text-blue-600 hover:underline font-medium"
                          >
                            Join Call
                          </Link>
                        </div>
                      )}
                    </td>

                    {showDoctorColumn && (
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-800">
                          {item.doctor?.user?.fullname}
                        </p>
                        <p className="text-xs text-blue-600">
                          {item.doctor?.department}
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
                      <span className="font-semibold text-gray-800">৳{item.paidAmount}</span>
                      <p
                        className={`text-[11px] font-medium ${
                          item.paymentStatus === 'PAID' ? 'text-emerald-600' : 'text-amber-600'
                        }`}
                      >
                        {item.paymentStatus}
                      </p>
                      {item.transactionId && (
                        <p className="text-[10px] text-gray-400 font-mono">
                          TxID: {item.transactionId}
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          item.status === 'CONFIRMED'
                            ? 'bg-blue-100 text-blue-800'
                            : item.status === 'COMPLETED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.status === 'IN_PROGRESS'
                                ? 'bg-purple-100 text-purple-800'
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
                          {/* DOCTOR ACTIONS */}
                          {userRole === 'DOCTOR' && (
                            <>
                              {item.status === 'CONFIRMED' && (
                                <button
                                  type="button"
                                  disabled={actionLoading}
                                  onClick={() => onStatusUpdate(item.id, 'IN_PROGRESS')}
                                  className="inline-flex items-center gap-1 rounded-md bg-purple-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-purple-700 disabled:opacity-50 transition cursor-pointer"
                                >
                                  <PlayCircle className="h-3.5 w-3.5" />
                                  <span>Start</span>
                                </button>
                              )}
                              {item.status === 'IN_PROGRESS' && (
                                <button
                                  type="button"
                                  disabled={actionLoading}
                                  onClick={() => onStatusUpdate(item.id, 'COMPLETED')}
                                  className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition cursor-pointer"
                                >
                                  <CheckCircle className="h-3.5 w-3.5" />
                                  <span>Complete</span>
                                </button>
                              )}
                            </>
                          )}

                          {/* ADMIN & STAFF ACTIONS */}
                          {userRole !== 'DOCTOR' && (
                            <>
                              {item.status === 'PENDING' && (
                                <button
                                  type="button"
                                  disabled={actionLoading}
                                  onClick={() => onStatusUpdate(item.id, 'CONFIRMED')}
                                  className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition cursor-pointer"
                                >
                                  <UserCheck className="h-3.5 w-3.5" />
                                  <span>Confirm</span>
                                </button>
                              )}
                              {userRole === 'ADMIN' && item.status === 'CONFIRMED' && (
                                <button
                                  type="button"
                                  disabled={actionLoading}
                                  onClick={() => onStatusUpdate(item.id, 'COMPLETED')}
                                  className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition cursor-pointer"
                                >
                                  <CheckCircle className="h-3.5 w-3.5" />
                                  <span>Complete</span>
                                </button>
                              )}
                              {item.status !== 'CANCELLED' && item.status !== 'COMPLETED' && (
                                <button
                                  type="button"
                                  disabled={actionLoading}
                                  onClick={() => onCancelAppointment(item.id)}
                                  className="rounded-md p-1 text-gray-400 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50 transition cursor-pointer"
                                  title="Cancel"
                                >
                                  <XCircle className="h-4 w-4" />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Read-only</span>
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
  )
}