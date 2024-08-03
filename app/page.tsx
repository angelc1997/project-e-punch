import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="h-[100vh] flex flex-col justify-center items-center">
      <div className="text-3xl mb-4">ePunch點點班</div>
      <Link href="/signup">
        <Button className="text-2xl px-8 py-10">註冊/登入</Button>
      </Link>
    </div>
  );
}
