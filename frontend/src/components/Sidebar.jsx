import React from "react";
import { NavLink } from "react-router-dom";
import { Protect, useClerk, useUser } from "@clerk/clerk-react";
import {
  Eraser,
  FileText,
  Hash,
  House,
  Image,
  Scissors,
  SquarePen,
  Users
} from "lucide-react";

const navItems = [
  { to: "/ai", label: "Dashboard", Icon: House },
  { to: "/ai/write-article", label: "Write Article", Icon: SquarePen },
  { to: "/ai/blog-titles", label: "Blog Titles", Icon: Hash },
  { to: "/ai/generate-images", label: "Generate Images", Icon: Image },
  { to: "/ai/remove-background", label: "Remove Background", Icon: Eraser },
  { to: "/ai/remove-object", label: "Remove Object", Icon: Scissors },
  { to: "/ai/review-resume", label: "Review Resume", Icon: FileText },
  { to: "/ai/community", label: "Community", Icon: Users }
];

const Sidebar = ({ sidebar, setSidebar }) => {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  return (
    <div
      className={`w-60 bg-white border-r border-gray-200 flex flex-col justify-between items-center max-sm:absolute top-14 bottom-0 
      ${sidebar ? "translate-x-0" : "max-sm:-translate-x-full"} transition-all duration-300 ease-in-out`}
    >
      <div className="my-7 w-full">

        {/* USER IMAGE ONLY (NAME REMOVED) */}
        <div className="flex flex-col items-center">
          <img
            src={user?.imageUrl}
            alt="User Avatar"
            className="w-14 h-14 rounded-full object-cover"
          />
        </div>

        {/* NAVIGATION LINKS */}
        <div className="px-6 mt-6 text-sm font-medium">
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/ai"}
              onClick={() => setSidebar(false)}
              className={({ isActive }) =>
                `px-3.5 py-2.5 flex items-center gap-3 rounded-xl 
                ${
                  isActive
                    ? "bg-gradient-to-r from-[#3C81F6] to-[#9234EA] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-600"}`} />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* USER PROFILE & PLAN INFO */}
        <div className="mt-8 px-5 w-full">
          <div
            onClick={openUserProfile}
            className="flex flex-col items-center cursor-pointer hover:opacity-90"
          >
            <img src={user?.imageUrl} className="w-10 h-10 rounded-full" alt="" />

            {/* No user name shown here */}

            <p className="text-xs text-gray-500 mt-1">
              <Protect
                plan="premium"
                fallback={
                  <>
                    Free Plan •{" "}
                  
                  </>
                }
              >
                Premium Plan
              </Protect>
            </p>
          </div>

          <button
            onClick={signOut}
            className="text-xs text-red-600 hover:underline block mx-auto mt-3"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
