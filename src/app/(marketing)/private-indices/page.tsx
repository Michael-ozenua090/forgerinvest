import Link from 'next/link';

export default function PrivateIndicesPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12">
        <span className="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider rounded-full mb-6">
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Accredited Investors Only
        </span>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Forge Private Market Indices</h1>
        <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">
          Access diversified exposure to the late-stage private market through the Forge Accuidity Index and themed baskets.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Index Card */}
          <div className="border rounded-2xl p-8 bg-white shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Forge Accuidity Index</h2>
                <p className="text-gray-600">A broad benchmark tracking the performance of 60+ highly liquid private companies.</p>
              </div>
              <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded text-sm font-semibold">Live</span>
            </div>
            
            {/* Mock Chart Area */}
            <div className="w-full h-72 bg-gradient-to-b from-gray-50 to-white rounded-xl border border-gray-100 flex items-center justify-center mb-8 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 flex items-center justify-center">
                <svg className="w-full h-32 text-blue-500" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d="M0,100 L20,80 L40,85 L60,40 L80,50 L100,10" fill="none" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <span className="text-gray-400 font-medium z-10">[ NAV History Chart Visualization ]</span>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-100">
              <div className="text-center sm:text-left">
                <p className="text-sm text-gray-500 font-medium mb-1">YTD Return</p>
                <p className="text-2xl font-bold text-emerald-600">+14.2%</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm text-gray-500 font-medium mb-1">Constituents</p>
                <p className="text-2xl font-bold text-gray-900">64</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm text-gray-500 font-medium mb-1">Rebalanced</p>
                <p className="text-2xl font-bold text-gray-900">Quarterly</p>
              </div>
            </div>
          </div>

          {/* Themed Baskets */}
          <h3 className="text-2xl font-bold mt-12 mb-6">Themed Baskets</h3>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-xl p-6 bg-white hover:border-blue-300 hover:shadow-md transition group cursor-pointer">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition">Next-Gen AI 20</h4>
              <p className="text-gray-600 mb-6 line-clamp-2">Targeted exposure to the foundational models and AI infrastructure layer.</p>
              <div className="flex items-center text-sm font-semibold text-blue-600">
                View Methodology
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            <div className="border border-gray-200 rounded-xl p-6 bg-white hover:border-blue-300 hover:shadow-md transition group cursor-pointer">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-2 group-hover:text-indigo-600 transition">Space Tech Leaders</h4>
              <p className="text-gray-600 mb-6 line-clamp-2">The pioneers in commercial launch, satellite broadband, and lunar infrastructure.</p>
              <div className="flex items-center text-sm font-semibold text-indigo-600">
                View Methodology
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <h3 className="text-lg font-bold mb-6">Sector Breakdown</h3>
            {/* Mock Pie Chart Area */}
            <div className="w-full h-48 bg-white rounded-xl border border-gray-100 flex items-center justify-center mb-8 relative">
              <div className="w-32 h-32 rounded-full border-8 border-blue-500 border-r-indigo-500 border-b-purple-500 border-l-emerald-500"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-700">64<br/>Cos</span>
              </div>
            </div>
            <ul className="space-y-3">
              <li className="flex justify-between items-center text-sm"><div className="flex items-center"><span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span><span className="font-medium text-gray-700">Enterprise Software</span></div> <span className="font-bold text-gray-900">34%</span></li>
              <li className="flex justify-between items-center text-sm"><div className="flex items-center"><span className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></span><span className="font-medium text-gray-700">Fintech</span></div> <span className="font-bold text-gray-900">21%</span></li>
              <li className="flex justify-between items-center text-sm"><div className="flex items-center"><span className="w-3 h-3 rounded-full bg-purple-500 mr-2"></span><span className="font-medium text-gray-700">AI & Data</span></div> <span className="font-bold text-gray-900">18%</span></li>
              <li className="flex justify-between items-center text-sm"><div className="flex items-center"><span className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></span><span className="font-medium text-gray-700">Aerospace</span></div> <span className="font-bold text-gray-900">12%</span></li>
              <li className="flex justify-between items-center text-sm"><div className="flex items-center"><span className="w-3 h-3 rounded-full bg-gray-300 mr-2"></span><span className="font-medium text-gray-700">Other</span></div> <span className="font-bold text-gray-900">15%</span></li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white shadow-lg">
            <h3 className="text-xl font-bold mb-3">Ready to Invest?</h3>
            <p className="text-gray-300 text-sm mb-8 leading-relaxed">Create an account to view full index methodologies, historical data, and to express interest in index products.</p>
            <Link href="/register" className="block w-full py-3.5 px-4 bg-white text-gray-900 text-center font-bold rounded-xl hover:bg-gray-50 transition shadow-sm">
              Register for Access
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
