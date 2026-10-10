'use client'

import DoctorCard from '@/components/doctors/DoctorCard'
import { fetchDoctorsThunk } from '@/redux/doctor/doctorFetchSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import Container from '@/utils/Container'
import PageHeading from '@/utils/PageHeading'
import { AlertCircle, Clock, PhoneCall, RefreshCw, Stethoscope, UserX } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'

export default function DoctorsPage() {
  const pathName = usePathname()
  const path = pathName.slice(1)

  const dispatch = useAppDispatch()
  const { doctors, loading, error } = useAppSelector((state) => state.doctors)

  useEffect(() => {
    void dispatch(fetchDoctorsThunk())
  }, [dispatch])

  const handleRetry = () => {
    void dispatch(fetchDoctorsThunk())
  }

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      <PageHeading
        pageHeading="Specialist Doctors"
        pageDescription="Connect with qualified healthcare specialists. Book serial appointments with flexible consulting hours and chamber care."
        pageNavigation={path}
      />

      <Container>
        {loading && (
          <div className="my-12 space-y-8">
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
          <div className="my-20 flex flex-col items-center justify-center text-center">
            <AlertCircle className="h-10 w-10 text-rose-500 mb-3" />
            <h3 className="text-xl font-bold text-slate-800">Connection Failed</h3>
            <p className="mt-1 max-w-md text-sm text-slate-500">
              {error || 'Unable to connect to the server. Please check your connection and try again.'}
            </p>
            <button
              type="button"
              onClick={handleRetry}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 active:scale-95 cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {!loading && !error && doctors.length === 0 && (
          <div className="my-16 mx-auto max-w-xl rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center sm:p-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-600">
              <UserX className="h-10 w-10" />
            </div>
            <h3 className="mt-5 text-xl font-bold text-slate-800">No Doctors Found</h3>
            <p className="mt-2 text-sm text-slate-500">
              There are currently no doctors available in the database roster. Please check back later or contact our chamber desk.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleRetry}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95 cursor-pointer"
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

        {!loading && !error && doctors.length > 0 && (
          <>
            <div className="my-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {doctors.map((doctor) => {
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
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95 sm:w-auto cursor-pointer"
                  >
                    <PhoneCall className="h-4 w-4" />
                    <span>Call Emergency Desk</span>
                  </a>
                </div>
              </div>
            </div>
          </>
        )}
      </Container>
    </div>
  )
}