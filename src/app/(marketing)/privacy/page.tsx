import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-8">
        Privacy Policy
      </h1>
      
      <div className="prose prose-blue max-w-none text-gray-600">
        <p className="text-sm mb-8">Last Updated: October 9, 2026</p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
        <p className="mb-4">
          We collect personal and financial information you provide to us when you register for an account, link your financial accounts, or use our services. This may include your name, email address, Social Security number, and transaction history.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Protection of Financial Data</h2>
        <p className="mb-4">
          We use bank-level encryption and security measures to protect your sensitive financial data. We do not store your banking credentials on our servers. All financial data is transmitted securely and handled in compliance with industry standards.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Use of Cookies</h2>
        <p className="mb-4">
          We use cookies and similar tracking technologies to track the activity on our Platform and hold certain information. Cookies are files with small amounts of data which may include an anonymous unique identifier.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. How We Use Your Information</h2>
        <p className="mb-4">
          We use the information we collect to provide, maintain, and improve our services, process transactions, communicate with you, and comply with legal and regulatory obligations.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Information Sharing and Disclosure</h2>
        <p className="mb-4">
          We do not sell your personal information. We may share your information with trusted third-party service providers who assist us in operating our Platform, conducting our business, or serving our users.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Regulatory Compliance</h2>
        <p className="mb-4">
          We process personal data in accordance with applicable data protection laws and financial regulations, including the Gramm-Leach-Bliley Act (GLBA) and relevant state privacy laws.
        </p>
      </div>
    </div>
  );
}
