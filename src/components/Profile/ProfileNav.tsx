'use client'

import { logoutThunk } from '@/redux/auth/logoutSlice'
import { clearProfile } from '@/redux/auth/userprofileSlice'
import { clearSigninState } from '@/redux/auth/signinSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { LogOut, Settings } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

interface ProfileProps {
  className?: string
}

function ProfileNav({ className = '' }: ProfileProps) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { user } = useAppSelector((state) => state.profile)
  const { loading } = useAppSelector((state) => state.logout)

  const handleLogout = async () => {
    await dispatch(logoutThunk())
    dispatch(clearProfile())
    dispatch(clearSigninState())
    router.push('/')
  }

  return (
    <div
      className={`${className} absolute top-5 right-0 w-64 bg-white shadow-xl rounded-xl border border-gray-100 overflow-hidden z-50`}
    >
      <div className="flex items-center gap-3 p-4 border-b border-gray-100 bg-slate-50/50">
        <div className="w-10 h-10 border border-gray-200 overflow-hidden rounded-full flex-shrink-0 bg-gray-100">
          <Image
            src="/profile.jpg"
            alt="User avatar"
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col min-w-0">
          <h2 className="text-sm font-semibold text-gray-800 truncate capitalize">
            {user?.fullname || 'User'}
          </h2>
          <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">
            {user?.role || 'PATIENT'}
          </p>
        </div>
      </div>

      <ul className="p-2 space-y-1">
        <li>
          <Link
            href="/profile"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors text-sm text-gray-700 font-medium"
          >
            <Settings size={16} />
            <span>Profile Settings</span>
          </Link>
        </li>

        <li>
          <button
            type="button"
            disabled={loading}
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors text-sm font-medium cursor-pointer disabled:opacity-50"
          >
            <LogOut size={16} />
            <span>{loading ? 'Logging out...' : 'Logout'}</span>
          </button>
        </li>
      </ul>
    </div>
  )
}

export default ProfileNav