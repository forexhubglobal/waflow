"use client";
import { useState, useEffect } from 'react';

import { io, Socket } from 'socket.io-client';

export default function InboxPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedConvo, setSelectedConvo] = useState<any>(null);
  const [liveMessages, setLiveMessages] = useState<any[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Mock conversations
    setConversations([
      { id: '1', customer: { name: 'John Tan', phone: '+60123456789' }, lastMessageAt: new Date().toISOString() },
      { id: '2', customer: { name: 'Sarah', phone: '+60198765432' }, lastMessageAt: new Date(Date.now() - 3600000).toISOString() },
    ] as any);

    // Initialize Socket
    const token = localStorage.getItem('token') || localStorage.getItem('access_token');
    if (token) {
      const newSocket = io(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}`, {
        auth: { token }
      });

      newSocket.on('newMessage', (msg: any) => {
        setLiveMessages((prev) => [...prev, msg]);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, []);

  const [messageText, setMessageText] = useState("");

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/whatsapp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: selectedConvo.customer.phone,
          text: text,
          conversationId: selectedConvo.id
        })
      });
      if (response.ok) {
        setMessageText("");
        alert("Message sent!");
      } else {
        alert("Failed to send message");
      }
    } catch (e) {
      alert("Error sending message");
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white border rounded-lg overflow-hidden shadow-sm">
      {/* Sidebar / Conversation List */}
      <div className="w-1/3 border-r flex flex-col bg-gray-50">
        <div className="p-4 border-b bg-white">
          <input 
            type="text" 
            placeholder="Search conversations..." 
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((convo: any) => (
            <div 
              key={convo.id}
              onClick={() => setSelectedConvo(convo)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-100 ${selectedConvo?.id === convo.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''}`}
            >
              <div className="flex justify-between items-center mb-1">
                <h4 className="font-semibold text-gray-800">{convo.customer.name}</h4>
                <span className="text-xs text-gray-400">
                  {new Date(convo.lastMessageAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
              <p className="text-sm text-gray-500 truncate">{convo.customer.phone}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="w-2/3 flex flex-col">
        {selectedConvo ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b flex justify-between items-center bg-white shadow-sm z-10">
              <div>
                <h3 className="font-semibold text-lg">{selectedConvo.customer.name}</h3>
                <p className="text-sm text-gray-500">{selectedConvo.customer.phone}</p>
              </div>
              <div className="space-x-2">
                <button className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm font-medium">Mark as Won</button>
                <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm font-medium">Create Quote</button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
               {/* Mock Messages */}
               <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-md">
                     <p className="text-gray-800">Boss renovation RM50k boleh buat full house?</p>
                     <span className="text-xs text-gray-400 mt-1 block">10:45 AM</span>
                  </div>
               </div>

               {/* Live WS Messages */}
               {liveMessages.map((msg, idx) => (
                 <div key={idx} className={`flex justify-${msg.senderType === 'AGENT' ? 'end' : 'start'}`}>
                   <div className={`p-3 rounded-lg shadow-sm max-w-md ${msg.senderType === 'AGENT' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none'}`}>
                     <p>{msg.content || msg.body}</p>
                     <span className={`text-xs mt-1 block ${msg.senderType === 'AGENT' ? 'text-blue-100' : 'text-gray-400'}`}>
                       {new Date(msg.createdAt || Date.now()).toLocaleTimeString()}
                     </span>
                   </div>
                 </div>
               ))}
               
               {/* AI Suggestion */}
               <div className="flex justify-center my-4">
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-sm max-w-lg w-full">
                     <p className="text-blue-800 font-semibold mb-1 flex items-center">
                        <span className="mr-2">✨ AI Suggested Reply</span>
                     </p>
                     <p className="text-blue-900">Boleh boss. Untuk budget RM50k kami boleh cadangkan scope renovation yang sesuai, termasuk kabinet dapur dan lantai ruang tamu.</p>
                     <div className="mt-2 flex justify-end space-x-2">
                        <button className="px-2 py-1 text-xs bg-white text-gray-600 rounded border hover:bg-gray-100">Dismiss</button>
                        <button onClick={() => handleSend("Boleh boss. Untuk budget RM50k kami boleh cadangkan scope renovation yang sesuai, termasuk kabinet dapur dan lantai ruang tamu.")} className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">Approve & Send</button>
                     </div>
                  </div>
               </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t bg-white">
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend(messageText)}
                  placeholder="Type your message..." 
                  className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:border-blue-500"
                />
                <button onClick={() => handleSend(messageText)} className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700">
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}
