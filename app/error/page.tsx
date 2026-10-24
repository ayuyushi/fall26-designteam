import Link from 'next/link'

export default function ErrorPage() {
  return (
    <main className="site-page">
      <header className="site-header">
        <Link className="site-header-link" href="/">Home</Link>
        <p>ChompIn</p>
        <span className="site-header-spacer" aria-hidden="true" />
      </header>
      <section className="site-content error-content">
        <div className="error-card">
          <p className="site-eyebrow">Oops!</p>
          <h1>Something went wrong.</h1>
          <p>Please try again. If the problem continues, head back home and start over.</p>
          <Link className="error-home-button" href="/">Back to home</Link>
        </div>
      </section>
    </main>
  )
}