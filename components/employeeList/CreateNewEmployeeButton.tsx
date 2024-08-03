"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";

import { app, secondApp } from "@/utils/firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { useToast } from "@/components/ui/use-toast";

const auth = getAuth(app);
const auth2 = getAuth(secondApp);
const db = getFirestore(app);

interface NewEmployeeData {
  id: string;
  name: string;
  email: string;
  department: string;
  password: string;
  phone: string;
  role: string;
  status: string;
}

type User = any;

const CreateNewEmployeeButton = ({ adminId }: { adminId: string }) => {
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [newEmployee, setNewEmployee] = useState<NewEmployeeData>({
    id: "",
    name: "",
    email: "",
    department: "",
    password: "123456",
    phone: "",
    role: "",
    status: "在職",
  });
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (
      !newEmployee.id ||
      !newEmployee.name ||
      !newEmployee.email ||
      !newEmployee.department ||
      !newEmployee.password ||
      !newEmployee.role
    ) {
      toast({
        title: "錯誤",
        description: "請填寫所有欄位",
        variant: "destructive",
      });
      return;
    }

    try {
      await createUserWithEmailAndPassword(
        auth2,
        newEmployee.email,
        newEmployee.password
      );

      const user: User | null = auth2.currentUser;

      await updateProfile(user, {
        displayName: newEmployee.name,
      });

      console.log(user);

      await setDoc(doc(db, "admins", adminId, "users", user.uid), {
        employeeId: newEmployee.id,
        name: newEmployee.name,
        email: newEmployee.email,
        department: newEmployee.department,
        phone: newEmployee.phone,
        password: newEmployee.password,
        role: newEmployee.role,
        status: newEmployee.status,
        attendanceDays: 0,
        leaveDays: 0,
        createdAt: new Date().toISOString(),
        sys: "user",
      });

      await setDoc(doc(db, "users", user.uid), {
        employeeId: newEmployee.id,
        name: newEmployee.name,
        email: newEmployee.email,
        department: newEmployee.department,
        phone: newEmployee.phone,
        password: newEmployee.password,
        role: newEmployee.role,
        status: newEmployee.status,
        createdAt: new Date().toISOString(),
        sys: "user",
      });

      toast({
        title: `成功新增 ${newEmployee.name}`,
        description: `已同步新增登入帳號`,
      });

      setIsOpenDialog(false);
      setNewEmployee({
        id: "",
        name: "",
        email: "",
        department: "",
        password: "",
        phone: "",
        role: "",
        status: "在職",
      });
    } catch (error: any) {
      toast({
        title: "新增失敗",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
        <DialogTrigger asChild>
          <Button>新增員工</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新增員工</DialogTitle>
          </DialogHeader>

          <div>
            <Label>員工編號</Label>
            <Input
              name="id"
              className="mt-2"
              placeholder="ex:A001"
              value={newEmployee.id}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, id: e.target.value })
              }
            />
          </div>

          <div>
            <Label>姓名</Label>
            <Input
              name="name"
              className="mt-2"
              placeholder="ex:王小明"
              value={newEmployee.name}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, name: e.target.value })
              }
            />
          </div>

          <div>
            <Label>信箱</Label>
            <Input
              name="email"
              className="mt-2"
              placeholder="ex: employee@example.com"
              value={newEmployee.email}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, email: e.target.value })
              }
            />
          </div>

          <div>
            <Label>預設密碼</Label>
            <Input
              name="password"
              className="mt-2"
              autoComplete="new-password"
              value={newEmployee.password}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, password: e.target.value })
              }
            />
          </div>

          <div>
            <Label>部門</Label>
            <div className="mt-2">
              <Select
                value={newEmployee.department}
                onValueChange={(value) =>
                  setNewEmployee((prevState) => ({
                    ...prevState,
                    department: value,
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="部門" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="人資">人資</SelectItem>
                    <SelectItem value="總務">總務</SelectItem>
                    <SelectItem value="財務">財務</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>職位</Label>
            <div className="mt-2">
              <Select
                value={newEmployee.role}
                onValueChange={(value) =>
                  setNewEmployee((prevState) => ({
                    ...prevState,
                    role: value,
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="職位" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="工程師">工程師</SelectItem>
                    <SelectItem value="設計師">設計師</SelectItem>
                    <SelectItem value="財務">財務</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>分機</Label>
            <Input
              className="mt-2"
              placeholder="分機"
              name="phone"
              value={newEmployee.phone}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, phone: e.target.value })
              }
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpenDialog(false)}>
              取消
            </Button>
            <Button onClick={handleSubmit}>確認</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateNewEmployeeButton;
