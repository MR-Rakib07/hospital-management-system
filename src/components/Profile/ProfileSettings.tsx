'use client'

import React from 'react'
import type { UserProfile } from '@/types/authTypes'
import PersonalInfoForm from './PersonalInfoForm'
import ChangePasswordForm from './ChangePasswordForm'
import DeleteAccountSection from './DeleteAccountSection'

interface ProfileSettingsProps {
  user?: UserProfile | null
  onUpdate?: () => void
}

export default function ProfileSettings({ user, onUpdate }: ProfileSettingsProps) {
  return (
    <div className="w-full max-w-7xl mx-auto py-4 sm:py-6 px-3 sm:px-6 lg:px-8 space-y-8">
      <PersonalInfoForm user={user} onUpdate={onUpdate} />
      <ChangePasswordForm />
      <DeleteAccountSection />
    </div>
  )
}