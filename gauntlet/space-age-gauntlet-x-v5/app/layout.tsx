import "./globals.css";
import type { Metadata } from "next";
export const metadata:Metadata={title:"Space Age Gauntlet X V3",description:"Autonomous quality-orchestration compiler and runner"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
