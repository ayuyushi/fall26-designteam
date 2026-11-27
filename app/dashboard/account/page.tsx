import AccountForm from './account-form'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Page"
};

export default async function Account() {
  const supabase = await createClient()

  const { data: claimsData } = await supabase.auth.getClaims()
  if(!claimsData?.claims){
    redirect('/login') //redirect to login page if not valid authentication
  }

  return (
    <main className="site-page">
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