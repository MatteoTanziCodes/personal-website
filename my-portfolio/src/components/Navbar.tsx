// src/components/Navbar.tsx
import Link from 'next/link';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/resume', label: 'Resume' },
  { href: '/projects', label: 'Projects' },
  { href: '/research', label: 'Research' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  return (
    <nav className="bg-slate-800 text-white p-4 flex gap-6 font-medium">
      {navLinks.map((link) => (
        <Link key={link.href} href={link.href} className="hover:text-primary">
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
