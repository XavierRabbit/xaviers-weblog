'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Entries', path: '/' },
    { name: 'Links', path: '/links' },
    { name: 'Quotes', path: '/quotes' },
    { name: 'Notes', path: '/notes' },
    { name: 'Elsewhere', path: '/elsewhere' },
  ];

  return (
    <nav className="flex items-center gap-2 overflow-x-auto pb-1">
      {navItems.map((item) => {
        const isActive =
          item.path === '/'
            ? pathname === '/'
            : pathname.startsWith(item.path);

        return (
          <Link
            key={item.name}
            href={item.path}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              isActive
                ? 'bg-surface-blue text-white shadow-md'
                : 'text-text-light opacity-60 hover:opacity-100 hover:bg-surface-blue hover:bg-opacity-20'
            }`}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}