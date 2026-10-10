'use client'

import { useAppSelector } from '@/redux/hooks'
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  DollarSign,
  TrendingUp,
  UserCheck,
  UserMinus,
  Users,
} from 'lucide-react'
import React from 'react'
import {
  Area,
  AreaChart,
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

const bookingTrendData = [
  { day: 'Sat', bookings: 45, checkedIn: 38 },
  { day: 'Sun', bookings: 72, checkedIn: 65 },
  { day: 'Mon', bookings: 88, checkedIn: 80 },
  { day: 'Tue', bookings: 64, checkedIn: 58 },
  { day: 'Wed', bookings: 95, checkedIn: 89 },
  { day: 'Thu', bookings: 82, checkedIn: 74 },
  { day: 'Fri', bookings: 30, checkedIn: 25 },
]

const departmentLoadData = [
  { department: 'Cardio', patients: 120 },
  { department: 'Neuro', patients: 85 },
  { department: 'Ortho', patients: 95 },
  { department: 'Pedia', patients: 110 },
  { department: 'Medicine', patients: 140 },
]

const statusDistributionData = [
  { name: 'Checked-In', value: 58, color: '#2563EB' },
  { name: 'Expected', value: 24, color: '#60A5FA' },
  { name: 'Pending Slot', value: 12, color: '#93C5FD' },
  { name: 'No-Show', value: 6, color: '#BFDBFE' },
]

const doctorWeeklyData = [
  { day: 'Sat', patients: 6 },
  { day: 'Sun', patients: 12 },
  { day: 'Mon', patients: 14 },
  { day: 'Tue', patients: 10 },
  { day: 'Wed', patients: 15 },
  { day: 'Thu', patients: 11 },
  { day: 'Fri', patients: 4 },
]

function AdminDashboardView() {
  const stats = [
    {
      title: "Today's Bookings",
      count: '142',
      change: '+14% from yesterday',
      icon: CalendarCheck,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Checked-In',
      count: '88',
      change: '62% arrival rate',
      icon: UserCheck,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Yet to Arrive',
      count: '46',
      change: 'Expected before 8 PM',
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'No-Show / Cancelled',
      count: '8',
      change: '5.6% drop rate',
      icon: UserMinus,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
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
              className="rounded-xl border border-blue-100 bg-white p-4 sm:p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0 pr-2">
                  <p className="truncate text-xs font-semibold uppercase tracking-wider text-gray-500">
                    {stat.title}
                  </p>
                  <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-gray-800">
                    {stat.count}
                  </p>
                  <span className="mt-0.5 sm:mt-1 block truncate text-xs font-medium text-blue-600">
                    {stat.change}
                  </span>
                </div>
                <div className={`flex-shrink-0 rounded-xl p-2.5 sm:p-3.5 ${stat.bgColor} ${stat.color}`}>
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-blue-100 bg-white p-4 sm:p-6 shadow-sm lg:col-span-2">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-gray-800">
                Weekly Booking & Arrival Flow
              </h3>
              <p className="text-xs text-gray-500">
                Advance appointments vs physical check-ins
              </p>
            </div>
            <span className="self-start sm:self-auto rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">
              Last 7 Days
            </span>
          </div>

          <div className="h-60 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={bookingTrendData}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFF6FF" />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={{ stroke: '#DBEAFE' }}
                  tick={{ fill: '#1E40AF', fontSize: 11, fontWeight: 500 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#1E40AF', fontSize: 11, fontWeight: 500 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1px solid #BFDBFE',
                    boxShadow: '0 4px 6px -1px rgb(59 130 246 / 0.1)',
                    color: '#1E3A8A',
                  }}
                  itemStyle={{ color: '#1E40AF', fontSize: '12px', fontWeight: 500 }}
                  labelStyle={{ color: '#1E3A8A', fontWeight: 600, marginBottom: '4px' }}
                />
                <Area
                  type="monotone"
                  dataKey="bookings"
                  stroke="#1D4ED8"
                  strokeWidth={2}
                  fill="#3B82F6"
                  fillOpacity={0.25}
                  name="Booked"
                />
                <Area
                  type="monotone"
                  dataKey="checkedIn"
                  stroke="#0284C7"
                  strokeWidth={2}
                  fill="#60A5FA"
                  fillOpacity={0.35}
                  name="Checked-In"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-blue-100 bg-white p-4 sm:p-6 shadow-sm">
          <h3 className="text-sm sm:text-base font-bold text-gray-800">
            Arrival Status Ratio
          </h3>
          <p className="text-xs text-gray-500">Real-time attendance breakdown</p>

          <div className="relative mt-2 h-48 sm:h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusDistributionData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1px solid #BFDBFE',
                    color: '#1E3A8A',
                    boxShadow: '0 4px 6px -1px rgb(59 130 246 / 0.1)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 space-y-2">
            {statusDistributionData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-700 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-blue-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-blue-100 bg-white p-4 sm:p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-sm sm:text-base font-bold text-gray-800">
            Department Patient Load
          </h3>
          <p className="text-xs text-gray-500">
            Current advance booking volume by medical department
          </p>
        </div>

        <div className="h-56 sm:h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={departmentLoadData}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFF6FF" />
              <XAxis
                dataKey="department"
                tickLine={false}
                axisLine={{ stroke: '#DBEAFE' }}
                tick={{ fill: '#1E40AF', fontSize: 11, fontWeight: 500 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#1E40AF', fontSize: 11, fontWeight: 500 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  border: '1px solid #BFDBFE',
                  boxShadow: '0 4px 6px -1px rgb(59 130 246 / 0.1)',
                  color: '#1E3A8A',
                }}
                itemStyle={{ color: '#1E40AF', fontSize: '12px' }}
                labelStyle={{ color: '#1E3A8A', fontWeight: 600 }}
              />
              <Bar
                dataKey="patients"
                fill="#3B82F6"
                radius={[6, 6, 0, 0]}
                barSize={32}
                name="Patients"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

function DoctorDashboardView() {
  const stats = [
    {
      title: "Today's Booked Queue",
      count: '16',
      change: '10 slots filled online',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Waiting in Lobby',
      count: '4',
      change: 'Checked-in & verified',
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Consultations Done',
      count: '8',
      change: '50% daily quota',
      icon: CheckCircle2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Today Earnings',
      count: '$480',
      change: 'Advance consultation fee',
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
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
              className="rounded-xl border border-blue-100 bg-white p-4 sm:p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0 pr-2">
                  <p className="truncate text-xs font-semibold uppercase tracking-wider text-gray-500">
                    {stat.title}
                  </p>
                  <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-gray-800">
                    {stat.count}
                  </p>
                  <span className="mt-0.5 sm:mt-1 block truncate text-xs font-medium text-blue-600">
                    {stat.change}
                  </span>
                </div>
                <div className={`flex-shrink-0 rounded-xl p-2.5 sm:p-3.5 ${stat.bgColor} ${stat.color}`}>
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-blue-100 bg-white p-4 sm:p-6 shadow-sm lg:col-span-2">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-gray-800">
                My Consultation Volume
              </h3>
              <p className="text-xs text-gray-500">Patients consulted this week</p>
            </div>
            <span className="self-start sm:self-auto rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">
              Active Week
            </span>
          </div>

          <div className="h-60 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={doctorWeeklyData}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFF6FF" />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={{ stroke: '#DBEAFE' }}
                  tick={{ fill: '#1E40AF', fontSize: 11, fontWeight: 500 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#1E40AF', fontSize: 11, fontWeight: 500 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1px solid #BFDBFE',
                    boxShadow: '0 4px 6px -1px rgb(59 130 246 / 0.1)',
                    color: '#1E3A8A',
                  }}
                  itemStyle={{ color: '#1E40AF', fontSize: '12px' }}
                  labelStyle={{ color: '#1E3A8A', fontWeight: 600 }}
                />
                <Bar
                  dataKey="patients"
                  fill="#2563EB"
                  radius={[6, 6, 0, 0]}
                  barSize={32}
                  name="Patients Consulted"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-blue-100 bg-white p-4 sm:p-6 shadow-sm">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-gray-800">
              Slot Occupancy
            </h3>
            <p className="text-xs text-gray-500">Chamber capacity utilization</p>

            <div className="mt-5 space-y-4">
              <div>
                <div className="mb-1 flex justify-between text-xs font-semibold text-gray-700">
                  <span>Online Advance Slots</span>
                  <span className="font-bold text-blue-600">16 / 20</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-blue-50">
                  <div className="h-full rounded-full bg-blue-600" style={{ width: '80%' }} />
                </div>
              </div>

              <div>
                <div className="mb-1 flex justify-between text-xs font-semibold text-gray-700">
                  <span>Walk-in Emergency Reserve</span>
                  <span className="font-bold text-blue-500">2 / 5</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-blue-50">
                  <div className="h-full rounded-full bg-blue-400" style={{ width: '40%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-lg border border-blue-100 bg-blue-50/60 p-3.5">
            <div className="flex items-start gap-2.5">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-blue-600 mt-0.5" />
              <p className="text-xs text-gray-700 leading-relaxed">
                Your booked appointments are currently at{' '}
                <strong className="font-semibold text-blue-900">80% capacity</strong> today.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.profile)

  if (user?.role === 'ADMIN') {
    return <AdminDashboardView />
  }

  return <DoctorDashboardView />
}