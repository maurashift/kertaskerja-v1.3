'use client';

import Link from 'next/link';
import { TbDownload, TbBook2, TbCircleFilled } from 'react-icons/tb';
import { useBrandingProviders } from '@/providers/BrandingProviders';
import { LoadingClip } from '@/lib/loading';
import { ButtonSky } from '@/components/ui/button';

const Dashboard = () => {
  const { loading, branding } = useBrandingProviders();
  const manualUserLink =
    process.env.NEXT_PUBLIC_LINK_MANUAL_USER ||
    'https://drive.google.com/drive/folders/1xFqVRchn8eCRtMLhWvqSb78qDxTXB9Y1?usp=sharing';

  if (loading) {
    return <LoadingClip />;
  }

  const user = branding?.user;
  const isAdmin =
    user?.roles === 'super_admin' || user?.roles === 'reviewer';

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border border-emerald-500 p-5">
        <p className="flex items-center gap-2 font-bold">
          <TbCircleFilled className="text-emerald-500" />
          Selamat Datang,&nbsp;
          {user?.nama_pegawai ?? 'di halaman dashboard'}
        </p>

        {!isAdmin && (
          <p className="text-sm text-gray-700">
            {user?.nama_opd ?? 'Tidak terdaftar di OPD manapun'}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-sky-500 p-5">
        <h1 className="flex items-center gap-3 font-semibold">
          <TbBook2 className="text-4xl rounded-full border border-black p-1" />
          Download Panduan Website (Manual User)
        </h1>

        <Link
          href={manualUserLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ButtonSky className="flex items-center gap-2">
            <TbDownload />
            Download
          </ButtonSky>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
