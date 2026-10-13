'use client'

import React from 'react'
import { AlertTriangle, Loader2, X } from 'lucide-react'

interface CancelConfirmModalProps {
  isOpen: boolean
  patientName?: string
  serialCode?: string | null
  loading: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function CancelConfirmModal({
  isOpen,
  patientName,
  serialCode,
  loading,
  onClose,
  onConfirm,
}: CancelConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl transition-all">
        <div className="flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
            <AlertTriangle className="h-6 w-6" />
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

        <div className="mt-4">
          <h3 className="text-base font-bold text-gray-900">
            Cancel Appointment?
          </h3>
          <p className="mt-1.5 text-xs text-gray-500 leading-relaxed">
            Are you sure you want to cancel the appointment for{' '}
            <strong className="text-gray-800">{patientName || 'this patient'}</strong>
            {serialCode ? ` (${serialCode})` : ''}? This action cannot be undone.
          </p>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2 border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
          >
            Keep Appointment
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 transition disabled:opacity-50 cursor-pointer shadow-xs shadow-rose-200"
          >
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span>Yes, Cancel</span>
          </button>
        </div>
      </div>
    </div>
  )
}