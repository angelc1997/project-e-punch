// "use client";

// import * as React from "react";
// import {
//   ColumnDef,
//   ColumnFiltersState,
//   SortingState,
//   VisibilityState,
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import { ChevronDown } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Label } from "@/components/ui/label";

// type EmployeeRecordData = {
//   date: string;
//   clockIn: string;
//   clockOut: string;
//   punchStatus: boolean;
//   statusDescription: string;
// };

// const columns: ColumnDef<EmployeeRecordData>[] = [
//   {
//     accessorKey: "date",
//     header: "日期",
//   },
//   {
//     accessorKey: "clockIn",
//     header: "上班時間",
//   },
//   {
//     accessorKey: "clockOut",
//     header: "下班時間",
//   },
//   {
//     accessorKey: "punchStatus",
//     header: "打卡狀態",
//     cell: ({ row }) => (
//       <Label>{row.getValue("punchStatus") ? "正常" : "異常"}</Label>
//     ),
//   },
//   {
//     accessorKey: "statusDescription",
//     header: "狀態說明",
//   },
//   {
//     id: "actions",
//     cell: ({ row }) => (
//       <Button disabled={row.getValue("punchStatus")}>處理異常</Button>
//     ),
//   },
// ];

// const RecordList: React.FC<{ data: EmployeeRecordData[] }> = ({ data }) => {
//   const [sorting, setSorting] = React.useState<SortingState>([]);
//   const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
//     []
//   );
//   const [columnVisibility, setColumnVisibility] =
//     React.useState<VisibilityState>({});

//   const table = useReactTable({
//     data,
//     columns,
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     onColumnVisibilityChange: setColumnVisibility,
//     state: {
//       sorting,
//       columnFilters,
//       columnVisibility,
//     },
//   });

//   return (
//     <div className="w-full">
//       <div className="rounded-md border">
//         {/* <Table>
//           <TableHeader>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => (
//                   <TableHead key={header.id}>
//                     {header.isPlaceholder
//                       ? null
//                       : flexRender(
//                           header.column.columnDef.header,
//                           header.getContext()
//                         )}
//                   </TableHead>
//                 ))}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {table.getRowModel().rows?.length ? (
//               table.getRowModel().rows.map((row) => (
//                 <TableRow
//                   key={row.id}
//                   data-state={row.getIsSelected() && "selected"}
//                 >
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell key={cell.id}>
//                       {flexRender(
//                         cell.column.columnDef.cell,
//                         cell.getContext()
//                       )}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell
//                   colSpan={columns.length}
//                   className="h-24 text-center"
//                 >
//                   無其他資料
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table> */}
//       </div>
//     </div>
//   );
// };

// export default RecordList;

const RecordList = () => {
  return (
    <>
      <div>列表</div>
    </>
  );
};

export default RecordList;
