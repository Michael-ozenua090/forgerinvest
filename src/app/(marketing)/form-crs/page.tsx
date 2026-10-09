import React from 'react';

export default function FormCRSPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-8">
        Customer Relationship Summary (Form CRS)
      </h1>
      
      <div className="prose prose-blue max-w-none text-gray-600">
        <p className="text-sm mb-8">Date: October 9, 2026</p>

        <p className="font-medium text-gray-900 mb-6">
          Forge is registered with the Securities and Exchange Commission (SEC) as an investment adviser and a broker-dealer. Brokerage and investment advisory services and fees differ, and it is important for you to understand these differences. Free and simple tools are available to research firms and financial professionals at Investor.gov/CRS, which also provides educational materials about broker-dealers, investment advisers, and investing.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">What investment services and advice can you provide me?</h2>
        <p className="mb-4">
          We offer both brokerage and investment advisory services to retail investors.
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2"><strong>Brokerage Services:</strong> We buy and sell securities for you at your direction. We do not monitor your portfolio on an ongoing basis.</li>
          <li className="mb-2"><strong>Investment Advisory Services:</strong> We provide ongoing advice and monitor your portfolio. We may manage accounts on a discretionary basis, meaning we make trading decisions without asking you in advance.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">What fees will I pay?</h2>
        <p className="mb-4">
          You will pay fees and costs whether you make or lose money on your investments. Fees and costs will reduce any amount of money you make on your investments over time. Please make sure you understand what fees and costs you are paying.
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2"><strong>Brokerage Fees:</strong> You pay a transaction-based fee (commission) every time you buy or sell an investment.</li>
          <li className="mb-2"><strong>Advisory Fees:</strong> You pay an ongoing asset-based fee calculated as a percentage of the value of the assets in your account.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">What are your legal obligations to me when providing recommendations?</h2>
        <p className="mb-4">
          <strong>Standard of Conduct:</strong> When we provide you with a recommendation as your broker-dealer or act as your investment adviser, we have to act in your best interest and not put our interest ahead of yours. At the same time, the way we make money creates some conflicts with your interests. You should understand and ask us about these conflicts because they can affect the recommendations and investment advice we provide you.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Conflicts of Interest</h2>
        <p className="mb-4">
          Our financial professionals receive compensation based on the revenue they generate for the firm. This creates an incentive for them to encourage you to increase the assets in your account or trade more frequently. We mitigate these conflicts through our supervisory procedures and by clearly disclosing them to you.
        </p>
        
        <div className="bg-gray-50 p-6 rounded-lg mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Conversation Starters</h3>
          <ul className="list-disc pl-6 text-sm text-gray-700">
            <li>Help me understand how these fees and costs might affect my investments.</li>
            <li>How might your conflicts of interest affect me, and how will you address them?</li>
            <li>As a financial professional, do you have any disciplinary history? For what type of conduct?</li>
            <li>Who is my primary contact person? Is he or she a representative of an investment adviser or a broker-dealer?</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
