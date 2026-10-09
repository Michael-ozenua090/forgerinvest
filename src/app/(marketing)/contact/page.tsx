import { MapPin, Phone, Mail } from "lucide-react";

export default function ContactPage() {
  const offices = [
    { city: "San Francisco", type: "Global HQ", address: "101 California St, San Francisco, CA 94111" },
    { city: "New York", type: "East Coast", address: "1 World Trade Center, New York, NY 10007" },
    { city: "London", type: "Europe", address: "1 Canada Square, London E14 5AB, UK" },
    { city: "Berlin", type: "Engineering Hub", address: "Rosenthaler Str. 40, 10178 Berlin, Germany" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6 sm:px-12">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16">
        
        {/* Contact Form Section */}
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Contact Us</h1>
          <p className="text-lg text-gray-600 mb-8">
            Have questions about Forge? Reach out to our team and we'll get back to you shortly.
          </p>

          <form className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white">
                <option>Institutional Trading</option>
                <option>Shareholder Liquidity</option>
                <option>Press & Media</option>
                <option>General Inquiry</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"></textarea>
            </div>

            <button type="button" className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition">
              Send Message
            </button>
          </form>
        </div>

        {/* Office Locations Section */}
        <div className="space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Offices</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {offices.map((office, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-100 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-bold text-gray-900">{office.city}</h3>
                  </div>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-3">{office.type}</span>
                  <p className="text-gray-600 text-sm leading-relaxed">{office.address}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Direct Inquiries</h2>
            <div className="bg-gray-900 text-white p-8 rounded-xl space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-gray-800 p-3 rounded-lg"><Phone className="w-6 h-6 text-blue-400" /></div>
                <div>
                  <h4 className="font-bold mb-1">Phone Support</h4>
                  <p className="text-gray-400 text-sm mb-2">Available Mon-Fri, 9am - 6pm EST</p>
                  <a href="tel:+18005550199" className="text-blue-400 font-medium hover:text-blue-300">+1 (800) 555-0199</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-gray-800 p-3 rounded-lg"><Mail className="w-6 h-6 text-blue-400" /></div>
                <div>
                  <h4 className="font-bold mb-1">Email Support</h4>
                  <p className="text-gray-400 text-sm mb-2">General inquiries and support</p>
                  <a href="mailto:support@forgeinvest.example.com" className="text-blue-400 font-medium hover:text-blue-300">support@forge.example.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
