import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login | Life Reboot",
  description: "Login to your Life Reboot account",
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 