'use client'

import React from 'react'
import type { AppointmentWithRelations } from '@/types/authTypes'
import {
  X,
  User,
  Calendar,
  Stethoscope,
  Video,
  Building,
  CreditCard,
  FileText,
} from 'lucide-react'
import Link from 'next/link'

interface AppointmentViewModalProps {
  appointment: AppointmentWithRelations | null
  isOpen: boolean
  onClose: () => void
}

export default function AppointmentViewModal({
  appointment,
  isOpen,
  onClose,
}: AppointmentViewModalProps) {
  if (!isOpen || !appointment) return null

  const formattedDate = appointment.appointmentDate
    ? new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Not Scheduled'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between border-b border-gray-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-blue-50 px-2.5 py-1 font-mono text-xs font-bold text-blue-700 border border-blue-100">
                {appointment.serialCode || `SL-${appointment.serialNumber}`}
              </span>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  appointment.status === 'CONFIRMED'
                    ? 'bg-blue-100 text-blue-800'
                    : appointment.status === 'COMPLETED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : appointment.status === 'IN_PROGRESS'
                        ? 'bg-purple-100 text-purple-800'
                        : appointment.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                }`}
              >
                {appointment.status}
              </span>
            </div>
            <h3 className="mt-2 text-lg font-bold text-gray-900">
              Appointment Details
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4 text-xs text-gray-600">
          <div className="rounded-xl border border-gray-100 bg-gray-50/75 p-4 space-y-2">
            <h4 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
              <User className="h-4 w-4 text-blue-600" /> Patient Info
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <div>
                <span className="text-gray-400">Name:</span>{' '}
                <strong className="text-gray-800">{appointment.patientName}</strong>
              </div>
              <div>
                <span className="text-gray-400">Phone:</span>{' '}
                <strong className="text-gray-800">{appointment.patientPhone}</strong>
              </div>
              {appointment.patientEmail && (
                <div>
                  <span className="text-gray-400">Email:</span>{' '}
                  <span className="text-gray-800">{appointment.patientEmail}</span>
                </div>
              )}
              <div>
                <span className="text-gray-400">Gender / Age:</span>{' '}
                <span className="text-gray-800">
                  {appointment.patientGender ?? 'N/A'}, {appointment.patientAge ? `${appointment.patientAge} Yrs` : 'Age N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50/75 p-4 space-y-2">
            <h4 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-blue-600" /> Doctor & Chamber
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <div>
                <span className="text-gray-400">Doctor:</span>{' '}
                <strong className="text-gray-800">
                  {appointment.doctor?.user?.fullname ?? 'Assigned Doctor'}
                </strong>
              </div>
              <div>
                <span className="text-gray-400">Department:</span>{' '}
                <span className="text-gray-800">
                  {appointment.doctor?.department ?? 'General'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-blue-500" />
                <span className="text-gray-800">{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {appointment.type === 'ONLINE' ? (
                  <>
                    <Video className="h-3.5 w-3.5 text-purple-600" />
                    <span className="text-purple-700 font-medium">Online Consultation</span>
                  </>
                ) : (
                  <>
                    <Building className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-medium">Chamber (Offline)</span>
                  </>
                )}
              </div>
            </div>

            {appointment.type === 'ONLINE' && appointment.meetingLink && (
              <div className="pt-2 border-t border-gray-200">
                <span className="text-gray-400">Meeting Link: </span>
                <Link
                  href={appointment.meetingLink}
                  target="_blank"
                  className="font-medium text-blue-600 hover:underline break-all"
                >
                  {appointment.meetingLink}
                </Link>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50/75 p-4 space-y-2">
            <h4 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-blue-600" /> Billing Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <div>
                <span className="text-gray-400">Paid Amount:</span>{' '}
                <strong className="text-gray-900">৳{appointment.paidAmount}</strong>
              </div>
              <div>
                <span className="text-gray-400">Payment Status:</span>{' '}
                <span
                  className={`font-semibold ${
                    appointment.paymentStatus === 'PAID' ? 'text-emerald-600' : 'text-amber-600'
                  }`}
                >
                  {appointment.paymentStatus}
                </span>
              </div>
              {appointment.transactionId && (
                <div>
                  <span className="text-gray-400">TxID:</span>{' '}
                  <span className="font-mono text-gray-700">{appointment.transactionId}</span>
                </div>
              )}
            </div>
          </div>

          {appointment.problemDetails && (
            <div className="rounded-xl border border-gray-100 bg-gray-50/75 p-4 space-y-1">
              <h4 className="font-semibold text-gray-800 text-xs flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-blue-600" /> Problem Overview
              </h4>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {appointment.problemDetails}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}