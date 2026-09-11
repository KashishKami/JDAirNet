import type { Metadata } from "next"
import "../styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL("https://jdairnet.com"),
  title: {
    default: "JDAirNet | Fast Broadband & Lease Lines",
    template: "%s | JDAirNet",
  },
  description:
    "JDAirNet provides high-speed broadband for homes and dedicated lease lines for offices and businesses.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
