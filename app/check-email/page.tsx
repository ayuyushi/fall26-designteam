import Link from 'next/link'
import Header from '@/components/header'

export default function CheckEmail() {
  return (
    <main className="site-page">
      <Header visibility="guest" current="/check-email" />
      <section className="site-content error-content">
        <div className="error-card">
          <p className="site-eyebrow">Account verification</p>
          <h1>Check your UF email</h1>
          <p>Use the verification link sent to your UF email address to finish creating your account.</p>
          <Link className="error-home-button" href="/login">Back to login</Link>
        </div>
      </section>
    </main>
  )
}