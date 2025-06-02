import { Metadata } from "next";
import { ReactNode } from "react";

export function metadata(): Metadata {
  return {
    title: "Profile",
    description: "SMCT Group of Companies Request Form profile page.",
  };
}

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
