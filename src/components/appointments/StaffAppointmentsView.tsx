'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
  fetchAppointmentsThunk,
  updateAppointmentStatusThunk,
  cancelAppointmentThunk,
} from '@/redux/appointment/appointmentSlice'
import type { AppointmentStatus } from '@/types/authTypes'
import { Filter, Search, Calendar, RefreshCcw } from 'lucide-react'
import AppointmentsTable from './AppointmentsTable'

const getLocalDateString = (d: Date = new Date()): string => {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const isSameDayMatch = (
  rawDate: string | Date | undefined | null,
  targetDateStr: string
): boolean => {
  if (!rawDate || !targetDateStr) return false

  if (typeof rawDate === 'string') {
    const trimmed = rawDate.trim()
    if (trimmed.startsWith(targetDateStr)) {
      return true
    }
  }

  const d = new Date(rawDate)
  if (isNaN(d.getTime())) return false

  const localFormatted = getLocalDateString(d)
  if (localFormatted === targetDateStr) {
    return true
  }

  const utcFormatted = d.toISOString().split('T')[0]
  if (utcFormatted === targetDateStr) {
    return true
  }

  return false
}

export default function StaffAppointmentsView() {
  const dispatch = useAppDispatch()
  const { appointments, loading, actionLoading } = useAppSelector((state) => state.appointment)

  const todayStr = useMemo(() => getLocalDateString(), [])
  const [selectedDate, setSelectedDate] = useState<string>(todayStr)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL')

  useEffect(() => {
    void dispatch(fetchAppointmentsThunk(undefined))
  }, [dispatch])

  const canModify = (): boolean => true

  const handleStatusUpdate = (id: string, newStatus: AppointmentStatus): void => {
    void dispatch(updateAppointmentStatusThunk({ id, status: newStatus }))
  }

  const handleCancelAppointment = (id: string): void => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      void dispatch(cancelAppointmentThunk(id))
    }
  }

  const sortedAppointments = useMemo(() => {
    return [...appointments].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return dateB - dateA
    })
  }, [appointments])

  const displayedAppointments = useMemo(() => {
    return sortedAppointments.filter((apt) => {
      const isStaffAllowedStatus =
        apt.status === 'PENDING' ||
        apt.status === 'CONFIRMED' ||
        apt.status === 'CANCELLED'

      if (!isStaffAllowedStatus) return false

      const patientName = apt.patientName || apt.patient?.fullname || ''
      const patientPhone = apt.patientPhone || apt.patient?.phone || ''
      const doctorName = apt.doctor?.user?.fullname || ''
      const serialStr = apt.serialNumber ? apt.serialNumber.toString() : ''
      const serialCode = (apt as unknown as { serialCode?: string | null }).serialCode || ''
      const query = searchTerm.trim().toLowerCase()

      const matchesSearch =
        query.length === 0 ||
        patientName.toLowerCase().includes(query) ||
        patientPhone.includes(query) ||
        doctorName.toLowerCase().includes(query) ||
        serialCode.toLowerCase().includes(query) ||
        serialStr === query ||
        `#${serialStr}` === query

      const matchesStatus = selectedStatus === 'ALL' || apt.status === selectedStatus

      let matchesDate = true
      if (selectedDate.length > 0) {
        matchesDate = isSameDayMatch(apt.appointmentDate, selectedDate)
      }

      return matchesSearch && matchesStatus && matchesDate
    })
  }, [sortedAppointments, searchTerm, selectedStatus, selectedDate])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-xl border border-blue-100 bg-white p-4 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by serial code, patient, phone or doctor..."
            className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex items-center">
            <Calendar className="absolute left-3 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="ALL">All Front-Desk Queue</option>
              <option value="PENDING">PENDING</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setSelectedDate(todayStr)}
            className="flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-2 text-xs font-medium text-blue-600 hover:bg-blue-100 transition cursor-pointer"
          >
            Today
          </button>

          {selectedDate && (
            <button
              type="button"
              onClick={() => setSelectedDate('')}
              className="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 transition cursor-pointer"
            >
              <RefreshCcw className="h-3 w-3" />
              <span>Show All Days</span>
            </button>
          )}
        </div>
      </div>

      <AppointmentsTable
        appointments={displayedAppointments}
        loading={loading}
        actionLoading={actionLoading}
        showDoctorColumn={true}
        userRole="STAFF"
        canModify={canModify}
        onStatusUpdate={handleStatusUpdate}
        onCancelAppointment={handleCancelAppointment}
      />
    </div>
  )
}