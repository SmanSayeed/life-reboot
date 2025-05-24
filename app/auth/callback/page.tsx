'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code')
      const next = searchParams.get('next') || '/dashboard'

      if (code) {
        try {
          await supabase.auth.exchangeCodeForSession(code)
          router.push(next)
        } catch (error) {
          console.error('Error exchanging code for session:', error)
          router.push('/login?error=auth')
        }
      } else {
        router.push('/login')
      }
    }

    handleCallback()
  }, [router, searchParams, supabase.auth])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Authenticating...</h2>
        <p className="text-muted-foreground">Please wait while we verify your credentials.</p>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Loading...</h2>
          <p className="text-muted-foreground">Please wait...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
} 