"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useOrderStore } from "@/lib/zustand/useOrderStore";

export function TableDashboard({ page }: { page: number }) {
  const { orders } = useOrderStore();

  return (
    <Table key={page}>
      <TableHeader>
        <TableRow>
          <TableHead>Customer Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Progress</TableHead>
          <TableHead>Bill of Materials</TableHead>
          <TableHead>Due Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <TableRow key={index}>
              <TableCell>{order.customerName}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>{order.progress}</TableCell>
              <TableCell>
                {order.material?.map((item) => item.materialName).join(", ") ||
                  "No materials"}
              </TableCell>
              <TableCell>
                {new Date(order.dueDate).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              No orders found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
