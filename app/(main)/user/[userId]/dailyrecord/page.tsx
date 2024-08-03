"use client";
import EmployeeDesktopAside from "@/components/sidebar/EmployeeDesktopAside";
import EmployeeMobileAside from "@/components/sidebar/EmployeeMobileAside";
import EmployeeMainContent from "@/components/EmployeeMainContent";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/utils/firebase";
import { getFirestore } from "firebase/firestore";

const auth = getAuth(app);
const db = getFirestore(app);

interface User {
  userId: string;
  userName: string;
  email: string;
}

const UserDashboard = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user || !user.displayName || !user.email) {
        window.location.href = "/signup";
      } else {
        const userId = user.uid;
        const userName = user.displayName;
        const email = user.email;
        setUser({ userId, userName, email });
      }
    });

    return () => {};
  }, []);

  return (
    <div className="block md:flex">
      <EmployeeDesktopAside
        name={user?.userName}
        email={user?.email}
        userId={user?.userId}
      />
      <EmployeeMobileAside name={user?.userName} email={user?.email} />
      {/* main */}
      <main className=" bg-slate-200 w-full h-screen">
        <div className="flex justify-center bg-white mt-10 ">
          <EmployeeMainContent />
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
