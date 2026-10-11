'use client'

import { clearProfile, fetchProfileThunk } from '@/redux/auth/userprofileSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { Role } from '@/types/authTypes'
import {
  Building2,
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
    label: 'Departments & Roles',
    href: '/dashboard/departments',
    icon: Building2,
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
    <div className="relative flex min-h-screen bg-gray-100">
      {/* Mobile Menu Floating Trigger Button */}
      <button
        type="button"
        aria-label="Open sidebar"
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-40 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-gray-700 shadow-md border border-gray-200 transition-colors hover:bg-gray-50 lg:hidden cursor-pointer"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Backdrop Overlay for Mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity lg:hidden"
        />
      )}

      {/* Full Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo Section */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6">
          <Link href="/dashboard" className="text-xl font-bold text-blue-600 tracking-tight">
            MediCare Portal
          </Link>
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 lg:hidden cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 border-b border-gray-100">
          <div className="rounded-xl bg-blue-50/70 p-3.5 border border-blue-100/60">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                Logged in as
              </span>
              <span className="rounded bg-blue-200 px-1.5 py-0.5 text-[10px] font-bold text-blue-800">
                {userRole}
              </span>
            </div>
            <p className="mt-1 font-semibold text-gray-900 truncate text-sm">
              {user?.fullname || 'User'}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-1.5">
            {visibleNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs font-semibold'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Sidebar Footer - Logout Button */}
        <div className="border-t border-gray-200 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 cursor-pointer"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Page Content */}
      <main className="flex-1 min-w-0 overflow-y-auto px-4 py-16 sm:px-6 sm:py-8 lg:p-8">
        {children}
      </main>
    </div>
  )
}