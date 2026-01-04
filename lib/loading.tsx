import React from "react"
import { ClipLoader, BeatLoader, SyncLoader } from "react-spinners"

/* props umum loader */
type LoaderProps = {
  loading?: boolean
  color?: string
  size?: number
  className?: string
  text?: string
}

/* wrapper loader */
const LoaderWrapper = ({
  children,
  text,
  className = "",
}: {
  children: React.ReactNode
  text?: string
  className?: string
}) => (
  <div
    className={`flex flex-col items-center justify-center px-5 py-3 ${className}`}
  >
    {children}
    {text && (
      <span className="mt-4 text-sm font-medium text-gray-700 uppercase">
        {text}
      </span>
    )}
  </div>
)

/* loader besar */
export const LoadingClip = ({
  loading = true,
  color = "#1f2937",
  size = 50,
  className,
  text = "Loading",
}: LoaderProps) => (
  <LoaderWrapper className={className} text={text}>
    <ClipLoader loading={loading} color={color} size={size} />
  </LoaderWrapper>
)

export const LoadingBeat = ({
  loading = true,
  color = "#1f2937",
  size = 20,
  className,
  text = "Loading",
}: LoaderProps) => (
  <LoaderWrapper className={className} text={text}>
    <BeatLoader loading={loading} color={color} size={size} />
  </LoaderWrapper>
)

export const LoadingSync = ({
  loading = true,
  color = "#1f2937",
  size = 10,
  className,
  text = "Loading",
}: LoaderProps) => (
  <LoaderWrapper className={className} text={text}>
    <SyncLoader loading={loading} color={color} size={size} />
  </LoaderWrapper>
)

/* loader kecil untuk button */
type ButtonLoaderProps = Omit<LoaderProps, "text">

export const LoadingButtonClip = ({
  loading = true,
  color = "#ffffff",
  size = 14,
  className = "",
}: ButtonLoaderProps) => (
  <span className={`flex items-center mr-2 ${className}`}>
    <ClipLoader loading={loading} color={color} size={size} />
  </span>
)

export const LoadingButtonClip2 = ({
  loading = true,
  color = "currentColor",
  size = 14,
  className = "",
}: ButtonLoaderProps) => (
  <span className={`flex items-center mr-2 ${className}`}>
    <ClipLoader loading={loading} color={color} size={size} />
  </span>
)
