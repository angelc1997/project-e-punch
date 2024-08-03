"use client";
import AuthTabs from "@/components/auth/AuthTabs";

const AuthPage = () => {
  return (
    <div className="h-[100vh] flex flex-col justify-center items-center">
      <div className="text-3xl mb-4">ePunch點點班</div>
      <AuthTabs />
    </div>
  );
};

export default AuthPage;
