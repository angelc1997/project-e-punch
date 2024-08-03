"use client";

// zod 驗證
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { app, secondApp } from "@/utils/firebase";
import {
  getAuth,
  updateProfile,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { useState } from "react";

const auth = getAuth(app);
const db = getFirestore(app);

// 表單驗證 (Form schema)
const formSchema = z
  .object({
    companyName: z.string().min(1, { message: "必填項目" }),
    adminEmail: z
      .string()
      .min(1, { message: "必填項目" })
      .email({ message: "請輸入有效的電子郵件地址" }),
    password: z
      .string()
      .min(6, { message: "密碼至少 6 個字元" })
      .regex(/^[a-zA-Z0-9_]*$/, { message: "密碼只能包含英文、數字或底線" }),
    confirmPassword: z.string().min(6, { message: "密碼至少 6 個字元" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "密碼不相符",
    path: ["confirmPassword"],
  });

// RegisterForm 元件
const RegisterForm = () => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      adminEmail: "",
      password: "",
      confirmPassword: "",
    },
  });

  // 處理提交表單
  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const adminCredential = await createUserWithEmailAndPassword(
        auth,
        data.adminEmail,
        data.password
      );
      const admin = adminCredential.user;
      console.log("註冊情況", adminCredential);
      console.log("admin", admin);

      // 公司名稱放到displayName
      await updateProfile(admin, { displayName: data.companyName });

      await setDoc(doc(db, "admins", admin.uid), {
        companyName: data.companyName,
        email: data.adminEmail,
        sys: "admin",
      });

      toast({
        title: "您已註冊成功",
        description: "歡迎使用ePunch點點班平台",
      });
      router.push(`/admin/${admin.uid}`);
    } catch (error: FirebaseError | any) {
      switch (error.code) {
        case "auth/email-already-in-use":
          toast({
            title: "信箱已被使用",
            description: "請使用其他信箱",
            variant: "destructive",
          });
          break;
        default:
          toast({
            title: "註冊失敗",
            description: "請重新註冊",
            variant: "destructive",
          });
          break;
      }
      console.log(error.code);
      console.log(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>註冊管理員帳號</CardTitle>
        <CardDescription>請先註冊帳號以管理其他使用者</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" flex justify-between items-center text-xs font-bold text-zinc-500">
                    公司名稱 <FormMessage className="text-xs" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="bg-slate-100 border-0 "
                      placeholder="請輸入公司名稱"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="adminEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" flex justify-between items-center text-xs font-bold text-zinc-500">
                    管理員帳號 <FormMessage className="text-xs" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="bg-slate-100 border-0 "
                      placeholder="請輸入管理員信箱"
                      autoComplete="username"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" flex justify-between items-center text-xs font-bold text-zinc-500">
                    密碼 <FormMessage className="text-xs" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      className="bg-slate-100 border-0 "
                      placeholder="請輸入密碼"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" flex justify-between items-center text-xs font-bold text-zinc-500">
                    再次輸入密碼 <FormMessage className="text-xs" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      className="bg-slate-100 border-0 "
                      placeholder="請再次輸入密碼"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button className="w-full" type="submit">
              註冊
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
