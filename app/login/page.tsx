import { login, signup } from './actions'
import Link from 'next/link'

function SignUpForm() {
  return (
    <section className="auth-card signup-card" aria-labelledby="signup-title">
      <h2 id="signup-title">Sign Up</h2>
      <form>
        <div className="auth-field">
          <label htmlFor="signup-email">UF Email</label>
          <input id="signup-email" name="email" type="email" autoComplete="email" pattern=".+@ufl\.edu" title="Please use your UF email address (@ufl.edu) to sign up" required />
        </div>
        <div className="auth-field">
          <label htmlFor="signup-password">Password</label>
          <input id="signup-password" name="password" type="password" autoComplete="new-password" required />
        </div>
        <button className="auth-submit" formAction={signup}>Sign up</button>
      </form>
    </section>
  )
}

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
      </div>
    </main>
  )
}