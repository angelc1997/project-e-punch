import Link from "next/link";
import { LogOut, Menu, Router, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { app } from "@/utils/firebase";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";

const auth = getAuth(app);

interface Admin {
  name?: string;
  email?: string;
}

const MobileAside = ({ name, email }: Admin) => {
  const router = useRouter();

  const handleLogout = () => {
    try {
      auth.signOut();
      router.push("/signup");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col bg-slate-200">
        <div className="flex-grow">
          <div className="m-2 p-4 bg-white border rounded">
            <h4 className="text-sm">{name}</h4>
            <span className="text-sm text-muted-foreground">{email}</span>
          </div>
          <nav className="flex flex-col p-2">
            <Link
              href="#"
              className="flex items-center rounded gap-3 p-2 text-muted-foreground hover:bg-primary hover:text-primary-foreground"
            >
              <Users className="h-4 w-4" /> 員工列表
            </Link>
          </nav>
        </div>
        <div className="p-2">
          <Button className="w-full p-4 rounded" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            登出
          </Button>
          <Button variant="ghost" className="w-full p-4 my-4 rounded">
            <Link href="/">ePunch點點班</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileAside;
