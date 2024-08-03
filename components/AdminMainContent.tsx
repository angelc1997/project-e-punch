"use client";
import { useEffect, useState } from "react";
import { app, secondApp } from "@/utils/firebase";
import { deleteUser, getAuth } from "firebase/auth";
import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import CreateNewEmployeeButton from "@/components/employeeList/CreateNewEmployeeButton";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
} from "firebase/firestore";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// 定義需要的資料格式
type EmployeeListValue = {
  employeeId: string;
  department: "人資" | "總務" | "業務" | "法務" | "財務";
  name: string;
  email: string;
  password: string;
  status: "在職" | "離職" | "留職停薪";
  phone: string;
  role: "工程師" | "設計師" | "財務";
  attendanceDays: number;
  leaveDays: number;
};

// 定義表格的欄位
const columns: ColumnDef<EmployeeListValue>[] = [
  {
    accessorKey: "employeeId",
    header: "員工編號",
    cell: ({ row }) => {
      return <div>{row.getValue("employeeId")}</div>;
    },
  },
  {
    accessorKey: "department",
    header: "部門",
    cell: ({ row }) => {
      return <div>{row.getValue("department")}</div>;
    },
  },

  {
    accessorKey: "role",
    header: "職位",
    cell: ({ row }) => {
      return <div>{row.getValue("role")}</div>;
    },
  },

  {
    accessorKey: "name",
    header: "姓名",
    cell: ({ row }) => {
      return <div>{row.getValue("name")}</div>;
    },
  },

  {
    accessorKey: "email",
    header: "信箱",
    cell: ({ row }) => {
      return <div>{row.getValue("email")}</div>;
    },
  },
  {
    accessorKey: "password",
    header: "預設密碼",
    cell: ({ row }) => {
      return <div>{row.getValue("password")}</div>;
    },
  },

  {
    accessorKey: "phone",
    header: "分機",
    cell: ({ row }) => {
      return <div>{row.getValue("phone")}</div>;
    },
  },

  {
    accessorKey: "attendanceDays",
    header: "打卡天數",
    cell: ({ row }) => {
      const amount = parseInt(row.getValue("attendanceDays"));
      return <div className="text-right font-medium">{amount}</div>;
    },
  },
  {
    accessorKey: "leaveDays",
    header: "請假天數",
    cell: ({ row }) => {
      const amount = parseInt(row.getValue("leaveDays"));
      return <div className="text-right font-medium">{amount}</div>;
    },
  },

  {
    accessorKey: "status",
    header: "狀態",
    cell: ({ row }) => <div>{row.getValue("status")}</div>,
  },

  // 設定欄位動作，可以進行編輯或刪除資料
  {
    id: "actions",
    header: "功能",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>編輯</DropdownMenuItem>
              <DropdownMenuItem>刪除</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];

export default function AdminMainContent() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const auth = getAuth(app);
  const db = getFirestore(app);
  const [adminId, setAdminId] = useState("");
  const [userList, setUserList] = useState<EmployeeListValue[]>([]);

  useEffect(() => {
    const admin = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAdminId(user.uid);
        console.log("我是admin使用者", user.uid);

        // col admins > adminId > users
        const usersCollection = collection(db, "admins", user.uid, "users");
        const usersQuery = query(usersCollection);
        onSnapshot(usersQuery, (querySnapshot) => {
          const users: EmployeeListValue[] = querySnapshot.docs.map(
            (doc) =>
              ({
                employeeId: doc.id,
                ...doc.data(),
              } as EmployeeListValue)
          );

          setUserList(users);
          console.log(users);
        });
      } else {
        window.location.href = "/signup";
      }
    });

    return () => {
      admin();
    };
  }, []);
  // 獲取員工資料

  const data: EmployeeListValue[] = userList;

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="">
      <div className="flex items-center py-4">
        <CreateNewEmployeeButton adminId={adminId} />
      </div>
      <div className="rounded-md border">
        <Table>
          {/* 表頭設定 */}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-center">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  無資料
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
