import { Calendar, Clock, FileText, MapPin, Phone, ShieldAlert, User } from 'lucide-react';
import React from 'react';
import { UserProfile } from '@/types/user';

export interface Appointment {
  id: string | number;
  doctorName: string;
  department: string;
  appointmentDate: string;
  appointmentTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
}

interface ProfileTabProps {
  user?: UserProfile | null;
  appointments?: Appointment[];
}

function ProfileTab({ user, appointments = [] }: ProfileTabProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 pt-1 sm:pt-2 w-full">
      <div className="border border-gray-200 rounded-lg p-4 sm:p-5 bg-white shadow-sm">
        <h5 className="text-base sm:text-[17px] font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
          User Overview
        </h5>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 text-sm capitalize">
          <div className="flex items-start gap-3 min-w-0">
            <User size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-gray-400 text-xs">Full Name</p>
              <p className="font-medium text-gray-800 truncate">{user?.fullname || 'Not provided'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 min-w-0">
            <Phone size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-gray-400 text-xs">Phone Number</p>
              <p className="font-medium text-gray-800 truncate">{user?.phone || 'Not provided'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 min-w-0">
            <Calendar size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-gray-400 text-xs">Date of Birth</p>
              <p className="font-medium text-gray-800 truncate">
                {user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not provided'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 min-w-0">
            <MapPin size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-gray-400 text-xs">Present Address</p>
              <p className="font-medium text-gray-800 break-words line-clamp-2">{user?.presentAddress || 'Not provided'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 min-w-0">
            <MapPin size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-gray-400 text-xs">Permanent Address</p>
              <p className="font-medium text-gray-800 break-words line-clamp-2">{user?.permanentAddress || 'Not provided'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 min-w-0">
            <ShieldAlert size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-gray-400 text-xs">Emergency Contact</p>
              <p className="font-medium text-gray-800 break-words line-clamp-2">
                {user?.emergencyContactName
                  ? `${user.emergencyContactName} (${user.emergencyRelation || 'N/A'}) - ${user.emergencyPhone || 'N/A'}`
                  : 'Not provided'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4 sm:p-5 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100 gap-2">
          <h5 className="text-base sm:text-[17px] font-semibold text-gray-800">My Appointments</h5>
          <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full flex-shrink-0">
            Total: {appointments.length}
          </span>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-8 sm:py-10 text-gray-400 text-sm">
            <FileText size={36} className="mx-auto mb-2 opacity-50" />
            No appointments booked yet.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {appointments.map((item) => (
              <div
                key={item.id}
                className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between border border-gray-200 rounded-lg gap-2.5 sm:gap-4 hover:border-blue-200 transition-colors"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h6 className="text-[14px] sm:text-[15px] font-semibold text-gray-800 truncate">
                      {item.doctorName}
                    </h6>
                    <span
                      className={`text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded border flex-shrink-0 ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-blue-600 truncate">{item.department}</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-gray-500 pt-1 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Calendar size={14} className="text-gray-400" />
                    <span>{item.appointmentDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Clock size={14} className="text-gray-400" />
                    <span>{item.appointmentTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileTab;