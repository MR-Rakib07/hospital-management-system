'use client'

import React from 'react'
import Image from 'next/image'
import { Edit2, Eye, Loader2, Trash2, UserCheck, UserX } from 'lucide-react'
import { DoctorWithProfile } from '@/redux/doctor/doctorFetchSlice'

interface DoctorTableProps {
  doctors: DoctorWithProfile[]
  actionLoading: boolean
  updatingId: string | null
  deletingId: string | null
  onView: (doctor: DoctorWithProfile) => void
  onEdit: (doctor: DoctorWithProfile) => void
  onToggleAvailability: (id: string, currentStatus: boolean) => void
  onDelete: (id: string) => void
}

export default function DoctorTable({
  doctors,
  actionLoading,
  updatingId,
  deletingId,
  onView,
  onEdit,
  onToggleAvailability,
  onDelete,
}: DoctorTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="border-b border-gray-200 bg-gray-50/75 text-xs font-semibold text-gray-700 uppercase tracking-wider">
            <tr>
              <th scope="col" className="px-6 py-4">Doctor</th>
              <th scope="col" className="px-6 py-4">Department & Specialization</th>
              <th scope="col" className="px-6 py-4">Fee</th>
              <th scope="col" className="px-6 py-4">Status</th>
              <th scope="col" className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {doctors.map((doc) => {
              const profile = doc.doctorProfile
              const isAvailable = Boolean(profile?.isAvailable)
              const isUpdating = updatingId === doc.id && actionLoading
              const isDeleting = deletingId === doc.id && actionLoading

              return (
                <tr key={doc.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-blue-50">
                        <Image
                          src={profile?.image || '/profile.jpg'}
                          alt={doc.fullname}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 leading-tight">
                          {doc.fullname}
                        </p>
                        <p className="text-xs text-gray-400">
                          {profile?.designation || 'Doctor'}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-800">
                      {profile?.department || 'General'}
                    </p>
                    <p className="text-xs text-gray-400 line-clamp-1">
                      {profile?.specialization || 'Consultation'}
                    </p>
                  </td>

                  <td className="px-6 py-4 font-semibold text-gray-900">
                    ৳{profile?.fee ?? 0}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                        isAvailable
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                      <button
                        type="button"
                        onClick={() => onView(doc)}
                        className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                        title="View Full Profile"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">View</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onEdit(doc)}
                        className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition cursor-pointer"
                        title="Edit Doctor"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>

                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => onToggleAvailability(doc.id, isAvailable)}
                        className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer ${
                          isAvailable
                            ? 'border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                            : 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {isUpdating ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : isAvailable ? (
                          <>
                            <UserX className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Set Off</span>
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Set Active</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={() => onDelete(doc.id)}
                        className="inline-flex items-center rounded-lg border border-rose-200 bg-rose-50 p-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition disabled:opacity-50 cursor-pointer"
                        title="Delete Doctor"
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