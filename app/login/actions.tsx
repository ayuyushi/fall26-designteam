'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email')
  const password = formData.get('password')
  if(typeof email !== 'string' || typeof password !== 'string') {
    redirect('/error?reason=invalid-login-details')
  }

  const data = {
    email: email.trim().toLowerCase(),
    password: password,
  }
  if(data.email==="" || data.password==="") {
    redirect('/error?reason=invalid-login-details')
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/account')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  const rawEmail = formData.get('email')
  const password = formData.get('password')
   if(typeof rawEmail !== 'string' || typeof password !== 'string') {
    redirect('/error?reason=invalid-signup-details')
  }
  const email = rawEmail.trim().toLowerCase()
  if(email==="" || password==="") {
    redirect('/error?reason=invalid-signup-details')
  }
  if(!email.endsWith('@ufl.edu')) {
    redirect('/error?reason=invalid-email')
  }

  const data = {
    email: email,
    password: password
  }
  
  const { error } = await supabase.auth.signUp(data)

  if (error) {
    switch (error.code) {
      case 'signup_disabled':
        console.error('Signups are currently disabled on this platform.');
        break;
      case 'weak_password':
        console.error('Weak or invalid password detected. Please input a different one.');
        break;
      default:
        console.error(`Signup failed: ${error.message}`);
    }
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/check-email')
}

export async function magicLinkLogin(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email')
  if (typeof email !== 'string') {
    redirect('/error?reason=invalid-login-details')
  }
  const data = {
    email: email.trim().toLowerCase(),
    options: {
      shouldCreateUser: false,
      emailRedirectTo: 'http://localhost:3000/auth/callback'
    }
  }

  if (data.email === '' || !data.email.endsWith('@ufl.edu')) {
    redirect('/error?reason=invalid-email')
  }

  const { error } = await supabase.auth.signInWithOtp(data)

  if (error) {
    redirect('/error')
  }

  redirect('/check-email')
}