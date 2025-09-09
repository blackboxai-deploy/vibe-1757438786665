'use client'

import { useState } from 'react'
import { useAuth } from '@/providers/auth-provider'
import AuthModal from '@/components/auth/AuthModal'
import Dashboard from '@/components/dashboard/Dashboard'
import LandingPage from '@/components/landing/LandingPage'

export default function HomePage() {
  const { user, loading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white">SKV Global AI</h2>
            <p className="text-gray-400">Loading your account...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <>
        <LandingPage onGetStarted={() => setShowAuthModal(true)} />
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </>
    )
  }

  return <Dashboard user={user} />
}