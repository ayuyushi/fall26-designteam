'use client'
import { signup } from './actions'
import { useState } from 'react'


export default function SignUpForm() {
    const [password, setPassword] = useState("")
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
            <input id="signup-password" name="password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} pattern="^(?=.*[A-Za-z])(?=.*[0-9]).{8,}$" required />
            {password.length < 8 && password.length > 0 && <p>Password must be at least 8 characters long.</p>}
            {password.length > 0 && (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) && <p>Password must contain letters and digits.</p>}
            </div>
            <button className="auth-submit" formAction={signup}>Sign up</button>
        </form>
        </section>
    )
}
