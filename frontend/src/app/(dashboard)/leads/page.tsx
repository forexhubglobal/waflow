"use client";
import { useState, useEffect } from 'react';

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [broadcastMsg, setBroadcastMsg] = useState("");

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/leads`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setLeads(await res.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedLeads);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedLeads(newSet);
  };

  const handleBroadcast = async () => {
    if (selectedLeads.size === 0 || !broadcastMsg.trim()) return;
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/whatsapp/broadcast`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          leadIds: Array.from(selectedLeads),
          message: broadcastMsg
        })
      });

      if (res.ok) {
        alert("Broadcast sent!");
        setShowBroadcast(false);
        setBroadcastMsg("");
        setSelectedLeads(new Set());
      }
    } catch (e) {
      alert("Error sending broadcast");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">All Leads</h1>
        <div className="space-x-2">
          {selectedLeads.size > 0 && (
            <button onClick={() => setShowBroadcast(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium">
              Broadcast ({selectedLeads.size})
            </button>
          )}
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium">
            + New Lead
          </button>
        </div>
      </div>

      <div className="bg-white shadow-sm border rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input 
                  type="checkbox" 
                  onChange={(e) => {
                    if (e.target.checked) setSelectedLeads(new Set(leads.map(l => l.id)));
                    else setSelectedLeads(new Set());
                  }} 
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leads.map((lead: any) => (
              <tr key={lead.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input 
                    type="checkbox" 
                    checked={selectedLeads.has(lead.id)}
                    onChange={() => toggleSelect(lead.id)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {lead.title || lead.customer?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {lead.customer?.phone || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {lead.score}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showBroadcast && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Send Broadcast</h2>
            <p className="text-sm text-gray-500 mb-4">Sending to {selectedLeads.size} leads.</p>
            <textarea 
              rows={4}
              value={broadcastMsg}
              onChange={(e) => setBroadcastMsg(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Hi {{name}}, we have a special promo for you..."
            />
            <div className="flex justify-end space-x-2 mt-4">
              <button onClick={() => setShowBroadcast(false)} className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleBroadcast} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Send Now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
