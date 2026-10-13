'use client'

import React, { useState } from 'react'
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
  Eye,
  Edit2,
  Phone,
  Mail,
  User,
  Stethoscope,
} from 'lucide-react'
import Link from 'next/link'
import AppointmentViewModal from '@/components/appointments/AppointmentsViewModel'
import EditAppointmentModal from './EditAppointmentModal'

interface AppointmentsTableProps {
  appointments: AppointmentWithRelations[]
  loading: boolean
  actionLoading: boolean
  showDoctorColumn: boolean
  userRole?: 'ADMIN' | 'DOCTOR' | 'STAFF' | string
  canModify: (appointment: AppointmentWithRelations) => boolean
  onStatusUpdate: (id: string, newStatus: AppointmentStatus) => Promise<void>
  onCancelAppointment: (id: string) => void | Promise<void>
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
  const [viewingAppointment, setViewingAppointment] = useState<AppointmentWithRelations | null>(null)
  const [editingAppointment, setEditingAppointment] = useState<AppointmentWithRelations | null>(null)

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'COMPLETED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'IN_PROGRESS':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'PENDING':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'CANCELLED':
      default:
        return 'bg-rose-50 text-rose-700 border-rose-200'
    }
  }

  const renderActionButtons = (item: AppointmentWithRelations) => {
    const hasAccess = canModify(item)

    return (
      <div className="flex items-center justify-end gap-1.5">
        <button
          type="button"
          onClick={() => setViewingAppointment(item)}
          className="rounded-lg border border-gray-200 bg-white p-1.5 text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition cursor-pointer"
          title="View Details"
        >
          <Eye className="h-4 w-4" />
        </button>

        {hasAccess && (userRole === 'ADMIN' || userRole === 'STAFF') && (
          <button
            type="button"
            onClick={() => setEditingAppointment(item)}
            className="rounded-lg border border-blue-200 bg-blue-50 p-1.5 text-blue-700 hover:bg-blue-100 transition cursor-pointer"
            title="Update Status"
          >
            <Edit2 className="h-4 w-4" />
          </button>
        )}

        {hasAccess && userRole === 'DOCTOR' && (
          <>
            {item.status === 'CONFIRMED' && (
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => void onStatusUpdate(item.id, 'IN_PROGRESS')}
                className="rounded-lg bg-purple-600 p-1.5 text-white hover:bg-purple-700 disabled:opacity-50 transition cursor-pointer"
                title="Start Session"
              >
                <PlayCircle className="h-4 w-4" />
              </button>
            )}
            {item.status === 'IN_PROGRESS' && (
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => void onStatusUpdate(item.id, 'COMPLETED')}
                className="rounded-lg bg-emerald-600 p-1.5 text-white hover:bg-emerald-700 disabled:opacity-50 transition cursor-pointer"
                title="Complete Session"
              >
                <CheckCircle className="h-4 w-4" />
              </button>
            )}
          </>
        )}

        {hasAccess && (userRole === 'ADMIN' || userRole === 'STAFF') && (
          <>
            {item.status === 'PENDING' && (
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => void onStatusUpdate(item.id, 'CONFIRMED')}
                className="rounded-lg bg-blue-600 p-1.5 text-white hover:bg-blue-700 disabled:opacity-50 transition cursor-pointer"
                title="Confirm Appointment"
              >
                <UserCheck className="h-4 w-4" />
              </button>
            )}
            {userRole === 'ADMIN' && item.status === 'CONFIRMED' && (
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => void onStatusUpdate(item.id, 'COMPLETED')}
                className="rounded-lg bg-emerald-600 p-1.5 text-white hover:bg-emerald-700 disabled:opacity-50 transition cursor-pointer"
                title="Complete Appointment"
              >
                <CheckCircle className="h-4 w-4" />
              </button>
            )}
            {item.status !== 'CANCELLED' && item.status !== 'COMPLETED' && (
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => void onCancelAppointment(item.id)}
                className="rounded-lg border border-rose-200 bg-rose-50 p-1.5 text-rose-600 hover:bg-rose-100 disabled:opacity-50 transition cursor-pointer"
                title="Cancel Appointment"
              >
                <XCircle className="h-4 w-4" />
              </button>
            )}
          </>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-12 text-gray-500 shadow-xs">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
        <span className="text-sm font-medium">Loading appointments...</span>
      </div>
    )
  }

  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center text-gray-400 shadow-xs">
        <Calendar className="h-10 w-10 text-gray-300 mb-2" />
        <p className="text-sm font-medium text-gray-600">No appointments found</p>
        <p className="text-xs text-gray-400 mt-1">Try updating your filters or search criteria.</p>
      </div>
    )
  }

  return (
    <>
      {/* Mobile & Tablet Card Layout (< 1024px) */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {appointments.map((item) => {
          const formattedDate = item.appointmentDate
            ? new Date(item.appointmentDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : 'N/A'

          return (
            <div
              key={item.id}
              className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs space-y-3.5 transition-all"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="inline-block rounded-md bg-blue-50 px-2 py-1 font-mono text-xs font-bold text-blue-700 border border-blue-100">
                  {item.serialCode || `SL-${item.serialNumber}`}
                </span>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${getStatusBadge(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400 shrink-0" />
                  <p className="font-semibold text-gray-900 text-sm">{item.patientName}</p>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 pl-6">
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3 text-gray-400" />
                    {item.patientPhone}
                  </span>
                  {item.patientEmail && (
                    <span className="flex items-center gap-1 truncate max-w-[200px]">
                      <Mail className="h-3 w-3 text-gray-400" />
                      {item.patientEmail}
                    </span>
                  )}
                  {(item.patientAge || item.patientGender) && (
                    <span className="text-gray-400">
                      {[item.patientAge ? `${item.patientAge}y` : null, item.patientGender]
                        .filter(Boolean)
                        .join(' • ')}
                    </span>
                  )}
                </div>
              </div>

              {showDoctorColumn && (
                <div className="rounded-xl bg-gray-50 p-2.5 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="h-4 w-4 text-blue-600 shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-800">
                        {item.doctor?.user?.fullname || 'Doctor Not Assigned'}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {item.doctor?.department || 'General Medicine'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-gray-100">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-semibold">Appointment</span>
                  <div className="flex items-center gap-1.5 text-gray-700 font-medium mt-0.5">
                    <Calendar className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${
                        item.type === 'ONLINE'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {item.type === 'ONLINE' ? (
                        <>
                          <Video className="h-3 w-3 shrink-0" /> Online
                        </>
                      ) : (
                        <>
                          <Building className="h-3 w-3 shrink-0" /> Offline
                        </>
                      )}
                    </span>
                    {item.type === 'ONLINE' && item.meetingLink && (
                      <Link
                        href={item.meetingLink}
                        target="_blank"
                        className="ml-2 text-[10px] text-blue-600 hover:underline font-semibold"
                      >
                        Join Room
                      </Link>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-gray-400 uppercase font-semibold">Fee & Payment</span>
                  <p className="font-bold text-gray-900 mt-0.5">৳{item.paidAmount}</p>
                  <p
                    className={`text-[10px] font-semibold ${
                      item.paymentStatus === 'PAID' ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  >
                    {item.paymentStatus}
                  </p>
                </div>
              </div>

              {item.problemDetails && (
                <p className="text-[11px] text-gray-500 line-clamp-2 bg-gray-50/70 p-2 rounded-lg">
                  <span className="font-semibold text-gray-700">Symptoms:</span> {item.problemDetails}
                </p>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-[11px] text-gray-400">Actions</span>
                {renderActionButtons(item)}
              </div>
            </div>
          )
        })}
      </div>

      {/* Desktop Responsive Table (>= 1024px) */}
      <div className="hidden lg:block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] table-fixed divide-y divide-gray-200 text-left text-xs sm:text-sm">
            <thead className="bg-gray-50 text-[11px] font-semibold uppercase text-gray-600 tracking-wider">
              <tr>
                <th className="w-[12%] px-4 py-3.5">Serial</th>
                <th className="w-[22%] px-4 py-3.5">Patient Details</th>
                <th className="w-[12%] px-4 py-3.5">Type</th>
                {showDoctorColumn && <th className="w-[18%] px-4 py-3.5">Doctor & Dept</th>}
                <th className="w-[14%] px-4 py-3.5">Date</th>
                <th className="w-[11%] px-4 py-3.5">Payment</th>
                <th className="w-[11%] px-4 py-3.5">Status</th>
                <th className="w-[8%] px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {appointments.map((item) => {
                const formattedDate = item.appointmentDate
                  ? new Date(item.appointmentDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'N/A'

                return (
                  <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-4 py-3.5 align-middle">
                      <span className="inline-block max-w-full truncate rounded bg-blue-50 px-2 py-0.5 font-mono text-[11px] font-bold text-blue-700 border border-blue-100">
                        {item.serialCode || `SL-${item.serialNumber}`}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 align-middle">
                      <p className="truncate font-semibold text-gray-900" title={item.patientName}>
                        {item.patientName}
                      </p>
                      <p className="truncate text-[11px] text-gray-500">{item.patientPhone}</p>
                      {item.patientEmail && (
                        <p className="truncate text-[10px] text-gray-400" title={item.patientEmail}>
                          {item.patientEmail}
                        </p>
                      )}
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mt-0.5">
                        {item.patientAge && <span>{item.patientAge}y</span>}
                        {item.patientAge && item.patientGender && <span>•</span>}
                        {item.patientGender && <span>{item.patientGender}</span>}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 align-middle">
                      <span
                        className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-semibold ${
                          item.type === 'ONLINE'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {item.type === 'ONLINE' ? (
                          <>
                            <Video className="h-3 w-3 shrink-0" /> Online
                          </>
                        ) : (
                          <>
                            <Building className="h-3 w-3 shrink-0" /> Offline
                          </>
                        )}
                      </span>
                      {item.type === 'ONLINE' && item.meetingLink && (
                        <div className="mt-1">
                          <Link
                            href={item.meetingLink}
                            target="_blank"
                            className="text-[10px] text-blue-600 hover:underline font-semibold block truncate"
                          >
                            Join Room
                          </Link>
                        </div>
                      )}
                    </td>

                    {showDoctorColumn && (
                      <td className="px-4 py-3.5 align-middle">
                        <p
                          className="truncate font-medium text-gray-900"
                          title={item.doctor?.user?.fullname ?? ''}
                        >
                          {item.doctor?.user?.fullname || 'N/A'}
                        </p>
                        <p
                          className="truncate text-[11px] text-blue-600 font-medium"
                          title={item.doctor?.department ?? ''}
                        >
                          {item.doctor?.department || 'General'}
                        </p>
                      </td>
                    )}

                    <td className="px-4 py-3.5 align-middle">
                      <div className="flex items-center gap-1 text-[11px] text-gray-700 font-medium">
                        <Calendar className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                        <span className="truncate">{formattedDate}</span>
                      </div>
                      {item.problemDetails && (
                        <p
                          className="mt-0.5 truncate text-[10px] text-gray-400"
                          title={item.problemDetails}
                        >
                          {item.problemDetails}
                        </p>
                      )}
                    </td>

                    <td className="px-4 py-3.5 align-middle">
                      <span className="font-bold text-gray-900 text-xs">৳{item.paidAmount}</span>
                      <p
                        className={`text-[10px] font-semibold ${
                          item.paymentStatus === 'PAID' ? 'text-emerald-600' : 'text-amber-600'
                        }`}
                      >
                        {item.paymentStatus}
                      </p>
                    </td>

                    <td className="px-4 py-3.5 align-middle">
                      <span
                        className={`inline-block truncate max-w-full rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${getStatusBadge(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right align-middle">
                      {renderActionButtons(item)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AppointmentViewModal
        appointment={viewingAppointment}
        isOpen={Boolean(viewingAppointment)}
        onClose={() => setViewingAppointment(null)}
      />

      <EditAppointmentModal
        appointment={editingAppointment}
        isOpen={Boolean(editingAppointment)}
        userRole={userRole}
        onClose={() => setEditingAppointment(null)}
        onUpdateStatus={onStatusUpdate}
        loading={actionLoading}
      />
    </>
  )
}