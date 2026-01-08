'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TbHome, TbBinaryTree, TbLogout, TbX } from 'react-icons/tb'; // Tambah icon X jika ingin tombol close
import { logout } from '@/lib/cookie';
import { useBrandingProviders } from '@/providers/BrandingProviders';

// 1. Definisikan tipe data props yang diterima dari Layout
interface SidebarProps {
  isOpen: boolean | null;
  toggleSidebar: () => void;
  isZoomed: boolean | null;
}

// 2. Terima props di parameter fungsi
export default function Sidebar({ isOpen, toggleSidebar, isZoomed }: SidebarProps) {
  const pathname = usePathname();
  const { branding } = useBrandingProviders();

  // Menu list
  const menu = [
    { label: 'Dashboard', href: '/', icon: TbHome },
    { label: 'Pohon Kinerja Pemda', href: '/pohonkinerjapemda', icon: TbBinaryTree },
  ];

  return (
    <aside 
      className={`fixed left-0 top-0 h-screen bg-[#182C4E] text-white transition-all duration-300 z-50 
      ${isOpen ? 'w-64 p-4' : 'w-0 overflow-hidden p-0'}`}
    >
      <div className="flex flex-col items-center mb-6 relative">
        {/* Opsional: Tombol close sidebar (berguna di layar kecil) */}
        <button onClick={toggleSidebar} className="absolute top-0 right-0 lg:hidden text-white/50 hover:text-white">
            <TbX size={20} />
        </button>

        {/* Mencegah error gambar jika branding belum load */}
        {branding?.logo && (
           <Image src={branding.logo} alt="logo" width={64} height={64} className="object-contain" />
        )}
        
        <h1 className="mt-2 font-bold text-center whitespace-nowrap overflow-hidden text-ellipsis w-full">
            {branding?.title || 'Loading...'}
        </h1>
        <p className="text-sm text-center text-gray-300">
            {branding?.client || '...'}
        </p>
      </div>

      <ul className="space-y-2">
        {menu.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}>
            <li className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer whitespace-nowrap 
              ${pathname === href ? 'bg-white text-black' : 'hover:bg-slate-600'}`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </li>
          </Link>
        ))}

        <li
          onClick={logout}
          className="flex items-center gap-3 p-3 rounded-lg cursor-pointer text-red-400 hover:bg-red-500/20 whitespace-nowrap"
        >
          <TbLogout size={20} />
          Logout
        </li>
      </ul>
    </aside>
  );
}