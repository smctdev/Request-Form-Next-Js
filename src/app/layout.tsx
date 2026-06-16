import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import BaseContent from "@/components/layouts/BaseContent";
import { NotificationProvider } from "@/context/NotificationContext";
import { ThemeProvider } from "@/context/theme-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SMCT Request Form | Home",
    template: "SMCT Request Form | %s",
  },
  description: "SMCT Group of Companies Request Form",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              <BaseContent children={children} />
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
        <script>
          console.info("%c 𝒮𝑀𝒞𝒯", "font-family:monospace; font-weight: 900;
          font-size: 120px;color: red; text-shadow: 3px 3px 0 rgb(217,324, 422)
          , 6px 6px 0 rgb(333,91,14) , 9px 9px 0 rgb(122,221,8) , 12px 12px 0
          rgb(5,45,68) , 15px 15px 0 rgb(2,22,206) , 18px 18px 0 rgb(4,77,155) ,
          21px 21px 0 rgb(42,21,155)"), console.info("%c 𝓡𝓮𝓺𝓾𝓮𝓼𝓽",
          "font-family:monospace; font-weight: 900; font-size: 120px;color: red;
          text-shadow: 3px 3px 0 rgb(217,324, 422) , 6px 6px 0 rgb(333,91,14) ,
          9px 9px 0 rgb(122,221,8) , 12px 12px 0 rgb(5,45,68) , 15px 15px 0
          rgb(2,22,206) , 18px 18px 0 rgb(4,77,155) , 21px 21px 0
          rgb(42,21,155)"), console.info("%c 𝓕𝓸𝓻𝓶", "font-family:monospace;
          font-weight: 900; font-size: 120px;color: red; text-shadow: 3px 3px 0
          rgb(217,324, 422) , 6px 6px 0 rgb(333,91,14) , 9px 9px 0
          rgb(122,221,8) , 12px 12px 0 rgb(5,45,68) , 15px 15px 0 rgb(2,22,206)
          , 18px 18px 0 rgb(4,77,155) , 21px 21px 0 rgb(42,21,155)"),
          console.info("%c 𝓢𝔂𝓼𝓽𝓮𝓶", "font-family:monospace; font-weight: 900;
          font-size: 120px;color: red; text-shadow: 3px 3px 0 rgb(217,324, 422)
          , 6px 6px 0 rgb(333,91,14) , 9px 9px 0 rgb(122,221,8) , 12px 12px 0
          rgb(5,45,68) , 15px 15px 0 rgb(2,22,206) , 18px 18px 0 rgb(4,77,155) ,
          21px 21px 0 rgb(42,21,155)")
        </script>
      </body>
    </html>
  );
}
