'use client'

import React, { ReactNode, useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, Loader2, Home } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { clearProfile, fetchProfileThunk } from '@/redux/auth/userprofileSlice'
import { Role } from '@/types/authTypes'
import Sidebar from '@/components/dashboard/Sidebar'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const { user, loading, error } = useAppSelector((state) => state.profile)

  useEffect(() => {
    if (!user) {
      void dispatch(fetchProfileThunk())
    }
  }, [dispatch, user])

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!loading && (!token || error)) {
      router.push('/')
    }
  }, [loading, error, router])

  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('role')
    }
    dispatch(clearProfile())
    router.push('/')
  }

  if (loading && !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    )
  }

  const userRole = (user?.role || 'PATIENT') as Role

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-gray-100">
      {/* Mobile Sticky Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur-md lg:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Open sidebar"
            onClick={(e) => {
              e.stopPropagation()
              setSidebarOpen(true)
            }}
            className="relative z-50 flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-xs hover:bg-gray-50 active:bg-gray-100 pointer-events-auto cursor-pointer"
          >
            <Menu className="h-6 w-6" />
          </button>
          {/* লোগোতে ক্লিক করলে সরাসরি হোমে যাবে */}
          <Link href="/" className="text-lg font-bold text-blue-600 tracking-tight cursor-pointer">
            MediCare
          </Link>
        </div>

        {/* মোবাইলে হোমপেজে দ্রুত যাওয়ার বাটন */}
        <Link
          href="/"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 cursor-pointer"
          title="Back to Home"
        >
          <Home className="h-4 w-4" />
        </Link>
      </header>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
        userRole={userRole}
        userName={user?.fullname || 'User'}
        userEmail={user?.email || ''}
      />

      <main className="flex-1 min-w-0 overflow-y-auto px-4 pt-20 pb-6 sm:px-6 sm:pt-20 sm:pb-8 lg:p-8">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  )
}