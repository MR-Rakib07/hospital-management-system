'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
  fetchAppointmentsThunk,
  updateAppointmentStatusThunk,
  cancelAppointmentThunk,
} from '@/redux/appointment/appointmentSlice'
import type { AppointmentStatus, AppointmentWithRelations } from '@/types/authTypes'
import { Calendar, RefreshCw, Search, X } from 'lucide-react'
import AppointmentsTable from './AppointmentsTable'
import CancelConfirmModal from './CancelConfirmModal'

const getTodayDateString = (): string => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

interface AppointmentsViewProps {
  userRole: 'ADMIN' | 'DOCTOR' | 'STAFF'
}

export default function AppointmentsView({ userRole }: AppointmentsViewProps) {
  const dispatch = useAppDispatch()
  const { appointments, loading, actionLoading } = useAppSelector(
    (state) => state.appointment
  )

  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString())
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [typeFilter, setTypeFilter] = useState<string>('ALL')
  const [targetCancelItem, setTargetCancelItem] = useState<AppointmentWithRelations | null>(null)

  useEffect(() => {
    void dispatch(fetchAppointmentsThunk(selectedDate ? { date: selectedDate } : undefined))
  }, [dispatch, selectedDate])

  const handleStatusUpdate = async (id: string, newStatus: AppointmentStatus) => {
    await dispatch(updateAppointmentStatusThunk({ id, status: newStatus })).unwrap()
  }

  const handleRequestCancel = (id: string) => {
    const item = appointments.find((a) => a.id === id) ?? null
    setTargetCancelItem(item)
  }

  const handleConfirmCancel = async () => {
    if (!targetCancelItem) return
    try {
      await dispatch(cancelAppointmentThunk(targetCancelItem.id)).unwrap()
      setTargetCancelItem(null)
    } catch {
      // Handled by redux state
    }
  }

  const filteredAppointments = useMemo(() => {
    const query = searchTerm.toLowerCase().trim()

    return appointments.filter((item) => {
      if (userRole === 'DOCTOR') {
        if (!['CONFIRMED', 'IN_PROGRESS', 'COMPLETED'].includes(item.status)) {
          return false
        }
      } else if (userRole === 'STAFF') {
        if (!['PENDING', 'CONFIRMED', 'COMPLETED'].includes(item.status)) {
          return false
        }
      }

      const matchesSearch =
        !query ||
        item.serialCode?.toLowerCase().includes(query) ||
        String(item.serialNumber).includes(query) ||
        item.patientName.toLowerCase().includes(query) ||
        item.patientPhone.toLowerCase().includes(query) ||
        Boolean(item.doctor?.user?.fullname && item.doctor.user.fullname.toLowerCase().includes(query)) ||
        Boolean(item.doctor?.department && item.doctor.department.toLowerCase().includes(query))

      const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter
      const matchesType = typeFilter === 'ALL' || item.type === typeFilter

      return matchesSearch && matchesStatus && matchesType
    })
  }, [appointments, searchTerm, statusFilter, typeFilter, userRole])

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-xs space-y-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex items-center">
              <Calendar className="absolute left-3 h-4 w-4 text-blue-600 pointer-events-none" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="rounded-xl border border-blue-200 bg-blue-50/40 py-2 pl-9 pr-3 text-xs font-semibold text-gray-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition cursor-pointer"
              />
            </div>

            <button
              type="button"
              onClick={() => setSelectedDate(getTodayDateString())}
              className={`rounded-xl px-3 py-2 text-xs font-semibold transition cursor-pointer ${
                selectedDate === getTodayDateString()
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Today
            </button>

            {selectedDate && (
              <button
                type="button"
                onClick={() => setSelectedDate('')}
                className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-2.5 py-2 text-xs font-medium text-gray-500 hover:bg-gray-50 transition cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
                <span>All Dates</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 outline-none focus:border-blue-500 shadow-xs cursor-pointer"
            >
              <option value="ALL">All Status</option>
              {userRole === 'ADMIN' && (
                <>
                  <option value="PENDING">PENDING</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </>
              )}
              {userRole === 'STAFF' && (
                <>
                  <option value="PENDING">PENDING</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="COMPLETED">COMPLETED</option>
                </>
              )}
              {userRole === 'DOCTOR' && (
                <>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="COMPLETED">COMPLETED</option>
                </>
              )}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 outline-none focus:border-blue-500 shadow-xs cursor-pointer"
            >
              <option value="ALL">All Types</option>
              <option value="OFFLINE">Offline</option>
              <option value="ONLINE">Online</option>
            </select>

            <button
              type="button"
              onClick={() =>
                void dispatch(
                  fetchAppointmentsThunk(selectedDate ? { date: selectedDate } : undefined)
                )
              }
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition shadow-xs cursor-pointer"
              title="Refresh Records"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by serial code, patient name, phone, or doctor name..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-4 text-xs sm:text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 shadow-xs"
          />
        </div>
      </div>

      <AppointmentsTable
        appointments={filteredAppointments}
        loading={loading}
        actionLoading={actionLoading}
        showDoctorColumn={userRole !== 'DOCTOR'}
        userRole={userRole}
        canModify={() => true}
        onStatusUpdate={handleStatusUpdate}
        onCancelAppointment={handleRequestCancel}
      />

      <CancelConfirmModal
        isOpen={Boolean(targetCancelItem)}
        patientName={targetCancelItem?.patientName}
        serialCode={
          targetCancelItem?.serialCode ||
          (targetCancelItem ? `SL-${targetCancelItem.serialNumber}` : null)
        }
        loading={actionLoading}
        onClose={() => setTargetCancelItem(null)}
        onConfirm={handleConfirmCancel}
      />
    </div>
  )
}