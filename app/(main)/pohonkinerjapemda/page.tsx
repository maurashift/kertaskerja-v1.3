import { Suspense } from "react";
import Link from "next/link";
import { FiHome } from "react-icons/fi";

import TematikKab from "@/components/pages/Pohon/TematikKab/TematikKab";
import { LoadingClip } from "@/lib/loading";

const PohonKinerjaPemdaPage = () => {
  return (
    <Suspense fallback={<LoadingClip />}>
      <nav className="flex items-center gap-1 mb-4 text-sm text-gray-700">
        <Link href="/" className="flex items-center hover:text-blue-600">
          <FiHome />
        </Link>
        <span>/</span>
        <span>Perencanaan Pemda</span>
        <span>/</span>
        <span className="font-medium">Pohon Kinerja Pemda</span>
      </nav>

      <TematikKab />
    </Suspense>
  );
};

export default PohonKinerjaPemdaPage;
