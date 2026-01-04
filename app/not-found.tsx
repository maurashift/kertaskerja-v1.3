import Link from "next/link"

/* halaman 404 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="text-center max-w-md">
        <h1 className="text-7xl font-extrabold text-red-600">404</h1>

        <h2 className="mt-4 text-2xl font-semibold text-gray-800">
          Halaman tidak ditemukan
        </h2>

        <p className="mt-3 text-gray-600 leading-relaxed">
          Halaman yang kamu cari tidak tersedia atau alamat URL-nya salah.
        </p>

        <Link
          href="/"
          className="inline-block mt-8 px-6 py-3 rounded-lg
                     bg-blue-600 text-white font-medium
                     hover:bg-blue-700 transition"
        >
          Kembali ke beranda
        </Link>
      </div>
    </div>
  )
}
