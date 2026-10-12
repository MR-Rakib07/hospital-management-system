'use client'

import React from 'react'
import {
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  QrCode,
  Search,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const staffCounterFlowData = [
  { time: '8 AM', verified: 12, pending: 4 },
  { time: '10 AM', verified: 28, pending: 8 },
  { time: '12 PM', verified: 35, pending: 15 },
  { time: '2 PM', verified: 18, pending: 6 },
  { time: '4 PM', verified: 22, pending: 10 },
  { time: '6 PM', verified: 15, pending: 3 },
]

const ticketTypeData = [
  { name: 'Online Booked', value: 65, color: '#4F46E5' },
  { name: 'Counter Walk-in', value: 25, color: '#818CF8' },
  { name: 'Emergency', value: 10, color: '#C7D2FE' },
]

export default function StaffOverviewPage() {
  const stats = [
    {
      title: "Today's Total Check-ins",
      count: '130',
      change: '85 verified at desk',
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      title: 'In Waiting Lobby',
      count: '24',
      change: 'Ready for doctor call',
      icon: Clock,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      title: 'Successful Verifications',
      count: '98',
      change: 'Completed tickets',
      icon: CheckCircle2,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      title: 'Attention / Discrepancies',
      count: '8',
      change: 'Invalid token / unpaid',
      icon: AlertTriangle,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
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
              className="rounded-xl border border-indigo-100 bg-white p-4 sm:p-5 shadow-xs transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0 pr-2">
                  <p className="truncate text-xs font-semibold uppercase tracking-wider text-gray-500">
                    {stat.title}
                  </p>
                  <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-gray-800">
                    {stat.count}
                  </p>
                  <span className="mt-0.5 sm:mt-1 block truncate text-xs font-medium text-indigo-600">
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
        <div className="rounded-xl border border-indigo-100 bg-white p-4 sm:p-6 shadow-xs lg:col-span-2">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-gray-800">
                Front Counter Hourly Flow
              </h3>
              <p className="text-xs text-gray-500">
                Patient arrivals and ticket clearance rate
              </p>
            </div>
            <span className="self-start sm:self-auto rounded-md border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600">
              Today
            </span>
          </div>

          <div className="h-60 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={staffCounterFlowData}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF2FF" />
                <XAxis
                  dataKey="time"
                  tickLine={false}
                  axisLine={{ stroke: '#E0E7FF' }}
                  tick={{ fill: '#3730A3', fontSize: 11, fontWeight: 500 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#3730A3', fontSize: 11, fontWeight: 500 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1px solid #C7D2FE',
                    boxShadow: '0 4px 6px -1px rgb(79 70 229 / 0.1)',
                    color: '#312E81',
                  }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Bar
                  dataKey="verified"
                  fill="#4F46E5"
                  radius={[4, 4, 0, 0]}
                  barSize={18}
                  name="Verified"
                />
                <Bar
                  dataKey="pending"
                  fill="#A5B4FC"
                  radius={[4, 4, 0, 0]}
                  barSize={18}
                  name="In Queue"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-indigo-100 bg-white p-4 sm:p-6 shadow-xs">
          <h3 className="text-sm sm:text-base font-bold text-gray-800">
            Booking Channel Ratio
          </h3>
          <p className="text-xs text-gray-500">Source of patient admissions</p>

          <div className="relative mt-2 h-48 sm:h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ticketTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {ticketTypeData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1px solid #C7D2FE',
                    color: '#312E81',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 space-y-2">
            {ticketTypeData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-700 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-indigo-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-indigo-100 bg-white p-4 sm:p-6 shadow-xs">
        <h3 className="text-sm sm:text-base font-bold text-gray-800">Quick Desk Actions</h3>
        <p className="text-xs text-gray-500">Common reception workflows</p>
        
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-3 p-3.5 rounded-lg border border-indigo-100 bg-indigo-50/50 hover:bg-indigo-50 transition cursor-pointer">
            <div className="p-2 rounded-lg bg-indigo-600 text-white">
              <QrCode className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Scan QR Appointment Ticket</p>
              <p className="text-xs text-gray-500">Instantly check-in verified patient</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-lg border border-indigo-100 bg-indigo-50/50 hover:bg-indigo-50 transition cursor-pointer">
            <div className="p-2 rounded-lg bg-indigo-600 text-white">
              <Search className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Manual Patient Lookup</p>
              <p className="text-xs text-gray-500">Find booking by phone or national ID</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}