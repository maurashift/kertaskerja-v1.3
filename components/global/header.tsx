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

const YEAR_OPTIONS: OptionNumber[] = Array.from(
  { length: 12 },
  (_, i) => {
    const year = 2019 + i;
    return { value: year, label: `Tahun ${year}` };
  }
);

const Header = () => {
  const token = getToken() ?? '';

  const [tahun, setTahun] = useState<OptionNumber | null>(null);
  const [opd, setOpd] = useState<OptionString | null>(null);
  const [selectedOpd, setSelectedOpd] = useState<OptionString | null>(null);
  const [opdOptions, setOpdOptions] = useState<OptionString[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loadingOpd, setLoadingOpd] = useState(false);

  useEffect(() => {
    const cookieData = getOpdTahun();
    const userData = getUser();

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

    try {
      setLoadingOpd(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/opd/findall`,
        {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!res.ok) throw new Error('Fetch OPD gagal');

      const json = await res.json();
      setOpdOptions(
        json.data.map((item: any) => ({
          value: item.kode_opd,
          label: item.nama_opd,
        }))
      );
    } catch {
      AlertNotification({
        title: 'Gagal',
        text: 'Tidak bisa memuat data OPD',
        icon: 'error',
      });
    } finally {
      setLoadingOpd(false);
    }
  };

  const setCookie = (name: string, value: any) => {
    document.cookie = `${name}=${JSON.stringify(value)}; path=/`;
  };

  const handleAktifkan = () => {
    if (selectedOpd) setCookie('opd', selectedOpd);
    if (tahun) setCookie('tahun', tahun);

    AlertNotification({
      title: 'Berhasil',
      text: 'Perubahan berhasil diterapkan',
      icon: 'success',
    });

    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-gradient-to-r from-[#182C4E] to-[#17212D] px-4 py-3 text-white">
      <div>
        <p className="text-sm font-light">
          {user?.roles === 'super_admin'
            ? opd?.label ?? 'Pilih OPD'
            : user?.nama_pegawai}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {(user?.roles === 'super_admin' || user?.roles === 'reviewer') && (
          <Select
            placeholder="Pilih OPD"
            value={selectedOpd ?? opd}
            options={opdOptions}
            isLoading={loadingOpd}
            onMenuOpen={fetchOpd}
            onChange={(v) => setSelectedOpd(v)}
            styles={{
              control: (base) => ({
                ...base,
                minWidth: 160,
                borderRadius: 8,
              }),
            }}
          />
        )}

        <Select
          placeholder="Pilih Tahun"
          value={tahun}
          options={YEAR_OPTIONS}
          onChange={(v) => setTahun(v)}
          styles={{
            control: (base) => ({
              ...base,
              minWidth: 160,
              borderRadius: 8,
            }),
          }}
        />

        <button
          onClick={handleAktifkan}
          className="rounded-lg border border-white px-4 py-2 text-sm hover:bg-white hover:text-gray-800"
        >
          Aktifkan
        </button>

        {user?.roles && (
          <span className="rounded-lg border border-white px-3 py-2 text-sm">
            {user.roles.replace('_', ' ').toUpperCase()}
          </span>
        )}
      </div>
    </div>
  );
};

export default Header;
