import { NextResponse } from "next/server";

// Fallback rates if external APIs fail or offline
const FALLBACK_RATES = {
  BTC: 65000,
  ETH: 2600,
  SOL: 150,
  USD: 1,
  GBP: 0.79,
};

export async function GET() {
  try {
    // 1. Fetch Crypto prices in USD and GBP with 5s timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const [cryptoRes, fiatRes] = await Promise.allSettled([
      fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd,gbp",
        {
          headers: { Accept: "application/json" },
          next: { revalidate: 60 },
          signal: controller.signal,
        }
      ),
      fetch("https://api.frankfurter.app/latest?from=USD&to=GBP", {
        headers: { Accept: "application/json" },
        next: { revalidate: 60 },
        signal: controller.signal,
      }),
    ]);

    clearTimeout(timeoutId);

    let btcUsd = FALLBACK_RATES.BTC;
    let ethUsd = FALLBACK_RATES.ETH;
    let solUsd = FALLBACK_RATES.SOL;
    let usdGbp = FALLBACK_RATES.GBP;

    if (cryptoRes.status === "fulfilled" && cryptoRes.value.ok) {
      const data = await cryptoRes.value.json();
      if (data?.bitcoin?.usd) btcUsd = data.bitcoin.usd;
      if (data?.ethereum?.usd) ethUsd = data.ethereum.usd;
      if (data?.solana?.usd) solUsd = data.solana.usd;
    }

    if (fiatRes.status === "fulfilled" && fiatRes.value.ok) {
      const data = await fiatRes.value.json();
      if (data?.rates?.GBP) usdGbp = data.rates.GBP;
    }

    const rates = {
      BTC: btcUsd,
      ETH: ethUsd,
      SOL: solUsd,
      USD: 1,
      GBP: usdGbp,
    };

    return NextResponse.json(
      {
        rates,
        timestamp: Date.now(),
        source: "live",
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
        },
      }
    );
  } catch (error) {
    // Graceful offline fallback
    return NextResponse.json(
      {
        rates: FALLBACK_RATES,
        timestamp: Date.now(),
        source: "fallback",
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
        },
      }
    );
  }
}
