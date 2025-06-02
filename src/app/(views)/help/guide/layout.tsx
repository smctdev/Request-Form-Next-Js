import { Metadata } from "next";
import { ReactNode } from "react";

export function metadata(): Metadata {
  return {
    title: "Guide",
    description: "SMCT Group of Companies Request Form guide page.",
  };
}

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
