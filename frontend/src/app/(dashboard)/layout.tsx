import React from 'react';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-slate-700">
          WAFlow
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-slate-800">
            Dashboard
          </Link>
          <Link href="/inbox" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-slate-800">
            Inbox (WhatsApp)
          </Link>
          <Link href="/quotations" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-slate-800">
            Quotations
          </Link>
          <Link href="/reports" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-slate-800">
            Reports & Analytics
          </Link>
          <Link href="/leads" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-slate-800">
            Leads
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-700">
          <Link href="/settings/staff" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-slate-800">
            Settings (Staff)
          </Link>
          <Link href="/settings/billing" className="block py-2.5 px-4 mt-2 rounded transition duration-200 hover:bg-slate-800 text-yellow-400">
            Billing & Upgrade
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">
          <h2 className="text-xl font-semibold text-gray-800">Overview</h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-600">Admin</span>
            <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
              A
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
