import Link from 'next/link'

export default async function Home() {

  return (
    <div>
      <h1>This is a test home page</h1>
      <Link href="/login">TEST!!! Auth page</Link>
      <h1>Account page should only work if logged in</h1>
      <Link href="/account">TEST!!! Account page</Link>
    </div>
  )
}