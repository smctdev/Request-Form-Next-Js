import { ucfirst } from "@/utils/ucfirst";
import { Metadata } from "next";
import { ReactNode } from "react";

export function generateMetadata({
  params,
}: {
  params: { title: string };
}): Metadata {
  const { title } = params;
  return {
    title: `Print | ${ucfirst(title)}`,
    description: "SMCT Group of Companies Request Form print page.",
  };
}

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
