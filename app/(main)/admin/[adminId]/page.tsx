"use client";
import DesktopAside from "@/components/sidebar/DesktopAside";
import MobileAside from "@/components/sidebar/MobileAside";
import AdminMainContent from "@/components/AdminMainContent";
import { app } from "@/utils/firebase";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

const auth = getAuth(app);

interface Admin {
  adminId: string;
  companyName: string;
  email: string;
}

const DashboardLayout = () => {
  const [admin, setAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user || !user.displayName || !user.email) {
        window.location.href = "/signup";
      } else {
        const adminId = user.uid;
        const companyName = user.displayName;
        const email = user.email;
        setAdmin({ adminId, companyName, email });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    // 共用Sidebar
    <div className="block md:flex">
      <DesktopAside name={admin?.companyName} email={admin?.email} />
      <MobileAside name={admin?.companyName} email={admin?.email} />
      {/* main */}
      <main className=" bg-slate-200 w-full h-screen">
        <div className="flex justify-center bg-white mt-10 ">
          <AdminMainContent />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
