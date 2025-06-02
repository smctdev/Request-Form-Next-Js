import { Metadata } from "next";
import { ReactNode } from "react";

export function metadata(): Metadata {
  return {
    title: "Setup",
    description: "SMCT Group of Companies Request Form setup page.",
  };
}

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
