"use client";

import React from "react";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#050505] font-body text-[#F5F5F5] antialiased selection:bg-[#D9D9D9]/25 selection:text-white">
      {children}
    </div>
  );
}
