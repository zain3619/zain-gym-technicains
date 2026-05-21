"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, Edit2, Trash2, X, Loader2, Save, 
  Award, Sparkles, CheckCircle2
} from "lucide-react";
import toast from "react-hot-toast";

export default function PricingManagementPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [billingPeriod, setBillingPeriod] = useState("month");
  const [features, setFeatures] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/v1/pricing");
      const data = await response.json();
      if (response.ok) {
        setPlans(data);
      }
    } catch (error) {
      console.error("Fetch plans error:", error);
      toast.error("Failed to load plans. Loading fallback list.");
      setPlans([
        {
          _id: "p1",
          name: "Standard Installation",
          price: "PKR 45,000",
          billingPeriod: "project",
          features: ["Assembly of 8 Machines", "Floor Ground Placements", "Cables Calibration Check"],
          isFeatured: false,
        },
        {
          _id: "p2",
          name: "Enterprise Gym Setup",
          price: "PKR 180,000",
          billingPeriod: "project",
          features: ["Full CAD Gym Design Layout", "Assembly & Rigging of 30+ Machines", "Ongoing 3-Month Maintenance support", "Cables & Treadmills calibration"],
          isFeatured: true,
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditId(null);
    setName("");
    setPrice("");
    setBillingPeriod("project");
    setFeatures("");
    setIsFeatured(false);
    setModalOpen(true);
  };

  const openEditModal = (plan) => {
    setEditId(plan._id);
    setName(plan.name || "");
    setPrice(plan.price || "");
    setBillingPeriod(plan.billingPeriod || "project");
    setFeatures(Array.isArray(plan.features) ? plan.features.join(", ") : "");
    setIsFeatured(plan.isFeatured !== undefined ? plan.isFeatured : false);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this package?")) return;
    
    const token = localStorage.getItem("admin_token");
    try {
      const response = await fetch(`http://localhost:5000/api/v1/pricing/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("Package deleted successfully");
        fetchPlans();
      }
    } catch (error) {
      toast.error("Deletion failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price) {
      toast.error("Please fill in required fields: name, price");
      return;
    }

    setSubmitting(true);
    const token = localStorage.getItem("admin_token");

    const payload = {
      name,
      price,
      billingPeriod,
      features,
      isFeatured,
    };

    const url = editId 
      ? `http://localhost:5000/api/v1/pricing/${editId}` 
      : "http://localhost:5000/api/v1/pricing";
    const method = editId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(editId ? "Pricing package updated" : "Pricing package created!");
        setModalOpen(false);
        fetchPlans();
      } else {
        const data = await response.json();
        throw new Error(data.message || "Failed to submit package");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-black uppercase text-white tracking-wider">
            Membership & <span className="text-[#82cd2b]">Pricing Packages</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">Configure pricing packages, assembly rates, and highlighted gym building packages.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex h-10 items-center gap-2 rounded-lg bg-[#82cd2b] text-black px-4.5 text-xs font-black uppercase tracking-wider hover:bg-[#97ff02] active:scale-95 transition-all cursor-pointer shadow-md"
        >
          <Plus className="h-4 w-4" />
          ADD PLAN
        </button>
      </div>

      {loading ? (
        <div className="flex h-[40vh] w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#82cd2b]" />
        </div>
      ) : plans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div 
              key={plan._id} 
              className={`rounded-2xl border p-6 flex flex-col justify-between group transition-all duration-300 relative shadow-xl ${
                plan.isFeatured 
                  ? "bg-[#82cd2b]/5 border-[#82cd2b]/25 shadow-[#82cd2b]/2"
                  : "bg-[#0d0d0d] border-white/5 hover:border-white/10"
              }`}
            >
              {plan.isFeatured && (
                <span className="absolute -top-3 left-6 flex h-6 items-center gap-1 rounded-full bg-[#82cd2b] px-3.5 text-[8px] font-black uppercase tracking-widest text-black shadow-md">
                  <Sparkles className="h-3 w-3 fill-black text-black" />
                  RECOMMENDED
                </span>
              )}

              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-white">{plan.name}</h3>
                <div className="flex items-baseline mt-4 mb-5 text-white">
                  <span className="text-2xl font-black">{plan.price}</span>
                  <span className="text-gray-500 font-bold text-[10px] ml-1.5 uppercase tracking-wider">
                    / {plan.billingPeriod}
                  </span>
                </div>

                <div className="space-y-2.5 pt-4.5 border-t border-white/5">
                  {Array.isArray(plan.features) && plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-400">
                      <CheckCircle2 className="h-4 w-4 text-[#82cd2b] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2.5 mt-6 pt-4 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEditModal(plan)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(plan._id)}
                  className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center border border-dashed border-white/10 rounded-2xl bg-[#0d0d0d] text-gray-500 text-xs">
          No pricing packages defined yet. Get started by adding a package!
        </div>
      )}

      {/* CRUD MODAL POPUP */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-[460px] rounded-2xl border border-white/10 bg-[#0d0d0d] p-6 shadow-2xl relative flex flex-col max-h-[85vh] overflow-y-auto no-scrollbar">
            
            <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-5 shrink-0">
              <h3 className="text-xs font-black uppercase text-white tracking-widest flex items-center gap-2">
                <Award className="h-4.5 w-4.5 text-[#82cd2b]" />
                {editId ? "Modify Pricing Plan" : "Create Pricing Plan"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 flex-1">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Package Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Enterprise Gym Setup"
                  className="h-11 w-full rounded-lg border border-white/10 bg-black px-4 text-xs text-white outline-none focus:border-[#82cd2b]/55 transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Price Tag *</label>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. PKR 180,000"
                    className="h-11 w-full rounded-lg border border-white/10 bg-black px-4 text-xs text-white outline-none focus:border-[#82cd2b]/55 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Billing Interval</label>
                  <input
                    type="text"
                    value={billingPeriod}
                    onChange={(e) => setBillingPeriod(e.target.value)}
                    placeholder="e.g. project, month"
                    className="h-11 w-full rounded-lg border border-white/10 bg-black px-4 text-xs text-white outline-none focus:border-[#82cd2b]/55 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Features List (Comma Separated) *</label>
                <textarea
                  rows="3"
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  placeholder="e.g. Full CAD layout design, Rigging of 30+ machines"
                  className="w-full rounded-lg border border-white/10 bg-black p-4 text-xs text-white outline-none focus:border-[#82cd2b]/55 transition-all resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Recommend Plan Highlight</label>
                <button
                  type="button"
                  onClick={() => setIsFeatured(!isFeatured)}
                  className={`h-11 w-full rounded-lg border transition-all flex items-center justify-center gap-2 font-extrabold text-[10px] uppercase tracking-wider cursor-pointer ${
                    isFeatured 
                      ? "bg-[#82cd2b]/10 border-[#82cd2b]/35 text-[#82cd2b]" 
                      : "bg-transparent border-white/15 text-gray-400 hover:border-white/25 hover:text-white"
                  }`}
                >
                  {isFeatured ? "RECOMMENDED HIGHLIGHT ACTIVE" : "STANDARD HIGHLIGHT"}
                </button>
              </div>

              <div className="pt-4 border-t border-white/5 flex gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 h-11 rounded-lg border border-white/15 bg-transparent text-white font-bold text-xs uppercase tracking-wider hover:bg-white/5 transition-all cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 h-11 rounded-lg bg-[#82cd2b] text-black font-extrabold text-xs uppercase tracking-widest hover:bg-[#97ff02] disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                >
                  {submitting ? (
                    <Loader2 className="h-4.5 w-4.5 animate-spin text-black" />
                  ) : (
                    <>
                      <Save className="h-4.5 w-4.5" />
                      SAVE PLAN
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
