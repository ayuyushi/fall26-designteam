import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/header'
import { createClient } from '@/utils/supabase/server'
import chompInLogo from './ChompInFont.png'
import chompInFavicon from './favicon.ico'

export default async function Home() {
  const supabase = await createClient()
  const { data: claimsData } = await supabase.auth.getClaims()

  return (
    <main className="site-page">
      <Header visibility={!claimsData?.claims ? 'guest' : 'auth'} current='/home'/>
      <section className="home-content">
        <p className="site-eyebrow">Create. Share. Connect. </p>
        <div className="home-logo-row">
          <Image
            className="home-logo"
            src={chompInLogo}
            alt="ChompIn"
            priority
          />
          <Image
            className="home-favicon"
            src={chompInFavicon}
            alt=""
            aria-hidden="true"
            priority
          />
        </div>
        <p className="home-description">
          Making class notes more accessible and collaborative.
        </p>
        <div className="home-actions">
          <Link className="home-action-card" href="/login">
            <span className="home-action-label">Get started</span>
            <span className="home-action-title">Sign in or create an account</span>
            <span className="home-action-description">Jump into ChompIn with your UFL email.</span>
          </Link>
          <Link className="home-action-card" href="/dashboard/account">
            <span className="home-action-label">Your space</span>
            <span className="home-action-title">View your profile</span>
            <span className="home-action-description">Update your username and profile details.</span>
          </Link>
        </div>
      </section>
    </main>
  )
}