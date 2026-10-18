'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { FileText, Loader2, AlertCircle } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
  fetchMyAppointmentsThunk,
  cancelAppointmentThunk,
  updateAppointmentStatusThunk,
  clearAppointmentMessages,
} from '@/redux/appointment/appointmentSlice'
import { API } from '@/api/API'
import type { UserProfile } from '@/types/user'
import type { AppointmentStatus, AppointmentWithRelations } from '@/types/authTypes'
import AppointmentViewModal from '@/components/appointments/AppointmentsViewModel'
import CancelConfirmModal from '@/components/appointments/CancelConfirmModal'
import EditAppointmentModal from '@/components/appointments/EditAppointmentModal'
import PatientAppointmentEditModal, { type PatientUpdatePayload } from '@/components/appointments/PatientAppointmentEditModal'
import UserProfileOverview from './UserProfileOverview'
import AppointmentCard from './AppointmentCard'

interface ProfileTabProps {
  user?: UserProfile | null
}

export default function ProfileTab({ user }: ProfileTabProps) {
  const dispatch = useAppDispatch()
  const { appointments, loading, actionLoading, error, successMessage } = useAppSelector(
    (state) => state.appointment
  )

  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentWithRelations | null>(null)
  const [appointmentToCancel, setAppointmentToCancel] = useState<AppointmentWithRelations | null>(null)
  const [appointmentToEdit, setAppointmentToEdit] = useState<AppointmentWithRelations | null>(null)
  const [statusAppointmentToEdit, setStatusAppointmentToEdit] = useState<AppointmentWithRelations | null>(null)

  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const [isUpdatingDetails, setIsUpdatingDetails] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)

  useEffect(() => {
    void dispatch(fetchMyAppointmentsThunk())
  }, [dispatch])

  const userRole = user?.role || 'PATIENT'

  const handleOpenCancelModal = (appointment: AppointmentWithRelations) => {
    setAppointmentToCancel(appointment)
  }

  const handleCloseCancelModal = () => {
    if (!cancellingId) {
      setAppointmentToCancel(null)
    }
  }

  const handleConfirmCancel = async () => {
    if (!appointmentToCancel) return

    const id = appointmentToCancel.id
    setCancellingId(id)
    dispatch(clearAppointmentMessages())
    setActionError(null)

    try {
      await dispatch(cancelAppointmentThunk(id)).unwrap()
      setAppointmentToCancel(null)
      setActionSuccess('Appointment cancelled successfully.')
    } catch (err: unknown) {
      setActionError(typeof err === 'string' ? err : 'Failed to cancel appointment.')
    } finally {
      setCancellingId(null)
    }
  }

  const handleOpenEditModal = (appointment: AppointmentWithRelations) => {
    setAppointmentToEdit(appointment)
  }

  const handleCloseEditModal = () => {
    if (!isUpdatingDetails) {
      setAppointmentToEdit(null)
    }
  }

  const handleUpdateDetails = async (payload: PatientUpdatePayload) => {
    setIsUpdatingDetails(true)
    setActionError(null)
    try {
      await API({
        endpoint: `/appointments/${encodeURIComponent(payload.id)}`,
        option: {
          method: 'PATCH',
          body: JSON.stringify(payload),
        },
      })
      setActionSuccess('Appointment details updated successfully.')
      void dispatch(fetchMyAppointmentsThunk())
      setAppointmentToEdit(null)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update appointment details.'
      setActionError(msg)
    } finally {
      setIsUpdatingDetails(false)
    }
  }

  const handleOpenStatusModal = (appointment: AppointmentWithRelations) => {
    setStatusAppointmentToEdit(appointment)
  }

  const handleCloseStatusModal = () => {
    setStatusAppointmentToEdit(null)
  }

  const handleUpdateStatus = async (id: string, status: AppointmentStatus): Promise<void> => {
    dispatch(clearAppointmentMessages())
    try {
      await dispatch(updateAppointmentStatusThunk({ id, status })).unwrap()
    } catch {}
  }

  const displayError = error || actionError
  const displaySuccess = successMessage || actionSuccess

  return (
    <div className="w-full space-y-4 pt-1 sm:space-y-6 sm:pt-2">
      <UserProfileOverview user={user} />

      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-xs sm:p-6">
        <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <h5 className="text-base font-bold text-gray-900 sm:text-lg">My Appointments</h5>
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-600">
              {appointments.length}
            </span>
          </div>

          <Link
            href="/appointment"
            className="rounded-lg bg-[#396CF0] px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#2857d0]"
          >
            + Book New
          </Link>
        </div>

        {displayError && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{displayError}</span>
          </div>
        )}

        {displaySuccess && (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-700">
            {displaySuccess}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Loader2 className="mb-2 h-7 w-7 animate-spin text-[#396CF0]" />
            <span className="text-xs font-medium sm:text-sm">Fetching appointments...</span>
          </div>
        ) : appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-10 text-center">
            <FileText size={40} className="mb-2 text-gray-300" />
            <p className="text-sm font-semibold text-gray-700">No appointments found</p>
            <p className="mt-0.5 text-xs text-gray-400">You haven&apos;t booked any appointments yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            {appointments.map((item) => (
              <AppointmentCard
                key={item.id}
                item={item}
                cancellingId={cancellingId}
                userRole={userRole}
                onViewDetails={setSelectedAppointment}
                onRequestCancel={handleOpenCancelModal}
                onRequestEdit={handleOpenEditModal}
                onRequestEditStatus={handleOpenStatusModal}
              />
            ))}
          </div>
        )}
      </div>

      <AppointmentViewModal
        appointment={selectedAppointment}
        isOpen={Boolean(selectedAppointment)}
        onClose={() => setSelectedAppointment(null)}
      />

      <PatientAppointmentEditModal
        isOpen={Boolean(appointmentToEdit)}
        appointment={appointmentToEdit}
        userRole={userRole}
        loading={isUpdatingDetails}
        onClose={handleCloseEditModal}
        onUpdate={handleUpdateDetails}
      />

      <EditAppointmentModal
        appointment={statusAppointmentToEdit}
        isOpen={Boolean(statusAppointmentToEdit)}
        userRole={userRole}
        loading={actionLoading}
        onClose={handleCloseStatusModal}
        onUpdateStatus={handleUpdateStatus}
      />

      <CancelConfirmModal
        isOpen={Boolean(appointmentToCancel)}
        patientName={appointmentToCancel?.patientName}
        serialCode={
          appointmentToCancel?.serialCode ||
          (appointmentToCancel?.serialNumber ? `SL-${appointmentToCancel.serialNumber}` : null)
        }
        loading={Boolean(cancellingId)}
        onClose={handleCloseCancelModal}
        onConfirm={handleConfirmCancel}
      />
    </div>
  )
}