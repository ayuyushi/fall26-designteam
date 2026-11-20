import Link from 'next/link';

export default function SideNav() {
    return (
    <nav className="site-side-nav" aria-label="Dashboard navigation">
        <Link className="site-header-link" href="/dashboard/account">Account</Link>
        <Link className="site-header-link" href="/dashboard/library">Library</Link>
        <Link className="site-header-link" href="/dashboard/favorites">Favorites</Link>
        <Link className="site-header-link" href="/dashboard/create">Create Note</Link>
    </nav>
    );
}