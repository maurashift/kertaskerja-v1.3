'use client';

import { useEffect, useState } from 'react';
import Select from 'react-select';
import { getOpdTahun, getUser, getToken } from '@/lib/cookie';
import { AlertNotification } from '@/lib/alert';

interface OptionNumber {
  value: number;
  label: string;
}

interface OptionString {
  value: string;
  label: string;
}

const YEAR_OPTIONS: OptionNumber[] = Array.from({ length: 12 }, (_, i) => {
  const year = 2019 + i;
  return { value: year, label: `Tahun ${year}` };
});

const Header = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [tahun, setTahun] = useState<OptionNumber | null>(null);
  const [opd, setOpd] = useState<OptionString | null>(null);
  const [selectedOpd, setSelectedOpd] = useState<OptionString | null>(null);
  const [opdOptions, setOpdOptions] = useState<OptionString[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loadingOpd, setLoadingOpd] = useState(false);

  // Effect untuk mengambil data dari cookie saat client-side load
  useEffect(() => {
    setIsMounted(true);
    const cookieData = getOpdTahun();
    const userData = getUser();
    const token = getToken();

    if (cookieData?.tahun) {
      setTahun(cookieData.tahun);
    }

    if (cookieData?.opd) {
      setOpd(cookieData.opd);
    }

    if (userData?.user) {
      setUser(userData.user);
    }
  }, []);

  const fetchOpd = async () => {
    if (opdOptions.length > 0) return;
    const token = getToken() ?? '';

    try {
      setLoadingOpd(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/opd/findall`, {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error('Fetch OPD gagal');

      const json = await res.json();
      setOpdOptions(
        json.data.map((item: any) => ({
          value: item.kode_opd,
          label: item.nama_opd,
        }))
      );
    } catch {
      AlertNotification('Gagal', 'Tidak bisa memuat data OPD', 'error', 1500, true);
    } finally {
      setLoadingOpd(false);
    }
  };

  const setCookie = (name: string, value: any) => {
    // Menambahkan path=/ agar cookie terbaca di seluruh rute
    document.cookie = `${name}=${JSON.stringify(value)}; path=/; max-age=86400;`;
  };

  const handleAktifkan = () => {
    if (selectedOpd) setCookie('opd', selectedOpd);
    if (tahun) setCookie('tahun', tahun);

    AlertNotification('Berhasil', 'Perubahan berhasil diterapkan', 'success', 1500, false);

    setTimeout(() => window.location.reload(), 1000);
  };

  // Custom styles untuk react-select agar cocok dengan tema gelap header
  const customSelectStyles = {
    control: (base: any) => ({
      ...base,
      minWidth: 160,
      borderRadius: 8,
      cursor: 'pointer',
    }),
    option: (base: any, state: any) => ({
      ...base,
      color: 'black', // Memastikan teks opsi berwarna hitam
      cursor: 'pointer',
    }),
    singleValue: (base: any) => ({
        ...base,
        color: 'black',
    })
  };

  // Cegah render di server untuk menghindari hydration mismatch karena akses cookie
  if (!isMounted) {
    return (
        <div className="flex h-18 w-full items-center justify-between rounded-xl bg-linear-to-r from-[#182C4E] to-[#17212D] px-4 py-3 opacity-50">
            {/* Skeleton loading state sederhana */}
        </div>
    ); 
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-linear-to-r from-[#182C4E] to-[#17212D] px-4 py-3 text-white shadow-md">
      <div>
        <p className="text-sm font-light text-gray-200">
          Selamat Datang, <br />
          <span className="font-semibold text-white text-base">
            {user?.roles === 'super_admin'
                ? opd?.label ?? 'Administrator'
                : user?.nama_pegawai ?? 'User'}
          </span>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Dropdown OPD hanya untuk Super Admin / Reviewer */}
        {(user?.roles === 'super_admin' || user?.roles === 'reviewer') && (
          <div className="text-black">
            <Select
                placeholder="Pilih OPD"
                value={selectedOpd ?? opd}
                options={opdOptions}
                isLoading={loadingOpd}
                onMenuOpen={fetchOpd}
                onChange={(v) => setSelectedOpd(v)}
                styles={customSelectStyles}
                instanceId="select-opd" // Penting untuk aksesibilitas & hydration
            />
          </div>
        )}

        {/* Dropdown Tahun */}
        <div className="text-black">
            <Select
            placeholder="Pilih Tahun"
            value={tahun}
            options={YEAR_OPTIONS}
            onChange={(v) => setTahun(v)}
            styles={customSelectStyles}
            instanceId="select-tahun"
            />
        </div>

        <button
          onClick={handleAktifkan}
          className="rounded-lg border border-white px-4 py-2 text-sm font-medium transition-colors hover:bg-white hover:text-[#182C4E]"
        >
          Aktifkan
        </button>

        {user?.roles && (
          <span className="ml-2 rounded-lg bg-white/10 px-3 py-2 text-xs font-bold tracking-wider text-white border border-white/20">
            {user.roles.replace('_', ' ').toUpperCase()}
          </span>
        )}
      </div>
    </div>
  );
};

export default Header;