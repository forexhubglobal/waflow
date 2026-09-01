"use client";
import { useState, useEffect } from 'react';

export default function ReportsPage() {
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    // For MVP, we calculate this on the frontend by fetching leads.
    // In production, backend should have a dedicated /reports/metrics endpoint.
    const fetchAndCalculate = async () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('access_token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/leads`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const leads = await res.json();
          const total = leads.length;
          const won = leads.filter((l: any) => l.status === 'WON').length;
          const lost = leads.filter((l: any) => l.status === 'LOST').length;
          const active = total - won - lost;
          
          const conversionRate = total > 0 ? Math.round((won / total) * 100) : 0;
          const totalRevenue = leads.filter((l: any) => l.status === 'WON').reduce((sum: number, l: any) => sum + (l.budget || 0), 0);

          setMetrics({ total, won, lost, active, conversionRate, totalRevenue });
        }
      } catch (e) {
        console.error("Failed to load metrics");
      }
    };
    fetchAndCalculate();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Sales Analytics & Reports</h1>
        <div className="space-x-2">
          <select className="border rounded-md px-3 py-2 text-sm">
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Year</option>
          </select>
          <button className="bg-white border rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-50">
            Export CSV
          </button>
        </div>
      </div>

      {!metrics ? (
        <div className="p-12 text-center text-gray-500">Loading metrics...</div>
      ) : (
        <>
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Conversion Rate</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{metrics.conversionRate}%</p>
            </div>
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Won Revenue</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">RM {metrics.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Active Pipeline</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">{metrics.active} Deals</p>
            </div>
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Lost Deals</h3>
              <p className="text-3xl font-bold text-red-600 mt-2">{metrics.lost}</p>
            </div>
          </div>

          {/* Charts/Visuals Area (Mocked for MVP) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Pipeline Funnel</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>1. Total Leads ({metrics.total})</span>
                    <span>100%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div className="bg-blue-200 h-4 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>2. Qualified / Active ({metrics.active})</span>
                    <span>{metrics.total > 0 ? Math.round((metrics.active / metrics.total) * 100) : 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div className="bg-blue-400 h-4 rounded-full" style={{ width: `${metrics.total > 0 ? (metrics.active / metrics.total) * 100 : 0}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>3. Won ({metrics.won})</span>
                    <span>{metrics.conversionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div className="bg-green-500 h-4 rounded-full" style={{ width: `${metrics.conversionRate}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Sales Rep Performance</h3>
              <p className="text-gray-500 text-sm">Visuals for individual rep performance will appear here (e.g. Lead Response Time, Deals Won per Rep).</p>
              <div className="mt-8 flex items-center justify-center h-32 bg-gray-50 rounded border border-dashed">
                <span className="text-gray-400">Chart Placeholder</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
