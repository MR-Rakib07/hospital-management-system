'use client'

import React from 'react'
import {
  X,
  Mail,
  Phone,
  Building2,
  MapPin,
  ShieldCheck,
  LayoutGrid,
  HeartHandshake,
} from 'lucide-react'
import { StaffUser } from '@/redux/staff/staffSlice'

interface StaffViewModalProps {
  staff: StaffUser | null
  onClose: () => void
}

export default function StaffViewModal({ staff, onClose }: StaffViewModalProps) {
  if (!staff) return null

  const profile = staff.staffProfile

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{staff.fullname}</h3>
            <p className="text-xs font-medium text-indigo-600">
              {profile?.department || 'Staff'}{' '}
              {profile?.counterNumber ? `• ${profile.counterNumber}` : ''}
            </p>
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

        <div className="mt-5 space-y-3 text-xs text-gray-600">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 shrink-0 text-indigo-500" />
            <span className="font-medium text-gray-800">{staff.email}</span>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 shrink-0 text-indigo-500" />
            <span className="font-medium text-gray-800">{staff.phone}</span>
          </div>

          <div className="flex items-center gap-3">
            <Building2 className="h-4 w-4 shrink-0 text-indigo-500" />
            <span>Department: <strong className="text-gray-800">{profile?.department || 'Not Assigned'}</strong></span>
          </div>

          <div className="flex items-center gap-3">
            <LayoutGrid className="h-4 w-4 shrink-0 text-indigo-500" />
            <span>Counter No: <strong className="text-gray-800">{profile?.counterNumber || 'N/A'}</strong></span>
          </div>

          {staff.gender && (
            <div className="flex items-center gap-3">
              <span className="h-4 w-4 shrink-0 font-bold text-indigo-500 text-center">⚧</span>
              <span>Gender: <strong className="text-gray-800">{staff.gender}</strong></span>
            </div>
          )}

          {staff.presentAddress && (
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 shrink-0 text-indigo-500" />
              <span>Address: <strong className="text-gray-800">{staff.presentAddress}</strong></span>
            </div>
          )}

          {staff.emergencyPhone && (
            <div className="flex items-center gap-3">
              <HeartHandshake className="h-4 w-4 shrink-0 text-indigo-500" />
              <span>
                Emergency: <strong className="text-gray-800">{staff.emergencyContactName || 'N/A'}</strong> ({staff.emergencyRelation || 'Relation'}) - {staff.emergencyPhone}
              </span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <ShieldCheck className="h-4 w-4 shrink-0 text-indigo-500" />
            <span>
              Account Status:{' '}
              <strong className={staff.isActive ? 'text-emerald-600' : 'text-rose-600'}>
                {staff.isActive ? 'Active' : 'Inactive'}
              </strong>
            </span>
          </div>
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