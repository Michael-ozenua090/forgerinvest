import Link from 'next/link';

export default function MarketplacePage() {
  const stocks = [
    { name: 'Databricks', sector: 'Data & AI', forgePrice: '$73.50', valuation: '$43B' },
    { name: 'Stripe', sector: 'Fintech', forgePrice: '$42.10', valuation: '$65B' },
    { name: 'SpaceX', sector: 'Aerospace', forgePrice: '$112.00', valuation: '$180B' },
    { name: 'Anthropic', sector: 'AI', forgePrice: '$30.25', valuation: '$18B' },
    { name: 'Shield AI', sector: 'Defense', forgePrice: '$15.80', valuation: '$2.8B' },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">Forge Marketplace</h1>
      <p className="text-xl text-gray-600 mb-8">Discover pre-IPO opportunities with real-time Forge Price™ data.</p>
      
      <div className="flex flex-wrap gap-4 mb-8">
        <button className="px-4 py-2 bg-gray-200 rounded-full font-medium">All Sectors</button>
        <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition">Data & AI</button>
        <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition">Fintech</button>
        <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition">Aerospace</button>
        <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition">Defense</button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stocks.map((stock) => (
          <div key={stock.name} className="border rounded-xl p-6 bg-white hover:shadow-lg transition-all relative group overflow-hidden">
            <h3 className="text-2xl font-semibold mb-2">{stock.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{stock.sector}</p>
            <div className="flex justify-between items-end mb-2">
              <div>
                <p className="text-sm text-gray-500">Forge Price™</p>
                <p className="text-xl font-bold">{stock.forgePrice}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Implied Valuation</p>
                <p className="text-lg font-medium">{stock.valuation}</p>
              </div>
            </div>
            
            {/* Overlay prompt on hover */}
            <div className="absolute inset-0 bg-white/95 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-center p-6 transition-opacity rounded-xl border-2 border-blue-500 z-10">
              <p className="text-lg font-medium mb-4">Sign In or Register to Access Live Order Books & Execute Trades</p>
              <div className="flex gap-3">
                <Link href="/login" className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
                  Sign In
                </Link>
                <Link href="/register" className="px-4 py-2 bg-gray-100 text-blue-600 font-medium rounded-lg hover:bg-gray-200 transition">
                  Register
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
