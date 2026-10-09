export default function ForgePricePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold mb-6 tracking-tight">A Daily Standard for Private Market Valuations</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          The Forge Price™ is a sophisticated pricing model that brings transparency and daily valuations to the private market.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="p-8 bg-blue-50 rounded-2xl border border-blue-100">
          <div className="text-3xl font-bold text-blue-600 mb-4">1</div>
          <h3 className="text-xl font-semibold mb-3 text-blue-900">Secondary Trades Weighting</h3>
          <p className="text-blue-800/80 leading-relaxed">We incorporate recent secondary market transactions, weighting them by volume and recency to reflect actual market clearing prices.</p>
        </div>
        <div className="p-8 bg-purple-50 rounded-2xl border border-purple-100">
          <div className="text-3xl font-bold text-purple-600 mb-4">2</div>
          <h3 className="text-xl font-semibold mb-3 text-purple-900">Company Disclosures (COIs)</h3>
          <p className="text-purple-800/80 leading-relaxed">Our model integrates official primary funding rounds and 409A valuations to ground the price in fundamental company events.</p>
        </div>
        <div className="p-8 bg-emerald-50 rounded-2xl border border-emerald-100">
          <div className="text-3xl font-bold text-emerald-600 mb-4">3</div>
          <h3 className="text-xl font-semibold mb-3 text-emerald-900">Multi-Source Consensus</h3>
          <p className="text-emerald-800/80 leading-relaxed">We aggregate institutional IOIs and bid/ask spreads from our proprietary order book to capture real-time market sentiment.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto bg-white border rounded-2xl shadow-sm p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Interactive Sample: Forge Price™ Updates</h2>
        <div className="flex flex-col sm:flex-row justify-between items-center p-6 bg-gray-50 rounded-xl border border-gray-100">
          <div className="mb-4 sm:mb-0 text-center sm:text-left">
            <h4 className="text-lg font-semibold">Example Corp</h4>
            <p className="text-sm text-gray-500">Last updated: Today, 9:30 AM EST</p>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-4xl font-bold text-blue-600">$45.20</p>
            <p className="text-sm text-emerald-600 font-medium mt-1">↑ +$1.20 (2.7%) since yesterday</p>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-3 gap-2 text-center text-xs text-gray-500">
          <div className="p-3 border rounded bg-white hover:bg-blue-50 transition cursor-pointer">Secondary Match<br/><span className="font-semibold text-gray-700">+$0.50</span></div>
          <div className="p-3 border rounded bg-white hover:bg-purple-50 transition cursor-pointer">New 409A<br/><span className="font-semibold text-gray-700">+$0.30</span></div>
          <div className="p-3 border rounded bg-white hover:bg-emerald-50 transition cursor-pointer">Order Book Demand<br/><span className="font-semibold text-gray-700">+$0.40</span></div>
        </div>
        <p className="text-sm text-center text-gray-500 mt-6">Hover over the components to see how they affect the final daily calculation.</p>
      </div>
    </div>
  );
}
