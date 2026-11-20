import Link from 'next/link'
import Header from '@/components/header'

const ERROR_DETAILS: Record<string, { reference: string; description: string }> = {
  'invalid-email': {
    reference: 'SIGNUP_UFL_EMAIL_REQUIRED',
    description: 'Sign-up requires a University of Florida email address ending in @ufl.edu.',
  },
  'login-invalid-credentials': {
    reference: 'LOGIN_INVALID_CREDENTIALS',
    description: 'The email or password was not accepted. Check your sign-in details and try again.',
  },
  'login-email-not-confirmed': {
    reference: 'LOGIN_EMAIL_NOT_CONFIRMED',
    description: "This account's email has not been confirmed. Check your inbox for a confirmation link.",
  },
  'login-rate-limited': {
    reference: 'LOGIN_TOO_MANY_ATTEMPTS',
    description: 'There have been too many sign-in attempts. Wait a few minutes before trying again.',
  },
  'login-failed': {
    reference: 'LOGIN_REQUEST_FAILED',
    description: 'We could not complete sign-in. Try again, and share this reference if the issue continues.',
  },
  'signup-disabled': {
    reference: 'SIGNUP_DISABLED',
    description: 'New accounts are currently disabled.',
  },
  'weak-password': {
    reference: 'SIGNUP_PASSWORD_TOO_WEAK',
    description: 'The password does not meet the security requirements. Choose a stronger password and try again.',
  },
  'email-already-registered': {
    reference: 'SIGNUP_EMAIL_ALREADY_REGISTERED',
    description: 'An account already exists for this email. Try signing in instead.',
  },
  'signup-invalid-email': {
    reference: 'SIGNUP_EMAIL_INVALID',
    description: 'The sign-up email address could not be accepted. Check the address and try again.',
  },
  'signup-rate-limited': {
    reference: 'SIGNUP_EMAIL_RATE_LIMITED',
    description: 'Too many confirmation emails were requested. Wait a few minutes before trying again.',
  },
  'signup-failed': {
    reference: 'SIGNUP_REQUEST_FAILED',
    description: 'We could not create your account. Try again, and share this reference if the issue continues.',
  },
}

const DEFAULT_ERROR = {
  reference: 'GENERAL_REQUEST_FAILED',
  description: 'We could not complete the request. Share this reference if the issue continues.',
}

export default async function ErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string | string[] }>
}) {
  const resolvedSearchParams = await searchParams
  const reason = Array.isArray(resolvedSearchParams.reason)
    ? resolvedSearchParams.reason[0]
    : resolvedSearchParams.reason
  const errorDetails = reason ? ERROR_DETAILS[reason] ?? DEFAULT_ERROR : DEFAULT_ERROR

  return (
    <main className="site-page">
      <Header visibility='guest' current='/error'/>
      <section className="site-content error-content">
        <div className="error-card">
          <p className="site-eyebrow">Oops!</p>
          <h1>Something went wrong.</h1>
          <p>{errorDetails.description}</p>
          <p className="error-reference">Reference: <strong>{errorDetails.reference}</strong></p>
          <Link className="error-home-button" href="/">Back to home</Link>
        </div>
      </section>
    </main>
  )
}