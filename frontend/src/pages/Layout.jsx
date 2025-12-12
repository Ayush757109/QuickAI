import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { Menu, X } from "lucide-react";
import { SignIn, useUser } from "@clerk/clerk-react";

import Sidebar from "../components/Sidebar"; // ✅ Correct import

const Layout = () => {
  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState(false);
  const { user } = useUser();

  if (user) {
    return (
      <div className="flex flex-col h-screen">
        <nav className="w-full px-6 py-3 min-h-[64px] flex items-center justify-between border-b border-gray-200">
          <img
            src={assets.logo}
            alt="logo"
            className="h-8 cursor-pointer"
            onClick={() => navigate("/")}
          />

          {/* Mobile Menu Toggle */}
          <div className="sm:hidden">
            {sidebar ? (
              <X className="w-6 h-6 text-gray-600" onClick={() => setSidebar(false)} />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" onClick={() => setSidebar(true)} />
            )}
          </div>
        </nav>

        <div className="flex h-[calc(100vh-64px)] w-full">
          <Sidebar sidebar={sidebar} setSidebar={setSidebar} />

          <main
            className="flex-1 bg-[#F4F7FB] overflow-auto"
            onClick={() => {
              // close sidebar on small screen when clicking main area
              if (sidebar && window.innerWidth < 640) setSidebar(false);
            }}
          >
            <Outlet />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <SignIn />
    </div>
  );
};

export default Layout;
