import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "AI Chatbot",
  description: "AI Assistant powered by Groq",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
