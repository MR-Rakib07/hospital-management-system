'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
  clearStaffMessages,
  deleteStaffThunk,
  fetchStaffsThunk,
  StaffUser,
  updateStaffThunk,
  UpdateStaffPayload,
} from '@/redux/staff/staffSlice'
import {
  CheckCircle2,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Users,
} from 'lucide-react'
import AddStaffModal from '@/components/staff/AddStaffModal'
import EditStaffModal from '@/components/staff/EditStaffModal'
import StaffTable from '@/components/staff/StaffTable'
import StaffViewModal from '@/components/staff/StaffViewModal'

export default function AdminStaffManagePage() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.profile)
  const { staffs, loading, error, actionLoading, successMessage } = useAppSelector(
    (state) => state.staff
  )

  const [searchTerm, setSearchTerm] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [viewStaff, setViewStaff] = useState<StaffUser | null>(null)
  const [editingStaff, setEditingStaff] = useState<StaffUser | null>(null)

  useEffect(() => {
    void dispatch(fetchStaffsThunk())
  }, [dispatch])

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearStaffMessages())
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [successMessage, dispatch])

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    setUpdatingId(id)
    try {
      await dispatch(
        updateStaffThunk({
          id,
          data: { isActive: !currentStatus },
        })
      ).unwrap()
    } finally {
      setUpdatingId(null)
    }
  }

  const handleUpdateStaff = async (id: string, data: UpdateStaffPayload) => {
    try {
      await dispatch(updateStaffThunk({ id, data })).unwrap()
      setEditingStaff(null)
    } catch {
      // Handled by redux slice
    }
  }

  const handleDeleteStaff = async (id: string) => {
    const isConfirmed = window.confirm('Are you sure you want to remove this staff member?')
    if (!isConfirmed) return

    setDeletingId(id)
    try {
      await dispatch(deleteStaffThunk(id)).unwrap()
    } finally {
      setDeletingId(null)
    }
  }

  const filteredStaffs = useMemo(() => {
    const query = searchTerm.toLowerCase().trim()
    if (!query) return staffs

    return staffs.filter((staff) => {
      const fullName = staff.fullname || ''
      const email = staff.email || ''
      const department = staff.staffProfile?.department || ''
      const counter = staff.staffProfile?.counterNumber || ''

      return (
        fullName.toLowerCase().includes(query) ||
        email.toLowerCase().includes(query) ||
        department.toLowerCase().includes(query) ||
        counter.toLowerCase().includes(query)
      )
    })
  }, [staffs, searchTerm])

  if (user?.role !== 'ADMIN') {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center text-sm font-medium text-rose-800">
        Only administrators can access staff management.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Hospital Staff Directory</h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Control service staff, counter assignments, and front-desk accounts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => dispatch(fetchStaffsThunk())}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-xs hover:bg-gray-50 transition cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-700 transition cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Register Staff</span>
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
          placeholder="Search by name, email, department, or counter number..."
          className="w-full rounded-xl border border-indigo-100 bg-white py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-xs"
        />
      </div>

      {loading && staffs.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-200 bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm font-medium text-gray-500">Loading staff directory...</p>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-700">
          <p className="font-semibold">{error}</p>
          <button
            type="button"
            onClick={() => dispatch(fetchStaffsThunk())}
            className="mt-3 inline-flex items-center rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 transition cursor-pointer"
          >
            Try Again
          </button>
        </div>
      ) : filteredStaffs.length === 0 ? (
        <div className="rounded-xl border border-indigo-50 bg-white p-12 text-center shadow-xs">
          <Users className="mx-auto h-10 w-10 text-gray-300" />
          <h3 className="mt-2 text-sm font-bold text-gray-700">No staff found</h3>
          <p className="mt-1 text-xs text-gray-400">
            {searchTerm ? 'Try adjusting your search criteria.' : 'No staff members registered yet.'}
          </p>
        </div>
      ) : (
        <StaffTable
          staffs={filteredStaffs}
          actionLoading={actionLoading}
          updatingId={updatingId}
          deletingId={deletingId}
          onView={(s) => setViewStaff(s)}
          onEdit={(s) => setEditingStaff(s)}
          onToggleStatus={toggleStatus}
          onDelete={handleDeleteStaff}
        />
      )}

      <AddStaffModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <StaffViewModal
        staff={viewStaff}
        onClose={() => setViewStaff(null)}
      />

      <EditStaffModal
        staff={editingStaff}
        isOpen={Boolean(editingStaff)}
        onClose={() => setEditingStaff(null)}
        onUpdate={handleUpdateStaff}
        loading={actionLoading}
      />
    </div>
  )
}