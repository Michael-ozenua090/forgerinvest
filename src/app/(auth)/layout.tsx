import Image from "next/image";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-forge-gray-50 flex flex-col relative overflow-hidden">
      {/* Subtle background gradients */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_top_right,rgba(255,90,0,0.08),transparent_40%)]" />
      <div className="pointer-events-none fixed inset-x-0 bottom-0 h-96 bg-[radial-gradient(circle_at_bottom_left,rgba(255,90,0,0.05),transparent_40%)]" />

      {/* Header */}
      <header className="relative z-10 py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link href="/">
          <div className="relative w-24 h-8">
            <Image
              src="/FRGE.png"
              alt="Forge Logo"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>
        <Link href="/" className="text-sm font-semibold text-forge-gray-600 hover:text-forge-orange transition-colors">
          Return Home
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-12 relative z-10">
        <div className="w-full max-w-lg">
          {children}
          
          <div className="mt-8 text-center flex items-center justify-center gap-2 text-xs font-medium text-forge-gray-500">
            <ShieldCheck size={14} className="text-market-up" />
            Secure application protected by 256-bit SSL encryption
          </div>
        </div>
      </main>
    </div>
  );
}
