"use client";

import { logout } from "../lib/api";
import { toast } from "../lib/toast";
import { useRouter } from "next/navigation";

export default function TopBar({ userEmail }: { userEmail?: string }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out");
      router.replace("/login");
    } catch (e) {
      console.error("Logout failed", e);
      toast.error("Logout failed");
    }
  };

  return (
    <div className="w-full bg-white border border-gray-100 rounded-xl shadow-sm p-4 mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex items-center justify-center font-semibold">
          {userEmail ? userEmail.charAt(0).toUpperCase() : "U"}
        </div>
        <div className="leading-tight">
          <div className="text-sm text-gray-500">Signed in as</div>
          <div className="text-sm font-medium text-gray-800">{userEmail || "Unknown"}</div>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-lg transition"
      >
        Logout
      </button>
    </div>
  );
}
