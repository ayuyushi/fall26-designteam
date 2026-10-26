import Link from 'next/link'

export default function CheckEmail() {
  return (
    <main>
      <h1>Check your UF email</h1>
      <p>
        Please use the verification link in your email to sign up.
      </p>
      <Link href="/login">Back to login</Link>
    </main>
  )
}