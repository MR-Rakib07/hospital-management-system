'use client'

import React from 'react'
import {
  Users,
  Clock,
  CheckCircle2,
  DollarSign,
  TrendingUp,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const doctorWeeklyData = [
  { day: 'Sat', patients: 6 },
  { day: 'Sun', patients: 12 },
  { day: 'Mon', patients: 14 },
  { day: 'Tue', patients: 10 },
  { day: 'Wed', patients: 15 },
  { day: 'Thu', patients: 11 },
  { day: 'Fri', patients: 4 },
]

export default function DoctorOverviewPage() {
  const stats = [
    {
      title: "Today's Booked Queue",
      count: '16',
      change: '10 slots filled online',
      icon: Users,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
    },
    {
      title: 'Waiting in Lobby',
      count: '4',
      change: 'Checked-in & verified',
      icon: Clock,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
    },
    {
      title: 'Consultations Done',
      count: '8',
      change: '50% daily quota',
      icon: CheckCircle2,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
    },
    {
      title: 'Today Earnings',
      count: '$480',
      change: 'Advance consultation fee',
      icon: DollarSign,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
    },
  ]

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.title}
              className="rounded-xl border border-teal-100 bg-white p-4 sm:p-5 shadow-xs transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0 pr-2">
                  <p className="truncate text-xs font-semibold uppercase tracking-wider text-gray-500">
                    {stat.title}
                  </p>
                  <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-gray-800">
                    {stat.count}
                  </p>
                  <span className="mt-0.5 sm:mt-1 block truncate text-xs font-medium text-teal-600">
                    {stat.change}
                  </span>
                </div>
                <div className={`shrink-0 rounded-xl p-2.5 sm:p-3.5 ${stat.bgColor} ${stat.color}`}>
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-teal-100 bg-white p-4 sm:p-6 shadow-xs lg:col-span-2">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-gray-800">
                My Consultation Volume
              </h3>
              <p className="text-xs text-gray-500">Patients consulted this week</p>
            </div>
            <span className="self-start sm:self-auto rounded-md border border-teal-200 bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-600">
              Active Week
            </span>
          </div>

          <div className="h-60 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={doctorWeeklyData}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0FDFA" />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={{ stroke: '#CCFBF1' }}
                  tick={{ fill: '#0F766E', fontSize: 11, fontWeight: 500 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#0F766E', fontSize: 11, fontWeight: 500 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1px solid #99F6E4',
                    boxShadow: '0 4px 6px -1px rgb(13 148 136 / 0.1)',
                    color: '#134E4A',
                  }}
                  itemStyle={{ color: '#0F766E', fontSize: '12px' }}
                  labelStyle={{ color: '#134E4A', fontWeight: 600 }}
                />
                <Bar
                  dataKey="patients"
                  fill="#0D9488"
                  radius={[6, 6, 0, 0]}
                  barSize={32}
                  name="Patients Consulted"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-teal-100 bg-white p-4 sm:p-6 shadow-xs">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-gray-800">
              Slot Occupancy
            </h3>
            <p className="text-xs text-gray-500">Chamber capacity utilization</p>

            <div className="mt-5 space-y-4">
              <div>
                <div className="mb-1 flex justify-between text-xs font-semibold text-gray-700">
                  <span>Online Advance Slots</span>
                  <span className="font-bold text-teal-600">16 / 20</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-teal-50">
                  <div className="h-full rounded-full bg-teal-600" style={{ width: '80%' }} />
                </div>
              </div>

              <div>
                <div className="mb-1 flex justify-between text-xs font-semibold text-gray-700">
                  <span>Walk-in Emergency Reserve</span>
                  <span className="font-bold text-teal-500">2 / 5</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-teal-50">
                  <div className="h-full rounded-full bg-teal-400" style={{ width: '40%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-lg border border-teal-100 bg-teal-50/60 p-3.5">
            <div className="flex items-start gap-2.5">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-teal-600 mt-0.5" />
              <p className="text-xs text-gray-700 leading-relaxed">
                Your booked appointments are currently at{' '}
                <strong className="font-semibold text-teal-900">80% capacity</strong> today.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}