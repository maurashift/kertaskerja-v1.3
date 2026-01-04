'use client';

import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import {
  Controller,
  SubmitHandler,
  useForm,
  useFieldArray,
} from 'react-hook-form';
import {
  ButtonSky,
  ButtonRed,
  ButtonRedBorder,
  ButtonSkyBorder,
} from '@/components/ui/button';
import { LoadingButtonClip } from '@/lib/loading';
import { AlertNotification } from '@/lib/alert';
import { getOpdTahun, getToken } from '@/lib/cookie';
import { Pohon } from './Pohon';
import {
  TbCirclePlus,
  TbCircleX,
  TbDeviceFloppy,
} from 'react-icons/tb';

/* ================= TYPES ================= */

interface OptionTypeString {
  value: string;
  label: string;
}

interface Target {
  target: string;
  satuan: string;
}

interface Indikator {
  nama_indikator: string;
  targets: Target[];
}

interface TaggingPayload {
  nama_tagging: string;
  keterangan_tagging_program: {
    kode_program_unggulan: string;
    tahun: string;
  }[];
}

interface FormValue {
  nama_pohon: string;
  keterangan: string;
  kode_opd?: OptionTypeString | null;
  indikator: Indikator[];
}

/* ================= COMPONENT ================= */

export const FormPohonPemda: React.FC<{
  id: number | null;
  level: number;
  formId: number;
  onCancelAction?: () => void;
  pokin: 'pemda' | 'opd';
}> = ({ id, level, formId, onCancelAction }) => {
  const token = getToken();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // --- ADDED: isMount State ---
  const [isMount, setIsMount] = useState(false);

  const { control, handleSubmit } = useForm<FormValue>({
    defaultValues: { indikator: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'indikator',
  });

  const [tahun, setTahun] = useState<any>(null);
  const [opdOption, setOpdOption] = useState<OptionTypeString[]>([]);
  const [kodeOpd, setKodeOpd] = useState<OptionTypeString | null>(null);

  const [unggulanBupati, setUnggulanBupati] = useState(false);
  const [hariKerja, setHariKerja] = useState(false);
  const [unggulanPusat, setUnggulanPusat] = useState(false);

  const [bupatiValue, setBupatiValue] = useState<OptionTypeString[]>([]);
  const [hariKerjaValue, setHariKerjaValue] = useState<OptionTypeString[]>([]);
  const [pusatValue, setPusatValue] = useState<OptionTypeString[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [addedData, setAddedData] = useState<any>(null);

  /* ================= EFFECT ================= */

  useEffect(() => {
    // --- ADDED: Set isMount to true ---
    setIsMount(true);

    const data = getOpdTahun();
    if (data?.tahun) {
      setTahun({
        value: data.tahun.value,
        label: data.tahun.label,
      });
    }
  }, []);

  /* ================= API ================= */

  const fetchOpd = async () => {
    try {
      const res = await fetch(`${API_URL}/opd/findall`, {
        headers: { Authorization: token ?? '' },
      });
      const json = await res.json();
      setOpdOption(
        json.data.map((o: any) => ({
          value: o.kode_opd,
          label: o.nama_opd,
        }))
      );
    } catch {}
  };

  /* ================= SUBMIT ================= */

  const onSubmit: SubmitHandler<FormValue> = async (form) => {
    try {
      setSubmitting(true);

      const tagging: TaggingPayload[] = [];

      if (unggulanBupati) {
        tagging.push({
          nama_tagging: 'Program Unggulan Bupati',
          keterangan_tagging_program: bupatiValue.map((b) => ({
            kode_program_unggulan: b.value,
            tahun: String(tahun?.value),
          })),
        });
      }

      if (hariKerja) {
        tagging.push({
          nama_tagging: '100 Hari Kerja Bupati',
          keterangan_tagging_program: hariKerjaValue.map((h) => ({
            kode_program_unggulan: h.value,
            tahun: String(tahun?.value),
          })),
        });
      }

      if (unggulanPusat) {
        tagging.push({
          nama_tagging: 'Program Unggulan Pemerintah Pusat',
          keterangan_tagging_program: pusatValue.map((p) => ({
            kode_program_unggulan: p.value,
            tahun: String(tahun?.value),
          })),
        });
      }

      const payload = {
        nama_pohon: form.nama_pohon,
        keterangan: form.keterangan,
        parent: id,
        tahun: String(tahun?.value),
        kode_opd: level > 2 ? kodeOpd?.value : null,
        indikator: form.indikator.map((i) => ({
          indikator: i.nama_indikator,
          target: i.targets,
        })),
        tagging,
      };

      const res = await fetch(`${API_URL}/pohon_kinerja_admin/create`, {
        method: 'POST',
        headers: {
          Authorization: token ?? '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      const json = await res.json();
      setAddedData(json.data);

      AlertNotification(
        'Berhasil',
        'Pohon berhasil ditambahkan',
        'success',
      );
    } catch {
      AlertNotification(
        'Gagal',
        'Terjadi kesalahan server',
        'error',
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= RENDER ================= */

  // --- ADDED: Hydration Guard ---
  if (!isMount) return null;

  if (addedData) {
    return (
      <Pohon
        tema={addedData}
        deleteTrigger={() => null}
        set_show_all={() => null}
        idForm={formId}
      />
    );
  }

  return (
    <li>
      <div className="tf-nc tf w-150 rounded-lg shadow-lg p-4 bg-white">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="nama_pohon"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                placeholder="Nama Pohon"
                className="w-full border rounded px-3 py-2"
              />
            )}
          />

          {level > 2 && (
            <Select
              value={kodeOpd}
              options={opdOption}
              placeholder="Perangkat Daerah"
              onMenuOpen={fetchOpd}
              onChange={(v) => setKodeOpd(v)}
            />
          )}

          {fields.map((_, i) => (
            <div key={i} className="border p-3 rounded">
              <Controller
                name={`indikator.${i}.nama_indikator`}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    placeholder="Nama Indikator"
                    className="w-full border rounded px-2 py-1"
                  />
                )}
              />

              <Controller
                name={`indikator.${i}.targets.0.target`}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    placeholder="Target"
                    className="w-full border rounded px-2 py-1 mt-2"
                  />
                )}
              />

              <Controller
                name={`indikator.${i}.targets.0.satuan`}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    placeholder="Satuan"
                    className="w-full border rounded px-2 py-1 mt-2"
                  />
                )}
              />

              <ButtonRedBorder
                type="button"
                onClick={() => remove(i)}
                className="mt-2"
              >
                Hapus
              </ButtonRedBorder>
            </div>
          ))}

          <ButtonSkyBorder
            type="button"
            onClick={() =>
              append({
                nama_indikator: '',
                targets: [{ target: '', satuan: '' }],
              })
            }
          >
            <TbCirclePlus /> Tambah Indikator
          </ButtonSkyBorder>

          <Controller
            name="keterangan"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                placeholder="Keterangan"
                className="w-full border rounded px-3 py-2"
              />
            )}
          />

          <ButtonSky type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <LoadingButtonClip /> Menyimpan...
              </>
            ) : (
              <>
                <TbDeviceFloppy /> Simpan
              </>
            )}
          </ButtonSky>

          <ButtonRed type="button" onClick={onCancelAction}>
            <TbCircleX /> Batal
          </ButtonRed>
        </form>
      </div>
    </li>
  );
};