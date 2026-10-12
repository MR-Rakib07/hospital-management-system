'use client'

import React from 'react'
import { Edit2, Eye, Loader2, Trash2, UserCheck, UserX } from 'lucide-react'
import { StaffUser } from '@/redux/staff/staffSlice'

interface StaffTableProps {
  staffs: StaffUser[]
  actionLoading: boolean
  updatingId: string | null
  deletingId: string | null
  onView: (staff: StaffUser) => void
  onEdit: (staff: StaffUser) => void
  onToggleStatus: (id: string, currentStatus: boolean) => void
  onDelete: (id: string) => void
}

export default function StaffTable({
  staffs,
  actionLoading,
  updatingId,
  deletingId,
  onView,
  onEdit,
  onToggleStatus,
  onDelete,
}: StaffTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="border-b border-gray-200 bg-gray-50/75 text-xs font-semibold text-gray-700 uppercase tracking-wider">
            <tr>
              <th scope="col" className="px-6 py-4">Staff Member</th>
              <th scope="col" className="px-6 py-4">Department</th>
              <th scope="col" className="px-6 py-4">Counter Number</th>
              <th scope="col" className="px-6 py-4">Status</th>
              <th scope="col" className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {staffs.map((staff) => {
              const profile = staff.staffProfile
              const isActive = staff.isActive
              const isUpdating = updatingId === staff.id && actionLoading
              const isDeleting = deletingId === staff.id && actionLoading

              return (
                <tr key={staff.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900 leading-tight">
                      {staff.fullname}
                    </p>
                    <p className="text-xs text-gray-400">{staff.email} • {staff.phone}</p>
                  </td>

                  <td className="px-6 py-4 font-medium text-gray-800">
                    {profile?.department || 'General'}
                  </td>

                  <td className="px-6 py-4">
                    {profile?.counterNumber ? (
                      <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 border border-indigo-100">
                        {profile.counterNumber}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">Not Assigned</span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                      <button
                        type="button"
                        onClick={() => onView(staff)}
                        className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">View</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onEdit(staff)}
                        className="inline-flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition cursor-pointer"
                        title="Edit Staff"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>

                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => onToggleStatus(staff.id, isActive)}
                        className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer ${
                          isActive
                            ? 'border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                            : 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {isUpdating ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : isActive ? (
                          <>
                            <UserX className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Deactivate</span>
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Activate</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={() => onDelete(staff.id)}
                        className="inline-flex items-center rounded-lg border border-rose-200 bg-rose-50 p-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition disabled:opacity-50 cursor-pointer"
                        title="Delete Staff"
                      >
                        {isDeleting ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}