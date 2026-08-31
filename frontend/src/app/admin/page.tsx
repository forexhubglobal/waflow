"use client";
import { useState, useEffect } from 'react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [companies, setCompanies] = useState<any>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const statsRes = await fetch('http://localhost:3001/admin/stats', { headers });
      if (statsRes.ok) setStats(await statsRes.json());

      const compRes = await fetch('http://localhost:3001/admin/companies', { headers });
      if (compRes.ok) setCompanies(await compRes.json());
    } catch (e) {
      console.error(e);
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
      await fetch(`http://localhost:3001/admin/companies/${id}/status`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      fetchData(); // refresh
    } catch (e) {
      alert("Error updating status");
    }
  };

  return (
    <div className="space-y-8">
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Companies</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalCompanies}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Active Subs</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats.activeCompanies}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Est. MRR</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">${stats.mrr}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Users</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Tenant Companies</h2>
        <div className="bg-white shadow-sm border rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact Email</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Users / Leads</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {companies.map((comp: any) => (
                <tr key={comp.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{comp.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{comp.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {comp._count?.users} / {comp._count?.leads}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${comp.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {comp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => toggleStatus(comp.id, comp.status)}
                      className={`text-${comp.status === 'ACTIVE' ? 'red' : 'green'}-600 hover:underline`}
                    >
                      {comp.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
