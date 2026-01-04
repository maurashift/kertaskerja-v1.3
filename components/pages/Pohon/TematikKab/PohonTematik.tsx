"use client";

import "@/components/pages/Pohon/treeflex.css";

import { useEffect, useState } from "react";
import { LoadingBeat } from "@/lib/loading";
import { Pohon } from "@/components/pages/Pohon/Pemda/Pohon";
import { PohonLaporan } from "@/components/lib/Pohon/Cascading/PohonLaporan";
import { getOpdTahun, getToken, getUser } from "@/lib/cookie";

type JenisPohon = "pemda" | "laporan" | "";

interface PohonTematikProps {
  id: number;
  jenis: JenisPohon;
  show_all: boolean;
  set_show_all: () => void;
}

interface TahunOption {
  value: number;
  label: string;
}

interface TematikItem {
  id: number;
  parent: number;
  tema: string;
  taget: string;
  satuan: string;
  keterangan: string;
  indikators: string;
  childs: unknown[];
}

const PohonTematik = ({
  id,
  jenis,
  show_all,
  set_show_all,
}: PohonTematikProps) => {
  const token = getToken();

  const [dataPohon, setDataPohon] = useState<TematikItem[]>([]);
  const [tahun, setTahun] = useState<TahunOption | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(false);

  useEffect(() => {
    const opd = getOpdTahun();
    const user = getUser();

    if (opd?.tahun) {
      setTahun({
        value: opd.tahun.value,
        label: opd.tahun.label,
      });
    }

    if (user?.user?.roles) {
      setUserRole(user.user.roles);
    }
  }, []);

  useEffect(() => {
    if (!id || !tahun?.value || !jenis) return;

    const fetchPohon = async () => {
      setLoading(true);
      setError(null);

      try {
        const basePemda = process.env.NEXT_PUBLIC_API_URL;
        const baseLaporan = process.env.NEXT_PUBLIC_API_URL_CASCADING_PEMDA;

        const url =
          jenis === "pemda"
            ? `${basePemda}/pohon_kinerja_admin/tematik/${id}`
            : `${baseLaporan}/laporan/cascading_pemda?tematikId=${id}&tahun=${tahun.value}`;

        const res = await fetch(url, {
          headers: {
            Authorization: token ?? "",
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error();
        }

        const json = await res.json();
        setDataPohon(
          jenis === "pemda" ? json?.data ?? [] : json?.data?.[0] ?? []
        );
      } catch {
        setError("Gagal memuat data pohon kinerja");
      } finally {
        setLoading(false);
      }
    };

    fetchPohon();
  }, [id, jenis, tahun, token, refreshKey]);

  if (loading) {
    return <LoadingBeat className="mx-5 py-5" />;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <ul>
      {jenis === "pemda" && (
        <Pohon
          tema={dataPohon}
          tahun={tahun?.value}
          user={userRole}
          show_all={show_all}
          set_show_all={set_show_all}
          deleteTrigger={() => setRefreshKey((v) => !v)}
        />
      )}

      {jenis === "laporan" && (
        <PohonLaporan
          tema={dataPohon}
          show_all={show_all}
          set_show_all={set_show_all}
        />
      )}
    </ul>
  );
};

export default PohonTematik;
