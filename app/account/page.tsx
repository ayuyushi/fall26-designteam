import AccountForm from './account-form'
import Header from '@/components/header'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function Account() {
  const supabase = await createClient()

  const { data: claimsData } = await supabase.auth.getClaims()
  if(!claimsData?.claims){
    redirect('/login') //redirect to login page if not valid authentication
  }

  return (
    <main className="site-page">
      <Header visibility='auth' current='/account'/>
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