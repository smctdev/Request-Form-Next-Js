import { Metadata } from "next";
import { ReactNode } from "react";

export function metadata(): Metadata {
  return {
    title: "My Requests",
    description: "SMCT Group of Companies Request Form my requests page.",
  };
}

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
