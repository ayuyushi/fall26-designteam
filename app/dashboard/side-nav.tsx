'use client'

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import favicon from '@/app/favicon.ico';

const DASHBOARD_LINKS = [
    { label: 'My Account', path: '/dashboard/account' },
    { label: 'Library', path: '/dashboard/library' },
    { label: 'Favorites', path: '/dashboard/favorites' },
    { label: 'Create Note', path: '/dashboard/create' },
];

export default function SideNav() {
    const pathname = usePathname();

    return (
    <nav className="site-side-nav" aria-label="Dashboard navigation">
        <Link className="site-side-nav-brand" href="/dashboard/account" aria-label="ChompIn account">
            <span className="site-side-nav-emblem">
                <Image src={favicon} alt="" priority />
            </span>
        </Link>
        <div className="site-side-nav-links">
            {DASHBOARD_LINKS.map((link) => (
                <Link
                    key={link.path}
                    className="site-side-nav-link"
                    data-active={pathname.startsWith(link.path)}
                    aria-current={pathname.startsWith(link.path) ? 'page' : undefined}
                    href={link.path}
                >
                    {link.label}
                </Link>
            ))}
        </div>
    </nav>
    );
}