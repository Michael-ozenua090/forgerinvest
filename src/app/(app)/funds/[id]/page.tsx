import { Suspense } from "react";
import FundDetailClient from "./FundDetailClient";

export function generateStaticParams() {
  return [
    { id: "accuidity" },
    { id: "ai20" },
  ];
}

export default async function FundDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense fallback={<div className="p-8 text-forge-gray-500 font-medium">Loading fund details...</div>}>
      <FundDetailClient id={id} />
    </Suspense>
  );
}
