'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Role } from '@/types/authTypes'
import {
  Building2,
  CalendarCheck,
  Clock,
  LayoutDashboard,
  LogOut,
  Stethoscope,
  UserCog,
  Users,
  X,
  UserCheck,
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  roles: Role[]
}

const navItems: NavItem[] = [
  {
    label: 'Overview',
    href: '/admin',
    icon: LayoutDashboard,
    roles: ['ADMIN'],
  },
  {
    label: 'Appointments',
    href: '/admin/appointments',
    icon: CalendarCheck,
    roles: ['ADMIN'],
  },
  {
    label: 'Manage Doctors',
    href: '/admin/doctors',
    icon: Stethoscope,
    roles: ['ADMIN'],
  },
  {
    label: 'Manage Staff',
    href: '/admin/staffs',
    icon: UserCog,
    roles: ['ADMIN'],
  },
  {
    label: 'Departments & Roles',
    href: '/admin/departments',
    icon: Building2,
    roles: ['ADMIN'],
  },
  {
    label: 'Patients',
    href: '/admin/patients',
    icon: Users,
    roles: ['ADMIN'],
  },
  {
    label: 'Overview',
    href: '/doctor',
    icon: LayoutDashboard,
    roles: ['DOCTOR'],
  },
  {
    label: 'My Appointments',
    href: '/doctor/appointments',
    icon: CalendarCheck,
    roles: ['DOCTOR'],
  },
  {
    label: 'Consultation Queue',
    href: '/doctor/schedule',
    icon: Clock,
    roles: ['DOCTOR'],
  },
  {
    label: 'Overview',
    href: '/staff',
    icon: LayoutDashboard,
    roles: ['STAFF'],
  },
  {
    label: 'Counter Desk',
    href: '/staff/appointments',
    icon: CalendarCheck,
    roles: ['STAFF'],
  },
  {
    label: 'Patient Verification',
    href: '/staff/verification',
    icon: UserCheck,
    roles: ['STAFF'],
  },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  onLogout: () => void
  userRole: Role
  userName: string
  userEmail: string
}

export default function Sidebar({
  isOpen,
  onClose,
  onLogout,
  userRole,
  userName,
  userEmail,
}: SidebarProps) {
  const pathname = usePathname()

  const brandHomeHref = useMemo(() => {
    if (userRole === 'ADMIN') return '/admin'
    if (userRole === 'DOCTOR') return '/doctor'
    if (userRole === 'STAFF') return '/staff'
    return '/'
  }, [userRole])

  const visibleNavItems = useMemo(() => {
    return navItems.filter((item) => item.roles.includes(userRole))
  }, [userRole])

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-xs transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-72 sm:w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out lg:static lg:h-screen lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl lg:shadow-none' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 px-6">
          <Link
            href={brandHomeHref}
            onClick={onClose}
            className="text-xl font-bold text-blue-600 tracking-tight"
          >
            MediCare Portal
          </Link>
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 active:bg-gray-200 lg:hidden cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-100 shrink-0">
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
              {userName}
            </p>
            <p className="text-xs text-gray-500 truncate">{userEmail}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 overscroll-contain">
          <nav className="space-y-1.5">
            {visibleNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
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

        <div className="shrink-0 border-t border-gray-200 p-4">
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 cursor-pointer"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  )
}