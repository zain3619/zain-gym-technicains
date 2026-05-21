"use client";

import React, { useState, useEffect } from "react";
import { 
  Mail, MailOpen, Trash2, Eye, X, Loader2, 
  User, Building, ShieldQuestion, Calendar, DollarSign
} from "lucide-react";
import toast from "react-hot-toast";

export default function MessagesInboxPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMsg, setSelectedMsg] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    const token = localStorage.getItem("admin_token");
    const headers = { "Authorization": `Bearer ${token}` };

    try {
      const response = await fetch("http://localhost:5000/api/v1/messages", { headers });
      const data = await response.json();
      if (response.ok) {
        setMessages(data);
      }
    } catch (error) {
      console.error("Messages fetch error:", error);
      toast.error("Failed to fetch messages. Loading fallback simulation.");
      setMessages([
        {
          _id: "m1",
          name: "Zain Qaiser",
          phone: "+92 323 3334777",
          email: "m.qaiser76@yahoo.com",
          business: "Zain Assembly Hub",
          projectType: "Commercial Gym Setup",
          budgetRange: "PKR 5M - 10M",
          message: "We need dynamic installation of 24 cardio and plate-loaded machines next week at our DHA Lahore fitness club. Please contact me with quotation.",
          isRead: false,
          createdAt: new Date().toISOString(),
        },
        {
          _id: "m2",
          name: "Sarah Khan",
          phone: "+92 300 1234567",
          email: "sarah@gmail.com",
          business: "Home Space Studio",
          projectType: "Home Gym Installation",
          budgetRange: "PKR 1M - 2M",
          message: "Hi, I am looking to set up a private strength training rack, rubber dumbbells, and a bench at my home garage in Islamabad. Let me know details.",
          isRead: true,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRead = async (msg) => {
    const token = localStorage.getItem("admin_token");
    const newReadState = !msg.isRead;

    try {
      const response = await fetch(`http://localhost:5000/api/v1/messages/${msg._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ isRead: newReadState }),
      });

      if (response.ok) {
        toast.success(newReadState ? "Message marked as read" : "Message marked as unread");
        
        // Update local arrays
        setMessages(prev => prev.map(m => m._id === msg._id ? { ...m, isRead: newReadState } : m));
        if (selectedMsg && selectedMsg._id === msg._id) {
          setSelectedMsg(prev => ({ ...prev, isRead: newReadState }));
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this message record?")) return;
    
    const token = localStorage.getItem("admin_token");
    try {
      const response = await fetch(`http://localhost:5000/api/v1/messages/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("Inquiry removed from inbox");
        setSelectedMsg(null);
        fetchMessages();
      }
    } catch (error) {
      toast.error("Failed to delete record");
    }
  };

  const openMessageDetails = (msg) => {
    setSelectedMsg(msg);
    if (!msg.isRead) {
      handleToggleRead(msg); // Automatically mark as read when viewing details!
    }
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-xl font-black uppercase text-white tracking-wider">
          Contact Inquiry <span className="text-[#82cd2b]">Inbox Logs</span>
        </h1>
        <p className="text-xs text-gray-500 mt-1">Read and filter prospective commercial gym build and technician leads.</p>
      </div>

      {loading ? (
        <div className="flex h-[40vh] w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#82cd2b]" />
        </div>
      ) : messages.length > 0 ? (
        <div className="rounded-2xl border border-white/5 bg-[#0d0d0d] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-black/45 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <th className="p-4 w-[60px]">Status</th>
                  <th className="p-4">Sender</th>
                  <th className="p-4">Business / Studio</th>
                  <th className="p-4">Project Type</th>
                  <th className="p-4">Submission Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-gray-300">
                {messages.map((msg) => (
                  <tr 
                    key={msg._id} 
                    className={`hover:bg-white/2 transition-colors cursor-pointer ${
                      !msg.isRead ? "font-bold text-white bg-white/[0.01]" : "text-gray-400"
                    }`}
                    onClick={() => openMessageDetails(msg)}
                  >
                    <td className="p-4" onClick={(e) => { e.stopPropagation(); handleToggleRead(msg); }}>
                      <button className="p-1 hover:text-[#82cd2b] transition-colors">
                        {msg.isRead ? (
                          <MailOpen className="h-4.5 w-4.5 text-gray-600" />
                        ) : (
                          <Mail className="h-4.5 w-4.5 text-[#82cd2b] drop-shadow-[0_0_8px_rgba(130,205,43,0.3)]" />
                        )}
                      </button>
                    </td>
                    <td className="p-4 truncate max-w-[150px]">{msg.name}</td>
                    <td className="p-4 truncate max-w-[150px]">{msg.business}</td>
                    <td className="p-4 truncate max-w-[180px]">{msg.projectType}</td>
                    <td className="p-4 text-[11px] text-gray-500">
                      {new Date(msg.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </td>
                    <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-2.5">
                        <button
                          onClick={() => openMessageDetails(msg)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                          title="Open Message"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(msg._id)}
                          className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                          title="Delete Inquiry"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="py-12 text-center border border-dashed border-white/10 rounded-2xl bg-[#0d0d0d] text-gray-500 text-xs">
          Your inbox folder is completely pristine! No customer messages have been logged yet.
        </div>
      )}

      {/* DETAIL INBOX POPUP DIALOG */}
      {selectedMsg && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-[550px] rounded-2xl border border-white/10 bg-[#0d0d0d] p-6 shadow-2xl relative max-h-[85vh] overflow-y-auto no-scrollbar">
            
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-5">
              <div>
                <h3 className="text-sm font-black uppercase text-white tracking-widest">Inquiry Details</h3>
                <span className="text-[9px] text-[#82cd2b] font-bold uppercase tracking-wider block mt-0.5">
                  ID: {selectedMsg._id}
                </span>
              </div>
              <button 
                onClick={() => setSelectedMsg(null)}
                className="p-1 text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Grid detail metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-6">
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-black border border-white/5">
                <User className="h-4 w-4 text-[#82cd2b]" />
                <div className="min-w-0">
                  <span className="text-[9px] text-gray-500 block uppercase font-bold">Contact Name</span>
                  <span className="text-white font-bold block truncate">{selectedMsg.name}</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-black border border-white/5">
                <Building className="h-4 w-4 text-blue-400" />
                <div className="min-w-0">
                  <span className="text-[9px] text-gray-500 block uppercase font-bold">Gym / Business</span>
                  <span className="text-white font-bold block truncate">{selectedMsg.business}</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-black border border-white/5">
                <ShieldQuestion className="h-4 w-4 text-purple-400" />
                <div className="min-w-0">
                  <span className="text-[9px] text-gray-500 block uppercase font-bold">Inquiry Type</span>
                  <span className="text-white font-bold block truncate">{selectedMsg.projectType}</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-black border border-white/5">
                <DollarSign className="h-4 w-4 text-amber-400" />
                <div className="min-w-0">
                  <span className="text-[9px] text-gray-500 block uppercase font-bold">Budget Allocation</span>
                  <span className="text-white font-bold block truncate">{selectedMsg.budgetRange}</span>
                </div>
              </div>
            </div>

            {/* Message Body */}
            <div className="p-4 rounded-xl border border-white/5 bg-black/45 text-xs mb-6">
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mb-2">Message Body</span>
              <p className="text-gray-300 whitespace-pre-line leading-relaxed">{selectedMsg.message}</p>
            </div>

            {/* Sender Contacts & Actions */}
            <div className="p-4 rounded-xl border border-[#82cd2b]/10 bg-[#82cd2b]/5 text-xs mb-6 space-y-2">
              <span className="text-[9px] text-[#82cd2b] font-bold uppercase tracking-wider block mb-1">Reply to Sender</span>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Email:</span>
                <a href={`mailto:${selectedMsg.email}`} className="text-white font-bold hover:underline">{selectedMsg.email}</a>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Phone number:</span>
                <a href={`tel:${selectedMsg.phone}`} className="text-white font-bold hover:underline">{selectedMsg.phone}</a>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex gap-3">
              <button
                onClick={() => handleToggleRead(selectedMsg)}
                className="flex-1 h-11 rounded-lg border border-white/15 bg-transparent text-white font-bold text-xs uppercase tracking-wider hover:bg-white/5 transition-all cursor-pointer"
              >
                MARK AS {selectedMsg.isRead ? "UNREAD" : "READ"}
              </button>
              <button
                onClick={() => handleDelete(selectedMsg._id)}
                className="flex-1 h-11 rounded-lg bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
              >
                <Trash2 className="h-4.5 w-4.5" />
                DELETE INQUIRY
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
