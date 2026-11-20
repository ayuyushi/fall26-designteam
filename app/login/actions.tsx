'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

function getLoginErrorReason(code: string | undefined) {
  switch (code) {
    case 'invalid_credentials':
      return 'login-invalid-credentials'
    case 'email_not_confirmed':
      return 'login-email-not-confirmed'
    case 'too_many_requests':
      return 'login-rate-limited'
    default:
      return 'login-failed'
  }
}

function getSignupErrorReason(code: string | undefined) {
  switch (code) {
    case 'signup_disabled':
      return 'signup-disabled'
    case 'weak_password':
      return 'weak-password'
    case 'user_already_exists':
      return 'email-already-registered'
    case 'email_address_invalid':
      return 'signup-invalid-email'
    case 'over_email_send_rate_limit':
      return 'signup-rate-limited'
    default:
      return 'signup-failed'
  }
}

export async function login(formData: FormData) {
  const supabase = await createClient()
  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.error('Login failed:', error)
    redirect(`/error?reason=${getLoginErrorReason(error.code)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard/account')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  const email = (formData.get('email') as string).trim().toLowerCase()
  if(!email.endsWith('@ufl.edu')) {
    redirect('/error?reason=invalid-email')
  }

  // type-casting here for convenience: validate inputs!!!
  const data = {
    email: email,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    console.error('Signup failed:', error)
    redirect(`/error?reason=${getSignupErrorReason(error.code)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/check-email')
}