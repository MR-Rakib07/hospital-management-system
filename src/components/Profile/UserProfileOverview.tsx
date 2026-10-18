'use client'

import React from 'react'
import { Calendar, MapPin, Phone, ShieldAlert, User } from 'lucide-react'
import type { UserProfile } from '@/types/user'

interface UserProfileOverviewProps {
  user?: UserProfile | null
}

export default function UserProfileOverview({ user }: UserProfileOverviewProps) {
  const formattedDob = user?.dateOfBirth
    ? new Date(user.dateOfBirth).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Not provided'

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-xs sm:p-6">
      <h5 className="mb-4 border-b border-gray-100 pb-3 text-base font-bold text-gray-900 sm:text-lg">
        Personal Overview
      </h5>

      <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-2 lg:grid-cols-3 sm:text-sm">
        <div className="flex items-start gap-3 min-w-0">
          <div className="rounded-lg bg-blue-50 p-2 text-blue-600 shrink-0">
            <User size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Full Name</p>
            <p className="truncate font-semibold text-gray-800">{user?.fullname || 'Not provided'}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 min-w-0">
          <div className="rounded-lg bg-blue-50 p-2 text-blue-600 shrink-0">
            <Phone size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Phone Number</p>
            <p className="truncate font-semibold text-gray-800">{user?.phone || 'Not provided'}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 min-w-0">
          <div className="rounded-lg bg-blue-50 p-2 text-blue-600 shrink-0">
            <Calendar size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Date of Birth</p>
            <p className="truncate font-semibold text-gray-800">{formattedDob}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 min-w-0">
          <div className="rounded-lg bg-blue-50 p-2 text-blue-600 shrink-0">
            <MapPin size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Present Address</p>
            <p className="line-clamp-2 font-semibold text-gray-800 break-words">
              {user?.presentAddress || 'Not provided'}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 min-w-0">
          <div className="rounded-lg bg-blue-50 p-2 text-blue-600 shrink-0">
            <MapPin size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Permanent Address</p>
            <p className="line-clamp-2 font-semibold text-gray-800 break-words">
              {user?.permanentAddress || 'Not provided'}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 min-w-0">
          <div className="rounded-lg bg-blue-50 p-2 text-blue-600 shrink-0">
            <ShieldAlert size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Emergency Contact</p>
            <p className="line-clamp-2 font-semibold text-gray-800 break-words">
              {user?.emergencyContactName
                ? `${user.emergencyContactName} (${user.emergencyRelation || 'N/A'}) - ${user.emergencyPhone || 'N/A'}`
                : 'Not provided'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}