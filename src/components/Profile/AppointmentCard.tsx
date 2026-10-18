'use client'

import React from 'react'
import {
  Calendar,
  Clock,
  Building,
  Eye,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  Edit3,
  ShieldCheck,
} from 'lucide-react'
import type { AppointmentStatus, AppointmentWithRelations } from '@/types/authTypes'

interface AppointmentCardProps {
  item: AppointmentWithRelations
  cancellingId: string | null
  userRole?: string
  onViewDetails: (appointment: AppointmentWithRelations) => void
  onRequestCancel: (appointment: AppointmentWithRelations) => void
  onRequestEdit: (appointment: AppointmentWithRelations) => void
  onRequestEditStatus?: (appointment: AppointmentWithRelations) => void
}

const getStatusBadge = (status: AppointmentStatus): string => {
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

export default function AppointmentCard({
  item,
  cancellingId,
  userRole = 'PATIENT',
  onViewDetails,
  onRequestCancel,
  onRequestEdit,
  onRequestEditStatus,
}: AppointmentCardProps) {
  const isCancelling = cancellingId === item.id
  const formattedDate = item.appointmentDate
    ? new Date(item.appointmentDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'N/A'

  const normalizedRole = userRole.toUpperCase()
  const isAdminOrStaff = ['ADMIN', 'STAFF'].includes(normalizedRole)
  const canManageStatus = ['ADMIN', 'DOCTOR', 'STAFF'].includes(normalizedRole)
  const canEditDetails = isAdminOrStaff || item.status === 'PENDING'
  const serial = item.formattedSerialCode || item.serialCode || (item.serialNumber ? `SL-${item.serialNumber}` : null)

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-3.5 transition-all hover:border-blue-200 hover:shadow-xs sm:flex-row sm:items-center sm:p-4">
      <div className="space-y-1.5 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          {serial && (
            <span className="rounded bg-blue-50 px-2 py-0.5 font-mono text-[11px] font-bold text-blue-700 border border-blue-100">
              {serial}
            </span>
          )}

          <h6 className="truncate text-xs font-bold text-gray-900 sm:text-sm">
            {item.doctor?.user?.fullname ? `Dr. ${item.doctor.user.fullname}` : 'Doctor Assigned'}
          </h6>

          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${getStatusBadge(item.status)}`}>
            {item.status}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
          <span className="font-semibold text-blue-600">
            {item.doctor?.department || 'General Medicine'}
          </span>
          <span>•</span>
          <span className="text-gray-700 font-medium">Patient: {item.patientName}</span>
          <span>•</span>
          <span className="text-gray-600 font-mono text-[11px]">{item.patientPhone}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-700">
            <Building className="h-3 w-3 shrink-0" /> In-Clinic (Offline)
          </span>

          <span className="text-[11px] font-semibold text-gray-700">
            Payment: <strong className={item.paymentStatus === 'PAID' ? 'text-emerald-600' : 'text-amber-600'}>{item.paymentStatus || 'UNPAID'}</strong> (৳{item.paidAmount ?? 0})
          </span>

          {item.prescription && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
              <CheckCircle2 className="h-3 w-3" /> Prescription Ready
            </span>
          )}
        </div>

        <div className="pt-1">
          {item.status === 'PENDING' && (
            <p className="flex items-center gap-1 text-[11px] font-medium text-amber-600">
              <AlertCircle size={12} className="shrink-0" />
              <span>Warning: Cancellation is only allowed while status is PENDING. Once CONFIRMED, it cannot be cancelled.</span>
            </p>
          )}
          {item.status === 'CONFIRMED' && !isAdminOrStaff && (
            <p className="flex items-center gap-1 text-[11px] font-medium text-blue-600">
              <AlertCircle size={12} className="shrink-0" />
              <span>This appointment is confirmed and cannot be cancelled.</span>
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 sm:mt-0 sm:flex-col sm:items-end sm:justify-center sm:border-t-0 sm:pt-0 sm:text-right">
        <div className="space-y-0.5 text-xs text-gray-500">
          <div className="flex items-center gap-1.5 font-medium text-gray-700 sm:justify-end">
            <Calendar size={13} className="text-blue-500" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] sm:justify-end">
            <Clock size={12} className="text-gray-400" />
            <span>Chamber Time</span>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2 sm:mt-2.5">
          {canManageStatus && onRequestEditStatus && (
            <button
              type="button"
              onClick={() => onRequestEditStatus(item)}
              className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
            >
              <ShieldCheck size={13} />
              <span>Status</span>
            </button>
          )}

          {canEditDetails && (
            <button
              type="button"
              onClick={() => onRequestEdit(item)}
              className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600 transition hover:bg-blue-100"
            >
              <Edit3 size={13} />
              <span>{isAdminOrStaff ? 'Edit Info' : 'Edit'}</span>
            </button>
          )}

          {item.status === 'PENDING' && (
            <button
              type="button"
              disabled={isCancelling}
              onClick={() => onRequestCancel(item)}
              className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCancelling ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Cancelling...</span>
                </>
              ) : (
                <>
                  <XCircle size={13} />
                  <span>Cancel</span>
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={() => onViewDetails(item)}
            className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            <Eye size={13} /> Details
          </button>
        </div>
      </div>
    </div> 
  )
}