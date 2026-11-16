import Link from 'next/link'
import Header from '@/components/header'

export default function ErrorPage() {
  return (
    <main className="site-page">
      <Header visibility='guest' current='/error'/>
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