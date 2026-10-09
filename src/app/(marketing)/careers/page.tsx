import { Briefcase, Heart, Map, DollarSign, ArrowRight } from "lucide-react";

export default function CareersPage() {
  const perks = [
    {
      title: "Competitive Compensation",
      description: "Top-tier base salaries and performance bonuses.",
      icon: <DollarSign className="w-6 h-6 text-blue-600" />
    },
    {
      title: "Pre-IPO Equity Packages",
      description: "Own a piece of the infrastructure you're building.",
      icon: <Briefcase className="w-6 h-6 text-blue-600" />
    },
    {
      title: "Comprehensive Healthcare",
      description: "Medical, dental, and vision coverage for you and your dependents.",
      icon: <Heart className="w-6 h-6 text-blue-600" />
    },
    {
      title: "Flexible Work",
      description: "Remote-first options and flexible hours.",
      icon: <Map className="w-6 h-6 text-blue-600" />
    }
  ];

  const positions = [
    { title: "Senior Full-Stack Engineer", department: "Engineering", location: "Remote" },
    { title: "Brokerage Operations Specialist", department: "Operations", location: "New York" },
    { title: "Compliance Officer", department: "Legal", location: "San Francisco" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6 sm:px-12">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Build the Infrastructure of Private Capital.
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join Forge in our mission to bring transparency, access, and efficiency to the private markets. We are looking for builders, thinkers, and innovators.
          </p>
        </header>

        <section className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Work Here?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {perks.map((perk, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-start">
                <div className="mb-4 bg-blue-50 p-3 rounded-lg">
                  {perk.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{perk.title}</h3>
                <p className="text-gray-600">{perk.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Open Positions</h2>
          <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden">
            {positions.map((pos, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row items-center justify-between p-6 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                <div className="mb-4 sm:mb-0 text-center sm:text-left">
                  <h3 className="text-lg font-bold text-gray-900">{pos.title}</h3>
                  <div className="text-sm text-gray-500 mt-1 flex items-center justify-center sm:justify-start gap-4">
                    <span>{pos.department}</span>
                    <span>&bull;</span>
                    <span>{pos.location}</span>
                  </div>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium">
                  Apply <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
