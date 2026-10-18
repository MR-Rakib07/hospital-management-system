'use client'

import React, { useEffect, useState, useMemo, useCallback } from 'react'
import Image from 'next/image'
import {
  Calendar,
  Droplets,
  Heart,
  MapPin,
  Phone,
  ShieldAlert,
  User,
  Loader2,
} from 'lucide-react'
import Container from '@/utils/Container'
import ProfileTab from '@/components/Profile/ProfileTab'
import ProfileSettings from '@/components/Profile/ProfileSettings'
import { fetchProfileThunk } from '@/redux/auth/userprofileSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'

const formatDisplayDate = (dateStr?: string | null): string => {
  if (!dateStr) return 'Not Set'
  const dateOnly = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr
  const [year, month, day] = dateOnly.split('-')
  if (!year || !month || !day) return 'Not Set'

  const dateObj = new Date(Number(year), Number(month) - 1, Number(day))
  if (Number.isNaN(dateObj.getTime())) return 'Not Set'

  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function Profile() {
  const dispatch = useAppDispatch()
  const { user, loading } = useAppSelector((state) => state.profile)
  const [isProfile, setProfile] = useState<boolean>(true)

  useEffect(() => {
    void dispatch(fetchProfileThunk())
  }, [dispatch])

  const handleProfileRefresh = useCallback(() => {
    void dispatch(fetchProfileThunk())
  }, [dispatch])

  const completionPercentage = useMemo(() => {
    if (!user) return 0
    const fields = [
      user.fullname,
      user.email,
      user.phone,
      user.gender,
      user.dateOfBirth,
      user.bloodGroup,
      user.maritalStatus,
      user.presentAddress,
      user.permanentAddress,
      user.emergencyContactName,
      user.emergencyPhone,
    ]
    const filled = fields.filter((val) => typeof val === 'string' && val.trim().length > 0).length
    return Math.round((filled / fields.length) * 100)
  }, [user])

  const profileData = useMemo(() => {
    return [
      {
        label: 'Gender',
        value: user?.gender
          ? user.gender.charAt(0) + user.gender.slice(1).toLowerCase()
          : 'Not Set',
        icon: <User size={18} className="text-blue-600" />,
      },
      {
        label: 'Birthday',
        value: formatDisplayDate(user?.dateOfBirth),
        icon: <Calendar size={18} className="text-blue-600" />,
      },
      {
        label: 'Phone No.',
        value: user?.phone || 'Not Set',
        icon: <Phone size={18} className="text-blue-600" />,
      },
      {
        label: 'Blood Group',
        value: user?.bloodGroup ? user.bloodGroup.replace('_', ' ') : 'Not Set',
        icon: <Droplets size={18} className="text-blue-600" />,
      },
      {
        label: 'Marital Status',
        value: user?.maritalStatus
          ? user.maritalStatus.charAt(0) + user.maritalStatus.slice(1).toLowerCase()
          : 'Not Set',
        icon: <Heart size={18} className="text-blue-600" />,
      },
      {
        label: 'Present Address',
        value: user?.presentAddress || 'Not Set',
        icon: <MapPin size={18} className="text-blue-600" />,
      },
      {
        label: 'Emergency',
        value: user?.emergencyPhone || 'Not Set',
        icon: <ShieldAlert size={18} className="text-blue-600" />,
      },
    ]
  }, [user])

  return (
    <section className="my-6 sm:my-10">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">
          <div className="w-full border border-gray-200 rounded-2xl bg-white shadow-xs overflow-hidden">
            <div className="w-full h-32 relative bg-slate-100">
              <Image
                src="/bg-profile.jpg"
                fill
                alt="Profile cover banner"
                className="w-full h-full object-cover"
                priority
              />
              <div className="w-20 h-20 absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2 rounded-full border-4 border-white shadow-md bg-gray-100 overflow-hidden">
                <Image
                  src="/profile.jpg"
                  fill
                  alt="Profile picture"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex flex-col items-center pt-13 pb-4 px-4 text-center">
              <h4 className="text-base sm:text-lg font-bold text-gray-800 capitalize">
                {loading && !user ? (
                  <span className="inline-flex items-center gap-1.5 text-gray-400">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    <span>Loading...</span>
                  </span>
                ) : (
                  user?.fullname || 'User Name'
                )}
              </h4>
              <p className="text-xs sm:text-sm font-medium text-gray-500 lowercase mt-0.5">
                {user?.email || 'user@example.com'}
              </p>
              <span className="mt-2.5 px-3 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-600 uppercase tracking-wide border border-blue-100">
                {user?.role || 'PATIENT'}
              </span>
            </div>

            <hr className="border-gray-100" />

            <div className="p-5 sm:p-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xs sm:text-sm font-bold text-gray-800">
                  Profile Completion
                </h2>
                <span className="text-xs sm:text-sm font-bold text-blue-600">
                  {completionPercentage}%
                </span>
              </div>
              
              <div className="w-full bg-gray-100 rounded-full h-2 mb-6 overflow-hidden">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>

              <div className="space-y-3.5">
                {profileData.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 text-sm">
                    <div className="shrink-0 w-8 h-8 rounded-xl bg-blue-50/80 flex items-center justify-center border border-blue-100/50">
                      {item.icon}
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-gray-400 text-[11px] font-medium leading-none">
                        {item.label}
                      </span>
                      <span
                        className="text-gray-800 font-semibold text-xs sm:text-sm truncate mt-1"
                        title={item.value}
                      >
                        {item.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full border border-gray-200 rounded-2xl bg-white shadow-xs overflow-hidden min-h-[600px] flex flex-col">
            <div className="flex items-center border-b border-gray-200 bg-gray-50/75 p-1.5 gap-1.5">
              <button
                type="button"
                onClick={() => setProfile(true)}
                className={`flex-1 py-2.5 sm:py-3 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                  isProfile
                    ? 'text-white bg-blue-600 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 bg-transparent'
                }`}
              >
                Profile Overview
              </button>
              <button
                type="button"
                onClick={() => setProfile(false)}
                className={`flex-1 py-2.5 sm:py-3 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                  !isProfile
                    ? 'text-white bg-blue-600 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 bg-transparent'
                }`}
              >
                Profile Settings
              </button>
            </div>

            <div className="p-4 sm:p-6 lg:p-8 flex-1">
              {isProfile ? (
                <ProfileTab user={user} />
              ) : (
                <ProfileSettings user={user} onUpdate={handleProfileRefresh} />
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}