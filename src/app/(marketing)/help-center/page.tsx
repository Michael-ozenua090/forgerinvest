import { Search, HelpCircle, ChevronDown } from "lucide-react";

export default function HelpCenterPage() {
  const faqCategories = [
    {
      title: "Accreditation Requirements",
      faqs: [
        { q: "What is an accredited investor?", a: "An accredited investor is an individual or a business entity that is allowed to trade securities that may not be registered with financial authorities. They must satisfy certain requirements regarding income, net worth, asset size, governance status, or professional experience." },
        { q: "How do I verify my accreditation status?", a: "You can verify your status by providing proof of income (tax returns, W-2s) or proof of net worth (bank statements, brokerage statements) during the onboarding process." }
      ]
    },
    {
      title: "Buying Private Shares",
      faqs: [
        { q: "What is the minimum investment?", a: "The minimum investment varies by offering, but typically starts at $100,000 for standard private equity secondary transactions." },
        { q: "How long does a transaction take to close?", a: "Secondary transactions typically take 30 to 60 days to close, as they often require Right of First Refusal (ROFR) waivers from the issuing company." }
      ]
    },
    {
      title: "Selling Private Shares",
      faqs: [
        { q: "Can I sell my vested options?", a: "Typically, you can only sell exercised shares, not unexercised options. However, certain structured liquidity programs may allow for cashless exercises." },
        { q: "What fees are involved in selling?", a: "Forge charges a standard brokerage commission on successful transactions. Exact fees will be detailed in your pricing agreement prior to listing." }
      ]
    },
    {
      title: "Wallet & Funding",
      faqs: [
        { q: "How do I fund my account?", a: "You can fund your Forge account via wire transfer. Instructions are provided securely within your dashboard once an investment is allocated." },
        { q: "Are my funds secure?", a: "Yes. Client funds are held in segregated, legally isolated escrow accounts managed by our regulated banking partners." }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6 sm:px-12">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
            <HelpCircle className="w-8 h-8 text-blue-700" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            How can we help?
          </h1>
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search the knowledge base..." 
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-lg transition"
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

        <div className="mt-16 bg-blue-50 rounded-2xl p-8 text-center border border-blue-100">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Still need help?</h3>
          <p className="text-gray-600 mb-6">Our support team is available Monday through Friday to assist you.</p>
          <a href="/contact" className="inline-block bg-blue-600 text-white font-medium px-6 py-2.5 rounded-lg hover:bg-blue-700 transition">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
