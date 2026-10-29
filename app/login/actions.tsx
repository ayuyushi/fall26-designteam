'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

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
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/account')
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

  switch (error?.code) {
    case 'signup_disabled':
      console.error('Signups are currently disabled on this platform.');
      break;
    case 'weak_password':
      console.error('Weak or invalid password detected. Please input a different one.');
      break;
    default:
      console.error(`Signup failed: ${error?.message}`);
  }

  if (error) {
    console.error(error)
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/check-email')
}