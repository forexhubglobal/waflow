import React from 'react';
import Link from 'next/link';

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-slate-700 flex flex-col">
          <span>WAFlow</span>
          <span className="text-xs text-blue-400 font-normal uppercase tracking-wider mt-1">Super Admin</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center px-4 py-3 text-gray-300 hover:bg-slate-800 hover:text-white rounded-md">
            <span className="font-medium">Platform Stats</span>
          </Link>
          <Link href="/admin/companies" className="flex items-center px-4 py-3 text-gray-300 hover:bg-slate-800 hover:text-white rounded-md">
            <span className="font-medium">Companies</span>
          </Link>
          <Link href="/admin/billing" className="flex items-center px-4 py-3 text-gray-300 hover:bg-slate-800 hover:text-white rounded-md">
            <span className="font-medium">Billing</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-700">
          <Link href="/" className="block py-2.5 px-4 rounded text-gray-400 hover:text-white transition duration-200">
            Exit to Tenant App &rarr;
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800">System Dashboard</h2>
        </header>
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
