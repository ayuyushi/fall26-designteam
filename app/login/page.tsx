import { login, signup } from './actions'
import Link from 'next/link'

function SignUpForm() {
  return (
    <div>
      <h2>Sign Up</h2>
      <form>
        <label htmlFor="email">Email:</label>
        <input id="email" name="email" type="email" required />
        <label htmlFor="password">Password:</label>
        <input id="password" name="password" type="password" required />
        <label htmlFor="ufid">UFID:</label>
        <input id="ufid" name="ufid" type="text" required />
        <label htmlFor="username">Username:</label>
        <input id="username" name="username" type="text" required />
        <button formAction={signup}>Sign up</button>
      </form>
    </div>
  )
}

function LoginForm() {
  return (
    <div>
      <h2>Login</h2>
      <form>
        <label htmlFor="email">Email:</label>
        <input id="email" name="email" type="email" required />
        <label htmlFor="password">Password:</label>
        <input id="password" name="password" type="password" required />
        <button formAction={login}>Log in</button>
      </form>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div>
      <Link href="/">Return to home page</Link>
      <LoginForm/>
      <SignUpForm/>
    </div>
  )
}