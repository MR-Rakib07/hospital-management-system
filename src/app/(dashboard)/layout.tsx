'use client'

import React, { ReactNode, useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, Loader2 } from 'lucide-react'
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
    <div className="relative flex h-screen overflow-hidden bg-gray-100">
      <header className="fixed top-0 inset-x-0 z-30 flex h-14 items-center border-b border-gray-200 bg-white/90 px-4 backdrop-blur-xs lg:hidden">
        <button
          type="button"
          aria-label="Open sidebar"
          onClick={() => setSidebarOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 active:bg-gray-200 cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="ml-3 text-base font-bold text-blue-600">MediCare</span>
      </header>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
        userRole={userRole}
        userName={user?.fullname || 'User'}
        userEmail={user?.email || ''}
      />

      <main className="flex-1 min-w-0 overflow-y-auto px-4 pt-18 pb-6 sm:px-6 sm:pt-20 sm:pb-8 lg:p-8">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  )
}