import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import styles from "@/styles/app/page.module.css";
import {MainDrawer} from "@/app/drawer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ConTracker",
  description: "Track contributions of teams in GitHub repositories",
};




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div>
          <header className={styles.pageHeader}>
            <div></div>
            <button>home</button>
            <h1>contracker</h1>
            <div className={styles.fillSpace}></div>
          </header>

          <div className={styles.mainContainer}>
            <MainDrawer/>
            <div className={styles.mainContent}>
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
