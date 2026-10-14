import Link from "next/link";
import { Search, HelpCircle, ChevronDown } from "lucide-react";

export default function HelpCenterPage() {
  const faqCategories = [
    {
      title: "Capital Growth & Savings Plans",
      faqs: [
        { q: "What is a Fixed-Term Investment Plan?", a: "A structured capital accumulation contract that locks principal for a predetermined duration (1, 2, 3, 6, or 12 months) and delivers predictable contracted yields from +100% to +1200% upon maturity." },
        { q: "What is the minimum starting capital?", a: "You can activate an investment plan with as little as $50.00 USD, or the equivalent in GBP, BTC, ETH, and SOL." }
      ]
    },
    {
      title: "Maturity & Returns",
      faqs: [
        { q: "How are yields calculated?", a: "Yields are calculated strictly according to your selected commitment horizon: 1 Month (+100%), 2 Months (+200%), 3 Months (+300%), 6 Months (+600%), and 12 Months (+1200%). Both principal and accrued profit disburse together at maturity." },
        { q: "Can I withdraw before my plan matures?", a: "To ensure maximum algorithmic compound returns and principal protection, plans remain locked until the designated maturity date, after which funds become fully liquid." }
      ]
    },
    {
      title: "Identity Verification (KYC)",
      faqs: [
        { q: "When do I need to complete identity verification?", a: "To keep onboarding friction-free, KYC verification is only requested when you initiate a withdrawal of your matured capital and profits to external accounts." },
        { q: "How long does verification take?", a: "Identity verification is automated and typically takes less than 2 minutes upon providing your basic details and valid identification." }
      ]
    },
    {
      title: "Wallet & Multi-Asset Funding",
      faqs: [
        { q: "How do I fund my account?", a: "You can fund your Forge balance using USD, GBP, Bitcoin (BTC), Ethereum (ETH), or Solana (SOL) with live conversion rates." },
        { q: "Are my funds secure?", a: "Yes. All deposits and locked capital are protected with institutional-grade security protocols, reserve-backed models, and zero-loss risk frameworks." }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6 sm:px-12">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-forge-orange/10 rounded-full mb-4">
            <HelpCircle className="w-8 h-8 text-forge-orange" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            How can we help?
          </h1>
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search the knowledge base..." 
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-forge-orange focus:border-forge-orange outline-none text-lg transition"
            />
          </div>
        </header>

        <div className="space-y-12">
          {faqCategories.map((category, idx) => (
            <section key={idx}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">{category.title}</h2>
              <div className="space-y-4">
                {category.faqs.map((faq, fIdx) => (
                  <details key={fIdx} className="group bg-white rounded-lg shadow-sm border border-gray-100 [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex items-center justify-between p-6 cursor-pointer font-semibold text-gray-900">
                      {faq.q}
                      <ChevronDown className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 bg-forge-orange/5 rounded-2xl p-8 text-center border border-forge-orange/20">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Still need help?</h3>
          <p className="text-gray-600 mb-6">Our support team is available Monday through Friday to assist you.</p>
          <Link href="/contact" className="inline-block bg-forge-orange text-white font-medium px-6 py-2.5 rounded-lg hover:bg-forge-orange-hover transition shadow-sm">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
