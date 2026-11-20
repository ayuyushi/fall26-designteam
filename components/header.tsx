import Link from 'next/link';
import Image from 'next/image';
import chompInLogo from '@/app/ChompInFont.png';

const NAV_ITEMS = [
  { label: 'Search Notes', path: '/notes', visibility: 'all' },
  { label: 'Library', path: '/dashboard/library', visibility: 'auth' },
  { label: 'My Account', path: '/dashboard/account', visibility: 'auth' },
  { label: 'Login', path: '/login', visibility: 'guest' },
];

export default function Header({ visibility, current }: { visibility: string, current: string }) {
    const visibleLinks = NAV_ITEMS.filter((item) => {
        if (item.path.includes(current)) return false;
        if (item.visibility === 'all' || item.visibility === visibility) return true;
        return false;
    });

    return (
        <header className="site-header">
            <Link className="site-header-link" href="/">Home</Link>
            <Image
                className="site-header-logo"
                src={chompInLogo}
                alt="ChompIn"
                priority
            />
            <nav className="site-header-nav" aria-label="Main navigation">
            {visibleLinks.map((link) => (
                <Link key={link.path} className="site-header-link" href={link.path}>{link.label}</Link>
            ))}
            </nav>
      </header>
    );
}