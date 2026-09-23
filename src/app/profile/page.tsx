'use client'

import ProfileSettings from "@/components/Profile/ProfileSettings";
import ProfileTab from "@/components/Profile/ProfileTab";
import { fetchProfileThunk } from "@/redux/auth/userprofileSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Container from "@/utils/Container";
import { Droplets, Heart, Mail, MapPin, Phone, ShieldAlert, User } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

function Profile() {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.profile);
  const [isProfile, setProfile] = useState<boolean>(true);

  useEffect(() => {
    dispatch(fetchProfileThunk());
  }, [dispatch]);

  const totalFields = 11;
  const completedFields = user
    ? [
        user.fullname,
        user.email,
        user.phone,
        user.gender,
        user.dateOfBirth,
        user.bloodGroup,
        user.maritalStatus,
        user.presentAddress,
        user.permanentAddress,
        user.emergencyContactName,
        user.emergencyPhone,
      ].filter(Boolean).length
    : 0;

  const completionPercentage = Math.round((completedFields / totalFields) * 100);

  const profileData = [
    {
      label: "Gender",
      value: user?.gender ? user.gender.charAt(0) + user.gender.slice(1).toLowerCase() : "Not Set",
      icon: <User size={18} className="text-blue-600" />,
    },
    {
      label: "Birthday",
      value: user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "Not Set",
      icon: <Mail size={18} className="text-blue-600" />,
    },
    {
      label: "Phone No.",
      value: user?.phone || "Not Set",
      icon: <Phone size={18} className="text-blue-600" />,
    },
    {
      label: "Blood Group",
      value: user?.bloodGroup ? user.bloodGroup.replace("_", " ") : "Not Set",
      icon: <Droplets size={18} className="text-blue-600" />,
    },
    {
      label: "Marital Status",
      value: user?.maritalStatus ? user.maritalStatus.charAt(0) + user.maritalStatus.slice(1).toLowerCase() : "Not Set",
      icon: <Heart size={18} className="text-blue-600" />,
    },
    {
      label: "Present Address",
      value: user?.presentAddress || "Not Set",
      icon: <MapPin size={18} className="text-blue-600" />,
    },
    {
      label: "Emergency",
      value: user?.emergencyPhone || "Not Set",
      icon: <ShieldAlert size={18} className="text-blue-600" />,
    },
  ];

  return (
    <section className="my-6 sm:my-10">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">
          <div className="w-full border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
            <div className="w-full h-[120px] relative bg-slate-100">
              <Image
                src="/bg-profile.jpg"
                fill
                alt="banner"
                className="w-full h-full object-cover"
                priority
              />
              <div className="w-20 h-20 absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2 rounded-full border-4 border-white shadow bg-gray-100 overflow-hidden">
                <Image
                  src="/profile.jpg"
                  fill
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex flex-col items-center pt-12 pb-3 px-4 text-center capitalize">
              <h4 className="text-base sm:text-lg font-semibold text-gray-800">
                {loading ? "Loading..." : user?.fullname || "User Name"}
              </h4>
              <p className="text-xs sm:text-sm font-medium text-gray-500 lowercase">
                {user?.email || "user@example.com"}
              </p>
              <span className="mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 uppercase">
                {user?.role || "PATIENT"}
              </span>
            </div>

            <hr className="text-gray-100" />

            <div className="p-5">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-sm sm:text-base font-bold text-gray-800">Complete your profile</h2>
                <span className="text-xs sm:text-sm font-semibold text-blue-600">{completionPercentage}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 mb-6 overflow-hidden">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>

              <div className="space-y-4 capitalize">
                {profileData.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 text-sm">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-gray-400 text-xs font-medium">{item.label}</span>
                      <span className="text-gray-800 font-semibold text-xs sm:text-sm truncate">
                        {item.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden min-h-[600px] flex flex-col">
            <div className="flex items-center border-b border-gray-200 bg-gray-50">
              <button
                onClick={() => setProfile(true)}
                className={`flex-1 h-12 sm:h-14 text-sm sm:text-base font-semibold transition-colors cursor-pointer ${
                  isProfile ? "text-white bg-blue-600" : "text-gray-600 hover:text-gray-900 bg-transparent"
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setProfile(false)}
                className={`flex-1 h-12 sm:h-14 text-sm sm:text-base font-semibold transition-colors cursor-pointer ${
                  !isProfile ? "text-white bg-blue-600" : "text-gray-600 hover:text-gray-900 bg-transparent"
                }`}
              >
                Profile Settings
              </button>
            </div>

            <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
              {isProfile ? (
                <ProfileTab user={user} appointments={[]} />
              ) : (
                <ProfileSettings
                  user={user}
                  onUpdate={() => dispatch(fetchProfileThunk())}
                />
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default Profile;