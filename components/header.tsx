import Link from 'next/link'

const NAV_ITEMS = [
  { label: 'Search Notes', path: '/notes', visibility: 'all' },
  { label: 'My Collection', path: '/library', visibility: 'auth' },
  { label: 'My Profile', path: '/account', visibility: 'auth' },
  { label: 'Login', path: '/login', visibility: 'guest' },
];

export default function Header({ visibility, current }: { visibility: string, current: string }) {
    const visibleLinks = NAV_ITEMS.filter((item) => {
        if (item.path === current) return false;
        if (item.visibility === 'all' || item.visibility === visibility) return true;
        return false;
    });

    return (
        <header className="site-header">
            <Link className="site-header-link" href="/">Home</Link>
            <p>ChompIn</p>
            <nav className="site-header-nav" aria-label="Main navigation">
            {visibleLinks.map((link) => (
                <Link key={link.path} className="site-header-link" href={link.path}>{link.label}</Link>
            ))}
            </nav>
      </header>
    );
}