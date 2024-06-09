import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Footer, Header } from "@/components";
import { UserProvider } from '@/contexts/UserContext';


const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900",] });

export const metadata: Metadata = {
  title: "AUTOLOC Rental Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`relative overflow-x-hidden max-w-screen-xl mx-auto bg-mystic-100 ${poppins.className}`}>
            <UserProvider>
              <Header />
              {children}
              <Footer />
            </UserProvider>
        </body>
    </html>
  );
}
