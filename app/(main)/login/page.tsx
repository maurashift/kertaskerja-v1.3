'use client'

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { TbEye, TbEyeClosed } from "react-icons/tb"

import { ButtonSky } from "@/components/ui/button"
import { LoadingButtonClip } from "@/lib/loading"
import { login } from "@/lib/cookie"
import { useBrandingProviders } from "@/providers/BrandingProviders"

const LoginPage = () => {
  const router = useRouter()
  const { branding } = useBrandingProviders()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await login(username, password)
      router.replace("/")
    } catch (err: any) {
      setError(
        typeof err?.message === "string"
          ? err.message
          : "Login gagal. Periksa NIP atau password."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center w-full h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-96 rounded-lg bg-white p-8 shadow-md"
      >
        <div className="mb-6 flex flex-col items-center">
          <Image
            src="https://logo.kertaskerja.cc/logo/kab-mahakam-ulu-2.png"
            alt="Logo"
            width={90}
            height={90}
            priority
          />
          <h1 className="mt-3 text-center text-2xl font-bold uppercase">
            Data Kinerja
          </h1>
          <p className="text-center text-sm text-gray-600">
            Kabupaten Sukoharjo
          </p>
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            NIP
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Masukkan NIP"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500"
          />
        </div>

        <div className="mb-5">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Masukkan password"
              className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            >
              {showPassword ? <TbEye /> : <TbEyeClosed />}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-300 bg-red-100 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <ButtonSky type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <LoadingButtonClip />
              Login...
            </span>
          ) : (
            "Login"
          )}
        </ButtonSky>
      </form>
    </div>
  )
}

export default LoginPage
