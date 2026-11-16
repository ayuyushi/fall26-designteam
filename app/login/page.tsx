import { login, magicLinkLogin } from './actions'
import SignUpForm from './SignUpForm'
import Link from 'next/link'

function LoginForm() {
  return (
    <section className="auth-card login-card" aria-labelledby="login-title">
      <h2 id="login-title">Login</h2>
      <form>
        <div className="auth-field">
          <label htmlFor="login-email">UF Email</label>
          <input id="login-email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="auth-field">
          <label htmlFor="login-password">Password</label>
          <input id="login-password" name="password" type="password" autoComplete="current-password" required />
        </div>
        <button className="auth-submit" formAction={login}>Log in</button>
      </form>
    </section>
  )
}


function MagicLinkForm() {
  return (
    <section className="auth-card">
      <h2>Continue without a password</h2>
      <form>
        <div className="auth-field">
          <label htmlFor="magic-link-email">UF Email</label>
          <input id="magic-link-email" name="email" type="email" autoComplete="email" required />
        </div>
        <button className="auth-submit" formAction={magicLinkLogin}>
          Email me a login link
        </button>
      </form>
    </section>
  )
}

export default function LoginPage() {
  return (
    <main className="auth-page">
      <div className="auth-shell">
        <header className="site-header auth-header">
          <Link className="auth-home-link" href="/">Home</Link>
          <p>ChompIn</p>
        </header>
        <div className="auth-content">
          <LoginForm />
          <SignUpForm />
        </div>
        <div className="auth-content">
          <MagicLinkForm />
        </div>
      </div>
    </main>
  )
}

