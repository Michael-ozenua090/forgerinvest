import { BookOpen, TrendingUp, Cpu, LineChart, ArrowRight } from "lucide-react";

export default function InsightsPage() {
  const featuredReports = [
    {
      title: "Pre-IPO Liquidity Trends 2026",
      category: "Market Report",
      icon: <TrendingUp className="w-6 h-6 text-purple-600" />,
      bg: "bg-purple-50",
      description: "An in-depth analysis of secondary market volumes, valuation multiples, and liquidity timelines ahead of expected IPOs."
    },
    {
      title: "AI Startup Valuations",
      category: "Sector Analysis",
      icon: <Cpu className="w-6 h-6 text-emerald-600" />,
      bg: "bg-emerald-50",
      description: "How generative AI platforms and foundational model companies are driving unprecedented private round valuations."
    },
    {
      title: "The Tech IPO Pipeline",
      category: "Quarterly Outlook",
      icon: <LineChart className="w-6 h-6 text-blue-600" />,
      bg: "bg-blue-50",
      description: "A comprehensive look at the late-stage companies most likely to enter the public markets over the next 18 months."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6 sm:px-12">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-blue-700" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Private Market Insights
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your editorial hub for institutional-grade research, data-driven analysis, and expert commentary on the private markets.
          </p>
        </header>

        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Reports</h2>
            <button className="text-blue-600 font-medium hover:text-blue-800 transition">View all reports</button>
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
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{report.title}</h3>
                  <p className="text-gray-600 text-sm flex-1 mb-6">{report.description}</p>
                  <div className="mt-auto flex items-center text-sm font-semibold text-blue-600 group-hover:gap-2 transition-all">
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
            Subscribe to our weekly newsletter to get the latest private market data, research, and expert analysis delivered straight to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row max-w-md mx-auto gap-3">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              required 
            />
            <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
