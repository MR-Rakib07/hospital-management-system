'use client'

import React from 'react'

export default function DeleteAccountSection() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 lg:p-8 shadow-xs">
      <h2 className="text-lg sm:text-xl font-bold text-[#ef7b61] mb-4">Delete Account :</h2>
      <div className="space-y-4 max-w-xl">
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          Once you delete your account, there is no going back. Please be certain before proceeding.
        </p>
        <button
          type="button"
          className="px-6 py-2.5 bg-[#ef7b61] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs hover:bg-[#d96a52] transition cursor-pointer active:scale-95"
        >
          Delete Account
        </button>
      </div>
    </div>
  )
}