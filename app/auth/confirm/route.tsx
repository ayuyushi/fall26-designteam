import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

/*export async function GET(req: NextRequest) {
  const supabase = await createClient()
  // Exchange the authorization code for a login session
  const { error } = await supabase.auth.verifyOtp({
    token_hash: 'hash',
    type: 'email'
  })
  
  if (error) {
    return NextResponse.redirect(new URL('/error', req.url), {
      status: 302,
    })
  }

  revalidatePath('/', 'layout')
  return NextResponse.redirect(new URL('/account', req.url), {
    status: 302,
  })*/
 export async function GET(req: NextRequest) {
  const supabase = await createClient()

  // Get the authorization code from the callback URL
  const code = req.nextUrl.searchParams.get('code')

  if (code === null) {
    return NextResponse.redirect(new URL('/error', req.url), {
      status: 302,
    })
  }

  // Exchange the authorization code for a login session
  const { error } = await supabase.auth.exchangeCodeForSession(code)
  
  if (error) {
    return NextResponse.redirect(new URL('/error', req.url), {
      status: 302,
    })
  }
  

  revalidatePath('/', 'layout')
  return NextResponse.redirect(new URL('/account', req.url), {
    status: 302,
  })

}