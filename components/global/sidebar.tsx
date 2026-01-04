'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TbHome, TbBinaryTree, TbLogout } from 'react-icons/tb';
import { logout } from '@/lib/cookie';
import { useBrandingProviders } from '@/providers/BrandingProviders';
import { useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const { branding } = useBrandingProviders();

  const [isOpen, setIsOpen] = useState(true);

  const menu = [
    { label: 'Dashboard', href: '/', icon: TbHome },
    { label: 'Pohon Kinerja Pemda', href: '/pohonkinerjapemda', icon: TbBinaryTree },
  ];

  return (
    <aside className={`fixed left-0 top-0 h-screen bg-[#182C4E] text-white transition-all ${isOpen ? 'w-64 p-4' : 'w-0 overflow-hidden'}`}>
      <div className="flex flex-col items-center mb-6">
        <Image src={branding.logo} alt="logo" width={64} height={64} />
        <h1 className="mt-2 font-bold text-center">{branding.title}</h1>
        <p className="text-sm">{branding.client}</p>
      </div>

      <ul className="space-y-2">
        {menu.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}>
            <li className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${pathname === href ? 'bg-white text-black' : 'hover:bg-slate-600'}`}>
              <Icon />
              <span>{label}</span>
            </li>
          </Link>
        ))}

        <li
          onClick={logout}
          className="flex items-center gap-3 p-3 rounded-lg cursor-pointer text-red-400 hover:bg-red-500/20"
        >
          <TbLogout />
          Logout
        </li>
      </ul>
    </aside>
  );
}
