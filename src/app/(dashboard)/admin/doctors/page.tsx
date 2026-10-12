'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
  clearActionStatus,
  deleteDoctorThunk,
  DoctorWithProfile,
  fetchDoctorsThunk,
  updateDoctorThunk,
  UpdateDoctorPayload,
} from '@/redux/doctor/doctorFetchSlice'
import {
  CheckCircle2,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Stethoscope,
} from 'lucide-react'
import AddDoctorModal from '@/components/doctors/AddDoctorModal'
import DoctorTable from '@/components/doctors/DoctorTable'
import DoctorViewModal from '@/components/doctors/DoctorViewModal'
import EditDoctorModal from '@/components/doctors/EditDoctorModal'

export default function AdminDoctorManagePage() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.profile)
  const { doctors, loading, error, actionLoading, successMessage } = useAppSelector(
    (state) => state.doctors
  )

  const [searchTerm, setSearchTerm] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [viewDoctor, setViewDoctor] = useState<DoctorWithProfile | null>(null)
  const [editingDoctor, setEditingDoctor] = useState<DoctorWithProfile | null>(null)

  useEffect(() => {
    void dispatch(fetchDoctorsThunk())
  }, [dispatch])

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearActionStatus())
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [successMessage, dispatch])

  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    setUpdatingId(id)
    try {
      await dispatch(
        updateDoctorThunk({
          id,
          data: { isAvailable: !currentStatus },
        })
      ).unwrap()
    } finally {
      setUpdatingId(null)
    }
  }

  const handleUpdateDoctor = async (id: string, data: UpdateDoctorPayload) => {
    try {
      await dispatch(updateDoctorThunk({ id, data })).unwrap()
      setEditingDoctor(null)
    } catch {
      // Error handled by redux slice actionError
    }
  }

  const handleDeleteDoctor = async (id: string) => {
    const isConfirmed = window.confirm('Are you sure you want to remove this doctor?')
    if (!isConfirmed) return

    setDeletingId(id)
    try {
      await dispatch(deleteDoctorThunk(id)).unwrap()
    } finally {
      setDeletingId(null)
    }
  }

  const filteredDoctors = useMemo(() => {
    const query = searchTerm.toLowerCase().trim()
    if (!query) return doctors

    return doctors.filter((doc) => {
      const fullName = doc.fullname || ''
      const department = doc.doctorProfile?.department || ''
      const specialization = doc.doctorProfile?.specialization || ''

      return (
        fullName.toLowerCase().includes(query) ||
        department.toLowerCase().includes(query) ||
        specialization.toLowerCase().includes(query)
      )
    })
  }, [doctors, searchTerm])

  if (user?.role !== 'ADMIN') {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center text-sm font-medium text-rose-800">
        Only hospital administrators can manage doctor profiles and availability.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Doctor Directory & Chambers</h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Control doctor records, fees, chamber details, and live availability
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => dispatch(fetchDoctorsThunk())}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-xs hover:bg-gray-50 transition cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Register Doctor</span>
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs sm:text-sm text-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by doctor name, department, or specialization..."
          className="w-full rounded-xl border border-blue-100 bg-white py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-xs"
        />
      </div>

      {loading && doctors.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-200 bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm font-medium text-gray-500">Loading doctor profiles...</p>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-700">
          <p className="font-semibold">{error}</p>
          <button
            type="button"
            onClick={() => dispatch(fetchDoctorsThunk())}
            className="mt-3 inline-flex items-center rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 transition cursor-pointer"
          >
            Try Again
          </button>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="rounded-xl border border-blue-50 bg-white p-12 text-center shadow-xs">
          <Stethoscope className="mx-auto h-10 w-10 text-gray-300" />
          <h3 className="mt-2 text-sm font-bold text-gray-700">No doctors found</h3>
          <p className="mt-1 text-xs text-gray-400">
            {searchTerm
              ? 'Try adjusting your search criteria.'
              : 'No doctors are currently registered.'}
          </p>
        </div>
      ) : (
        <DoctorTable
          doctors={filteredDoctors}
          actionLoading={actionLoading}
          updatingId={updatingId}
          deletingId={deletingId}
          onView={(doc) => setViewDoctor(doc)}
          onEdit={(doc) => setEditingDoctor(doc)}
          onToggleAvailability={toggleAvailability}
          onDelete={handleDeleteDoctor}
        />
      )}

      <AddDoctorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <DoctorViewModal
        doctor={viewDoctor}
        onClose={() => setViewDoctor(null)}
      />

      <EditDoctorModal
        doctor={editingDoctor}
        isOpen={Boolean(editingDoctor)}
        onClose={() => setEditingDoctor(null)}
        onUpdate={handleUpdateDoctor}
        loading={actionLoading}
      />
    </div>
  )
}