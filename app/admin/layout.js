"use client";

import React from "react";
import { Toaster } from "react-hot-toast";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#82cd2b] selection:text-black font-sans antialiased">
      {/* Toast notifications portal */}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: "#111",
            color: "#fff",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          },
          success: {
            iconTheme: {
              primary: "#82cd2b",
              secondary: "#000",
            },
          },
        }}
      />
      {children}
    </div>
  );
}
