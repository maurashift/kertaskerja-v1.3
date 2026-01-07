"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Select from "react-select";
import html2canvas from "html2canvas";
import { TbEye, TbPrinter } from "react-icons/tb";

import { getOpdTahun, getToken } from "@/lib/cookie";
import { ButtonBlackBorder, ButtonSky } from "@/components/ui/button";
import { TahunNull } from "@/components/global/OpdTahunNull";
import { AlertNotification, AlertQuestion2 } from "@/lib/alert";
import PohonTematik from "./PohonTematik";

type OptionType = {
  value: number;
  label: string;
};

const TematikKab = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = getToken();

  const containerRef = useRef<HTMLDivElement>(null);

  const [tahun, setTahun] = useState<OptionType | null>(null);
  const [opd, setOpd] = useState<OptionType | null>(null);
  const [tematikList, setTematikList] = useState<OptionType[]>([]);
  const [tematik, setTematik] = useState<OptionType | null>(null);

  const [loadingTematik, setLoadingTematik] = useState(false);
  const [loadingCetak, setLoadingCetak] = useState(false);
  const [showAll, setShowAll] = useState(false);

  /* ambil tahun & opd dari cookie */
  useEffect(() => {
    const data = getOpdTahun();
    if (data?.tahun) setTahun(data.tahun);
    if (data?.opd) setOpd(data.opd);
  }, []);

  /* sync tematik dari URL */
  useEffect(() => {
    const tema = searchParams.get("tema");
    const id = searchParams.get("id");

    if (tema && id) {
      setTematik({ label: tema, value: Number(id) });
    }
  }, [searchParams]);

  /* fetch list tematik */
  const fetchTematik = async () => {
    if (!tahun) return;

    setLoadingTematik(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pohon_kinerja/tematik/${tahun.value}`,
        {
          headers: {
            Authorization: token ?? "",
          },
        }
      );

      if (!res.ok) throw new Error("fetch gagal");

      const json = await res.json();
      setTematikList(
        json.data.map((item: any) => ({
          value: item.id,
          label: item.nama_pohon,
        }))
      );
    } catch {
      AlertNotification("Gagal mengambil data tematik", "", "error", 1500, true);
    } finally {
      setLoadingTematik(false);
    }
  };

  /* set tematik + update URL */
  const handleSelectTematik = (value: OptionType | null) => {
    setShowAll(false);

    if (!value) {
      setTematik(null);
      router.push("/pohonkinerjapemda");
      return;
    }

    setTematik(value);
    router.push(`/pohonkinerjapemda?tema=${value.label}&id=${value.value}`);
  };

  /* export pohon ke image */
  const handleCetak = async () => {
    if (!containerRef.current) return;

    const hiddenEls = document.querySelectorAll(
      ".hide-on-capture"
    ) as NodeListOf<HTMLElement>;
    hiddenEls.forEach((el) => (el.style.display = "none"));

    try {
      setLoadingCetak(true);

      const canvas = await html2canvas(containerRef.current, {
        scale: 2,
        useCORS: true,
      });

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `pohon_kinerja_${tahun?.label ?? "unknown"}.png`;
      link.click();
    } catch {
      AlertNotification("Gagal mencetak pohon", "", "error", 1500, true);
    } finally {
      hiddenEls.forEach((el) => (el.style.display = ""));
      setLoadingCetak(false);
    }
  };

  if (!tahun) return <TahunNull />;

  return (
    <>
      {/* SELECT TEMATIK */}
      <div className="p-5 border-2 rounded-xl mt-3">
        <label className="uppercase text-xs font-bold mb-2 block">
          Tema
        </label>
        <Select
          isClearable
          isSearchable
          isLoading={loadingTematik}
          options={tematikList}
          value={tematik}
          placeholder="Pilih Tematik"
          onChange={handleSelectTematik}
          onMenuOpen={() => tematikList.length === 0 && fetchTematik()}
        />
      </div>

      {/* ACTION BAR */}
      <div className="flex items-center justify-between p-5 border-2 rounded-t-xl mt-2">
        {!tematik ? (
          <p className="font-semibold">Pilih tematik terlebih dahulu</p>
        ) : (
          <>
            <ButtonBlackBorder onClick={() => setShowAll((v) => !v)}>
              <TbEye className="mr-1" />
              {showAll ? "Sembunyikan Semua" : "Tampilkan Semua"}
            </ButtonBlackBorder>

            <ButtonSky
              disabled={loadingCetak}
              onClick={() =>
                AlertQuestion2(
                  "Sembunyikan sidebar sebelum cetak?",
                  "",
                  "warning",
                  "Cetak",
                  "Batal"
                )//.then((res) => res.isConfirmed && handleCetak())
              }
            >
              <TbPrinter className="mr-1" />
              Cetak Pohon
            </ButtonSky>
          </>
        )}
      </div>

      {/* POHON */}
      {tematik && (
        <div className="border-2 border-t-0 rounded-b-xl p-3 h-[calc(100vh-180px)] overflow-auto">
          <div ref={containerRef} className="tf-tree text-center">
            <PohonTematik
              id={tematik.value}
              jenis="pemda"
              show_all={showAll}
              set_show_all={() => setShowAll(true)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default TematikKab;
