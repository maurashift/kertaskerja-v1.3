'use client'

import { useRouter } from "next/navigation"
import { useState } from "react"
import { LoadingButtonClip2 } from "@/lib/loading"

/* props dasar button */
interface ButtonProps {
  children: React.ReactNode
  type?: "button" | "submit" | "reset"
  className?: string
  halaman_url?: string
  onClick?: () => void
  disabled?: boolean
}

/* core button */
const BaseButton = ({
  children,
  type = "button",
  className = "",
  halaman_url,
  onClick,
  disabled,
}: ButtonProps) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    if (disabled || loading) return

    if (onClick) {
      onClick()
      return
    }

    if (halaman_url) {
      setLoading(true)
      router.push(halaman_url)
    }
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={handleClick}
      className={`px-3 py-1 flex items-center justify-center gap-2 rounded-lg transition ${className}`}
    >
      {loading && <LoadingButtonClip2 />}
      {children}
    </button>
  )
}

/*variant button*/

export const ButtonSky = (props: ButtonProps) => (
  <BaseButton
    {...props}
    className={`bg-gradient-to-r from-[#08C2FF] to-[#006BFF] hover:from-[#0584AD] hover:to-[#014CB2] text-white ${props.className}`}
  />
)

export const ButtonSkyBorder = (props: ButtonProps) => (
  <BaseButton
    {...props}
    className={`border-2 border-[#3072D6] text-[#3072D6] hover:bg-[#3072D6] hover:text-white ${props.className}`}
  />
)

export const ButtonGreen = (props: ButtonProps) => (
  <BaseButton
    {...props}
    className={`bg-gradient-to-r from-[#1CE978] to-[#11B935] hover:from-[#1EB281] hover:to-[#0D7E5C] text-white ${props.className}`}
  />
)

export const ButtonGreenBorder = (props: ButtonProps) => (
  <BaseButton
    {...props}
    className={`border-2 border-[#00A607] text-[#00A607] hover:bg-[#00A607] hover:text-white ${props.className}`}
  />
)

export const ButtonBlack = (props: ButtonProps) => (
  <BaseButton
    {...props}
    className={`bg-gradient-to-r from-[#1C201A] to-[#434848] hover:from-[#3A4238] hover:to-[#676C6F] text-white ${props.className}`}
  />
)

export const ButtonBlackBorder = (props: ButtonProps) => (
  <BaseButton
    {...props}
    className={`border-2 border-[#1C201A] text-[#1C201A] hover:bg-[#1C201A] hover:text-white ${props.className}`}
  />
)

export const ButtonRed = (props: ButtonProps) => (
  <BaseButton
    {...props}
    className={`bg-gradient-to-r from-[#DA415B] to-[#BC163C] hover:from-[#B7384D] hover:to-[#951230] text-white ${props.className}`}
  />
)

export const ButtonRedBorder = (props: ButtonProps) => (
  <BaseButton
    {...props}
    className={`border-2 border-[#D20606] text-[#D20606] hover:bg-[#D20606] hover:text-white ${props.className}`}
  />
)
