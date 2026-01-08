'use client'

import { Poppins } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/global/sidebar";
import Header from "@/components/global/header";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { getUser } from "@/lib/cookie";
import NextTopLoader from "nextjs-toploader";
import { BrandingProviders } from "@/providers/BrandingProviders";

const font = Poppins({
    subsets: ['latin'],
    weight: ['200', '300', '400', '500', '600', '700', '800'],
    display: 'swap', // Mengatur tampilan swap agar tidak ada flash saat font dimuat
});
export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {

    const [isOpen, setIsOpen] = useState<boolean | null>(null);
    const [user, setUser] = useState<any>(null);
    const [isZoomed, setIsZoomed] = useState<boolean | null>(null);
    const pathname = usePathname();
    const loginPage = pathname === "/login"
    const [mounted, setMounted] = useState(false)

    // useEffect hanya berjalan di Client (browser)
    useEffect(() => {
        setMounted(true)
    }, [])

    const logo = process.env.NEXT_PUBLIC_LOGO_URL;

    const checkZoomLevel = () => {
        const zoomLevel = window.devicePixelRatio;
        if (zoomLevel >= 1.5) {
            setIsZoomed(true);
            setIsOpen(false); // Hide sidebar by default when zoom is 150%
        } else {
            setIsZoomed(false);
            setIsOpen(true); // Show sidebar when zoom level is below 150%
        }
    };

    useEffect(() => {
        const data = getUser();
        if (data) {
            setUser(data.user)
        }
        // Mengambil path dari URL tanpa domain dan protokol
        const path = window.location.pathname;
        // Mengganti judul (title) halaman dengan path (nama halaman)
        document.title = path.substring(1);
    }, [pathname]);

    const toggleSidebar = () => {
        setIsOpen(!isOpen)
    }

    useEffect(() => {
        checkZoomLevel();
        window.addEventListener('resize', checkZoomLevel);
        return () => window.removeEventListener('resize', checkZoomLevel);
    }, []);

    if (loginPage) {
        return (
            <html lang="en" className={font.className}>
                <head>
                    <title>KAK Pemda</title>
                    <meta name="description" content="Aplikasi Kinerja Pembangunan Daerah Pemda" />
                    <link
                        rel="icon"
                        href={logo}
                    // href="/universal.png" 
                    />
                </head>
                <body>
                    <BrandingProviders>
                        <NextTopLoader
                            color="linear-gradient(to right, rgb(134, 239, 172), rgb(59, 130, 246), rgb(147, 51, 234))"
                        />
                        <div className={`${font.className}`}>{children}</div>
                    </BrandingProviders>
                </body>
            </html>
        );
    }

    if (!mounted) return null
    return (
        <>
            <div className="flex-wrap">
                <BrandingProviders>
                    <NextTopLoader
                        color="linear-gradient(to right, rgb(134, 239, 172), rgb(59, 130, 246), rgb(147, 51, 234))"
                    />
                    {!loginPage && <Sidebar isOpen={isOpen} toggleSidebar={() => toggleSidebar()} isZoomed={isZoomed} />}
                    <div className={`w-full ${isOpen ? 'pl-64' : ''}`}>
                        {!loginPage && <Header />}
                        <div className={`${font.className} ${loginPage ? "" : "px-4 py-2"}`}>{children}</div>
                    </div>
                </BrandingProviders>
            </div>
        </>
    );
}
