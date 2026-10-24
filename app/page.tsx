import Link from 'next/link'

export default async function Home() {
  return (
    <main className="site-page">
      <header className="site-header">
        <span className="site-header-spacer" aria-hidden="true" />
        <p>ChompIn</p>
        <Link className="site-header-link" href="/login">Log in</Link>
      </header>
      <section className="home-content">
        <p className="site-eyebrow">Create. Share. Connect. </p>
        <h1>ChompIn.</h1>
        <p className="home-description">
          Making class notes more accessible and collaborative.
        </p>
        <div className="home-actions">
          <Link className="home-action-card" href="/login">
            <span className="home-action-label">Get started</span>
            <span className="home-action-title">Sign in or create an account</span>
            <span className="home-action-description">Jump into ChompIn with your UFL email.</span>
          </Link>
          <Link className="home-action-card" href="/account">
            <span className="home-action-label">Your space</span>
            <span className="home-action-title">View your profile</span>
            <span className="home-action-description">Update your username and profile details.</span>
          </Link>
        </div>
      </section>
    </main>
  )
}