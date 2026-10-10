'use client'

import { clearProfile, fetchProfileThunk } from '@/redux/auth/userprofileSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { Role } from '@/types/authTypes'
import {
  CalendarCheck,
  Clock,
  LayoutDashboard,
  LogOut,
  Menu,
  Stethoscope,
  Users,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { ReactNode, useEffect, useState } from 'react'

interface DashboardLayoutProps {
  children: ReactNode
}

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  roles: Role[]
}

const navItems: NavItem[] = [
  {
    label: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['ADMIN', 'DOCTOR'],
  },
  {
    label: 'Appointments',
    href: '/dashboard/appointments',
    icon: CalendarCheck,
    roles: ['ADMIN', 'DOCTOR'],
  },
  {
    label: 'Consultation Queue',
    href: '/dashboard/schedule',
    icon: Clock,
    roles: ['DOCTOR'],
  },
  {
    label: 'Manage Doctors',
    href: '/dashboard/doctors',
    icon: Stethoscope,
    roles: ['ADMIN'],
  },
  {
    label: 'Patients',
    href: '/dashboard/patients',
    icon: Users,
    roles: ['ADMIN'],
  },
]

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const { user, loading, error } = useAppSelector((state) => state.profile)

  useEffect(() => {
    if (!user) {
      dispatch(fetchProfileThunk())
    }
  }, [dispatch, user])

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!loading && (!token || error)) {
      router.push('/login')
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
    router.push('/login')
  }

  if (loading && !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  const userRole = user?.role || 'PATIENT'
  const visibleNavItems = navItems.filter((item) => item.roles.includes(userRole))

  return (
    <div className="flex min-h-screen bg-gray-100">
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6">
          <Link href="/dashboard" className="text-xl font-bold text-blue-600">
            MediCare Portal
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 lg:hidden cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto p-4">
          <div className="mb-4 rounded-lg bg-blue-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Account Role
            </p>
            <p className="font-semibold text-gray-800 line-clamp-1">{user?.fullname || 'User'}</p>
            <span className="inline-block mt-1 rounded bg-blue-200 px-2 py-0.5 text-xs font-semibold text-blue-800">
              {userRole}
            </span>
          </div>

          <nav className="flex-1 space-y-1">
            {visibleNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>

      <div className="flex flex-1 flex-col min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
              {userRole === 'ADMIN' ? 'Hospital Administration' : 'Doctor Portal'}
            </h1>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <span className="hidden sm:inline-block text-xs sm:text-sm text-gray-600 truncate max-w-[150px] md:max-w-[200px]">
              {user?.email}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50/50 px-2.5 py-1.5 sm:px-3 text-xs sm:text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 overflow-x-hidden">{children}</main>
      </div>
    </div>
  )
}