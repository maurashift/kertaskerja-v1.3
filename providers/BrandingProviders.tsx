'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { getOpdTahun, getUser } from "@/lib/cookie"

/* option types */
type OptionNumber = {
  value: number
  label: string
}

type OptionString = {
  value: string
  label: string
}

/* branding state */
type BrandingState = {
  title: string
  client: string
  logo: string
  api_perencanaan: string
  api_permasalahan: string
  api_csf: string
  tahun: OptionNumber | null
  opd: OptionString | null
  user: unknown
}

/* context value */
type BrandingProvidersValue = {
  branding: BrandingState
  loading: boolean
}

/* env config */
const ENV = {
  title: process.env.NEXT_PUBLIC_APP_NAME || "",
  client: process.env.NEXT_PUBLIC_CLIENT_NAME || "",
  logo: process.env.NEXT_PUBLIC_LOGO_URL || "",
  api_perencanaan: process.env.NEXT_PUBLIC_API_URL || "",
  api_permasalahan: process.env.NEXT_PUBLIC_API_URL_PERMASALAHAN || "",
  api_csf: process.env.NEXT_PUBLIC_API_URL_CSF || "",
}

/* context */
const BrandingProvidersContext =
  createContext<BrandingProvidersValue | null>(null)

/* provider */
export function BrandingProviders({ children }: { children: ReactNode }) {
  const [tahun, setTahun] = useState<OptionNumber | null>(null)
  const [opd, setOpd] = useState<OptionString | null>(null)
  const [user, setUser] = useState<unknown>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const { tahun, opd } = getOpdTahun()
    const userData = getUser()

    if (tahun) setTahun(tahun)
    if (opd) setOpd(opd)
    if (userData?.user) setUser(userData.user)

    setLoading(false)
  }, [])

  return (
    <BrandingProvidersContext.Provider
      value={{
        loading,
        branding: {
          ...ENV,
          tahun,
          opd,
          user,
        },
      }}
    >
      {children}
    </BrandingProvidersContext.Provider>
  )
}

/* hook */
export function useBrandingProviders() {
  const ctx = useContext(BrandingProvidersContext)
  if (!ctx) {
    throw new Error("useBrandingProviders harus dipakai di dalam BrandingProviders")
  }
  return ctx
}
