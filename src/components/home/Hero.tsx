'use client'

import React from 'react'
import Link from 'next/link'
import Container from '@/utils/Container'
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Clock,
  CreditCard,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
} from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50/50 py-16 sm:py-20 lg:py-28">
      {/* Background Soft Blobs */}
      <div className="absolute top-0 right-1/4 -z-10 h-96 w-96 rounded-full bg-blue-100/70 blur-3xl" />
      <div className="absolute bottom-10 left-1/4 -z-10 h-80 w-80 rounded-full bg-cyan-100/50 blur-3xl" />

      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Heading, Details & CTA */}
          <div className="text-center lg:col-span-7 lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              <span>Smart Hospital Serial Booking</span>
            </div>

            <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Healthcare Appointments,{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Simplified & Fast
              </span>
            </h1>

            <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base lg:text-lg">
              Book your chamber slot directly with specialist doctors. Get an instant serial token without any advance payment—pay offline when you visit the clinic.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col justify-center gap-3.5 sm:flex-row sm:items-center lg:justify-start">
              <Link
                href="/doctors"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-500/25 transition duration-200 hover:bg-blue-700 active:scale-95 cursor-pointer"
              >
                <CalendarCheck className="h-4 w-4" />
                <span>Explore Doctors Roster</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <a
                href="tel:+8801700000000"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-6 py-3.5 text-sm font-semibold text-blue-700 shadow-sm transition duration-200 hover:bg-blue-50/70 active:scale-95 cursor-pointer"
              >
                <PhoneCall className="h-4 w-4 text-blue-600" />
                <span>Emergency: +880 1700-000000</span>
              </a>
            </div>

            {/* Badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-xs font-medium text-slate-600 lg:justify-start">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Verified Chamber Doctors</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>No Advance Fees Required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Instant Serial Number</span>
              </div>
            </div>
          </div>

          {/* Right Column: Information Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md rounded-3xl border border-blue-100 bg-white p-6 shadow-xl shadow-blue-900/5 sm:p-7">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Stethoscope className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">How Booking Works</h3>
                    <p className="text-xs text-slate-500">Offline chamber workflow</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 border border-emerald-200/50">
                  Chambers Open
                </span>
              </div>

              {/* Steps */}
              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-700">
                    1
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Select Doctor & Chamber Day</p>
                    <p className="text-xs text-slate-500">Choose your specialist and check visiting hours & schedule.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-700">
                    2
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Receive Serial Token</p>
                    <p className="text-xs text-slate-500">Get an automated serial queue number instantly.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-700">
                    3
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Arrive & Pay Offline</p>
                    <p className="text-xs text-slate-500">Visit chamber reception and pay consultation fee upon arrival.</p>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-6 rounded-2xl border border-blue-50 bg-blue-50/50 p-4">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="h-3.5 w-3.5 text-blue-600" />
                    Chamber: 04:00 PM - 09:00 PM
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-emerald-700">
                    <CreditCard className="h-3.5 w-3.5" />
                    Cash on Arrival
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Feature Stats Grid */}
        <div className="mt-14 grid grid-cols-2 gap-4 border-t border-slate-200/80 pt-8 sm:grid-cols-4">
          <div className="flex items-center justify-center gap-3 text-left">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100/60 text-blue-700">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">50+</p>
              <p className="text-xs text-slate-500">Specialist Doctors</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 text-left">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100/60 text-blue-700">
              <CalendarCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">Live Serial</p>
              <p className="text-xs text-slate-500">Automated Queue</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 text-left">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100/60 text-blue-700">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">No Advance</p>
              <p className="text-xs text-slate-500">Pay at Reception</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 text-left">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100/60 text-blue-700">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">100%</p>
              <p className="text-xs text-slate-500">Verified Chambers</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}