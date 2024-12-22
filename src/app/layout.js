import { Suspense } from "react";
import "./globals.css";
import Providers from '@/components/Providers'

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html className="h-full bg-gray-900/80">
      <body className="h-full bg-gray-900/80">
        <Providers>
          <Suspense fallback={<div>Loading...</div>}>
            {children}
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
