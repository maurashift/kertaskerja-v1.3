'use client';

import React, { useEffect, useState } from "react";
import {
  TbEye,
  TbArrowGuide,
  TbCheck,
  TbX,
  TbCirclePlus,
  TbPencil,
  TbTrash,
  TbBookmarkPlus,
  TbZoom,
  TbPrinter,
  TbCopy,
  TbHourglass,
  TbCircleLetterXFilled,
  TbCircleCheckFilled,
} from "react-icons/tb";

import {
  ButtonSky,
  ButtonSkyBorder,
  ButtonRedBorder,
  ButtonGreenBorder,
  ButtonBlack,
} from "@/components/ui/button";

import { AlertNotification, AlertQuestion } from "@/lib/alert";
import { LoadingClip } from "@/lib/loading";

import { getToken } from "@/lib/cookie";
import {
  FormPohonPemda,
  FormAmbilPohon,
  FormEditPohon,
} from "./FormPohonPemda";

import { ModalReview } from "@/components/pages/Pohon/ModalReview";
import { ModalClone } from "@/components/pages/Pohon/ModalClone";
import { ModalCetak } from "@/components/pages/Pohon/ModalCetak";

/* util */
const uid = () => Date.now();
const toggle = (fn: React.Dispatch<React.SetStateAction<boolean>>) =>
  fn((p) => !p);

/*component*/

