import { Suspense } from "react";
import TradingTerminalClient from "./TradingTerminalClient";

export function generateStaticParams() {
  return [
    { symbol: "DBX" },
    { symbol: "STRP" },
    { symbol: "SPX" },
    { symbol: "ANTH" },
    { symbol: "SHLD" },
    { symbol: "NURA" },
    { symbol: "RIPL" },
  ];
}

export default async function TradingTerminalPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = await params;
  return (
    <Suspense fallback={<div className="p-8 text-forge-gray-500 font-medium">Loading trading terminal...</div>}>
      <TradingTerminalClient symbol={symbol} />
    </Suspense>
  );
}
