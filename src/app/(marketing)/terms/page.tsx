import React from 'react';

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-8">
        Terms of Service
      </h1>
      
      <div className="prose prose-blue max-w-none text-gray-600">
        <p className="text-sm mb-8">Last Updated: October 9, 2026</p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
        <p className="mb-4">
          By accessing or using the Forge platform ("Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Platform Licensing</h2>
        <p className="mb-4">
          Forge grants you a limited, non-exclusive, non-transferable, and revocable license to use the Platform for your personal, non-commercial use, subject to these Terms.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Eligible Participants</h2>
        <p className="mb-4">
          The Platform is intended solely for individuals who are 18 years of age or older. Any access to or use of the Platform by anyone under 18 is expressly prohibited.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Intellectual Property</h2>
        <p className="mb-4">
          All content, features, and functionality on the Platform, including but not limited to text, graphics, logos, and software, are the exclusive property of Forge and are protected by United States and international copyright, trademark, and other intellectual property laws.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Disclaimer of Warranties</h2>
        <p className="mb-4">
          The Platform is provided "as is" and "as available" without any warranties of any kind. We do not guarantee that the Platform will always be safe, secure, or error-free.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Limitation of Liability</h2>
        <p className="mb-4">
          In no event shall Forge be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the Platform.
        </p>
      </div>
    </div>
  );
}
