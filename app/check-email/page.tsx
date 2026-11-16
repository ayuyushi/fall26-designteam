import Link from 'next/link'

export default function CheckEmail() {
  return (
    <main>
      <h1>Check your UF email</h1>
      <p>
        Check your UF email for an authentication link. Click the link to continue to ChompIn. Already Have an account? {' '}<Link href="/login">Log in</Link>
      </p>
      <Link href="/login">Back to login</Link>
    </main>
  )
}