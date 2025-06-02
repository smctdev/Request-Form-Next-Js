import { ucfirst } from "@/utils/ucfirst";
import { Metadata } from "next";
import { ReactNode } from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ title: string }>;
}): Promise<Metadata> {
  const { title } = await params;
  return {
    title: `Print | ${ucfirst(title)}`,
    description: "SMCT Group of Companies Request Form print page.",
  };
}

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
