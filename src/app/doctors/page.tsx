'use client'

import DoctorCard from '@/components/doctors/DoctorCard'
import { fetchDoctorsThunk } from '@/redux/doctor/doctorFetchSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import Container from '@/utils/Container'
import PageHeading from '@/utils/PageHeading'
import {
  AlertCircle,
  Clock,
  Filter,
  PhoneCall,
  RefreshCw,
  Search,
  Sparkles,
  Stethoscope,
  UserX,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'

export default function DoctorsPage() {
  const pathName = usePathname()
  const path = pathName.slice(1)

  const dispatch = useAppDispatch()
  const { doctors, loading, error } = useAppSelector((state) => state.doctors)

  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedDept, setSelectedDept] = useState<string>('ALL')

  useEffect(() => {
    void dispatch(fetchDoctorsThunk())
  }, [dispatch])

  const handleRetry = () => {
    void dispatch(fetchDoctorsThunk())
  }

  const departments = useMemo(() => {
    const set = new Set<string>()
    doctors.forEach((d) => {
      if (d.doctorProfile?.department) {
        set.add(d.doctorProfile.department.trim())
      }
    })
    return Array.from(set).sort()
  }, [doctors])

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const name = doctor.fullname?.toLowerCase() || ''
      const dept = doctor.doctorProfile?.department?.toLowerCase() || ''
      const spec = doctor.doctorProfile?.specialization?.toLowerCase() || ''
      const term = searchTerm.toLowerCase().trim()

      const matchesSearch =
        !term || name.includes(term) || dept.includes(term) || spec.includes(term)

      const matchesDept =
        selectedDept === 'ALL' ||
        doctor.doctorProfile?.department?.toLowerCase() === selectedDept.toLowerCase()

      return matchesSearch && matchesDept
    })
  }, [doctors, searchTerm, selectedDept])

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedDept('ALL')
  }

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      <PageHeading
        pageHeading="Specialist Doctors"
        pageDescription="Connect with qualified healthcare specialists. Book serial appointments with flexible consulting hours and chamber care."
        pageNavigation={path}
      />

      <Container>
        {!loading && !error && doctors.length > 0 && (
          <div className="my-8 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by doctor name, specialty, or department..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-10 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2.5 sm:flex-nowrap">
                <div className="relative w-full sm:w-auto">
                  <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-9 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 sm:w-56"
                  >
                    <option value="ALL">All Departments</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1.5 whitespace-nowrap rounded-xl bg-blue-50/70 px-3.5 py-2.5 text-xs font-semibold text-blue-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>
                    {filteredDoctors.length} {filteredDoctors.length === 1 ? 'Doctor' : 'Doctors'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="my-10 space-y-8">
            <div className="flex flex-col items-center justify-center space-y-3 py-10">
              <div className="relative flex h-14 w-14 items-center justify-center">
                <div className="absolute h-full w-full animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
                <Stethoscope className="h-6 w-6 text-blue-600 animate-pulse" />
              </div>
              <p className="text-sm font-medium text-slate-500">
                Loading specialist profiles...
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(4)].map((_, idx) => (
                <div
                  key={idx}
                  className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
                >
                  <div className="h-44 w-full animate-pulse rounded-xl bg-slate-100" />
                  <div className="mt-4 space-y-2.5">
                    <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
                    <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
                    <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100" />
                  </div>
                  <div className="mt-5 h-9 w-full animate-pulse rounded-lg bg-slate-100" />
                </div>
              ))}
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="my-12 mx-auto max-w-lg rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <AlertCircle className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-800">Connection Failed</h3>
            <p className="mt-2 text-sm text-slate-500">{error}</p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleRetry}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 active:scale-95"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Retry Now</span>
              </button>
            </div>
          </div>
        )}

        {!loading && !error && doctors.length === 0 && (
          <div className="my-12 mx-auto max-w-xl rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center sm:p-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-600">
              <UserX className="h-10 w-10" />
            </div>
            <h3 className="mt-5 text-xl font-bold text-slate-800">No Doctors Registered</h3>
            <p className="mt-2 text-sm text-slate-500">
              There are currently no doctors available in the database roster. Please verify system updates or try again shortly.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleRetry}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh Roster</span>
              </button>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                <PhoneCall className="h-4 w-4 text-slate-500" />
                <span>Contact Desk</span>
              </Link>
            </div>
          </div>
        )}

        {!loading && !error && doctors.length > 0 && filteredDoctors.length === 0 && (
          <div className="my-12 mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <Search className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-800">No Matching Specialists</h3>
            <p className="mt-2 text-sm text-slate-500">
              We couldn&apos;t find any doctors matching &ldquo;{searchTerm || selectedDept}&rdquo;. Try clearing filters or revising terms.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-800 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-900"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        )}

        {!loading && !error && filteredDoctors.length > 0 && (
          <div className="my-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredDoctors.map((doctor) => {
              const { doctorProfile } = doctor

              return (
                <DoctorCard
                  key={doctorProfile.id}
                  id={doctorProfile.id}
                  image={doctorProfile.image}
                  name={doctor.fullname}
                  department={doctorProfile.department}
                  specialization={doctorProfile.specialization}
                  designation={doctorProfile.designation}
                  experience={doctorProfile.experience}
                  location={doctor.presentAddress}
                  phone={doctor.phone}
                  visitingDays={doctorProfile.availableDays}
                  visitingHours={doctorProfile.visitingHours}
                  fee={doctorProfile.fee}
                />
              )
            })}
          </div>
        )}

        {!loading && !error && doctors.length > 0 && (
          <div className="mt-14 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/80 via-white to-indigo-50/80 p-6 sm:p-8">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 sm:text-lg">Need Immediate Assistance?</h4>
                  <p className="text-xs text-slate-500 sm:text-sm">
                    Our offline consultation helpline is available for critical appointments and schedule confirmation.
                  </p>
                </div>
              </div>
              <div className="flex w-full items-center gap-3 sm:w-auto">
                <a
                  href="tel:+8801700000000"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95 sm:w-auto"
                >
                  <PhoneCall className="h-4 w-4" />
                  <span>Call Emergency Desk</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  )
}