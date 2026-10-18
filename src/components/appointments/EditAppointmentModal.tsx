'use client'

import React, { useState, useEffect } from 'react'
import type { AppointmentStatus, AppointmentWithRelations } from '@/types/authTypes'
import { X, Loader2 } from 'lucide-react'
import type { CounterPaymentStatus } from '@/redux/appointment/appointmentSlice'

interface EditAppointmentModalProps {
  appointment: AppointmentWithRelations | null
  isOpen: boolean
  userRole?: 'ADMIN' | 'DOCTOR' | 'STAFF' | string
  onClose: () => void
  onUpdateStatus: (
    id: string,
    status: AppointmentStatus,
    paymentStatus?: CounterPaymentStatus,
    paidAmount?: number
  ) => Promise<void>
  loading: boolean
}

export default function EditAppointmentModal({
  appointment,
  isOpen,
  userRole = 'ADMIN',
  onClose,
  onUpdateStatus,
  loading,
}: EditAppointmentModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<AppointmentStatus>('PENDING')
  const [paymentStatus, setPaymentStatus] = useState<CounterPaymentStatus>('UNPAID')
  const [paidAmount, setPaidAmount] = useState<string>('0')

  useEffect(() => {
    if (appointment) {
      setSelectedStatus(appointment.status)
      setPaymentStatus(appointment.paymentStatus || 'UNPAID')
      setPaidAmount(String(appointment.paidAmount ?? 0))
    }
  }, [appointment])

  if (!isOpen || !appointment) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onUpdateStatus(
      appointment.id,
      selectedStatus,
      paymentStatus,
      paidAmount ? Number(paidAmount) : 0
    )
    onClose()
  }

  const serial = appointment.formattedSerialCode || appointment.serialCode || (appointment.serialNumber ? `SL-${appointment.serialNumber}` : null)
  const isManagement = ['ADMIN', 'STAFF'].includes(userRole.toUpperCase())

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900">Update Appointment & Payment</h3>
            {serial && (
              <p className="text-xs text-gray-500 font-mono mt-0.5">
                Serial: {serial}
              </p>
            )}
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

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700">Patient</label>
            <p className="mt-1 text-sm font-medium text-gray-800">{appointment.patientName}</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700">Select Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as AppointmentStatus)}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              {userRole.toUpperCase() === 'ADMIN' && (
                <>
                  <option value="PENDING">PENDING</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </>
              )}
              {userRole.toUpperCase() === 'STAFF' && (
                <>
                  <option value="PENDING">PENDING</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="COMPLETED">COMPLETED</option>
                </>
              )}
              {userRole.toUpperCase() === 'DOCTOR' && (
                <>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="COMPLETED">COMPLETED</option>
                </>
              )}
            </select>
          </div>

          {isManagement && (
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
              <div>
                <label className="block text-xs font-semibold text-gray-700">Payment Status</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as CounterPaymentStatus)}
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="UNPAID">UNPAID</option>
                  <option value="PAID">PAID</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">Paid Amount (৳)</label>
                <input
                  type="number"
                  min="0"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end gap-2 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
            >
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}