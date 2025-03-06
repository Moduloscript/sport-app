import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server-client'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const type = requestUrl.searchParams.get('type')
  
  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=${encodeURIComponent(error.message)}`
      )
    }

    // Handle email verification redirect
    if (type === 'email') {
      const { verifyEmail } = (await import('@/stores/auth-store')).useAuthStore.getState()
      await verifyEmail()
      return NextResponse.redirect(
        `${requestUrl.origin}/verify-email?verified=true`
      )
    }
  }

  // Default redirect after sign in
  return NextResponse.redirect(requestUrl.origin)
}
