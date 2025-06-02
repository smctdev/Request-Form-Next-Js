import { Metadata } from "next";
import CreateRequestBase from "./_components/CreateRequestBase";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ title?: string }>;
}): Promise<Metadata> {
  const { title } = await searchParams;
  return {
    title: `Create Request | ${title}`,
    description: `SMCT Group of Companies Request Form create request page. ${title}`,
  };
}

export default async function CreateRequest({
  searchParams,
}: {
  searchParams: Promise<{ title: string }>;
}) {
  const { title } = await searchParams;
  return (
    <>
      <CreateRequestBase title={title} />
    </>
  );
}
