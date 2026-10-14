import { BookOpen, TrendingUp, Landmark, ShieldCheck, ArrowRight } from "lucide-react";

export default function InsightsPage() {
  const featuredReports = [
    {
      title: "The Math of Compounding: 1 to 12 Month Growth Horizons",
      category: "Yield Strategy",
      icon: <TrendingUp className="w-6 h-6 text-forge-orange" />,
      bg: "bg-forge-orange/10",
      description: "How disciplined time-locks generate up to +1200% returns through algorithmic liquidity allocation."
    },
    {
      title: "Multi-Asset Wealth: Balancing Fiat and Digital Currencies",
      category: "Asset Allocation",
      icon: <Landmark className="w-6 h-6 text-forge-orange" />,
      bg: "bg-forge-orange/10",
      description: "Strategic advantages of locking USD, GBP, BTC, ETH, and SOL into fixed-term savings contracts."
    },
    {
      title: "Capital Protection in High-Yield Environments",
      category: "Risk Management",
      icon: <ShieldCheck className="w-6 h-6 text-forge-orange" />,
      bg: "bg-forge-orange/10",
      description: "Deep dive into our reserve backing models, automated maturity disbursements, and zero-loss risk frameworks."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6 sm:px-12">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-forge-orange/10 rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-forge-orange" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Capital Growth & Wealth Insights
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your educational hub for compound interest strategies, capital preservation models, and disciplined wealth creation across fiat and crypto assets.
          </p>
        </header>

        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Reports</h2>
            <button className="text-forge-orange font-medium hover:text-forge-orange-hover transition">View all reports</button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {featuredReports.map((report, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-lg transition-all duration-300 cursor-pointer">
                <div className={`h-32 ${report.bg} flex items-center justify-center`}>
                  <div className="bg-white p-4 rounded-full shadow-sm">
                    {report.icon}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">{report.category}</span>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-forge-orange transition-colors">{report.title}</h3>
                  <p className="text-gray-600 text-sm flex-1 mb-6">{report.description}</p>
                  <div className="mt-auto flex items-center text-sm font-semibold text-forge-orange group-hover:gap-2 transition-all">
                    Read Report <ArrowRight className="ml-1 w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 bg-gray-900 rounded-3xl p-10 md:p-16 text-center shadow-xl">
          <h2 className="text-3xl font-bold text-white mb-4">Never miss an insight</h2>
          <p className="text-gray-300 max-w-xl mx-auto mb-8">
            Subscribe to our weekly newsletter to get the latest capital growth models, compound yield updates, and wealth strategies delivered straight to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row max-w-md mx-auto gap-3">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-forge-orange text-gray-900"
              required 
            />
            <button type="submit" className="bg-forge-orange text-white px-6 py-3 rounded-lg hover:bg-forge-orange-hover transition font-medium whitespace-nowrap shadow-sm">
              Subscribe
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
