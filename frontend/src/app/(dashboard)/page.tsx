"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch('http://localhost:3001/leads', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (res.status === 401) {
          router.push('/login');
          return;
        }

        const data = await res.json();
        setLeads(data);
      } catch (err) {
        console.error("Failed to fetch leads", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [router]);

  if (loading) return <div className="p-6">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">TOTAL LEADS</h3>
          <p className="text-3xl font-bold mt-2">{leads.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">NEW LEADS</h3>
          <p className="text-3xl font-bold mt-2">{leads.filter((l: any) => l.status === 'NEW').length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">WON DEALS</h3>
          <p className="text-3xl font-bold mt-2">{leads.filter((l: any) => l.status === 'WON').length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">REVENUE</h3>
          <p className="text-3xl font-bold mt-2">
            RM {leads.filter((l: any) => l.status === 'WON').reduce((sum, l: any) => sum + (l.budget || 0), 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="bg-white p-6 rounded-lg shadow-sm border overflow-x-auto">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Sales Pipeline (Kanban)</h3>
        <div className="flex space-x-4 min-w-max pb-4">
          {['NEW', 'CONTACTED', 'QUOTATION', 'WON', 'LOST'].map((status) => (
            <div 
              key={status} 
              className="w-80 bg-gray-50 rounded-md flex flex-col p-3 border"
              onDragOver={(e) => e.preventDefault()}
              onDrop={async (e) => {
                e.preventDefault();
                const leadId = e.dataTransfer.getData('leadId');
                if (!leadId) return;
                
                // Optimistic UI update
                setLeads((prev: any) => prev.map((l: any) => l.id === leadId ? { ...l, status } : l));

                // Backend call
                const token = localStorage.getItem('access_token') || localStorage.getItem('token');
                await fetch(`http://localhost:3001/leads/${leadId}`, {
                  method: 'PATCH',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ status })
                });
              }}
            >
              <h4 className="font-semibold text-gray-700 mb-3 uppercase flex justify-between">
                {status} <span className="bg-gray-200 text-gray-600 px-2 rounded-full text-xs py-0.5">{leads.filter((l: any) => l.status === status).length}</span>
              </h4>
              <div className="flex-1 overflow-y-auto space-y-3 min-h-[300px]">
                {leads.filter((l: any) => l.status === status).map((lead: any) => (
                  <div 
                    key={lead.id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('leadId', lead.id)}
                    className="bg-white p-3 rounded shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow"
                  >
                    <p className="font-medium text-gray-900">{lead.title || 'Unknown Lead'}</p>
                    <p className="text-sm text-gray-500 mt-1">{lead.customer?.name || lead.source}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-sm font-semibold text-green-600">RM {lead.budget || 0}</span>
                      <span className="text-xs text-gray-400">Score: {lead.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
