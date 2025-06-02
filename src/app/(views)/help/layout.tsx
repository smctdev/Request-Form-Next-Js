import { Metadata } from "next";
import { ReactNode } from "react";

export function metadata(): Metadata {
  return {
    title: {
      default: "Help",
      template: "SMCT Group of Companies Request Form | Help | %s",
    },
    description: "SMCT Group of Companies Request Form help page.",
  };
}

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