export const Pohon = ({
  tema,
  user,
  tahun,
  show_all,
  deleteTrigger,
  set_show_all,
}: any) => {
  const token = getToken();

  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const [editedData, setEditedData] = useState<any>(null);

  const [formList, setFormList] = useState<number[]>([]);
  const [putList, setPutList] = useState<number[]>([]);
  const [strategicForms, setStrategicForms] = useState<number[]>([]);

  const [isCetak, setIsCetak] = useState(false);
  const [isClone, setIsClone] = useState(false);

  const [reviews, setReviews] = useState<any[]>([]);
  const [showReview, setShowReview] = useState(false);
  const [loadingReview, setLoadingReview] = useState(false);
  const [isNewReview, setIsNewReview] = useState(false);
  const [isEditReview, setIsEditReview] = useState(false);
  const [reviewId, setReviewId] = useState<number | null>(null);

  useEffect(() => {
    setShow(!!show_all);
  }, [show_all]);

  /*API*/

  const fetchReview = async () => {
    const API = process.env.NEXT_PUBLIC_API_URL;
    try {
      setLoadingReview(true);
      const res = await fetch(`${API}/review_pokin/findall/${tema.id}`, {
        headers: { Authorization: token },
      });
      const json = await res.json();
      setReviews(json?.data || []);
    } catch {
      setReviews([]);
    } finally {
      setLoadingReview(false);
    }
  };

  const hapusReview = async (id: number) => {
    const API = process.env.NEXT_PUBLIC_API_URL;
    try {
      await fetch(`${API}/review_pokin/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: token },
      });
      AlertNotification("Berhasil", "Review dihapus", "success", 1200, false);
      fetchReview();
    } catch {
      AlertNotification("Gagal", "Server error", "error", 1500, false);
    }
  };

  const hapusPohon = async (id: number) => {
    const API = process.env.NEXT_PUBLIC_API_URL;
    try {
      await fetch(`${API}/pohon_kinerja_admin/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: token },
      });
      AlertNotification("Berhasil", "Pohon dihapus", "success", 1200, false);
      setDeleted(true);
      deleteTrigger();
    } catch {
      AlertNotification("Gagal", "Server error", "error", 1500, false);
    }
  };

  const toggleAktif = async () => {
    const API = process.env.NEXT_PUBLIC_API_URL;
    try {
      await fetch(`${API}/pokin/activation_tematik/${tema.id}`, {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_active: !tema.is_active }),
      });
      deleteTrigger();
    } catch {}
  };

  if (deleted) return null;

  /*render*/

  return (
    <li>
      {edit ? (
        <FormEditPohon
          id={tema.id}
          level={tema.level_pohon}
          pokin="pemda"
          onCancel={() => setEdit(false)}
          EditBerhasil={(d: any) => {
            setEditedData(d);
            setEdit(false);
          }}
        />
      ) : (
        <div className="tf-nc tf w-[600px] rounded-lg shadow-lg bg-white p-3">

          {/* HEADER */}
          <div className="font-bold text-center uppercase mb-2">
            {tema.jenis_pohon} #{tema.id}
            {!tema.is_active && (
              <span className="ml-2 px-2 py-1 text-xs bg-red-500 text-white rounded">
                NON-AKTIF
              </span>
            )}
          </div>

          {/* BODY */}
          <TablePohon item={editedData || tema} />

          {/* REVIEW */}
          {showReview && (
            <div className="mt-3">
              {loadingReview ? (
                <LoadingClip />
              ) : reviews.length === 0 ? (
                <p className="text-center">tidak ada review</p>
              ) : (
                reviews.map((r) => (
                  <div key={r.id} className="border p-2 mb-2 rounded">
                    <p>{r.review}</p>
                    <small>{r.nama_pegawai}</small>
                    <div className="flex gap-2 mt-2">
                      <ButtonSkyBorder
                        onClick={() => {
                          setIsEditReview(true);
                          setReviewId(r.id);
                        }}
                      >
                        <TbPencil />
                      </ButtonSkyBorder>
                      <ButtonRedBorder
                        onClick={() =>
                          AlertQuestion(
                            "Hapus?",
                            "Hapus review",
                            "question",
                            "Hapus",
                            "Batal"
                          ).then((res) => res.isConfirmed && hapusReview(r.id))
                        }
                      >
                        <TbTrash />
                      </ButtonRedBorder>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ACTION */}
          <div className="flex flex-wrap gap-2 justify-center mt-3 hide-on-capture">
            <ButtonSkyBorder onClick={() => toggle(setShow)}>
              <TbEye /> {show ? "Sembunyikan" : "Tampilkan"}
            </ButtonSkyBorder>

            {user !== "reviewer" && (
              <>
                <ButtonSkyBorder onClick={() => setEdit(true)}>
                  <TbPencil /> Edit
                </ButtonSkyBorder>

                <ButtonSky onClick={() => setIsCetak(true)}>
                  <TbPrinter /> Cetak
                </ButtonSky>

                <ButtonBlack onClick={() => setIsClone(true)}>
                  <TbCopy /> Clone
                </ButtonBlack>

                <ButtonRedBorder
                  onClick={() =>
                    AlertQuestion(
                      "Hapus?",
                      "Pohon akan terhapus",
                      "question",
                      "Hapus",
                      "Batal"
                    ).then((r) => r.isConfirmed && hapusPohon(tema.id))
                  }
                >
                  <TbTrash /> Hapus
                </ButtonRedBorder>

                {tema.jenis_pohon === "Tematik" && (
                  <button
                    className="border px-3 py-1 rounded"
                    onClick={toggleAktif}
                  >
                    {tema.is_active ? <TbX /> : <TbCheck />}{" "}
                    {tema.is_active ? "Nonaktifkan" : "Aktifkan"}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* CHILD */}
      {show && (
        <ul>
          {tema.childs?.map((d: any) => (
            <Pohon
              key={d.id}
              tema={d}
              user={user}
              show_all={show_all}
              set_show_all={set_show_all}
              deleteTrigger={deleteTrigger}
            />
          ))}
        </ul>
      )}

      {/* MODAL */}
      <ModalReview
        jenis="baru"
        pokin="pemda"
        isOpen={isNewReview}
        idPohon={tema.id}
        onClose={() => setIsNewReview(false)}
        onSuccess={fetchReview}
      />

      <ModalReview
        jenis="lama"
        pokin="pemda"
        id={reviewId}
        isOpen={isEditReview}
        idPohon={tema.id}
        onClose={() => setIsEditReview(false)}
        onSuccess={fetchReview}
      />

      <ModalClone
        jenis="pemda"
        isOpen={isClone}
        nama_pohon={tema.tema}
        tahun={tahun}
        id={tema.id}
        kode_opd=""
        onClose={() => setIsClone(false)}
        onSuccess={deleteTrigger}
      />

      <ModalCetak
        jenis="non_cascading"
        pohon={tema}
        isOpen={isCetak}
        onClose={() => setIsCetak(false)}
      />
    </li>
  );
};

/*table*/

export const TablePohon = ({ item }: any) => {
  const {
    tema,
    nama_pohon,
    indikator,
    keterangan,
    perangkat_daerah,
    status,
    tagging,
  } = item;

  return (
    <div className="border rounded p-2">
      <p className="font-semibold">{tema || nama_pohon}</p>
      <p>{keterangan || "-"}</p>

      {tagging?.map((t: any) => (
        <div key={t.id} className="mt-2 border p-2 rounded bg-yellow-50">
          <TbCircleCheckFilled /> {t.nama_tagging}
        </div>
      ))}

      {status && (
        <div className="mt-2">
          {status === "menunggu_disetujui" && (
            <span>
              {status} <TbHourglass />
            </span>
          )}
          {status === "disetujui" && (
            <span className="text-green-500">
              {status} <TbCheck />
            </span>
          )}
          {status === "ditolak" && (
            <span className="text-red-500">
              {status} <TbCircleLetterXFilled />
            </span>
          )}
        </div>
      )}
    </div>
  );
};
