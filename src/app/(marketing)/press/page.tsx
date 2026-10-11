import { Download, FileText, Mail, ArrowRight } from "lucide-react";

export default function PressPage() {
  const releases = [
    {
      date: "October 5, 2026",
      title: "Forge Capital Reports Record Inflows in Fixed-Term Growth Plans",
      excerpt: "Fixed-term capital commitments across 1-month and 12-month plans reached new milestones as savers seek predictable, contracted compound yields."
    },
    {
      date: "September 12, 2026",
      title: "Forge Expands Digital Asset Yield Rails with BTC, ETH, and SOL Integration",
      excerpt: "New infrastructure integrations provide seamless deposits and fixed-yield contracts for major cryptocurrencies alongside USD and GBP."
    },
    {
      date: "August 20, 2026",
      title: "Forge Launches Educational Simulator for High-Yield Capital Accumulation",
      excerpt: "Interactive wealth simulation features, real-time FX rate conversions, and disciplined savings calculators are now live for all platform members."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6 sm:px-12">
      <div className="max-w-5xl mx-auto">
        <header className="mb-16 border-b border-gray-200 pb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            News & Press Releases
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Stay updated with the latest announcements, platform milestones, and news from Forge Capital.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Announcements</h2>
            {releases.map((release, idx) => (
              <article key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <span className="text-sm font-semibold text-forge-orange mb-2 block">{release.date}</span>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{release.title}</h3>
                <p className="text-gray-600 mb-4">{release.excerpt}</p>
                <a href="#" className="inline-flex items-center text-forge-orange font-medium hover:text-forge-orange-hover transition">
                  Read full release <ArrowRight className="ml-1 w-4 h-4" />
                </a>
              </article>
            ))}
          </div>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-forge-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-forge-orange" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Media Kit</h3>
              <p className="text-gray-600 text-sm mb-6">
                Download our official logos, executive headshots, and brand guidelines.
              </p>
              <button className="w-full bg-forge-orange text-white px-4 py-2.5 rounded-lg hover:bg-forge-orange-hover transition font-medium flex items-center justify-center gap-2 shadow-sm">
                <FileText className="w-4 h-4" /> Download Assets
              </button>
            </div>

            <div className="bg-gray-900 text-white p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold mb-2">Press Contact</h3>
              <p className="text-gray-400 text-sm mb-6">
                For media inquiries, interviews, or speaking engagements, please contact our PR team.
              </p>
              <a href="mailto:press@forgeinvest.example.com" className="inline-flex items-center gap-2 text-white bg-gray-800 hover:bg-gray-700 px-4 py-2.5 rounded-lg transition w-full justify-center font-medium">
                <Mail className="w-4 h-4" /> press@forge.example.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
