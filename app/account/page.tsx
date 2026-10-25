import AccountForm from './account_form'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function Account() {
  const supabase = await createClient()

  const { data: claimsData } = await supabase.auth.getClaims()

  return (
    <main className="site-page">
      <header className="site-header">
        <Link className="site-header-link" href="/">Home</Link>
        <br></br>
        <Link className="site-header-link" href="/notes">Notes page</Link>
        <p>ChompIn</p>
        <span className="site-header-spacer" aria-hidden="true" />
      </header>
      <section className="site-content account-content">
        <div className="account-intro">
          <p className="site-eyebrow">Your space</p>
          <h1>Profile settings</h1>
          <p>Update the details connected to your ChompIn profile.</p>
        </div>
        <section className="profile-card" aria-label="Profile details">
          <AccountForm claims={claimsData?.claims ?? null} />
        </section>
      </section>
    </main>
  )
}