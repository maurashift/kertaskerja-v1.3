'use client';

import { BrandingProviders } from '@/providers/BrandingProviders';
import Sidebar from '@/components/global/sidebar';
import Header from '@/components/global/header';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <BrandingProviders>
      <div className="flex">
        <Sidebar
          isOpen={true}
          isZoomed={false}
          toggleSidebar={() => {}}
        />
        <main className="flex-1">
          <Header />
          {children}
        </main>
      </div>
    </BrandingProviders>
  );
}
