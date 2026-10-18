'use client'

import React, { useState } from 'react'
import type { AppointmentStatus, AppointmentWithRelations } from '@/types/authTypes'
import {
  Calendar,
  CheckCircle,
  Loader2,
  UserCheck,
  Building,
  XCircle,
  PlayCircle,
  Eye,
  Edit2,
  Edit3,
  Phone,
  Mail,
  Stethoscope,
} from 'lucide-react'
import AppointmentViewModal from '@/components/appointments/AppointmentsViewModel'
import EditAppointmentModal from './EditAppointmentModal'
import PatientAppointmentEditModal, {
  type PatientUpdatePayload,
} from './PatientAppointmentEditModal'

interface AppointmentsTableProps {
  appointments: AppointmentWithRelations[]
  loading: boolean
  actionLoading: boolean
  showDoctorColumn: boolean
  userRole?: 'ADMIN' | 'DOCTOR' | 'STAFF' | string
  canModify: (appointment: AppointmentWithRelations) => boolean
  onStatusUpdate: (id: string, newStatus: AppointmentStatus) => Promise<void>
  onCancelAppointment: (id: string) => void | Promise<void>
  onUpdateDetails?: (payload: PatientUpdatePayload) => Promise<void>
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
  onUpdateDetails,
}: AppointmentsTableProps) {
  const [viewingAppointment, setViewingAppointment] = useState<AppointmentWithRelations | null>(null)
  const [editingAppointment, setEditingAppointment] = useState<AppointmentWithRelations | null>(null)
  const [editingDetailsAppointment, setEditingDetailsAppointment] = useState<AppointmentWithRelations | null>(null)
  
  // নির্দিষ্ট কোন অ্যাপয়েন্টমেন্টটিতে অ্যাকশন চলছে তা ট্র্যাক করার জন্য লোকাল স্টেট
  const [activeActionId, setActiveActionId] = useState<string | null>(null)

  const normalizedRole = userRole.toUpperCase()
  const isManagement = ['ADMIN', 'STAFF'].includes(normalizedRole)

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-blue-50 text-blue-700 border-blue-200/80'
      case 'COMPLETED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
      case 'IN_PROGRESS':
        return 'bg-purple-50 text-purple-700 border-purple-200/80'
      case 'PENDING':
        return 'bg-amber-50 text-amber-700 border-amber-200/80'
      case 'CANCELLED':
      default:
        return 'bg-rose-50 text-rose-700 border-rose-200/80'
    }
  }

  const handleDetailsSubmit = async (payload: PatientUpdatePayload) => {
    if (onUpdateDetails) {
      setActiveActionId(payload.id)
      try {
        await onUpdateDetails(payload)
      } finally {
        setActiveActionId(null)
      }
    }
    setEditingDetailsAppointment(null)
  }

  const executeStatusUpdate = async (id: string, status: AppointmentStatus) => {
    setActiveActionId(id)
    try {
      await onStatusUpdate(id, status)
    } finally {
      setActiveActionId(null)
    }
  }

  const executeCancel = async (id: string) => {
    setActiveActionId(id)
    try {
      await onCancelAppointment(id)
    } finally {
      setActiveActionId(null)
    }
  }

  const renderActionButtons = (item: AppointmentWithRelations) => {
    const hasAccess = canModify(item)
    const canEditDetails = isManagement || (hasAccess && item.status === 'PENDING')
    const isThisItemLoading = activeActionId === item.id && actionLoading

    return (
      <div className="flex items-center justify-end gap-1.5">
        <button
          type="button"
          onClick={() => setViewingAppointment(item)}
          className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
          title="View Details"
        >
          <Eye className="h-4 w-4" />
        </button>

        {canEditDetails && (
          <button
            type="button"
            onClick={() => setEditingDetailsAppointment(item)}
            className="rounded-lg border border-blue-200 bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100 cursor-pointer"
            title="Edit Details"
          >
            <Edit3 className="h-4 w-4" />
          </button>
        )}

        {hasAccess && isManagement && (
          <button
            type="button"
            onClick={() => setEditingAppointment(item)}
            className="rounded-lg border border-indigo-200 bg-indigo-50 p-2 text-indigo-700 transition hover:bg-indigo-100 cursor-pointer"
            title="Update Status"
          >
            <Edit2 className="h-4 w-4" />
          </button>
        )}

        {hasAccess && normalizedRole === 'DOCTOR' && (
          <>
            {item.status === 'CONFIRMED' && (
              <button
                type="button"
                disabled={isThisItemLoading}
                onClick={() => void executeStatusUpdate(item.id, 'IN_PROGRESS')}
                className="rounded-lg bg-purple-600 p-2 text-white transition hover:bg-purple-700 disabled:opacity-50 cursor-pointer"
                title="Start Session"
              >
                {isThisItemLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlayCircle className="h-4 w-4" />}
              </button>
            )}
            {item.status === 'IN_PROGRESS' && (
              <button
                type="button"
                disabled={isThisItemLoading}
                onClick={() => void executeStatusUpdate(item.id, 'COMPLETED')}
                className="rounded-lg bg-emerald-600 p-2 text-white transition hover:bg-emerald-700 disabled:opacity-50 cursor-pointer"
                title="Complete Session"
              >
                {isThisItemLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
              </button>
            )}
          </>
        )}

        {hasAccess && isManagement && (
          <>
            {item.status === 'PENDING' && (
              <button
                type="button"
                disabled={isThisItemLoading}
                onClick={() => void executeStatusUpdate(item.id, 'CONFIRMED')}
                className="rounded-lg bg-blue-600 p-2 text-white transition hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                title="Confirm Appointment"
              >
                {isThisItemLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserCheck className="h-4 w-4" />}
              </button>
            )}
            {normalizedRole === 'ADMIN' && item.status === 'CONFIRMED' && (
              <button
                type="button"
                disabled={isThisItemLoading}
                onClick={() => void executeStatusUpdate(item.id, 'COMPLETED')}
                className="rounded-lg bg-emerald-600 p-2 text-white transition hover:bg-emerald-700 disabled:opacity-50 cursor-pointer"
                title="Complete Appointment"
              >
                {isThisItemLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
              </button>
            )}
            {item.status !== 'CANCELLED' && item.status !== 'COMPLETED' && (
              <button
                type="button"
                disabled={isThisItemLoading}
                onClick={() => void executeCancel(item.id)}
                className="rounded-lg border border-rose-200 bg-rose-50 p-2 text-rose-600 transition hover:bg-rose-100 disabled:opacity-50 cursor-pointer"
                title="Cancel Appointment"
              >
                {isThisItemLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
              </button>
            )}
          </>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-16">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Loading appointments...</span>
      </div>
    )
  }

  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-14 text-center">
        <Calendar className="h-10 w-10 text-slate-300 mb-2" />
        <p className="text-sm font-semibold text-slate-700">No appointments found</p>
        <p className="text-xs text-slate-400 mt-1">Try updating your filters or search criteria.</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-3.5 lg:hidden">
        {appointments.map((item) => {
          const formattedDate = item.appointmentDate
            ? new Date(item.appointmentDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : 'N/A'
          const serial = item.formattedSerialCode || item.serialCode || (item.serialNumber ? `SL-${item.serialNumber}` : null)

          return (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                {serial ? (
                  <span className="rounded-md bg-blue-50 px-2.5 py-1 font-mono text-xs font-bold text-blue-700 border border-blue-100">
                    {serial}
                  </span>
                ) : <div />}
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${getStatusBadge(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
              </div>

              <div className="space-y-1">
                <p className="font-semibold text-slate-900 text-sm">{item.patientName}</p>
                <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-xs text-slate-500">
                  {item.patientPhone && (
                    <span className="flex items-center gap-1 font-mono text-slate-600">
                      <Phone className="h-3 w-3 text-slate-400" />
                      {item.patientPhone}
                    </span>
                  )}
                  {item.patientEmail && (
                    <span className="flex items-center gap-1 truncate max-w-[170px]">
                      <Mail className="h-3 w-3 text-slate-400" />
                      {item.patientEmail}
                    </span>
                  )}
                  {(item.patientAge || item.patientGender) && (
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                      {[item.patientAge ? `${item.patientAge}y` : null, item.patientGender]
                        .filter(Boolean)
                        .join(' • ')}
                    </span>
                  )}
                </div>
              </div>

              {showDoctorColumn && (
                <div className="rounded-xl bg-slate-50 p-2.5 flex items-center gap-2.5 border border-slate-100">
                  <Stethoscope className="h-4 w-4 text-blue-600 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-slate-800">
                      {item.doctor?.user?.fullname || 'Not Assigned'}
                    </p>
                    <p className="truncate text-[11px] text-blue-600 font-medium">
                      {item.doctor?.department || 'General Medicine'}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Schedule</span>
                  <div className="flex items-center gap-1.5 font-medium text-slate-700 mt-0.5">
                    <Calendar className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="mt-1">
                    <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                      <Building className="h-3 w-3 shrink-0" /> Offline (Counter)
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Payment</span>
                  {item.paidAmount !== undefined && (
                    <p className="font-bold text-slate-900 mt-0.5 text-sm">৳{item.paidAmount}</p>
                  )}
                  {item.paymentStatus && (
                    <span
                      className={`inline-block text-[10px] font-semibold ${
                        item.paymentStatus === 'PAID' ? 'text-emerald-600' : 'text-amber-600'
                      }`}
                    >
                      {item.paymentStatus}
                    </span>
                  )}
                </div>
              </div>

              {item.problemDetails && (
                <p className="text-[11px] text-slate-500 line-clamp-2 bg-slate-50 p-2 rounded-lg">
                  <span className="font-semibold text-slate-700">Problem:</span> {item.problemDetails}
                </p>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-[11px] font-medium text-slate-400">Actions</span>
                {renderActionButtons(item)}
              </div>
            </div>
          )
        })}
      </div>

      <div className="hidden lg:block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs sm:text-sm">
            <thead className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3.5">Serial</th>
                <th className="px-5 py-3.5">Patient Details</th>
                <th className="px-5 py-3.5">Type</th>
                {showDoctorColumn && <th className="px-5 py-3.5">Doctor & Dept</th>}
                <th className="px-5 py-3.5">Schedule</th>
                <th className="px-5 py-3.5">Payment</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {appointments.map((item) => {
                const formattedDate = item.appointmentDate
                  ? new Date(item.appointmentDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'N/A'
                const serial = item.formattedSerialCode || item.serialCode || (item.serialNumber ? `SL-${item.serialNumber}` : null)

                return (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap align-middle">
                      {serial ? (
                        <span className="rounded-md bg-blue-50 px-2.5 py-1 font-mono text-[11px] font-bold text-blue-700 border border-blue-100">
                          {serial}
                        </span>
                      ) : (
                        <span className="text-slate-300 font-mono text-xs">—</span>
                      )}
                    </td>

                    <td className="px-5 py-4 align-middle">
                      <p className="font-semibold text-slate-900 leading-tight truncate" title={item.patientName}>
                        {item.patientName}
                      </p>
                      {item.patientPhone && (
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                          <Phone className="h-3 w-3 shrink-0 text-slate-400" />
                          <span className="font-mono">{item.patientPhone}</span>
                        </div>
                      )}
                      <div className="mt-0.5 flex items-center gap-2 text-[11px] text-slate-400">
                        {item.patientEmail && (
                          <span className="truncate max-w-[140px]" title={item.patientEmail}>
                            {item.patientEmail}
                          </span>
                        )}
                        {(item.patientAge || item.patientGender) && (
                          <span className="rounded bg-slate-100 px-1 py-0.2 text-[10px] font-medium text-slate-600">
                            {[item.patientAge ? `${item.patientAge}y` : null, item.patientGender]
                              .filter(Boolean)
                              .join(' • ')}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap align-middle">
                      <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold border bg-emerald-50 text-emerald-700 border-emerald-100">
                        <Building className="h-3 w-3 shrink-0" /> Offline
                      </span>
                    </td>

                    {showDoctorColumn && (
                      <td className="px-5 py-4 align-middle">
                        <p className="font-semibold text-slate-900 text-xs sm:text-sm truncate">
                          {item.doctor?.user?.fullname || 'Not Assigned'}
                        </p>
                        <p className="text-[11px] font-medium text-blue-600 truncate mt-0.5">
                          {item.doctor?.department || 'General Medicine'}
                        </p>
                      </td>
                    )}

                    <td className="px-5 py-4 whitespace-nowrap align-middle">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-800">
                        <Calendar className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                        <span>{formattedDate}</span>
                      </div>
                      {item.problemDetails && (
                        <p className="mt-0.5 truncate text-[11px] text-slate-400 max-w-[130px]" title={item.problemDetails}>
                          {item.problemDetails}
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap align-middle">
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">৳{item.paidAmount}</span>
                      <p
                        className={`text-[10px] font-semibold mt-0.5 ${
                          item.paymentStatus === 'PAID' ? 'text-emerald-600' : 'text-amber-600'
                        }`}
                      >
                        {item.paymentStatus}
                      </p>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap align-middle">
                      <span
                        className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${getStatusBadge(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right whitespace-nowrap align-middle">
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

      <PatientAppointmentEditModal
        appointment={editingDetailsAppointment}
        isOpen={Boolean(editingDetailsAppointment)}
        userRole={userRole}
        loading={actionLoading}
        onClose={() => setEditingDetailsAppointment(null)}
        onUpdate={handleDetailsSubmit}
      />
    </>
  )
}